import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useToggle } from '@uidotdev/usehooks'
import { useStockMovementsStore } from '../../hooks/useStockMovements.js'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { useSuppliersStore } from '../../hooks/useSuppliers.js'
import { createPurchases } from '../../services/stockMovements.js'
import { normalizeText } from '../../utils/format.js'
import { computeUnitCost } from '../../utils/suppliers.js'
import { toBase } from '../../utils/units.js'
import ComprasToolbar from './components/ComprasToolbar/index.jsx'
import ComprasTable from './components/ComprasTable/index.jsx'
import CompraBulkForm from './components/CompraBulkForm/index.jsx'
import Modal from '../../components/Modal/index.jsx'
import Button from '../../components/Button/index.jsx'
import Pagination from '../../components/Pagination/index.jsx'
import {
  Page,
  Title,
  Count,
  ContentHeader,
  StateWrap,
  Spinner,
  RetryButton,
  Toast,
} from './styles.js'

/**
 * Ordena una lista de movimientos por una columna.
 *
 * @param {Array} list - Movimientos a ordenar.
 * @param {string} key - Columna ('date' | 'ingredient' | 'quantity' | 'supplier' | 'cost').
 * @param {string} dir - Dirección ('asc' | 'desc').
 * @param {Map} ingredientMap - Mapa de id de ingrediente a objeto.
 * @param {Map} supplierMap - Mapa de id de proveedor a objeto.
 * @returns {Array} Lista ordenada.
 */
function sortMovements(list, key, dir, ingredientMap, supplierMap) {
  const direction = dir === 'asc' ? 1 : -1

  const valueOf = (item) => {
    switch (key) {
      case 'ingredient':
        return ingredientMap.get(item.ingredientId)?.name ?? ''
      case 'supplier':
        return item.supplierId ? supplierMap.get(item.supplierId)?.name ?? '' : ''
      case 'quantity':
        return Number(item.quantity) || 0
      case 'cost':
        return item.cost != null ? Number(item.cost) : null
      case 'date':
      default:
        return String(item.date ?? '')
    }
  }

  return [...list].sort((a, b) => {
    const aValue = valueOf(a)
    const bValue = valueOf(b)

    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction
    }
    return String(aValue).localeCompare(String(bValue), undefined, { numeric: true }) * direction
  })
}

/**
 * Página de administración de compras (entradas de stock).
 *
 * @returns {JSX.Element} Vista de la página de compras.
 */
