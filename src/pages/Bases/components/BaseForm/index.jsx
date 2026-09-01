import { useCallback, useMemo, useState, Fragment } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { convert, compatibleUnitOptions, formatQuantity } from '../../../../utils/units.js'
import { normalizeText } from '../../../../utils/format.js'
import {
  Form,
  Fields,
  Field,
  Label,
  Input,
  PortionsControl,
  PortionsButton,
  PortionsDisplay,
  PortionsInput,
  PortionsLabel,
  ErrorText,
  Hint,
  HeaderRow,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitleBlock,
  SectionTitle,
  SectionDescription,
  SectionMeta,
  SectionAction,
  IngredientPicker,
  IngredientColumns,
  IngredientColumn,
  ColumnHeader,
  ColumnTitle,
  ColumnCount,
  IngredientSearch,
  IngredientSearchInput,
  AvailableList,
  AvailableItem,
  AvailableInfo,
  AvailableName,
  AvailableMeta,
  AddBadge,
  DropdownEmpty,
  SelectedList,
  IngredientWrap,
  IngredientRow,
  IngredientInfo,
  IngredientName,
  IngredientMeta,
  QuantityRow,
  QuantityGroup,
  QuantityInput,
  UnitSelect,
  RemoveButton,
  IngredientError,
  EmptyText,
  StepsList,
  StepItem,
  StepRail,
  StepNumber,
  StepLine,
  StepCard,
  StepHeader,
  StepOptional,
  StepRemoveButton,
  StepTextarea,
  StepChipLabel,
  StepIngredientsGroup,
  StepIngredients,
  StepChip,
  Actions,
  Spacer,
  Stepper,
  StepperItem,
  StepperDot,
  StepperLabel,
  StepperLine,
} from './styles.js'

/** Normaliza el valor inicial de ingredientes a un objeto `{ id: cantidad }`. */
function normalizeInitialIngredients(value) {
  const result = {}
  Object.entries(value || {}).forEach(([id, quantity]) => {
    result[id] = quantity != null ? String(quantity) : ''
  })
  return result
}

/**
 * Construye el mapa inicial de unidades por ingrediente, usando la unidad base
 * de cada ingrediente registrado.
 *
 * @param {object} ingredientsById - Objeto `{ id: cantidad }` de la base.
 * @param {Array} catalog - Ingredientes registrados.
 * @returns {object} Objeto `{ id: unidad }`.
 */
function normalizeInitialUnits(ingredientsById, catalog) {
  const result = {}
  Object.keys(ingredientsById || {}).forEach((id) => {
    const ingredient = catalog.find((item) => String(item.id) === String(id))
    result[id] = ingredient?.unit ?? ''
  })
  return result
}

/** Contador de keys para los pasos del formulario. */
let nextStepKey = 0

/** Crea un paso vacío con un key único. */
function createEmptyStep() {
  nextStepKey += 1
  return { key: nextStepKey, description: '', ingredientIds: [], optional: false }
}

/**
 * Normaliza los pasos iniciales de la base.
 *
 * @param {object} initialValues - Valores iniciales de la base.
 * @returns {Array<{key: number, description: string, ingredientIds: string[], optional: boolean}>} Pasos.
 */
function normalizeInitialSteps(initialValues) {
  const raw = initialValues?.steps

  if (Array.isArray(raw) && raw.length > 0) {
    return raw.map((step) => ({
      key: (nextStepKey += 1),
      description: step?.description ?? '',
      ingredientIds: Array.isArray(step?.ingredientIds) ? step.ingredientIds : [],
      optional: step?.optional === true,
    }))
  }

  return [createEmptyStep()]
}

/**
 * Valida un número obligatorio, numérico y mayor que cero.
 *
 * @param {string|number|null|undefined} value - Valor a validar.
 * @param {string} label - Nombre del campo (para el mensaje de error).
 * @returns {string|null} Mensaje de error o null si es válido.
 */
function validatePositive(value, label) {
  if (value === '' || value === null || value === undefined) {
    return `${label} es obligatorio.`
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return `${label} debe ser un número válido.`
  }
  if (number <= 0) {
    return `${label} debe ser mayor que cero.`
  }

  return null
}

