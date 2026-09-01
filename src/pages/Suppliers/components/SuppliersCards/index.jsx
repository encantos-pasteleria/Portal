import { formatCurrency } from '../../../../utils/format.js'
import { formatAmount } from '../../../../utils/units.js'
import { getIngredientEntries } from '../../../../utils/suppliers.js'
import {
  Grid,
  Card,
  CardHeader,
  HeaderLeft,
  Avatar,
  CardInfo,
  CardName,
  CardContact,
  StatusBadge,
  IngredientsSection,
  SectionLabel,
  IngredientList,
  IngredientRow,
  IngredientName,
  IngredientAmount,
  IngredientPrice,
  EmptyIngredients,
  StatsRow,
  Stat,
  StatRow,
  StatIcon,
  StatValue,
  StatLabel,
  DetailButton,
} from './styles.js'

/**
 * Vista en tarjetas de los proveedores.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Proveedores a mostrar.
 * @param {Map} props.ingredientNames - Mapa de id de ingrediente a nombre.
 * @param {Function} props.onEdit - Callback al editar un proveedor.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del proveedor en proceso de cambio.
 * @param {Function} props.onViewDetail - Callback al ver detalles.
 * @returns {JSX.Element} Rejilla de tarjetas de proveedores.
 */
function SuppliersCards({ items, ingredientNames, onToggleActive, togglingId, onViewDetail }) {
  return (
    <Grid>
      {items.map((item) => {
        const ingredientEntries = getIngredientEntries(item.ingredientPackaging)
        const ingredientCount = ingredientEntries.length
        const initial = item.name ? item.name.charAt(0) : '?'

        return (
          <Card key={item.id ?? item.name} $inactive={!item.active}>
            <CardHeader>
              <HeaderLeft>
                <Avatar>{initial}</Avatar>
                <CardInfo>
                  <CardName>{item.name}</CardName>
                  {item.contactName && <CardContact>{item.contactName}</CardContact>}
                  <StatusBadge $active={item.active}>
                    {item.active ? 'Activo' : 'Inactivo'}
                  </StatusBadge>
                </CardInfo>
              </HeaderLeft>
            </CardHeader>

            <IngredientsSection>
              <SectionLabel>
                Ingredientes{ingredientCount > 0 ? ` (${ingredientCount})` : ''}
              </SectionLabel>
              {ingredientCount === 0 ? (
                <EmptyIngredients>Sin ingredientes</EmptyIngredients>
              ) : (
                <IngredientList>
                  {ingredientEntries.map(([id, pkg]) => {
                    const name = ingredientNames.get(String(id)) ?? id
                    const amount = pkg
                      ? formatAmount(pkg.quantity, pkg.unit)
                      : ''
                    const price = pkg
                      ? formatCurrency(pkg.price)
                      : ''
                    return (
                      <IngredientRow key={id}>
                        <IngredientName>{name}</IngredientName>
                        {amount && <IngredientAmount>{amount}</IngredientAmount>}
                        {price && <IngredientPrice>{price}</IngredientPrice>}
                      </IngredientRow>
                    )
                  })}
                </IngredientList>
              )}
            </IngredientsSection>

            <StatsRow>
              <Stat>
                <StatRow>
                  <StatIcon>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m7.5 4.27 9 5.15" />
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <path d="m3.3 7 8.7 5 8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </StatIcon>
                  <StatValue>{ingredientCount}</StatValue>
                </StatRow>
                <StatLabel>Ingredientes</StatLabel>
              </Stat>
            </StatsRow>

            <DetailButton type="button" onClick={() => onViewDetail(item)}>
              Ver detalles
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
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </DetailButton>
          </Card>
        )
      })}
    </Grid>
  )
}

export default SuppliersCards