function Purchases() {
  const items = useStockMovementsStore((state) => state.items)
  const status = useStockMovementsStore((state) => state.status)
  const search = useStockMovementsStore((state) => state.search)
  const page = useStockMovementsStore((state) => state.page)
  const total = useStockMovementsStore((state) => state.total)
  const load = useStockMovementsStore((state) => state.load)
  const setSearch = useStockMovementsStore((state) => state.setSearch)
  const setPage = useStockMovementsStore((state) => state.setPage)
  const ingredients = useIngredientsStore((state) => state.allItems)
  const loadIngredients = useIngredientsStore((state) => state.loadAll)
  const suppliers = useSuppliersStore((state) => state.allItems)
  const loadSuppliers = useSuppliersStore((state) => state.loadAll)
  const debouncedSearch = useDebounce(search, 250)
  const [ingredientFilter, setIngredientFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [sortKey, setSortKey] = useState('date')
  const [sortDir, setSortDir] = useState('desc')

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadIngredients(), loadSuppliers()])
    }
    loadAll()
  }, [load, loadIngredients, loadSuppliers])

  const ingredientMap = useMemo(() => {
    const map = new Map()
    ingredients.forEach((ingredient) => map.set(ingredient.id, ingredient))
    return map
  }, [ingredients])

  const supplierMap = useMemo(() => {
    const map = new Map()
    suppliers.forEach((supplier) => map.set(supplier.id, supplier))
    return map
  }, [suppliers])

  const filtered = useMemo(() => {
    const query = normalizeText(debouncedSearch.trim())
    const base = items
      .filter((item) => item.type === 'in')
      .filter((item) => {
        if (!query) return true

        const ingredient = ingredientMap.get(item.ingredientId)
        const supplier = item.supplierId ? supplierMap.get(item.supplierId) : null
        const haystack = normalizeText(
          [ingredient?.name, supplier?.name, item.notes, item.createdBy]
            .filter(Boolean)
            .join(' '),
        )
        return haystack.includes(query)
      })
      .filter((item) => !ingredientFilter || item.ingredientId === ingredientFilter)
      .filter((item) => {
        if (!supplierFilter) return true
        if (supplierFilter === '__none__') return item.supplierId == null
        return item.supplierId === supplierFilter
      })

    return sortMovements(base, sortKey, sortDir, ingredientMap, supplierMap)
  }, [
    items,
    debouncedSearch,
    ingredientMap,
    supplierMap,
    ingredientFilter,
    supplierFilter,
    sortKey,
    sortDir,
  ])
  const totalItems = total
  const totalPages = Math.max(1, Math.ceil(totalItems / 10))
  const currentPage = page
  const pageItems = filtered
  const hasFilters = search.trim() !== '' || ingredientFilter !== '' || supplierFilter !== ''

  const [modalOpen, setModalOpen] = useToggle(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Abre el modal para registrar una nueva compra. */
  const openCreateModal = () => {
    setModalOpen(true)
  }

  /** Carga masiva temporal de compras (una por cada proveedor asociado al ingrediente). */
  const handleBulkLoad = async () => {
    const today = new Date().toISOString().split('T')[0]
    const purchases = ingredients.flatMap((ingredient, index) => {
      const ingredientId = String(ingredient.id)
      const relatedSuppliers = suppliers.filter((supplier) =>
        Object.prototype.hasOwnProperty.call(supplier.ingredientPackaging ?? {}, ingredientId),
      )

      if (relatedSuppliers.length === 0) return []

      const unit = ingredient.unit || 'g'
      let quantity = 35 + index * 2

      if (unit === 'kg') {
        quantity = toBase(quantity, 'kg')
      } else if (unit === 'l') {
        quantity = toBase(quantity, 'l')
      } else if (unit === 'g') {
        quantity = quantity * 1000
      } else if (unit === 'ml') {
        quantity = quantity * 1000
      }

      return relatedSuppliers.map((supplier) => ({
        ingredientId,
        quantity,
        supplierId: supplier.id,
        cost: computeUnitCost(supplier.ingredientPackaging?.[ingredientId], ingredient.unit),
        date: today,
        notes: 'Carga masiva temporal',
      }))
    })

    setSubmitting(true)
    try {
      await createPurchases(purchases)
      setConfirmation(`${purchases.length} compras cargadas masivamente`)
      load()
    } catch (error) {
      setConfirmation(error.message || 'Error al cargar compras')
    } finally {
      setSubmitting(false)
    }
  }

  /** Cierra el modal de registro si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
  }

  /**
   * Cambia el filtro por ingrediente y vuelve a la primera página.
   *
   * @param {string} value - Id del ingrediente ('' = todos).
   */
  const handleIngredientFilterChange = (value) => {
    setIngredientFilter(value)
    setPage(1)
  }

  /**
   * Cambia el filtro por proveedor y vuelve a la primera página.
   *
   * @param {string} value - Id del proveedor ('' = todos, '__none__' = sin proveedor).
   */
  const handleSupplierFilterChange = (value) => {
    setSupplierFilter(value)
    setPage(1)
  }

  /**
   * Cambia la columna de orden. Si ya está activa, alterna la dirección.
   *
   * @param {string} key - Columna a ordenar.
   */
  const handleSortChange = (key) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' || key === 'cost' ? 'desc' : 'asc')
    }
  }

  /**
   * Envía el formulario para registrar una o varias compras.
   *
   * @param {Array} purchases - Compras a registrar.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (purchases) => {
    setSubmitting(true)

    try {
      await createPurchases(purchases)
      const count = purchases.length
      setConfirmation(
        count === 1 ? 'Compra registrada' : `${count} compras registradas`,
      )
      setModalOpen(false)
      load()
    } catch {
      /* noop */
    } finally {
      setSubmitting(false)
    }
  }

  let content

  if (status === 'loading') {
    content = (
      <StateWrap>
        <Spinner role="status" aria-label="Cargando" />
        <span>Cargando compras…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar las compras.</span>
        <RetryButton type="button" onClick={load}>
          Reintentar
        </RetryButton>
      </StateWrap>
    )
  } else if (totalItems === 0) {
    content = (
      <StateWrap>
        <span>
          {hasFilters
            ? 'No se encontraron compras con los criterios indicados.'
            : 'No hay compras registradas.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'compra' : 'compras'}
          </Count>
        </ContentHeader>
        <ComprasTable
          items={pageItems}
          ingredientMap={ingredientMap}
          supplierMap={supplierMap}
          sortKey={sortKey}
          sortDir={sortDir}
          onSortChange={handleSortChange}
        />
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Compras</Title>
        {status === 'success' && (
          <>
            <ComprasToolbar
              search={search}
              onSearchChange={setSearch}
              ingredients={ingredients}
              ingredientFilter={ingredientFilter}
              onIngredientFilterChange={handleIngredientFilterChange}
              suppliers={suppliers}
              supplierFilter={supplierFilter}
              onSupplierFilterChange={handleSupplierFilterChange}
              onAdd={openCreateModal}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' }}>
              <Button type="button" variant="secondary" onClick={handleBulkLoad} disabled={submitting}>
                ⚡ Carga masiva temporal
              </Button>
            </div>
          </>
        )}
        {content}
      </Page>

      <Modal open={modalOpen} title="Agregar compras" onClose={closeModal}>
        <CompraBulkForm
          ingredients={ingredients}
          suppliers={suppliers}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      {confirmation && (
        <Toast role="status">
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
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {confirmation}
        </Toast>
      )}
    </>
  )
}

export default Purchases