/**
 * Valida el paso de datos básicos (nombre y porciones).
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validateBasic(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'

  const portionsError = validatePositive(values.portions, 'Las porciones')
  if (portionsError) errors.portions = portionsError

  return errors
}

/**
 * Valida el paso de ingredientes.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validateIngredientsStep(values) {
  const errors = {}

  const entries = Object.entries(values.ingredients)
  if (entries.length === 0) {
    errors.ingredients = 'Selecciona al menos un ingrediente.'
  }

  entries.forEach(([id, quantity]) => {
    const quantityError = validatePositive(quantity, 'La cantidad')
    if (quantityError) errors[`quantity-${id}`] = quantityError
  })

  return errors
}

/**
 * Valida el paso de preparación.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validateStepsStep(values) {
  const errors = {}

  values.steps.forEach((step) => {
    if (!step.description.trim()) {
      errors[`step-${step.key}`] = 'Describe el paso.'
    }
  })

  return errors
}

/**
 * Valida todos los campos del formulario.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validate(values) {
  return {
    ...validateBasic(values),
    ...validateIngredientsStep(values),
    ...validateStepsStep(values),
  }
}

/**
 * Formulario para crear o editar una base (postre).
 *
 * Además de los ingredientes (con unidad convertible), permite armar la
 * preparación paso a paso, asociando varios ingredientes y marcando pasos
 * como opcionales.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {Array} [props.ingredients=[]] - Ingredientes disponibles para seleccionar.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {string} [props.submitLabel='Guardar base'] - Texto del botón de envío.
 * @param {Function} props.onSubmit - Callback al enviar el formulario.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario de la base.
 */
