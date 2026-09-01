import { useMemo, useState } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { normalizeText } from '../../../../utils/format.js'
import {
  Form,
  Field,
  Label,
  Input,
  ErrorText,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitleBlock,
  SectionTitle,
  SectionDescription,
  SectionMeta,
  SectionAction,
  BaseSearch,
  BaseSearchInput,
  AvailableList,
  AvailableItem,
  AvailableInfo,
  AvailableName,
  AvailableMeta,
  AddBadge,
  DropdownEmpty,
  SelectedList,
  SelectedItem,
  SelectedInfo,
  SelectedName,
  SelectedMeta,
  QuantityInput,
  RemoveButton,
  EmptySelected,
  PercentList,
  PercentItem,
  PercentFields,
  PercentNameInput,
  PercentValueWrap,
  PercentValueInput,
  PercentSuffix,
  Actions,
} from './styles.js'

/** Contador de keys para items y porcentajes del formulario. */
let nextKey = 0

/** Crea una key única para los elementos dinámicos. */
function createKey() {
  nextKey += 1
  return nextKey
}

/** Normaliza las bases iniciales a `{ key, baseId, quantity }`. */
function normalizeInitialItems(value) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => ({
      key: createKey(),
      baseId: String(item.baseId),
      quantity: item.quantity ?? 1,
    }))
  }
  return []
}

/** Normaliza los porcentajes iniciales a `{ key, name, value }`. */
function normalizeInitialPercentages(value) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((percentage) => ({
      key: createKey(),
      name: percentage.name ?? '',
      value: percentage.value ?? '',
    }))
  }
  return []
}

/**
 * Formulario para crear o editar una receta, asociando varias bases y
 * porcentajes.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {Array} [props.bases=[]] - Bases disponibles para asociar.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {string} [props.submitLabel='Guardar receta'] - Texto del botón de envío.
 * @param {Function} props.onSubmit - Callback al enviar el formulario.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario de la receta.
 */
