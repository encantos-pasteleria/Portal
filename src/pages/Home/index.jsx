import { useCallback, useEffect, useMemo } from 'react'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { useSuppliersStore } from '../../hooks/useSuppliers.js'
import { useBasesStore } from '../../hooks/useBases.js'
import { useProductionsStore } from '../../hooks/useProductions.js'
import { useStockMovementsStore } from '../../hooks/useStockMovements.js'
import { getStockStatus } from '../../utils/stock.js'
import { bestUnitCost } from '../../utils/suppliers.js'
import { formatCurrency, formatDate } from '../../utils/format.js'
import { formatAmount } from '../../utils/units.js'
import StatCard from './components/StatCard/index.jsx'
import StockDonut from './components/StockDonut/index.jsx'
import {
  Page,
  Title,
  Subtitle,
  StatGrid,
  Grid,
  Panel,
  PanelHeader,
  PanelTitle,
  PanelLink,
  PanelBody,
  DonutRow,
  Legend,
  LegendItem,
  LegendDot,
  LegendLabel,
  LegendValue,
  List,
  ListItem,
  ItemMain,
  ItemTitle,
  ItemMeta,
  ItemValue,
  Badge,
  BarListWrap,
  BarItem,
  BarRow,
  BarLabel,
  BarSub,
  BarValue,
  BarTrack,
  BarFill,
  EmptyText,
  StateWrap,
  Spinner,
  RetryButton,
} from './styles.js'

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

/** Momento de un registro (createdAt con respaldo en date). */
function timeOf(item) {
  const time = new Date(item?.createdAt ?? item?.date).getTime()
  return Number.isNaN(time) ? 0 : time
}

/**
 * Página de inicio: dashboard con los indicadores generales del negocio.
 *
 * @returns {JSX.Element} Vista del dashboard.
 */
