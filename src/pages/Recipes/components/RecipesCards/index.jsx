import Switch from '../../../../components/Switch/index.jsx'
import Button from '../../../../components/Button/index.jsx'
import { formatCurrency } from '../../../../utils/format.js'
import {
  Grid,
  Card,
  CardHeader,
  HeaderLeft,
  Avatar,
  CardInfo,
  CardName,
  StatusBadge,
  BasesSection,
  SectionLabel,
  BaseList,
  BaseRow,
  BaseName,
  BaseAmount,
  EmptyBases,
  PercentSection,
  PercentChips,
  PercentChip,
  CostSection,
  CostRow,
  CostLabel,
  CostValue,
  CostTotal,
  CostSub,
  EditButton,
  HeaderActions,
} from './styles.js'

/**
 * Vista en tarjetas de las recetas.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Recetas a mostrar.
 * @param {Map} props.baseMap - Mapa de id de base a objeto.
 * @param {Map} props.costMap - Mapa de id de receta a costeo calculado.
 * @param {Function} props.onEdit - Callback al editar.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id de la receta en proceso de cambio.
 * @param {Function} props.onDelete - Callback al eliminar una receta.
 * @param {string|number|null} props.deletingId - Id de la receta en proceso de borrado.
 * @returns {JSX.Element} Rejilla de tarjetas de recetas.
 */
function RecipesCards({
  items,
  baseMap,
  costMap,
  onEdit,
  onToggleActive,
  togglingId,
  onDelete,
  deletingId,
}) {
  return (
    <Grid>
      {items.map((item) => {
        const initial = item.name ? item.name.charAt(0) : '?'
        const bases = item.items ?? []
        const percentages = item.percentages ?? []
        const cost = costMap?.get(String(item.id)) ?? null

        return (
          <Card key={item.id ?? item.name} $inactive={!item.active}>
            <CardHeader>
              <HeaderLeft>
                <Avatar>{initial}</Avatar>
                <CardInfo>
                  <CardName>{item.name}</CardName>
                  <StatusBadge $active={item.active}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </StatusBadge>
                </CardInfo>
              </HeaderLeft>
              <HeaderActions>
                <Button
                  variant="danger"
                  disabled={deletingId === item.id}
                  onClick={() => onDelete(item)}
                >
                  Eliminar
                </Button>
                <Switch
                  checked={item.active}
                  disabled={togglingId === item.id}
                  onChange={(active) => onToggleActive(item, active)}
                />
              </HeaderActions>
            </CardHeader>

            <BasesSection>
              <SectionLabel>Bases ({bases.length})</SectionLabel>
              {bases.length === 0 ? (
                <EmptyBases>Sin bases asociadas</EmptyBases>
              ) : (
                <BaseList>
                  {bases.map((row) => {
                    const base = baseMap.get(String(row.baseId))
                    return (
                      <BaseRow key={row.baseId}>
                        <BaseName>{base?.name ?? row.baseId}</BaseName>
                        <BaseAmount>× {row.quantity}</BaseAmount>
                      </BaseRow>
                    )
                  })}
                </BaseList>
              )}
            </BasesSection>

            {percentages.length > 0 && (
              <PercentSection>
                <PercentChips>
                  {percentages.map((percentage) => (
                    <PercentChip key={`${percentage.name}-${percentage.value}`}>
                      {percentage.value}% {percentage.name}
                    </PercentChip>
                  ))}
                </PercentChips>
              </PercentSection>
            )}

            {cost && (
              <CostSection>
                <SectionLabel>Costeo</SectionLabel>
                <CostRow>
                  <CostLabel>Subtotal bases</CostLabel>
                  <CostValue>{formatCurrency(cost.subtotal)}</CostValue>
                </CostRow>
                {cost.percentages.map((percentage) => (
                  <CostRow key={`${percentage.name}-${percentage.value}`}>
                    <CostLabel>
                      {percentage.name} ({percentage.value}%)
                    </CostLabel>
                    <CostValue>{formatCurrency(percentage.amount)}</CostValue>
                  </CostRow>
                ))}
                <CostTotal>
                  <CostLabel>Costo total</CostLabel>
                  <CostValue>{formatCurrency(cost.total)}</CostValue>
                </CostTotal>
                {item.portions != null && (
                  <CostSub>
                    {cost.perPortion != null
                      ? `${formatCurrency(cost.perPortion)} por porción · `
                      : ''}
                    rinde {item.portions} {item.portions === 1 ? 'porción' : 'porciones'}
                  </CostSub>
                )}
                {!cost.hasCost && <CostSub>Sin costos de proveedor registrados</CostSub>}
              </CostSection>
            )}

            <EditButton type="button" onClick={() => onEdit(item)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </EditButton>
          </Card>
        )
      })}
    </Grid>
  )
}

export default RecipesCards
