import { useState, Fragment } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { formatCurrency, formatUnitCost, normalizeText } from '../../../../utils/format.js'
import { formatAmount } from '../../../../utils/units.js'
import { previewQuotation } from '../../../../services/quotations.js'
import {
  Form,
  Stepper,
  StepperItem,
  StepperDot,
  StepperLabel,
  StepperLine,
  Fields,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitleBlock,
  SectionTitle,
  SectionDescription,
  SectionMeta,
  SectionAction,
  Field,
  FieldRow,
  Label,
  Input,
  TextArea,
  EmptyText,
  ErrorText,
  BaseSearch,
  BaseSearchInput,
  AvailableList,
  AvailableItem,
  AvailableInfo,
  AvailableName,
  AvailableMeta,
  AvailablePrice,
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
  RecipePercentList,
  RecipePercentNote,
  RecipePercentRow,
  RecipePercentLabel,
  RecipePercentValue,
  BaseSection,
  BaseTitle,
  SupplierRow,
  SupplierInfo,
  ItemName,
  ItemMeta,
  SupplierSelect,
  SupplierCost,
  Summary,
  ItemCard,
  ItemHeader,
  ItemCost,
  SupplierWrap,
  SupplierChip,
  Breakdown,
  BreakdownRow,
  TotalRow,
  TotalValue,
  Spacer,
  Actions,
} from './styles.js'

const STEP_LABELS = ['Cliente y recetas', 'Proveedores', 'Resumen']

/** Contador de keys para recetas seleccionadas. */
let nextKey = 0

/** Crea una key única para los elementos dinámicos. */
function createKey() {
  nextKey += 1
  return nextKey
}

/** Normaliza las recetas iniciales a `{ key, recipeId, quantity }`. */
function normalizeInitialItems(value) {
  if (Array.isArray(value) && value.length > 0) {
    return value.map((item) => ({
      key: createKey(),
      recipeId: String(item.recipeId),
      quantity: item.quantity ?? 1,
    }))
  }
  return []
}

/** Normaliza los porcentajes propios de la cotización a `{ key, name, value }`. */
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
 * Formulario para crear o editar una cotización: datos del cliente, recetas y
 * selección del proveedor de cada ingrediente (misma estructura de precios que
 * una producción). El flujo se divide en pasos.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {Array} [props.recipes=[]] - Recetas disponibles para cotizar.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {Function} props.onSubmit - Callback con datos del cliente, recetas y proveedores.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario de la cotización.
 */
