import { useEffect, useMemo, useState } from 'react'
import { useToggle } from '@uidotdev/usehooks'
import { useProductionsStore } from '../../hooks/useProductions.js'
import { useRecipesStore } from '../../hooks/useRecipes.js'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { createProduction } from '../../services/productions.js'
import { formatCurrency, formatDate } from '../../utils/format.js'
import Button from '../../components/Button/index.jsx'
import Modal from '../../components/Modal/index.jsx'
import ProductionForm from './components/ProductionForm/index.jsx'
import {
  Page,
  Title,
  ContentHeader,
  DateTitle,
  DateGroup,
  Count,
  StateWrap,
  Spinner,
  RetryButton,
  Toast,
  Toolbar,
  Filters,
  FilterSelect,
  WindowNav,
  WindowLabel,
  List,
  Row,
  Main,
  Name,
  Meta,
  CostText,
  StatusBadge,
  OpenLink,
} from './styles.js'

const STATUS_LABELS = {
  nuevo: 'Nuevo',
  en_progreso: 'En progreso',
  finalizado: 'Finalizado',
}

/**
 * Página de producción (hacer una receta descontando stock).
 *
 * @returns {JSX.Element} Vista de la página de producción.
 */
function Production() {
  const items = useProductionsStore((state) => state.items)
  const status = useProductionsStore((state) => state.status)
  const total = useProductionsStore((state) => state.total)
  const offset = useProductionsStore((state) => state.offset)
  const windowStart = useProductionsStore((state) => state.windowStart)
  const windowEnd = useProductionsStore((state) => state.windowEnd)
  const load = useProductionsStore((state) => state.load)
  const prev = useProductionsStore((state) => state.prev)
  const next = useProductionsStore((state) => state.next)

  const recipes = useRecipesStore((state) => state.allItems)
  const loadRecipes = useRecipesStore((state) => state.loadAll)
  const loadIngredients = useIngredientsStore((state) => state.load)

  const [modalOpen, setModalOpen] = useToggle(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [isError, setIsError] = useState(false)
  const [statusFilter, setStatusFilter] = useState('')
  const [recipeFilter, setRecipeFilter] = useState('')

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadRecipes(), loadIngredients()])
    }
    loadAll()
  }, [load, loadRecipes, loadIngredients])

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Indica si hay filtros activos. */
  const hasFilters = statusFilter !== '' || recipeFilter !== ''

  /** Filtra las producciones de la página actual por estado y receta. */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter) {
        const itemStatus = item.status || (item.steps ? 'nuevo' : 'finalizado')
        if (itemStatus !== statusFilter) return false
      }
      if (recipeFilter && item.recipeId !== recipeFilter) return false
      return true
    })
  }, [items, statusFilter, recipeFilter])

  /** Agrupa las producciones filtradas por fecha, conservando el orden. */
  const groupedItems = useMemo(() => {
    const groups = []
    const map = new Map()
    filteredItems.forEach((item) => {
      const key = String(item.date ?? '').slice(0, 10)
      if (!map.has(key)) {
        const group = { date: key, items: [] }
        map.set(key, group)
        groups.push(group)
      }
      map.get(key).items.push(item)
    })
    return groups
  }, [filteredItems])

  /**
   * Cambia el filtro por estado.
   *
   * @param {string} value - Estado ('', 'nuevo', 'en_progreso', 'finalizado').
   */
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
  }

  /**
   * Cambia el filtro por receta.
   *
   * @param {string} value - Id de la receta ('' = todas).
   */
  const handleRecipeFilterChange = (value) => {
    setRecipeFilter(value)
  }

  /**
   * Registra la producción y recarga historial + stock de ingredientes.
   *
   * @param {object} payload - Datos de la producción.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      await createProduction(payload)
      setConfirmation('Producción iniciada. Abrila para avanzar por los pasos.')
      setIsError(false)
      setModalOpen(false)
      load()
      loadIngredients()
    } catch (error) {
      setConfirmation(error.message || 'Error al iniciar la producción')
      setIsError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const totalItems = total

  let content

  if (status === 'loading') {
    content = (
      <StateWrap>
        <Spinner role="status" aria-label="Cargando" />
        <span>Cargando producciones…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar las producciones.</span>
        <RetryButton type="button" onClick={load}>
          Reintentar
        </RetryButton>
      </StateWrap>
    )
  } else if (totalItems === 0) {
    content = (
      <StateWrap>
        <span>No hay producciones en estos días.</span>
      </StateWrap>
    )
  } else if (hasFilters && filteredItems.length === 0) {
    content = (
      <StateWrap>
        <span>No se encontraron producciones con los criterios indicados.</span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'producción' : 'producciones'}
          </Count>
        </ContentHeader>
        <List>
          {groupedItems.map((group) => (
            <DateGroup key={group.date}>
              <DateTitle>{formatDate(group.date)}</DateTitle>
              {group.items.map((item) => {
                const prodStatus = item.status || (item.steps ? 'nuevo' : 'finalizado')
                return (
                  <Row key={item.id}>
                    <Main>
                      <Name>{item.recipeName}</Name>
                      <Meta>
                        {item.portions != null && `${item.portions} porciones`}
                      </Meta>
                    </Main>
                    <StatusBadge $status={prodStatus}>
                      {STATUS_LABELS[prodStatus] || 'Nuevo'}
                    </StatusBadge>
                    <CostText>{formatCurrency(item.finalCost ?? item.totalCost)}</CostText>
                    <OpenLink to={`/produccion/${item.id}`}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Abrir
                    </OpenLink>
                  </Row>
                )
              })}
            </DateGroup>
          ))}
        </List>
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Producción</Title>
        {status === 'success' && (
          <Toolbar>
            <Filters>
              <FilterSelect
                value={statusFilter}
                onChange={(event) => handleStatusFilterChange(event.target.value)}
                aria-label="Filtrar por estado"
              >
                <option value="">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="en_progreso">En progreso</option>
                <option value="finalizado">Finalizado</option>
              </FilterSelect>

              <FilterSelect
                value={recipeFilter}
                onChange={(event) => handleRecipeFilterChange(event.target.value)}
                aria-label="Filtrar por receta"
              >
                <option value="">Todas las recetas</option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </FilterSelect>
            </Filters>

            <Button type="button" onClick={setModalOpen}>
              + Iniciar producción
            </Button>
          </Toolbar>
        )}

        <WindowNav>
          <Button
            type="button"
            variant="secondary"
            onClick={prev}
            disabled={status === 'loading'}
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retroceder
          </Button>

          <WindowLabel>
            {windowStart && windowEnd
              ? `${formatDate(windowStart)} – ${formatDate(windowEnd)}`
              : 'Últimos días'}
          </WindowLabel>

          <Button
            type="button"
            variant="secondary"
            onClick={next}
            disabled={status === 'loading' || offset <= 0}
          >
            Avanzar
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </WindowNav>

        {content}
      </Page>

      <Modal open={modalOpen} title="Iniciar producción" size="lg" onClose={() => setModalOpen(false)}>
        <ProductionForm
          recipes={recipes}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {confirmation && (
        <Toast role="status" $error={isError}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isError ? (
              <circle cx="12" cy="12" r="10" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
          {confirmation}
        </Toast>
      )}
    </>
  )
}

export default Production
