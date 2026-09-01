import { useEffect, useState, useMemo } from 'react'
import { useDebounce, useToggle } from '@uidotdev/usehooks'
import { useSuppliersStore } from '../../hooks/useSuppliers.js'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { createSupplier, updateSupplier, updateSupplierActive } from '../../services/suppliers.js'
import { createIngredient } from '../../services/ingredients.js'
import { normalizeText } from '../../utils/format.js'
import SuppliersToolbar from './components/SuppliersToolbar/index.jsx'
import SuppliersCards from './components/SuppliersCards/index.jsx'
import SuppliersList from './components/SuppliersList/index.jsx'
import SupplierDetail from './components/SupplierDetail/index.jsx'
import ViewToggle from '../../components/ViewToggle/index.jsx'
import SupplierForm from './components/SupplierForm/index.jsx'
import Modal from '../../components/Modal/index.jsx'
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
 * Página de administración de proveedores.
 *
 * @returns {JSX.Element} Vista de la página de proveedores.
 */
function Suppliers() {
  const items = useSuppliersStore((state) => state.items)
  const status = useSuppliersStore((state) => state.status)
  const search = useSuppliersStore((state) => state.search)
  const page = useSuppliersStore((state) => state.page)
  const total = useSuppliersStore((state) => state.total)
  const load = useSuppliersStore((state) => state.load)
  const setSearch = useSuppliersStore((state) => state.setSearch)
  const setPage = useSuppliersStore((state) => state.setPage)
  const removeItem = useSuppliersStore((state) => state.removeItem)
  const active = useSuppliersStore((state) => state.active)
  const setActive = useSuppliersStore((state) => state.setActive)
  const ingredientFilter = useSuppliersStore((state) => state.ingredientFilter)
  const setIngredientFilter = useSuppliersStore((state) => state.setIngredientFilter)
  const ingredients = useIngredientsStore((state) => state.items)
  const loadIngredients = useIngredientsStore((state) => state.load)
  const loadAllIngredients = useIngredientsStore((state) => state.loadAll)
  const allIngredients = useIngredientsStore((state) => state.allItems)
  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadIngredients(true), loadAllIngredients()])
    }
    loadAll()
  }, [active, load, loadIngredients, loadAllIngredients])

  const ingredientNames = useMemo(() => {
    const map = new Map()
    allIngredients.forEach((ingredient) => map.set(String(ingredient.id), ingredient.name))
    return map
  }, [allIngredients])

  const filtered = useMemo(() => {
    const query = normalizeText(debouncedSearch.trim())
    return items.filter((item) => {
      const matchesQuery = !query || normalizeText(item.name).includes(query)
      const matchesIngredients =
        ingredientFilter.length === 0 ||
        ingredientFilter.some((id) =>
          Object.prototype.hasOwnProperty.call(item.ingredientPackaging ?? {}, String(id)),
        )
      return matchesQuery && matchesIngredients
    })
  }, [items, debouncedSearch, ingredientFilter])
  const totalItems = total
  const totalPages = Math.max(1, Math.ceil(totalItems / 10))
  const currentPage = page
  const pageItems = filtered
  const hasFilters = search.trim() !== '' || ingredientFilter.length > 0

  const [modalOpen, setModalOpen] = useToggle(false)
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('cards')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [detailSupplier, setDetailSupplier] = useState(null)

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Abre el modal para crear un nuevo proveedor. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar un proveedor existente.
   *
   * @param {object} supplier - Proveedor a editar.
   */
  const openEditModal = (supplier) => {
    setDetailSupplier(null)
    setEditing(supplier)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar un proveedor.
   *
   * @param {object} payload - Datos del proveedor.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      if (editing) {
        await updateSupplier({ ...payload, id: editing.id })
        setConfirmation('Proveedor actualizado')
      } else {
        await createSupplier(payload)
        setConfirmation('Proveedor agregado')
      }

      setModalOpen(false)
      setEditing(null)
      load()
    } catch {
      /* noop */
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Crea un ingrediente desde el formulario de proveedor y recarga el catálogo.
   *
   * @param {object} payload - Datos del ingrediente.
   * @returns {Promise<object>} Ingrediente creado.
   */
  const handleCreateIngredient = async (payload) => {
    const created = await createIngredient(payload)
    await Promise.all([loadIngredients(), loadAllIngredients()])
    return created
  }

  /**
   * Activa o desactiva un proveedor y sincroniza con la API.
   *
   * @param {object} supplier - Proveedor a modificar.
   * @param {boolean} active - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (supplier, active) => {
    setTogglingId(supplier.id)

    try {
      await updateSupplierActive(supplier.id, active)
      removeItem(supplier.id)
      if (detailSupplier?.id === supplier.id) {
        setDetailSupplier(null)
      }
    } catch {
      /* noop */
    } finally {
      setTogglingId(null)
    }
  }

  let content

  if (status === 'loading') {
    content = (
      <StateWrap>
        <Spinner role="status" aria-label="Cargando" />
        <span>Cargando proveedores…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar los proveedores.</span>
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
            ? 'No se encontraron proveedores con los criterios indicados.'
            : 'No hay proveedores registrados.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'proveedor' : 'proveedores'}
          </Count>
          <ViewToggle view={view} onChange={setView} />
        </ContentHeader>
        {view === 'cards' ? (
          <SuppliersCards
            items={pageItems}
            ingredientNames={ingredientNames}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
            onViewDetail={setDetailSupplier}
          />
        ) : (
          <SuppliersList
            items={pageItems}
            ingredientNames={ingredientNames}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
            onViewDetail={setDetailSupplier}
          />
        )}
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Proveedores</Title>
        {status === 'success' && (
          <SuppliersToolbar
            search={search}
            onSearchChange={setSearch}
            active={active}
            onActiveChange={setActive}
            ingredients={ingredients}
            ingredientFilter={ingredientFilter}
            onIngredientFilterChange={setIngredientFilter}
            onAdd={openCreateModal}
          />
        )}
        {content}
      </Page>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar proveedor' : 'Agregar proveedor'}
        onClose={closeModal}
      >
        <SupplierForm
          initialValues={editing}
          ingredients={allIngredients}
          submitting={submitting}
          submitLabel={editing ? 'Guardar cambios' : 'Guardar proveedor'}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          onCreateIngredient={handleCreateIngredient}
        />
      </Modal>

      {detailSupplier && (
        <SupplierDetail
          supplier={detailSupplier}
          ingredientNames={ingredientNames}
          allIngredients={allIngredients}
          onClose={() => setDetailSupplier(null)}
          onEdit={openEditModal}
          onToggleActive={handleToggleActive}
          togglingId={togglingId}
        />
      )}

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

export default Suppliers