function RecipeForm({
  initialValues,
  bases = [],
  submitting = false,
  submitLabel = 'Guardar receta',
  onSubmit,
  onCancel,
}) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [portions, setPortions] = useState(initialValues?.portions ?? '')
  const [items, setItems] = useState(() => normalizeInitialItems(initialValues?.items))
  const [percentages, setPercentages] = useState(() =>
    normalizeInitialPercentages(initialValues?.percentages),
  )
  const [baseSearch, setBaseSearch] = useState('')
  const [errors, setErrors] = useState({})

  const baseMap = useMemo(() => {
    const map = new Map()
    bases.forEach((base) => map.set(String(base.id), base))
    return map
  }, [bases])

  /** Bases no asociadas, filtradas por búsqueda. */
  const availableBases = useMemo(() => {
    const query = normalizeText(baseSearch.trim())
    const selectedIds = new Set(items.map((item) => item.baseId))
    return bases.filter((base) => {
      if (selectedIds.has(String(base.id))) return false
      if (!query) return true
      return normalizeText(base.name).includes(query)
    })
  }, [bases, items, baseSearch])

  const setField = (key, value, setter) => {
    setter(value)
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /** Asocia una base a la receta con cantidad inicial 1. */
  const addBase = (baseId) => {
    setItems((prev) => [...prev, { key: createKey(), baseId: String(baseId), quantity: 1 }])
    setErrors((prev) => {
      if (!prev.items) return prev
      const next = { ...prev }
      delete next.items
      return next
    })
  }

  /** Desasocia una base de la receta. */
  const removeBase = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }

  /** Actualiza la cantidad de una base. */
  const setQuantity = (key, value) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: value } : item)),
    )
    setErrors((prev) => {
      if (!prev[`quantity-${key}`]) return prev
      const next = { ...prev }
      delete next[`quantity-${key}`]
      return next
    })
  }

  /** Agrega un porcentaje vacío. */
  const addPercentage = () => {
    setPercentages((prev) => [...prev, { key: createKey(), name: '', value: '' }])
  }

  /** Elimina un porcentaje. */
  const removePercentage = (key) => {
    setPercentages((prev) => prev.filter((percentage) => percentage.key !== key))
  }

  /** Actualiza el nombre de un porcentaje. */
  const setPercentageName = (key, value) => {
    setPercentages((prev) =>
      prev.map((percentage) =>
        percentage.key === key ? { ...percentage, name: value } : percentage,
      ),
    )
    setErrors((prev) => {
      if (!prev[`pname-${key}`]) return prev
      const next = { ...prev }
      delete next[`pname-${key}`]
      return next
    })
  }

  /** Actualiza el valor de un porcentaje. */
  const setPercentageValue = (key, value) => {
    setPercentages((prev) =>
      prev.map((percentage) =>
        percentage.key === key ? { ...percentage, value } : percentage,
      ),
    )
    setErrors((prev) => {
      if (!prev[`pvalue-${key}`]) return prev
      const next = { ...prev }
      delete next[`pvalue-${key}`]
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!name.trim()) nextErrors.name = 'El nombre es obligatorio.'

    const portionsValue = Number(portions)
    if (!Number.isFinite(portionsValue) || portionsValue <= 0) {
      nextErrors.portions = 'Debe ser mayor que cero.'
    }

    if (items.length === 0) nextErrors.items = 'Asocia al menos una base.'

    items.forEach((item) => {
      const quantity = Number(item.quantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        nextErrors[`quantity-${item.key}`] = 'Debe ser mayor que cero.'
      }
    })

    percentages.forEach((percentage) => {
      if (!percentage.name.trim()) nextErrors[`pname-${percentage.key}`] = 'Indica el nombre.'
      const value = Number(percentage.value)
      if (!Number.isFinite(value) || value <= 0) {
        nextErrors[`pvalue-${percentage.key}`] = 'Debe ser mayor que cero.'
      }
    })

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: name.trim(),
      portions: portionsValue,
      items: items.map(({ baseId, quantity }) => ({ baseId, quantity: Number(quantity) })),
      percentages: percentages.map(({ name: pName, value }) => ({
        name: pName.trim(),
        value: Number(value),
      })),
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Section>
        <SectionHeader>
          <SectionIcon>
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </SectionIcon>
          <SectionTitleBlock>
            <SectionTitle>Datos básicos</SectionTitle>
            <SectionDescription>Nombre y porciones de la receta</SectionDescription>
          </SectionTitleBlock>
        </SectionHeader>

        <Field>
          <Label htmlFor="recipe-name">Nombre</Label>
          <Input
            id="recipe-name"
            type="text"
            autoComplete="off"
            placeholder="Ej. Torta de chocolate"
            value={name}
            onChange={(event) => setField('name', event.target.value, setName)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="recipe-portions">Porciones</Label>
          <Input
            id="recipe-portions"
            type="number"
            autoComplete="off"
            min="1"
            placeholder="Ej. 8"
            value={portions}
            onChange={(event) => setField('portions', event.target.value, setPortions)}
            aria-invalid={Boolean(errors.portions)}
          />
          {errors.portions && <ErrorText>{errors.portions}</ErrorText>}
        </Field>
      </Section>

      <Section>
        <SectionHeader>
          <SectionIcon>
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
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
          </SectionIcon>
          <SectionTitleBlock>
            <SectionTitle>Bases</SectionTitle>
            <SectionDescription>Asocia las bases que componen la receta</SectionDescription>
          </SectionTitleBlock>
          <SectionMeta>
            {items.length === 0
              ? 'Sin bases'
              : items.length === 1
                ? '1 base'
                : `${items.length} bases`}
          </SectionMeta>
        </SectionHeader>

        {bases.length === 0 ? (
          <DropdownEmpty>No hay bases registradas</DropdownEmpty>
        ) : (
          <>
            <BaseSearch>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <BaseSearchInput
                type="text"
                placeholder="Buscar base…"
                value={baseSearch}
                onChange={(event) => setBaseSearch(event.target.value)}
                aria-label="Buscar base"
              />
            </BaseSearch>

            {availableBases.length === 0 ? (
              <DropdownEmpty>
                {baseSearch.trim()
                  ? 'Sin coincidencias'
                  : 'Todas las bases ya fueron asociadas'}
              </DropdownEmpty>
            ) : (
              <AvailableList>
                {availableBases.map((base) => (
                  <AvailableItem
                    key={base.id}
                    type="button"
                    onClick={() => addBase(base.id)}
                    aria-label={`Agregar ${base.name}`}
                  >
                    <AvailableInfo>
                      <AvailableName>{base.name}</AvailableName>
                      <AvailableMeta>
                        {base.portions != null
                          ? `${base.portions} ${base.portions === 1 ? 'porción' : 'porciones'}`
                          : 'Base'}
                      </AvailableMeta>
                    </AvailableInfo>
                    <AddBadge aria-hidden="true">+</AddBadge>
                  </AvailableItem>
                ))}
              </AvailableList>
            )}
          </>
        )}

        {items.length === 0 ? (
          <EmptySelected>Agrega bases a la receta</EmptySelected>
        ) : (
          <SelectedList>
            {items.map((item) => {
              const base = baseMap.get(item.baseId)
              return (
                <SelectedItem key={item.key}>
                  <SelectedInfo>
                    <SelectedName>{base?.name ?? item.baseId}</SelectedName>
                  </SelectedInfo>
                  <QuantityInput
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={item.quantity}
                    onChange={(event) => setQuantity(item.key, event.target.value)}
                    aria-label={`Cantidad de ${base?.name ?? item.baseId}`}
                    aria-invalid={Boolean(errors[`quantity-${item.key}`])}
                  />
                  <RemoveButton
                    type="button"
                    onClick={() => removeBase(item.key)}
                    aria-label={`Quitar ${base?.name ?? item.baseId}`}
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </RemoveButton>
                </SelectedItem>
              )
            })}
          </SelectedList>
        )}
        {errors.items && <ErrorText>{errors.items}</ErrorText>}
      </Section>

      <Section>
        <SectionHeader>
          <SectionIcon>
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
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          </SectionIcon>
          <SectionTitleBlock>
            <SectionTitle>Porcentajes</SectionTitle>
            <SectionDescription>
              Porcentajes aplicables a la receta
            </SectionDescription>
          </SectionTitleBlock>
          <SectionAction type="button" onClick={addPercentage}>
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar porcentaje
          </SectionAction>
        </SectionHeader>

        {percentages.length === 0 ? (
          <EmptySelected>
            Agrega porcentajes como “Margen de desperdicio” o “Ganancia”
          </EmptySelected>
        ) : (
          <PercentList>
            {percentages.map((percentage) => (
                <PercentItem key={percentage.key}>
                  <PercentFields>
                    <PercentNameInput
                      type="text"
                      placeholder="Ej. Margen de desperdicio"
                      value={percentage.name}
                      onChange={(event) =>
                        setPercentageName(percentage.key, event.target.value)
                      }
                      aria-label="Nombre del porcentaje"
                      aria-invalid={Boolean(errors[`pname-${percentage.key}`])}
                    />
                    <PercentValueWrap>
                      <PercentValueInput
                        type="number"
                        min="0"
                        inputMode="decimal"
                        placeholder="10"
                        value={percentage.value}
                        onChange={(event) =>
                          setPercentageValue(percentage.key, event.target.value)
                        }
                        aria-label="Valor del porcentaje"
                        aria-invalid={Boolean(errors[`pvalue-${percentage.key}`])}
                      />
                      <PercentSuffix>%</PercentSuffix>
                    </PercentValueWrap>
                  </PercentFields>
                  <RemoveButton
                    type="button"
                    onClick={() => removePercentage(percentage.key)}
                    aria-label="Quitar porcentaje"
                  >
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </RemoveButton>
                  {errors[`pname-${percentage.key}`] && (
                    <ErrorText>{errors[`pname-${percentage.key}`]}</ErrorText>
                  )}
                  {errors[`pvalue-${percentage.key}`] && (
                    <ErrorText>{errors[`pvalue-${percentage.key}`]}</ErrorText>
                  )}
                </PercentItem>
            ))}
          </PercentList>
        )}
      </Section>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </Button>
      </Actions>
    </Form>
  )
}

export default RecipeForm