function QuotationForm({
  initialValues,
  recipes = [],
  submitting = false,
  onSubmit,
  onCancel,
}) {
  const [clientName, setClientName] = useState(initialValues?.clientName ?? '')
  const [clientPhone, setClientPhone] = useState(initialValues?.clientPhone ?? '')
  const [clientEmail, setClientEmail] = useState(initialValues?.clientEmail ?? '')
  const [clientNotes, setClientNotes] = useState(initialValues?.clientNotes ?? '')
  const [items, setItems] = useState(() => normalizeInitialItems(initialValues?.items))
  const [percentages, setPercentages] = useState(() =>
    normalizeInitialPercentages(initialValues?.percentages),
  )
  const [recipeSearch, setRecipeSearch] = useState('')
  const [errors, setErrors] = useState({})

  const [currentStep, setCurrentStep] = useState(0)
  const [preview, setPreview] = useState(null)
  const [selections, setSelections] = useState(
    () => initialValues?.supplierSelections ?? {},
  )
  const [calculating, setCalculating] = useState(false)
  const [calcError, setCalcError] = useState(null)

  const recipeMap = new Map(recipes.map((recipe) => [String(recipe.id), recipe]))
  const itemMap = new Map((preview?.items ?? []).map((item) => [item.ingredientId, item]))

  /**
   * Porcentajes parametrizados en cada receta seleccionada (catálogo Parámetros).
   * Se muestran como referencia y se aplican automáticamente a la cotización.
   */
  const recipePercentages = items.flatMap((item) => {
    const recipe = recipeMap.get(item.recipeId)
    return (recipe?.percentages ?? []).map((percentage) => ({
      recipeName: recipe?.name ?? item.recipeId,
      name: percentage.name,
      value: Number(percentage.value) || 0,
    }))
  })

  /** Recetas no asociadas, filtradas por búsqueda. */
  const selectedIds = new Set(items.map((item) => item.recipeId))
  const query = normalizeText(recipeSearch.trim())
  const availableRecipes = recipes.filter((recipe) => {
    if (selectedIds.has(String(recipe.id))) return false
    if (!query) return true
    return normalizeText(recipe.name).includes(query)
  })

  /** Invalida la vista previa al cambiar cliente o recetas. */
  const resetPreview = () => {
    setPreview(null)
    setSelections({})
    setCurrentStep(0)
    setCalcError(null)
  }

  const setField = (key, value, setter) => {
    setter(value)
    setErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /** Asocia una receta a la cotización con cantidad inicial 1. */
  const addRecipe = (recipeId) => {
    setItems((prev) => [...prev, { key: createKey(), recipeId: String(recipeId), quantity: 1 }])
    resetPreview()
    setErrors((prev) => {
      if (!prev.items) return prev
      const next = { ...prev }
      delete next.items
      return next
    })
  }

  /** Desasocia una receta de la cotización. */
  const removeRecipe = (key) => {
    setItems((prev) => prev.filter((item) => item.key !== key))
    resetPreview()
  }

  /** Actualiza la cantidad de una receta. */
  const setQuantity = (key, value) => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: value } : item)),
    )
    resetPreview()
    setErrors((prev) => {
      if (!prev[`quantity-${key}`]) return prev
      const next = { ...prev }
      delete next[`quantity-${key}`]
      return next
    })
  }

  /** Agrega un porcentaje propio de la cotización. */
  const addPercentage = () => {
    setPercentages((prev) => [...prev, { key: createKey(), name: '', value: '' }])
    setErrors((prev) => {
      if (!prev.percentages) return prev
      const next = { ...prev }
      delete next.percentages
      return next
    })
  }

  /** Elimina un porcentaje propio de la cotización. */
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

  /** Valida el primer paso y calcula la vista previa. */
  const handleCalculate = async () => {
    const nextErrors = {}

    if (!clientName.trim()) nextErrors.clientName = 'El nombre del cliente es obligatorio.'
    if (items.length === 0) nextErrors.items = 'Agrega al menos una receta.'

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

    setCalculating(true)
    setPreview(null)
    setCalcError(null)
    try {
      const result = await previewQuotation({
        items: items.map(({ recipeId, quantity }) => ({
          recipeId,
          quantity: Number(quantity),
        })),
      })
      setPreview(result)
      setSelections((prev) => {
        const initial = {}
        result.items.forEach((item) => {
          initial[item.ingredientId] = prev[item.ingredientId] ?? item.defaultSupplierId ?? null
        })
        return initial
      })
      setCurrentStep(1)
    } catch (error) {
      setCalcError(error.message || 'No se pudo calcular la cotización.')
    } finally {
      setCalculating(false)
    }
  }

  /**
   * Actualiza el proveedor seleccionado de un ingrediente.
   *
   * @param {string} ingredientId - Id del ingrediente.
   * @param {string} supplierId - Id del proveedor ('' = sin proveedor).
   */
  const handleSupplierChange = (ingredientId, supplierId) => {
    setSelections((prev) => ({ ...prev, [ingredientId]: supplierId || null }))
  }

  /**
   * Costo unitario seleccionado de un ingrediente de la vista previa.
   *
   * @param {string} ingredientId - Id del ingrediente.
   * @returns {number|null} Costo por unidad base o null.
   */
  const unitCostOf = (ingredientId) => {
    const item = itemMap.get(ingredientId)
    if (!item) return null
    const option = item.supplierOptions.find(
      (opt) => opt.supplierId === selections[ingredientId],
    )
    return option?.cost ?? null
  }

  /**
   * Resumen de la cotización: subtotal por receta, porcentajes aplicados y
   * total. Mantiene la misma estructura de precios que producción.
   *
   * @returns {{
   *   recipes: Array<{ recipeId: string, name: string, subtotal: number, percentages: Array<object>, total: number }>,
   *   subtotal: number,
   *   percentageSum: number,
   *   total: number,
   * }} Resumen de costos.
   */
  const computeSummary = () => {
    const recipes = (preview?.recipes ?? []).map((recipe) => {
      const subtotal = (recipe.ingredients ?? []).reduce((sum, ing) => {
        const unitCost = unitCostOf(ing.ingredientId)
        return sum + (unitCost != null ? unitCost * ing.quantity : 0)
      }, 0)

      const percentages = (recipe.percentages ?? []).map((percentage) => ({
        name: percentage.name,
        value: percentage.value,
        amount: (subtotal * percentage.value) / 100,
      }))
      const percentageSum = percentages.reduce((sum, p) => sum + p.value, 0)

      return {
        recipeId: recipe.recipeId,
        name: recipe.name,
        subtotal,
        percentages,
        total: subtotal * (1 + percentageSum / 100),
      }
    })

    const subtotal = recipes.reduce((sum, recipe) => sum + recipe.subtotal, 0)
    const recipesTotal = recipes.reduce((sum, recipe) => sum + recipe.total, 0)

    const extraPercentages = percentages.map((percentage) => {
      const value = Number(percentage.value) || 0
      return {
        name: percentage.name.trim(),
        value,
        amount: (recipesTotal * value) / 100,
      }
    })
    const extraSum = extraPercentages.reduce((sum, p) => sum + p.value, 0)
    const total = recipesTotal * (1 + extraSum / 100)

    return { recipes, subtotal, recipesTotal, extraPercentages, total }
  }

  /**
   * Envía el formulario (solo en el último paso).
   *
   * @param {React.FormEvent} event - Evento de envío.
   */
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!preview || currentStep !== 2) return
    const summary = computeSummary()
    onSubmit({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      clientNotes: clientNotes.trim(),
      items: items.map(({ recipeId, quantity }) => ({
        recipeId,
        recipeName: recipeMap.get(recipeId)?.name ?? '',
        quantity: Number(quantity),
      })),
      supplierSelections: selections,
      percentages: percentages.map(({ name: pName, value }) => ({
        name: pName.trim(),
        value: Number(value) || 0,
      })),
      estimatedCost: summary.total,
      hasCost: preview.items.some((item) => item.supplierOptions.length > 0),
    })
  }

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0))

  const summary = computeSummary()

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Stepper>
        {STEP_LABELS.map((label, index) => (
          <Fragment key={label}>
            <StepperItem>
              <StepperDot
                type="button"
                data-active={currentStep === index}
                data-done={currentStep > index}
                onClick={() => setCurrentStep(index)}
                disabled={index > currentStep}
              >
                {currentStep > index ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </StepperDot>
              <StepperLabel data-active={currentStep === index}>{label}</StepperLabel>
            </StepperItem>
            {index < STEP_LABELS.length - 1 && <StepperLine data-done={currentStep > index} />}
          </Fragment>
        ))}
      </Stepper>

      <Fields>
        {currentStep === 0 && (
          <>
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                </SectionIcon>
                <SectionTitleBlock>
                  <SectionTitle>Datos del cliente</SectionTitle>
                  <SectionDescription>Información de contacto</SectionDescription>
                </SectionTitleBlock>
              </SectionHeader>

              <Field>
                <Label htmlFor="quote-client">Cliente</Label>
                <Input
                  id="quote-client"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. María Pérez"
                  value={clientName}
                  onChange={(event) => setField('clientName', event.target.value, setClientName)}
                  aria-invalid={Boolean(errors.clientName)}
                />
                {errors.clientName && <ErrorText>{errors.clientName}</ErrorText>}
              </Field>

              <FieldRow>
                <Field>
                  <Label htmlFor="quote-phone">Teléfono</Label>
                  <Input
                    id="quote-phone"
                    type="tel"
                    autoComplete="off"
                    placeholder="Ej. 300 123 4567"
                    value={clientPhone}
                    onChange={(event) => setClientPhone(event.target.value)}
                  />
                </Field>

                <Field>
                  <Label htmlFor="quote-email">Correo</Label>
                  <Input
                    id="quote-email"
                    type="email"
                    autoComplete="off"
                    placeholder="Ej. cliente@correo.com"
                    value={clientEmail}
                    onChange={(event) => setClientEmail(event.target.value)}
                  />
                </Field>
              </FieldRow>

              <Field>
                <Label htmlFor="quote-notes">Notas</Label>
                <TextArea
                  id="quote-notes"
                  rows="2"
                  placeholder="Detalles del pedido, fecha de entrega, observaciones…"
                  value={clientNotes}
                  onChange={(event) => setClientNotes(event.target.value)}
                />
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
                  <SectionTitle>Recetas</SectionTitle>
                  <SectionDescription>Selecciona las recetas a cotizar</SectionDescription>
                </SectionTitleBlock>
                <SectionMeta>
                  {items.length === 0
                    ? 'Sin recetas'
                    : items.length === 1
                      ? '1 receta'
                      : `${items.length} recetas`}
                </SectionMeta>
              </SectionHeader>

              {recipes.length === 0 ? (
                <DropdownEmpty>No hay recetas registradas</DropdownEmpty>
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
                      placeholder="Buscar receta…"
                      value={recipeSearch}
                      onChange={(event) => setRecipeSearch(event.target.value)}
                      aria-label="Buscar receta"
                    />
                  </BaseSearch>

                  {availableRecipes.length === 0 ? (
                    <DropdownEmpty>
                      {recipeSearch.trim()
                        ? 'Sin coincidencias'
                        : 'Todas las recetas ya fueron asociadas'}
                    </DropdownEmpty>
                  ) : (
                    <AvailableList>
                      {availableRecipes.map((recipe) => (
                        <AvailableItem
                          key={recipe.id}
                          type="button"
                          onClick={() => addRecipe(recipe.id)}
                          aria-label={`Agregar ${recipe.name}`}
                        >
                          <AvailableInfo>
                            <AvailableName>{recipe.name}</AvailableName>
                            <AvailableMeta>
                              {recipe.portions != null
                                ? `${recipe.portions} ${
                                    recipe.portions === 1 ? 'porción' : 'porciones'
                                  }`
                                : 'Receta'}
                            </AvailableMeta>
                          </AvailableInfo>
                          <AvailablePrice>Cotizar</AvailablePrice>
                          <AddBadge aria-hidden="true">+</AddBadge>
                        </AvailableItem>
                      ))}
                    </AvailableList>
                  )}
                </>
              )}

              {items.length === 0 ? (
                <EmptySelected>Agrega recetas a la cotización</EmptySelected>
              ) : (
                <SelectedList>
                  {items.map((item) => {
                    const recipe = recipeMap.get(item.recipeId)
                    return (
                      <SelectedItem key={item.key}>
                        <SelectedInfo>
                          <SelectedName>{recipe?.name ?? item.recipeId}</SelectedName>
                          <SelectedMeta>
                            {recipe?.portions != null
                              ? `${recipe.portions} ${
                                  recipe.portions === 1 ? 'porción' : 'porciones'
                                }`
                              : 'Receta'}
                          </SelectedMeta>
                        </SelectedInfo>
                        <QuantityInput
                          type="number"
                          min="1"
                          inputMode="numeric"
                          value={item.quantity}
                          onChange={(event) => setQuantity(item.key, event.target.value)}
                          aria-label={`Cantidad de ${recipe?.name ?? item.recipeId}`}
                          aria-invalid={Boolean(errors[`quantity-${item.key}`])}
                        />
                        <RemoveButton
                          type="button"
                          onClick={() => removeRecipe(item.key)}
                          aria-label={`Quitar ${recipe?.name ?? item.recipeId}`}
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
              {calcError && <ErrorText>{calcError}</ErrorText>}
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
                    Porcentajes propios de la cotización (se suman a los de cada receta)
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

              {recipePercentages.length > 0 && (
                <RecipePercentList>
                  <RecipePercentNote>De las recetas (Parámetros)</RecipePercentNote>
                  {recipePercentages.map((percentage) => (
                    <RecipePercentRow
                      key={`${percentage.recipeName}-${percentage.name}-${percentage.value}`}
                    >
                      <RecipePercentLabel>
                        {percentage.recipeName} · {percentage.name}
                      </RecipePercentLabel>
                      <RecipePercentValue>{percentage.value}%</RecipePercentValue>
                    </RecipePercentRow>
                  ))}
                </RecipePercentList>
              )}

              {percentages.length === 0 ? (
                <EmptySelected>
                  Agrega porcentajes como “Ganancia”, “Domicilio” o “Descuento”
                </EmptySelected>
              ) : (
                <PercentList>
                  {percentages.map((percentage) => (
                    <PercentItem key={percentage.key}>
                      <PercentFields>
                        <PercentNameInput
                          type="text"
                          placeholder="Ej. Ganancia"
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
          </>
        )}

        {currentStep === 1 && (
          <>
            {(preview?.bases ?? []).length === 0 && (
              <EmptyText>Estas recetas no tienen bases con ingredientes.</EmptyText>
            )}
            {(preview?.bases ?? []).map((base) => (
              <BaseSection key={base.baseId}>
                <BaseTitle>{base.name}</BaseTitle>
                {base.ingredients.map((baseIngredient) => {
                  const item = itemMap.get(baseIngredient.ingredientId)
                  if (!item) return null
                  const selected = item.supplierOptions.find(
                    (opt) => opt.supplierId === selections[item.ingredientId],
                  )
                  return (
                    <SupplierRow key={baseIngredient.ingredientId}>
                      <SupplierInfo>
                        <ItemName>{item.ingredientName}</ItemName>
                        <ItemMeta>
                          Necesario: {formatAmount(baseIngredient.quantity, item.unit)}
                        </ItemMeta>
                      </SupplierInfo>
                      <SupplierSelect
                        value={selections[item.ingredientId] ?? ''}
                        onChange={(event) =>
                          handleSupplierChange(item.ingredientId, event.target.value)
                        }
                        aria-label={`Proveedor de ${item.ingredientName}`}
                      >
                        <option value="">Sin proveedor</option>
                        {item.supplierOptions.map((opt) => (
                          <option key={opt.supplierId} value={opt.supplierId}>
                            {opt.name}
                          </option>
                        ))}
                      </SupplierSelect>
                      <SupplierCost>
                        {selected?.cost != null
                          ? `${formatUnitCost(selected.cost)} / ${item.unit}`
                          : item.supplierOptions.length === 0
                            ? 'Sin compras registradas'
                            : 'Sin costo'}
                      </SupplierCost>
                    </SupplierRow>
                  )
                })}
              </BaseSection>
            ))}
          </>
        )}

        {currentStep === 2 && (
          <>
            <Summary>
              {(preview?.items ?? []).map((item) => {
                const option = item.supplierOptions.find(
                  (opt) => opt.supplierId === selections[item.ingredientId],
                )
                const cost = option?.cost != null ? option.cost * item.quantity : 0
                return (
                  <ItemCard key={item.ingredientId}>
                    <ItemHeader>
                      <ItemName>{item.ingredientName}</ItemName>
                      <ItemCost>{formatCurrency(cost)}</ItemCost>
                    </ItemHeader>
                    <ItemMeta>Necesario: {formatAmount(item.quantity, item.unit)}</ItemMeta>
                    <SupplierWrap>
                      <SupplierChip>{option ? option.name : 'Sin proveedor'}</SupplierChip>
                    </SupplierWrap>
                  </ItemCard>
                )
              })}
            </Summary>

            <Breakdown>
              <BreakdownRow>
                <span>Subtotal ingredientes</span>
                <strong>{formatCurrency(summary.subtotal)}</strong>
              </BreakdownRow>
              {summary.recipes.map((recipe) =>
                recipe.percentages.map((percentage) => (
                  <BreakdownRow key={`${recipe.recipeId}-${percentage.name}`} $muted>
                    <span>
                      {percentage.name} ({percentage.value}%) · {recipe.name}
                    </span>
                    <span>{formatCurrency(percentage.amount)}</span>
                  </BreakdownRow>
                )),
              )}
              {summary.extraPercentages.map((percentage, index) => (
                <BreakdownRow key={`extra-${index}-${percentage.name}`} $muted>
                  <span>
                    {percentage.name} ({percentage.value}%) · Cotización
                  </span>
                  <span>{formatCurrency(percentage.amount)}</span>
                </BreakdownRow>
              ))}
            </Breakdown>

            <TotalRow>
              <span>Total estimado</span>
              <TotalValue>{formatCurrency(summary.total)}</TotalValue>
            </TotalRow>
          </>
        )}
      </Fields>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Spacer />
        {currentStep > 0 && (
          <Button type="button" variant="secondary" onClick={goBack}>
            Anterior
          </Button>
        )}
        {currentStep === 0 && (
          <Button type="button" disabled={calculating} onClick={handleCalculate}>
            {calculating ? 'Calculando…' : 'Continuar'}
          </Button>
        )}
        {currentStep === 1 && (
          <Button type="button" onClick={() => setCurrentStep(2)}>
            Continuar
          </Button>
        )}
        {currentStep === 2 && (
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar cotización'}
          </Button>
        )}
      </Actions>
    </Form>
  )
}

export default QuotationForm
