import Switch from '../../../../components/Switch/index.jsx'
import { formatCurrency, formatDate } from '../../../../utils/format.js'
import {
  Grid,
  Card,
  CardHeader,
  HeaderLeft,
  Avatar,
  CardInfo,
  CardName,
  StatusBadge,
  ClientInfo,
  ContactRow,
  Notes,
  RecipesSection,
  SectionLabel,
  RecipeList,
  RecipeRow,
  RecipeName,
  RecipeAmount,
  EmptyRecipes,
  PercentSection,
  PercentList,
  PercentLine,
  PercentLabel,
  PercentValue,
  CostList,
  CostLine,
  CostName,
  CostSupplier,
  CostAmount,
  Total,
  TotalLabel,
  TotalValue,
  TotalSub,
  CardActions,
  EditButton,
  ExportButton,
} from './styles.js'

/**
 * Vista en tarjetas de las cotizaciones.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Cotizaciones a mostrar.
 * @param {Array} [props.recipes=[]] - Recetas parametrizadas (para respaldo de porcentajes).
 * @param {Function} props.onEdit - Callback al editar.
 * @param {Function} props.onExport - Callback al exportar a PDF.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id de la cotización en proceso de cambio.
 * @returns {JSX.Element} Rejilla de tarjetas de cotizaciones.
 */
function QuotationsCards({
  items,
  recipes: allRecipes = [],
  onEdit,
  onExport,
  onToggleActive,
  togglingId,
}) {
  const recipeMap = new Map(allRecipes.map((recipe) => [String(recipe.id), recipe]))

  return (
    <Grid>
      {items.map((item) => {
        const initial = item.clientName ? item.clientName.charAt(0) : '?'
        const recipes = item.items ?? []
        const costItems = item.costItems ?? []
        const costRecipes = item.costRecipes ?? []
        const percentages = costRecipes.flatMap((recipe) =>
          (recipe.percentages ?? []).map((percentage) => ({
            ...percentage,
            recipeName: recipe.name,
          })),
        )
        const fallbackPercentages = (item.items ?? []).flatMap((row) => {
          const recipe = recipeMap.get(String(row.recipeId))
          return (recipe?.percentages ?? []).map((percentage) => ({
            name: percentage.name,
            value: Number(percentage.value) || 0,
            amount: null,
            recipeName: recipe?.name ?? row.recipeName ?? row.recipeId,
          }))
        })
        const percentageRows = percentages.length > 0 ? percentages : fallbackPercentages
        const subtotal = costRecipes.reduce((sum, recipe) => sum + (recipe.subtotal ?? 0), 0)

        return (
          <Card key={item.id ?? item.clientName} $inactive={!item.active}>
            <CardHeader>
              <HeaderLeft>
                <Avatar>{initial}</Avatar>
                <CardInfo>
                  <CardName>{item.clientName}</CardName>
                  <StatusBadge $active={item.active}>
                    {item.active ? 'Activa' : 'Inactiva'}
                  </StatusBadge>
                </CardInfo>
              </HeaderLeft>
              <Switch
                checked={item.active}
                disabled={togglingId === item.id}
                onChange={(active) => onToggleActive(item, active)}
              />
            </CardHeader>

            <ClientInfo>
              {item.clientPhone && (
                <ContactRow>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{item.clientPhone}</span>
                </ContactRow>
              )}
              {item.clientEmail && (
                <ContactRow>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-10 6L2 7" />
                  </svg>
                  <span>{item.clientEmail}</span>
                </ContactRow>
              )}
              {item.date && (
                <ContactRow>
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4" />
                    <path d="M8 2v4" />
                    <path d="M3 10h18" />
                  </svg>
                  <span>{formatDate(item.date)}</span>
                </ContactRow>
              )}
            </ClientInfo>

            {item.clientNotes && <Notes>{item.clientNotes}</Notes>}

            <RecipesSection>
              <SectionLabel>Recetas ({recipes.length})</SectionLabel>
              {recipes.length === 0 ? (
                <EmptyRecipes>Sin recetas asociadas</EmptyRecipes>
              ) : (
                <RecipeList>
                  {recipes.map((row) => (
                    <RecipeRow key={`${row.recipeId}-${row.quantity}`}>
                      <RecipeName>{row.recipeName || row.recipeId}</RecipeName>
                      <RecipeAmount>× {row.quantity}</RecipeAmount>
                    </RecipeRow>
                  ))}
                </RecipeList>
              )}
            </RecipesSection>

            {percentageRows.length > 0 && (
              <PercentSection>
                <SectionLabel>Porcentajes por receta</SectionLabel>
                <PercentList>
                  {percentageRows.map((percentage) => (
                    <PercentLine
                      key={`${percentage.recipeName}-${percentage.name}-${percentage.value}`}
                    >
                      <PercentLabel>
                        {percentage.recipeName} · {percentage.name} ({percentage.value}%)
                      </PercentLabel>
                      <PercentValue>
                        {percentage.amount != null ? formatCurrency(percentage.amount) : '—'}
                      </PercentValue>
                    </PercentLine>
                  ))}
                </PercentList>
              </PercentSection>
            )}

            {costItems.length > 0 && (
              <CostList>
                <SectionLabel>Costeo por ingrediente</SectionLabel>
                {costItems.map((row) => (
                  <CostLine key={row.ingredientId}>
                    <CostName>{row.ingredientName}</CostName>
                    <CostSupplier>{row.supplierName ?? 'Sin proveedor'}</CostSupplier>
                    <CostAmount>{formatCurrency(row.cost)}</CostAmount>
                  </CostLine>
                ))}
              </CostList>
            )}

            <Total>
              <div>
                <TotalLabel>Total estimado</TotalLabel>
                {subtotal > 0 && <TotalSub>Subtotal {formatCurrency(subtotal)}</TotalSub>}
              </div>
              <TotalValue>
                {item.estimatedCost != null ? formatCurrency(item.estimatedCost) : '—'}
              </TotalValue>
            </Total>
            {item.hasCost === false && (
              <TotalSub>Sin costos de proveedor registrados</TotalSub>
            )}

            <CardActions>
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
              <ExportButton
                type="button"
                onClick={() => onExport(item)}
                aria-label={`Exportar cotización de ${item.clientName} a PDF`}
              >
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
                  <path d="M6 9V2h12v7" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect x="6" y="14" width="12" height="8" />
                </svg>
                PDF
              </ExportButton>
            </CardActions>
          </Card>
        )
      })}
    </Grid>
  )
}

export default QuotationsCards
