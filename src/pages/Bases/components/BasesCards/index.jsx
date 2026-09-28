import { formatAmount } from '../../../../utils/units.js'
import {
  Grid,
  Card,
  CardHeader,
  HeaderLeft,
  Avatar,
  CardInfo,
  CardName,
  StatusBadge,
  IngredientsSection,
  SectionLabel,
  IngredientList,
  IngredientRow,
  IngredientName,
  IngredientAmount,
  EmptyIngredients,
  StatsRow,
  Stat,
  StatRow,
  StatIcon,
  StatValue,
  StatLabel,
  DetailButton,
  CostButton,
  DeleteButton,
} from './styles.js'

/**
 * Vista en tarjetas de las bases.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Bases a mostrar.
 * @param {Map} props.ingredientMap - Mapa de id de ingrediente a objeto.
 * @param {Function} props.onViewDetail - Callback al ver detalles.
 * @param {Function} props.onViewCost - Callback al ver valor aproximado.
 * @param {Function} props.onDelete - Callback al eliminar una base.
 * @param {string|number|null} props.deletingId - Id de la base en proceso de borrado.
 * @returns {JSX.Element} Rejilla de tarjetas de bases.
 */
function BasesCards({ items, ingredientMap, onViewDetail, onViewCost, onDelete, deletingId }) {
  return (
    <Grid>
      {items.map((item) => {
        const entries = Object.entries(item.ingredients ?? {})
        const ingredientCount = entries.length
        const stepCount = Array.isArray(item.steps) ? item.steps.length : 0
        const initial = item.name ? item.name.charAt(0) : '?'

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
            </CardHeader>

            <IngredientsSection>
              <SectionLabel>
                Ingredientes{ingredientCount > 0 ? ` (${ingredientCount})` : ''}
              </SectionLabel>
              {ingredientCount === 0 ? (
                <EmptyIngredients>Sin ingredientes</EmptyIngredients>
              ) : (
                <IngredientList>
                  {entries.map(([id, quantity]) => {
                    const ingredient = ingredientMap.get(String(id))
                    const amount = ingredient?.unit
                      ? formatAmount(quantity, ingredient.unit)
                      : String(quantity)
                    return (
                      <IngredientRow key={id}>
                        <IngredientName>{ingredient?.name ?? id}</IngredientName>
                        <IngredientAmount>{amount}</IngredientAmount>
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </StatIcon>
                  <StatValue>{stepCount}</StatValue>
                </StatRow>
                <StatLabel>Pasos</StatLabel>
              </Stat>
              {item.portions != null && (
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
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </StatIcon>
                    <StatValue>{item.portions}</StatValue>
                  </StatRow>
                  <StatLabel>Porciones</StatLabel>
                </Stat>
              )}
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
            <CostButton type="button" onClick={() => onViewCost(item)}>
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
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Ver valor aproximado
            </CostButton>
            <DeleteButton
              type="button"
              disabled={deletingId === item.id}
              onClick={() => onDelete(item)}
            >
              Eliminar
            </DeleteButton>
          </Card>
        )
      })}
    </Grid>
  )
}

export default BasesCards
