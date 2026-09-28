import { useEffect, useMemo, useState } from 'react'
import { useDebounce, useToggle } from '@uidotdev/usehooks'
import { useQuotationsStore } from '../../hooks/useQuotations.js'
import { useRecipesStore } from '../../hooks/useRecipes.js'
import {
  createQuotation,
  updateQuotation,
  updateQuotationActive,
  computeQuotationCost,
} from '../../services/quotations.js'
import { normalizeText } from '../../utils/format.js'
import QuotationsToolbar from './components/QuotationsToolbar/index.jsx'
import QuotationsCards from './components/QuotationsCards/index.jsx'
import QuotationForm from './components/QuotationForm/index.jsx'
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
 * Página de administración de cotizaciones para clientes.
 *
 * @returns {JSX.Element} Vista de la página de cotizaciones.
 */
function Quotations() {
  const items = useQuotationsStore((state) => state.items)
  const status = useQuotationsStore((state) => state.status)
  const search = useQuotationsStore((state) => state.search)
  const page = useQuotationsStore((state) => state.page)
  const total = useQuotationsStore((state) => state.total)
  const load = useQuotationsStore((state) => state.load)
  const setSearch = useQuotationsStore((state) => state.setSearch)
  const setPage = useQuotationsStore((state) => state.setPage)
  const active = useQuotationsStore((state) => state.active)
  const setActive = useQuotationsStore((state) => state.setActive)
  const removeItem = useQuotationsStore((state) => state.removeItem)

  const allRecipes = useRecipesStore((state) => state.allItems)
  const loadAllRecipes = useRecipesStore((state) => state.loadAll)

  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    const loadAll = async () => {
      await Promise.all([load(), loadAllRecipes()])
    }
    loadAll()
  }, [active, load, loadAllRecipes])

  const filtered = useMemo(() => {
    const query = normalizeText(debouncedSearch.trim())
    if (!query) return items
    return items.filter(
      (item) =>
        normalizeText(item.clientName ?? '').includes(query) ||
        normalizeText(item.clientPhone ?? '').includes(query) ||
        normalizeText(item.clientEmail ?? '').includes(query),
    )
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

  /** Abre el modal para crear una nueva cotización. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar una cotización existente.
   *
   * @param {object} quotation - Cotización a editar.
   */
  const openEditModal = (quotation) => {
    setEditing(quotation)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar una cotización.
   *
   * @param {object} payload - Datos de la cotización.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      const { supplierSelections, percentages, ...rest } = payload
      let costDetail = {
        items: [],
        recipes: [],
        percentages: [],
        totalCost: rest.estimatedCost ?? 0,
      }

      try {
        costDetail = await computeQuotationCost(rest.items, supplierSelections, percentages)
      } catch {
        /* conserva el estimado calculado en el cliente */
      }

      const data = {
        ...rest,
        percentages,
        quotationCostPercentages: costDetail.percentages,
        supplierSelections,
        costItems: costDetail.items,
        costRecipes: costDetail.recipes,
        estimatedCost: costDetail.totalCost,
      }

      if (editing) {
        await updateQuotation({ ...data, id: editing.id })
        setConfirmation('Cotización actualizada')
      } else {
        await createQuotation({
          ...data,
          date: new Date().toISOString().split('T')[0],
        })
        setConfirmation('Cotización agregada')
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
   * Activa o desactiva una cotización y sincroniza con la API.
   *
   * @param {object} quotation - Cotización a modificar.
   * @param {boolean} activeValue - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (quotation, activeValue) => {
    setTogglingId(quotation.id)

    try {
      await updateQuotationActive(quotation.id, activeValue)
      removeItem(quotation.id)
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
        <span>Cargando cotizaciones…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar las cotizaciones.</span>
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
            ? 'No se encontraron cotizaciones con los criterios indicados.'
            : 'No hay cotizaciones registradas.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'cotización' : 'cotizaciones'}
          </Count>
        </ContentHeader>
        <QuotationsCards
          items={pageItems}
          recipes={allRecipes}
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
        <Title>Cotizaciones</Title>
        {status === 'success' && (
          <QuotationsToolbar
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
        title={editing ? 'Editar cotización' : 'Nueva cotización'}
        description={
          editing
            ? 'Modifica los datos del cliente y las recetas'
            : 'Agrega los datos del cliente y las recetas a cotizar'
        }
        size="lg"
        onClose={closeModal}
      >
        <QuotationForm
          initialValues={editing}
          recipes={allRecipes}
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

export default Quotations