function Home() {
  const ingredients = useIngredientsStore((state) => state.items)
  const ingredientStatus = useIngredientsStore((state) => state.status)
  const loadIngredients = useIngredientsStore((state) => state.load)

  const suppliers = useSuppliersStore((state) => state.items)
  const supplierStatus = useSuppliersStore((state) => state.status)
  const loadSuppliers = useSuppliersStore((state) => state.load)

  const bases = useBasesStore((state) => state.items)
  const baseStatus = useBasesStore((state) => state.status)
  const loadBases = useBasesStore((state) => state.load)

  const productions = useProductionsStore((state) => state.items)
  const productionStatus = useProductionsStore((state) => state.status)
  const loadProductions = useProductionsStore((state) => state.load)

  const movements = useStockMovementsStore((state) => state.items)
  const movementStatus = useStockMovementsStore((state) => state.status)
  const loadMovements = useStockMovementsStore((state) => state.load)

  const reloadAll = useCallback(() => {
    loadIngredients()
    loadSuppliers()
    loadBases()
    loadProductions()
    loadMovements()
  }, [loadIngredients, loadSuppliers, loadBases, loadProductions, loadMovements])

  useEffect(() => {
    reloadAll()
  }, [reloadAll])

  const statuses = [
    ingredientStatus,
    supplierStatus,
    baseStatus,
    productionStatus,
    movementStatus,
  ]
  const loading = statuses.some((status) => status === 'loading')
  const allError = statuses.every((status) => status === 'error')

  /** Mapa de id de proveedor a su objeto para resolver nombres. */
  const supplierMap = useMemo(() => {
    const map = new Map()
    suppliers.forEach((supplier) => map.set(String(supplier.id), supplier))
    return map
  }, [suppliers])

  /** Conteo de ingredientes por estado de stock. */
  const stockSummary = useMemo(() => {
    const result = { normal: 0, low: 0, out: 0 }
    ingredients.forEach((item) => {
      const { status } = getStockStatus(item.stock, item.minStock)
      result[status] += 1
    })
    return result
  }, [ingredients])

  /** Valor actual del inventario: stock en mano valorado al mejor costo de compra. */
  const inventoryValue = useMemo(
    () =>
      ingredients.reduce((sum, ingredient) => {
        const cost = bestUnitCost(ingredient, suppliers)
        return sum + (Number(ingredient.stock) || 0) * (cost ?? 0)
      }, 0),
    [ingredients, suppliers],
  )

  /** Totales de compras (movimientos de entrada). */
  const purchaseSummary = useMemo(() => {
    const purchases = movements.filter((movement) => movement.type === 'in')
    const spend = purchases.reduce(
      (sum, movement) =>
        sum + (Number(movement.quantity) || 0) * (Number(movement.cost) || 0),
      0,
    )
    return { count: purchases.length, spend }
  }, [movements])

  /** Totales de producción (cantidad, costo y porciones). */
  const productionSummary = useMemo(
    () => ({
      count: productions.length,
      cost: productions.reduce((sum, item) => sum + (Number(item.totalCost) || 0), 0),
      portions: productions.reduce((sum, item) => sum + (Number(item.portions) || 0), 0),
    }),
    [productions],
  )

  /** Ingredientes con stock bajo o agotado, priorizando los agotados. */
  const alerts = useMemo(() => {
    const order = { out: 0, low: 1 }
    return ingredients
      .map((item) => ({ ...item, ...getStockStatus(item.stock, item.minStock) }))
      .filter((item) => item.status !== 'normal')
      .sort((a, b) => order[a.status] - order[b.status] || a.ratio - b.ratio)
      .slice(0, 6)
  }, [ingredients])

  /** Producciones más recientes. */
  const recentProductions = useMemo(
    () => [...productions].sort((a, b) => timeOf(b) - timeOf(a)).slice(0, 5),
    [productions],
  )

  /** Compras más recientes. */
  const recentPurchases = useMemo(
    () =>
      movements
        .filter((movement) => movement.type === 'in')
        .sort((a, b) => timeOf(b) - timeOf(a))
        .slice(0, 5),
    [movements],
  )

  /** Gasto acumulado por proveedor. */
  const spendBySupplier = useMemo(() => {
    const map = new Map()
    movements
      .filter((movement) => movement.type === 'in')
      .forEach((movement) => {
        const spend = (Number(movement.quantity) || 0) * (Number(movement.cost) || 0)
        const key = movement.supplierId ? String(movement.supplierId) : '__none__'
        map.set(key, (map.get(key) || 0) + spend)
      })

    return [...map.entries()]
      .map(([id, value]) => ({
        name: id === '__none__' ? 'Sin proveedor' : supplierMap.get(id)?.name ?? id,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [movements, supplierMap])

  /** Ingredientes con mayor costo acumulado en producción. */
  const costByIngredient = useMemo(() => {
    const map = new Map()

    productions.forEach((production) => {
      const items = production.items || []
      items.forEach((item) => {
        const key = String(item.ingredientId ?? item.ingredientName)
        const cost = Number(item.cost) || 0
        const quantity = Number(item.quantity) || 0
        const current = map.get(key)

        if (current) {
          current.cost += cost
          current.quantity += quantity
        } else {
          map.set(key, {
            name: item.ingredientName || key,
            cost,
            quantity,
            unit: item.unit,
          })
        }
      })
    })

    return [...map.values()].sort((a, b) => b.cost - a.cost).slice(0, 5)
  }, [productions])

  const today = new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  if (loading) {
    return (
      <Page>
        <Title>Inicio</Title>
        <StateWrap>
          <Spinner role="status" aria-label="Cargando" />
          <span>Cargando resumen…</span>
        </StateWrap>
      </Page>
    )
  }

  if (allError) {
    return (
      <Page>
        <Title>Inicio</Title>
        <StateWrap>
          <span>No se pudo cargar el resumen.</span>
          <RetryButton type="button" onClick={reloadAll}>
            Reintentar
          </RetryButton>
        </StateWrap>
      </Page>
    )
  }

  return (
    <Page>
      <Title>Inicio</Title>
      <Subtitle>{today}</Subtitle>

      <StatGrid>
        <StatCard
          tone="primary"
          icon={
            <svg {...iconProps}>
              <circle cx="12" cy="12" r="10" />
              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
              <path d="M12 18V6" />
            </svg>
          }
          value={formatCurrency(inventoryValue)}
          label="Valor del inventario"
          sub={`${ingredients.length} ingredientes activos`}
        />

        <StatCard
          tone="neutral"
          icon={
            <svg {...iconProps}>
              <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
              <path d="M3.3 8.3L12 13l8.7-4.7" />
              <line x1="12" y1="22" x2="12" y2="13" />
            </svg>
          }
          value={ingredients.length}
          label="Ingredientes"
          sub={`${stockSummary.low} bajos · ${stockSummary.out} agotados`}
        />

        <StatCard
          tone="primary"
          icon={
            <svg {...iconProps}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          value={suppliers.length}
          label="Proveedores"
          sub="activos"
        />

        <StatCard
          tone="primary"
          icon={
            <svg {...iconProps}>
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          }
          value={bases.length}
          label="Bases"
          sub="activas"
        />

        <StatCard
          tone="success"
          icon={
            <svg {...iconProps}>
              <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M17 18h1" />
              <path d="M12 18h1" />
              <path d="M7 18h1" />
            </svg>
          }
          value={productionSummary.count}
          label="Producciones"
          sub={`${formatCurrency(productionSummary.cost)} · ${productionSummary.portions} porciones`}
        />

        <StatCard
          tone="warning"
          icon={
            <svg {...iconProps}>
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          }
          value={purchaseSummary.count}
          label="Compras"
          sub={`${formatCurrency(purchaseSummary.spend)} invertidos`}
        />
      </StatGrid>

      <Grid>
        <Panel>
          <PanelHeader>
            <PanelTitle>Estado del inventario</PanelTitle>
          </PanelHeader>
          <PanelBody>
            {ingredients.length === 0 ? (
              <EmptyText>No hay ingredientes registrados.</EmptyText>
            ) : (
              <DonutRow>
                <StockDonut
                  normal={stockSummary.normal}
                  low={stockSummary.low}
                  out={stockSummary.out}
                />
                <Legend>
                  <LegendItem>
                    <LegendDot $color="var(--color-success)" />
                    <LegendLabel>Normal</LegendLabel>
                    <LegendValue>{stockSummary.normal}</LegendValue>
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="var(--color-warning)" />
                    <LegendLabel>Stock bajo</LegendLabel>
                    <LegendValue>{stockSummary.low}</LegendValue>
                  </LegendItem>
                  <LegendItem>
                    <LegendDot $color="var(--color-danger)" />
                    <LegendLabel>Agotados</LegendLabel>
                    <LegendValue>{stockSummary.out}</LegendValue>
                  </LegendItem>
                </Legend>
              </DonutRow>
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Alertas de stock</PanelTitle>
            <PanelLink to="/catalogo/ingredientes">Ver parámetros</PanelLink>
          </PanelHeader>
          <PanelBody>
            {alerts.length === 0 ? (
              <EmptyText>Todos los ingredientes están en niveles normales.</EmptyText>
            ) : (
              <List>
                {alerts.map((item) => (
                  <ListItem key={item.id}>
                    <ItemMain>
                      <ItemTitle>{item.name}</ItemTitle>
                      <ItemMeta>
                        {formatAmount(item.stock, item.unit)} · mín.{' '}
                        {formatAmount(item.minStock, item.unit)}
                      </ItemMeta>
                    </ItemMain>
                    <Badge $tone={item.status}>
                      {item.status === 'out' ? 'Agotado' : 'Bajo'}
                    </Badge>
                  </ListItem>
                ))}
              </List>
            )}
          </PanelBody>
        </Panel>
      </Grid>

      <Grid>
        <Panel>
          <PanelHeader>
            <PanelTitle>Producciones recientes</PanelTitle>
            <PanelLink to="/produccion">Ver todo</PanelLink>
          </PanelHeader>
          <PanelBody>
            {recentProductions.length === 0 ? (
              <EmptyText>No hay producciones registradas.</EmptyText>
            ) : (
              <List>
                {recentProductions.map((item) => (
                  <ListItem key={item.id}>
                    <ItemMain>
                      <ItemTitle>{item.baseName}</ItemTitle>
                      <ItemMeta>
                        {formatDate(item.date)}
                        {item.portions != null && ` · ${item.portions} porciones`}
                      </ItemMeta>
                    </ItemMain>
                    <ItemValue>{formatCurrency(item.totalCost)}</ItemValue>
                  </ListItem>
                ))}
              </List>
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Compras recientes</PanelTitle>
            <PanelLink to="/compras">Ver todo</PanelLink>
          </PanelHeader>
          <PanelBody>
            {recentPurchases.length === 0 ? (
              <EmptyText>No hay compras registradas.</EmptyText>
            ) : (
              <List>
                {recentPurchases.map((item) => {
                  const ingredient = item.ingredientId
                    ? ingredients.find((entry) => String(entry.id) === String(item.ingredientId))
                    : null
                  const supplier = item.supplierId
                    ? supplierMap.get(String(item.supplierId))
                    : null
                  return (
                    <ListItem key={item.id ?? `${item.date}-${item.ingredientId}`}>
                      <ItemMain>
                        <ItemTitle>{ingredient?.name ?? item.ingredientId}</ItemTitle>
                        <ItemMeta>
                          {formatDate(item.date)} · {supplier?.name ?? 'Sin proveedor'}
                        </ItemMeta>
                      </ItemMain>
                      <ItemValue>
                        {item.cost != null ? formatCurrency(item.cost) : '—'}
                      </ItemValue>
                    </ListItem>
                  )
                })}
              </List>
            )}
          </PanelBody>
        </Panel>
      </Grid>

      <Grid>
        <Panel>
          <PanelHeader>
            <PanelTitle>Gasto por proveedor</PanelTitle>
          </PanelHeader>
          <PanelBody>
            {spendBySupplier.length === 0 ? (
              <EmptyText>Sin compras para calcular.</EmptyText>
            ) : (
              <BarListWrap>
                {spendBySupplier.map((item) => (
                  <BarItem key={item.name}>
                    <BarRow>
                      <BarLabel>{item.name}</BarLabel>
                      <BarValue>{formatCurrency(item.value)}</BarValue>
                    </BarRow>
                    <BarTrack>
                      <BarFill
                        $width={
                          spendBySupplier[0].value > 0
                            ? (item.value / spendBySupplier[0].value) * 100
                            : 0
                        }
                      />
                    </BarTrack>
                  </BarItem>
                ))}
              </BarListWrap>
            )}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader>
            <PanelTitle>Ingredientes por costo de producción</PanelTitle>
          </PanelHeader>
          <PanelBody>
            {costByIngredient.length === 0 ? (
              <EmptyText>Sin producciones para calcular.</EmptyText>
            ) : (
              <BarListWrap>
                {costByIngredient.map((item) => (
                  <BarItem key={item.name}>
                    <BarRow>
                      <BarLabel>
                        {item.name}
                        {item.quantity > 0 && item.unit && (
                          <BarSub>{formatAmount(item.quantity, item.unit)}</BarSub>
                        )}
                      </BarLabel>
                      <BarValue>{formatCurrency(item.cost)}</BarValue>
                    </BarRow>
                    <BarTrack>
                      <BarFill
                        $width={
                          costByIngredient[0].cost > 0
                            ? (item.cost / costByIngredient[0].cost) * 100
                            : 0
                        }
                      />
                    </BarTrack>
                  </BarItem>
                ))}
              </BarListWrap>
            )}
          </PanelBody>
        </Panel>
      </Grid>
    </Page>
  )
}

export default Home
