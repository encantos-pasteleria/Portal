import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useToggle } from '@uidotdev/usehooks'
import { useRecipesStore } from '../../hooks/useRecipes.js'
import { useBasesStore } from '../../hooks/useBases.js'
import { createRecipe, updateRecipe, updateRecipeActive } from '../../services/recipes.js'
import { normalizeText } from '../../utils/format.js'
import RecipesToolbar from './components/RecipesToolbar/index.jsx'
import RecipesCards from './components/RecipesCards/index.jsx'
import RecipeForm from './components/RecipeForm/index.jsx'
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
 * Página de administración de recetas (combinación de bases y porcentajes).
 *
 * @returns {JSX.Element} Vista de la página de recetas.
 */
function Recipes() {
  const items = useRecipesStore((state) => state.items)
  const status = useRecipesStore((state) => state.status)
  const search = useRecipesStore((state) => state.search)
  const page = useRecipesStore((state) => state.page)
  const total = useRecipesStore((state) => state.total)
  const load = useRecipesStore((state) => state.load)
  const setSearch = useRecipesStore((state) => state.setSearch)
  const setPage = useRecipesStore((state) => state.setPage)
  const active = useRecipesStore((state) => state.active)
  const setActive = useRecipesStore((state) => state.setActive)
  const removeItem = useRecipesStore((state) => state.removeItem)

  const allBases = useBasesStore((state) => state.allItems)
  const loadAllBases = useBasesStore((state) => state.loadAll)

  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadAllBases()])
    }
    loadAll()
  }, [active, load, loadAllBases])

  const baseMap = useMemo(() => {
    const map = new Map()
    allBases.forEach((base) => map.set(String(base.id), base))
    return map
  }, [allBases])

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
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Abre el modal para crear una nueva receta. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar una receta existente.
   *
   * @param {object} recipe - Receta a editar.
   */
  const openEditModal = (recipe) => {
    setEditing(recipe)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar una receta.
   *
   * @param {object} payload - Datos de la receta.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      if (editing) {
        await updateRecipe({ ...payload, id: editing.id })
        setConfirmation('Receta actualizada')
      } else {
        await createRecipe(payload)
        setConfirmation('Receta agregada')
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
   * Activa o desactiva una receta y sincroniza con la API.
   *
   * @param {object} recipe - Receta a modificar.
   * @param {boolean} activeValue - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (recipe, activeValue) => {
    setTogglingId(recipe.id)

    try {
      await updateRecipeActive(recipe.id, activeValue)
      removeItem(recipe.id)
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
        <span>Cargando recetas…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar las recetas.</span>
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
            ? 'No se encontraron recetas con los criterios indicados.'
            : 'No hay recetas registradas.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'receta' : 'recetas'}
          </Count>
        </ContentHeader>
        <RecipesCards
          items={pageItems}
          baseMap={baseMap}
          onEdit={openEditModal}
          onToggleActive={handleToggleActive}
          togglingId={togglingId}
        />
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Recetas</Title>
        {status === 'success' && (
          <RecipesToolbar
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
        title={editing ? 'Editar receta' : 'Agregar receta'}
        description={
          editing
            ? 'Modifica las bases y porcentajes de la receta'
            : 'Combina bases y porcentajes para armar la receta'
        }
        size="lg"
        onClose={closeModal}
      >
        <RecipeForm
          initialValues={editing}
          bases={allBases}
          submitting={submitting}
          submitLabel={editing ? 'Guardar cambios' : 'Guardar receta'}
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

export default Recipes
