import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useToggle } from '@uidotdev/usehooks'
import { useBasesStore } from '../../hooks/useBases.js'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { useSuppliersStore } from '../../hooks/useSuppliers.js'
import { createBase, updateBase, updateBaseActive, deleteBase } from '../../services/bases.js'
import { normalizeText } from '../../utils/format.js'
import BasesToolbar from './components/BasesToolbar/index.jsx'
import BasesCards from './components/BasesCards/index.jsx'
import BasesList from './components/BasesList/index.jsx'
import ViewToggle from '../../components/ViewToggle/index.jsx'
import BaseForm from './components/BaseForm/index.jsx'
import BaseDetail from './components/BaseDetail/index.jsx'
import BaseCostModal from './components/BaseCostModal/index.jsx'
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
 * Página de administración de bases (postres).
 *
 * @returns {JSX.Element} Vista de la página de bases.
 */
function Bases() {
  const items = useBasesStore((state) => state.items)
  const status = useBasesStore((state) => state.status)
  const search = useBasesStore((state) => state.search)
  const page = useBasesStore((state) => state.page)
  const total = useBasesStore((state) => state.total)
  const load = useBasesStore((state) => state.load)
  const setSearch = useBasesStore((state) => state.setSearch)
  const setPage = useBasesStore((state) => state.setPage)
  const active = useBasesStore((state) => state.active)
  const setActive = useBasesStore((state) => state.setActive)
  const removeItem = useBasesStore((state) => state.removeItem)

  const ingredients = useIngredientsStore((state) => state.items)
  const loadIngredients = useIngredientsStore((state) => state.load)
  const loadAllIngredients = useIngredientsStore((state) => state.loadAll)
  const allIngredients = useIngredientsStore((state) => state.allItems)

  const suppliers = useSuppliersStore((state) => state.allItems)
  const loadAllSuppliers = useSuppliersStore((state) => state.loadAll)

  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadIngredients(true), loadAllIngredients(), loadAllSuppliers()])
    }
    loadAll()
  }, [active, load, loadIngredients, loadAllIngredients, loadAllSuppliers])

  const ingredientMap = useMemo(() => {
    const map = new Map()
    allIngredients.forEach((ingredient) => map.set(String(ingredient.id), ingredient))
    return map
  }, [allIngredients])

  const filtered = useMemo(() => {
    const query = normalizeText(debouncedSearch.trim())
    if (!query) return items
    return items.filter((item) => normalizeText(item.name).includes(query))
  }, [items, debouncedSearch])

  const totalItems = total
  const totalPages = Math.max(1, Math.ceil(totalItems / 10))
  const currentPage = page
  const pageItems = filtered
  const hasFilters = search.trim() !== ''

  const [modalOpen, setModalOpen] = useToggle(false)
  const [editing, setEditing] = useState(null)
  const [detailBase, setDetailBase] = useState(null)
  const [costBase, setCostBase] = useState(null)
  const [view, setView] = useState('cards')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [togglingId, setTogglingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Abre el modal para crear una nueva base. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar una base existente.
   *
   * @param {object} base - Base a editar.
   */
  const openEditModal = (base) => {
    setDetailBase(null)
    setEditing(base)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar una base.
   *
   * @param {object} payload - Datos de la base.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      if (editing) {
        await updateBase({ ...payload, id: editing.id })
        setConfirmation('Base actualizada')
      } else {
        await createBase(payload)
        setConfirmation('Base agregada')
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
   * Activa o desactiva una base y sincroniza con la API.
   *
   * @param {object} base - Base a modificar.
   * @param {boolean} activeValue - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (base, activeValue) => {
    setTogglingId(base.id)

    try {
      await updateBaseActive(base.id, activeValue)
      removeItem(base.id)
      if (detailBase?.id === base.id) {
        setDetailBase(null)
      }
    } catch {
      /* noop */
    } finally {
      setTogglingId(null)
    }
  }

  /**
   * Elimina una base. Si está asociada a una receta, la inhabilita.
   *
   * @param {object} base - Base a eliminar.
   * @returns {Promise<void>}
   */
  const handleDelete = async (base) => {
    setDeletingId(base.id)

    try {
      const { deleted } = await deleteBase(base.id)
      if (deleted || active) {
        removeItem(base.id)
        if (detailBase?.id === base.id) setDetailBase(null)
      }
      setConfirmation(
        deleted
          ? 'Base eliminada'
          : 'Base inhabilitada porque está asociada a una receta',
      )
    } catch (error) {
      setConfirmation(error.message || 'No se pudo eliminar la base')
    } finally {
      setDeletingId(null)
    }
  }

  let content

  if (status === 'loading') {
    content = (
      <StateWrap>
        <Spinner role="status" aria-label="Cargando" />
        <span>Cargando bases…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar las bases.</span>
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
            ? 'No se encontraron bases con los criterios indicados.'
            : 'No hay bases registradas.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'base' : 'bases'}
          </Count>
          <ViewToggle view={view} onChange={setView} />
        </ContentHeader>
        {view === 'cards' ? (
          <BasesCards
            items={pageItems}
            ingredientMap={ingredientMap}
            onViewDetail={setDetailBase}
            onViewCost={setCostBase}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ) : (
          <BasesList
            items={pageItems}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
            onViewDetail={setDetailBase}
            onViewCost={setCostBase}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        )}
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Bases</Title>
        {status === 'success' && (
          <BasesToolbar
            search={search}
            onSearchChange={setSearch}
            active={active}
            onActiveChange={setActive}
            onAdd={openCreateModal}
          />
        )}
        {content}
      </Page>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar base' : 'Agregar base'}
        description={
          editing
            ? 'Modifica los datos de la base'
            : 'Crea una nueva base con sus ingredientes y preparación'
        }
        size="lg"
        onClose={closeModal}
      >
        <BaseForm
          initialValues={editing}
          ingredients={allIngredients}
          submitting={submitting}
          submitLabel={editing ? 'Guardar cambios' : 'Guardar base'}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <BaseDetail
        base={detailBase}
        ingredientMap={ingredientMap}
        onClose={() => setDetailBase(null)}
        onEdit={openEditModal}
        onToggleActive={handleToggleActive}
        togglingId={togglingId}
        onDelete={handleDelete}
        deletingId={deletingId}
      />

      <BaseCostModal
        base={costBase}
        ingredientMap={ingredientMap}
        suppliers={suppliers}
        onClose={() => setCostBase(null)}
      />

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

export default Bases