function BaseForm({
  initialValues,
  ingredients = [],
  submitting = false,
  submitLabel = 'Guardar base',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? '',
    portions: initialValues?.portions ?? '',
    ingredients: normalizeInitialIngredients(initialValues?.ingredients),
    steps: normalizeInitialSteps(initialValues),
  }))
  const [unitMap, setUnitMap] = useState(() =>
    normalizeInitialUnits(initialValues?.ingredients, ingredients),
  )
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [ingredientSearch, setIngredientSearch] = useState('')

  /** Ingredientes no seleccionados, filtrados por el término de búsqueda. */
  const availableIngredients = useMemo(() => {
    const query = normalizeText(ingredientSearch.trim())
    return ingredients.filter((ing) => {
      if (Object.prototype.hasOwnProperty.call(values.ingredients, String(ing.id))) return false
      if (!query) return true
      return normalizeText(ing.name).includes(query)
    })
  }, [ingredients, values.ingredients, ingredientSearch])

  /** Mapa de id de ingrediente a su objeto, para resolver la unidad base. */
  const ingredientCatalog = useMemo(() => {
    const map = new Map()
    ingredients.forEach((ingredient) => map.set(String(ingredient.id), ingredient))
    return map
  }, [ingredients])

  /**
   * Convierte una cantidad a la unidad base del ingrediente.
   *
   * @param {string} id - Id del ingrediente.
   * @param {string|number} quantity - Cantidad ingresada.
   * @returns {number|null} Cantidad en unidad base, o null si no es convertible.
   */
  const toBaseQuantity = useCallback(
    (id, quantity) => {
      const ingredient = ingredientCatalog.get(String(id))
      const baseUnit = ingredient?.unit
      const unit = unitMap[String(id)]
      if (!baseUnit || !unit) return null
      return convert(quantity, unit, baseUnit)
    },
    [unitMap, ingredientCatalog],
  )

  const setValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const toggleIngredient = (id) => {
    const key = String(id)

    setValues((prev) => {
      const next = { ...prev.ingredients }
      if (key in next) delete next[key]
      else next[key] = ''
      return {
        ...prev,
        ingredients: next,
        steps: prev.steps.map((step) =>
          step.ingredientIds.includes(key)
            ? { ...step, ingredientIds: step.ingredientIds.filter((sid) => sid !== key) }
            : step,
        ),
      }
    })
    setUnitMap((prev) => {
      if (key in prev) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      const ingredient = ingredientCatalog.get(key)
      return { ...prev, [key]: ingredient?.unit ?? '' }
    })
    setErrors((prev) => {
      const quantityKey = `quantity-${key}`
      if (!prev[quantityKey] && !prev.ingredients) return prev
      const next = { ...prev }
      delete next[quantityKey]
      delete next.ingredients
      return next
    })
  }

  const setIngredientQuantity = (id, quantity) => {
    const key = String(id)

    setValues((prev) => ({
      ...prev,
      ingredients: { ...prev.ingredients, [key]: quantity },
    }))
    setErrors((prev) => {
      const quantityKey = `quantity-${key}`
      if (!prev[quantityKey]) return prev
      const next = { ...prev }
      delete next[quantityKey]
      return next
    })
  }

  const setIngredientUnit = (id, unit) => {
    setUnitMap((prev) => ({ ...prev, [String(id)]: unit }))
  }

  /**
   * Actualiza la descripción de un paso y limpia su error.
   *
   * @param {number} key - Key del paso.
   * @param {string} value - Nueva descripción.
   */
  const setStepDescription = (key, value) => {
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.key === key ? { ...step, description: value } : step,
      ),
    }))
    setErrors((prev) => {
      if (!prev[`step-${key}`]) return prev
      const next = { ...prev }
      delete next[`step-${key}`]
      return next
    })
  }

  /**
   * Asocia o desasocia un ingrediente a un paso.
   *
   * @param {number} key - Key del paso.
   * @param {string} ingredientId - Id del ingrediente.
   */
  const toggleStepIngredient = (key, ingredientId) => {
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => {
        if (step.key !== key) return step
        const includes = step.ingredientIds.includes(ingredientId)
        return {
          ...step,
          ingredientIds: includes
            ? step.ingredientIds.filter((id) => id !== ingredientId)
            : [...step.ingredientIds, ingredientId],
        }
      }),
    }))
  }

  /**
   * Marca o desmarca un paso como opcional.
   *
   * @param {number} key - Key del paso.
   * @param {boolean} optional - Estado opcional.
   */
  const setStepOptional = (key, optional) => {
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => (step.key === key ? { ...step, optional } : step)),
    }))
  }

  /** Agrega un paso vacío al final de la preparación. */
  const addStep = () => {
    setValues((prev) => ({ ...prev, steps: [...prev.steps, createEmptyStep()] }))
  }

  /**
   * Elimina un paso (siempre queda al menos uno).
   *
   * @param {number} key - Key del paso a eliminar.
   */
  const removeStep = (key) => {
    setValues((prev) => ({
      ...prev,
      steps: prev.steps.length > 1 ? prev.steps.filter((step) => step.key !== key) : prev.steps,
    }))
    setErrors((prev) => {
      if (!prev[`step-${key}`]) return prev
      const next = { ...prev }
      delete next[`step-${key}`]
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name || nextErrors.portions) {
        setCurrentStep(0)
      } else if (
        nextErrors.ingredients ||
        Object.keys(nextErrors).some((key) => key.startsWith('quantity-'))
      ) {
        setCurrentStep(1)
      } else {
        setCurrentStep(2)
      }
      return
    }

    onSubmit({
      name: values.name.trim(),
      portions: Number(values.portions),
      ingredients: Object.fromEntries(
        Object.entries(values.ingredients).map(([id, quantity]) => {
          const converted = toBaseQuantity(id, quantity)
          return [id, converted != null ? converted : Number(quantity)]
        }),
      ),
      steps: values.steps.map((step) => ({
        description: step.description.trim(),
        ingredientIds: step.ingredientIds.filter((id) =>
          Object.prototype.hasOwnProperty.call(values.ingredients, id),
        ),
        optional: step.optional,
      })),
    })
  }

  /**
   * Valida el paso actual y avanza al siguiente si es válido.
   */
  const goNext = () => {
    const validators = [validateBasic, validateIngredientsStep, validateStepsStep]
    const stepErrors = validators[currentStep](values)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return
    setCurrentStep((step) => Math.min(step + 1, 2))
  }

  /** Retrocede al paso anterior. */
  const goPrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  const selectedCount = Object.keys(values.ingredients).length
  const selectedIngredients = Object.keys(values.ingredients)
    .map((id) => ingredientCatalog.get(id))
    .filter(Boolean)

  const decrementPortions = () => {
    setValue('portions', String(Math.max(1, (Number(values.portions) || 0) - 1)))
  }

  const incrementPortions = () => {
    setValue('portions', String((Number(values.portions) || 0) + 1))
  }

  const stepLabels = ['Datos', 'Ingredientes', 'Preparación']

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Stepper>
        {stepLabels.map((label, index) => (
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
            {index < stepLabels.length - 1 && (
              <StepperLine data-done={currentStep > index} />
            )}
          </Fragment>
        ))}
      </Stepper>

      <Fields>
        {currentStep === 0 && (
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
              <SectionDescription>Nombre y rendimiento de la base</SectionDescription>
            </SectionTitleBlock>
          </SectionHeader>

          <HeaderRow>
            <Field>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="Ej. Flan de leche"
                value={values.name}
                onChange={(event) => setValue('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="portions">Porciones</Label>
              <PortionsControl>
                <PortionsButton
                  type="button"
                  onClick={decrementPortions}
                  disabled={(Number(values.portions) || 0) <= 1}
                  aria-label="Disminuir porciones"
                >
                  −
                </PortionsButton>
                <PortionsDisplay>
                  <PortionsInput
                    id="portions"
                    type="number"
                    min="1"
                    inputMode="numeric"
                    value={values.portions}
                    onChange={(event) => setValue('portions', event.target.value)}
                    aria-invalid={Boolean(errors.portions)}
                    aria-label="Cantidad de porciones"
                  />
                  <PortionsLabel>porciones</PortionsLabel>
                </PortionsDisplay>
                <PortionsButton
                  type="button"
                  onClick={incrementPortions}
                  aria-label="Aumentar porciones"
                >
                  +
                </PortionsButton>
              </PortionsControl>
              {errors.portions && <ErrorText>{errors.portions}</ErrorText>}
            </Field>
          </HeaderRow>
        </Section>
        )}

        {currentStep === 1 && (
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
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </SectionIcon>
            <SectionTitleBlock>
              <SectionTitle>Ingredientes</SectionTitle>
              <SectionDescription>
                Selecciona los ingredientes y define sus cantidades
              </SectionDescription>
            </SectionTitleBlock>
            <SectionMeta>
              {selectedCount === 0
                ? 'Sin ingredientes'
                : selectedCount === 1
                  ? '1 seleccionado'
                  : `${selectedCount} seleccionados`}
            </SectionMeta>
          </SectionHeader>

          {ingredients.length === 0 ? (
            <EmptyText>No hay ingredientes registrados</EmptyText>
          ) : (
            <IngredientPicker>
              <IngredientSearch>
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
                <IngredientSearchInput
                  type="text"
                  placeholder="Buscar ingrediente…"
                  value={ingredientSearch}
                  onChange={(event) => setIngredientSearch(event.target.value)}
                  aria-label="Buscar ingrediente"
                />
              </IngredientSearch>

              <IngredientColumns>
                <IngredientColumn>
                  <ColumnHeader>
                    <ColumnTitle>Disponibles</ColumnTitle>
                    <ColumnCount>{availableIngredients.length}</ColumnCount>
                  </ColumnHeader>

                  {availableIngredients.length === 0 ? (
                    <DropdownEmpty>
                      {ingredientSearch.trim()
                        ? 'Sin coincidencias'
                        : 'Todos los ingredientes ya fueron agregados'}
                    </DropdownEmpty>
                  ) : (
                    <AvailableList>
                      {availableIngredients.map((ingredient) => (
                        <AvailableItem
                          key={ingredient.id}
                          type="button"
                          onClick={() => toggleIngredient(ingredient.id)}
                          aria-label={`Agregar ${ingredient.name}`}
                        >
                          <AvailableInfo>
                            <AvailableName>{ingredient.name}</AvailableName>
                            <AvailableMeta>Se mide en {ingredient.unit}</AvailableMeta>
                          </AvailableInfo>
                          <AddBadge aria-hidden="true">+</AddBadge>
                        </AvailableItem>
                      ))}
                    </AvailableList>
                  )}
                </IngredientColumn>

                <IngredientColumn>
                  <ColumnHeader>
                    <ColumnTitle>Seleccionados</ColumnTitle>
                    <ColumnCount>{selectedCount}</ColumnCount>
                  </ColumnHeader>

                  {selectedCount === 0 ? (
                    <DropdownEmpty>
                      Agrega ingredientes desde la lista para definir sus cantidades
                    </DropdownEmpty>
                  ) : (
                    <SelectedList>
                      {selectedIngredients.map((ingredient) => {
                        const id = String(ingredient.id)
                        const quantity = values.ingredients[id] ?? ''
                        const unit = unitMap[id] ?? ''
                        const baseUnit = ingredient.unit
                        const converted =
                          baseUnit && unit ? convert(quantity, unit, baseUnit) : null
                        const errorKey = `quantity-${id}`
                        const showHint = converted != null && unit !== baseUnit

                        return (
                          <IngredientWrap key={ingredient.id}>
                            <IngredientRow>
                              <IngredientInfo>
                                <IngredientName>{ingredient.name}</IngredientName>
                                <IngredientMeta>Se mide en {baseUnit}</IngredientMeta>
                              </IngredientInfo>
                              <RemoveButton
                                type="button"
                                onClick={() => toggleIngredient(ingredient.id)}
                                aria-label={`Quitar ${ingredient.name}`}
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
                            </IngredientRow>
                            <QuantityRow>
                              <QuantityGroup>
                                <QuantityInput
                                  type="number"
                                  min="0"
                                  placeholder="Cant."
                                  value={quantity}
                                  onChange={(event) =>
                                    setIngredientQuantity(ingredient.id, event.target.value)
                                  }
                                  aria-invalid={Boolean(errors[errorKey])}
                                  aria-label={`Cantidad de ${ingredient.name}`}
                                />
                                <UnitSelect
                                  value={unit}
                                  onChange={(event) =>
                                    setIngredientUnit(ingredient.id, event.target.value)
                                  }
                                  aria-label={`Unidad de ${ingredient.name}`}
                                >
                                  {compatibleUnitOptions(baseUnit).map(({ value, label }) => (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  ))}
                                </UnitSelect>
                              </QuantityGroup>
                              {showHint && (
                                <Hint>= {formatQuantity(converted, baseUnit)}</Hint>
                              )}
                            </QuantityRow>
                            {errors[errorKey] && (
                              <IngredientError>{errors[errorKey]}</IngredientError>
                            )}
                          </IngredientWrap>
                        )
                      })}
                    </SelectedList>
                  )}
                </IngredientColumn>
              </IngredientColumns>
            </IngredientPicker>
          )}
          {errors.ingredients && <ErrorText>{errors.ingredients}</ErrorText>}
        </Section>
        )}

        {currentStep === 2 && (
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
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </SectionIcon>
            <SectionTitleBlock>
              <SectionTitle>Preparación</SectionTitle>
              <SectionDescription>Describe los pasos de preparación</SectionDescription>
            </SectionTitleBlock>
            <SectionAction type="button" onClick={addStep}>
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
              Agregar paso
            </SectionAction>
          </SectionHeader>

          <StepsList>
            {values.steps.map((step, index) => {
              const isLast = index === values.steps.length - 1

              return (
                <StepItem key={step.key}>
                  <StepRail>
                    <StepNumber>{index + 1}</StepNumber>
                    {!isLast && <StepLine />}
                  </StepRail>
                  <StepCard>
                    <StepHeader>
                      <StepOptional
                        type="button"
                        aria-pressed={step.optional}
                        onClick={() => setStepOptional(step.key, !step.optional)}
                      >
                        <svg
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Opcional
                      </StepOptional>
                      <StepRemoveButton
                        type="button"
                        onClick={() => removeStep(step.key)}
                        disabled={values.steps.length === 1}
                        aria-label={`Quitar paso ${index + 1}`}
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
                      </StepRemoveButton>
                    </StepHeader>
                    <StepTextarea
                      placeholder={`Describe el paso a realizar...`}
                      value={step.description}
                      onChange={(event) => setStepDescription(step.key, event.target.value)}
                      aria-invalid={Boolean(errors[`step-${step.key}`])}
                    />
                    {errors[`step-${step.key}`] && (
                      <ErrorText>{errors[`step-${step.key}`]}</ErrorText>
                    )}
                    {selectedIngredients.length > 0 && (
                      <StepIngredientsGroup>
                        <StepChipLabel>Usa estos ingredientes en este paso</StepChipLabel>
                        <StepIngredients>
                          {selectedIngredients.map((ingredient) => {
                            const id = String(ingredient.id)
                            const active = step.ingredientIds.includes(id)
                            return (
                              <StepChip
                                key={id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleStepIngredient(step.key, id)}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                {ingredient.name}
                              </StepChip>
                            )
                          })}
                        </StepIngredients>
                      </StepIngredientsGroup>
                    )}
                  </StepCard>
                </StepItem>
              )
            })}
          </StepsList>
        </Section>
        )}
      </Fields>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Spacer />
        {currentStep > 0 && (
          <Button type="button" variant="secondary" onClick={goPrev}>
            Anterior
          </Button>
        )}
        {currentStep < 2 ? (
          <Button type="button" onClick={goNext}>
            Siguiente
          </Button>
        ) : (
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Guardando…' : submitLabel}
          </Button>
        )}
      </Actions>
    </Form>
  )
}

export default BaseForm
