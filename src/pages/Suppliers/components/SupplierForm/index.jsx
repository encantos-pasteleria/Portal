import { useState, Fragment } from 'react'
import Button from '../../../../components/Button/index.jsx'
import Modal from '../../../../components/Modal/index.jsx'
import IngredientForm from '../../../Ingredients/components/IngredientForm/index.jsx'
import { convert, compatibleUnitOptions } from '../../../../utils/units.js'
import { formatUnitCost, round } from '../../../../utils/format.js'
import {
  Form,
  Fields,
  Row,
  Field,
  Label,
  Input,
  Textarea,
  ErrorText,
  Actions,
  IngredientList,
  IngredientRow,
  IngredientInfo,
  IngredientName,
  IngredientStock,
  CostInput,
  UnitSelect,
  Checkbox,
  IngredientError,
  IngredientHint,
  HelperText,
  EmptyText,
  Section,
  SectionHeader,
  SectionIcon,
  SectionTitleBlock,
  SectionTitle,
  SectionDescription,
  Stepper,
  StepperItem,
  StepperDot,
  StepperLabel,
  StepperLine,
  Spacer,
  AddIngredientWrap,
} from './styles.js'

/**
 * Normaliza el valor inicial de ingredientes a `{ id: { price, quantity, unit } }`.
 *
 * @param {object} initialValues - Valores iniciales del proveedor.
 * @param {Array} catalog - Ingredientes registrados.
 * @returns {object} Objeto `{ id: { price, quantity, unit } }`.
 */
function normalizeInitialIngredients(initialValues, catalog) {
  const packaging = initialValues?.ingredientPackaging ?? {}
  const result = {}

  Object.entries(packaging).forEach(([id, pkg]) => {
    const ingredient = catalog.find((item) => String(item.id) === String(id))
    result[id] = {
      price: pkg.price != null ? String(pkg.price) : '',
      quantity: pkg.quantity != null ? String(pkg.quantity) : '',
      unit: pkg.unit ?? ingredient?.unit ?? '',
    }
  })

  return result
}

/**
 * Valida el precio de una presentación (obligatorio, numérico y no negativo).
 *
 * @param {string|number|null|undefined} value - Valor a validar.
 * @returns {string|null} Mensaje de error o null si es válido.
 */
function validatePrice(value) {
  if (value === '' || value === null || value === undefined) {
    return 'El precio es obligatorio.'
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return 'El precio debe ser un número válido.'
  }
  if (number < 0) {
    return 'El precio no puede ser negativo.'
  }

  return null
}

/**
 * Valida la cantidad de una presentación (obligatoria y mayor que cero).
 *
 * @param {string|number|null|undefined} value - Valor a validar.
 * @returns {string|null} Mensaje de error o null si es válido.
 */
function validateQuantity(value) {
  if (value === '' || value === null || value === undefined) {
    return 'La cantidad es obligatoria.'
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return 'La cantidad debe ser un número válido.'
  }
  if (number <= 0) {
    return 'La cantidad debe ser mayor que cero.'
  }

  return null
}

/**
 * Valida los datos básicos del proveedor (nombre y email).
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validateBasic(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }

  return errors
}

/**
 * Valida el paso de ingredientes y costos.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validateIngredientsStep(values) {
  const errors = {}

  Object.entries(values.ingredients).forEach(([id, entry]) => {
    const priceError = validatePrice(entry.price)
    if (priceError) errors[`price-${id}`] = priceError

    const quantityError = validateQuantity(entry.quantity)
    if (quantityError) errors[`quantity-${id}`] = quantityError
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
  }
}

/**
 * Formulario para crear o editar un proveedor.
 *
 * Cada ingrediente captura la presentación de compra (precio + cantidad +
 * unidad); el costo por unidad base se calcula automáticamente.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {Array} [props.ingredients=[]] - Ingredientes disponibles para seleccionar.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {string} [props.submitLabel='Guardar proveedor'] - Texto del botón de envío.
 * @param {Function} props.onSubmit - Callback al enviar el formulario.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario del proveedor.
 */
function SupplierForm({
  initialValues,
  ingredients = [],
  submitting = false,
  submitLabel = 'Guardar proveedor',
  onSubmit,
  onCancel,
  onCreateIngredient,
}) {
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? '',
    contactName: initialValues?.contactName ?? '',
    phone: initialValues?.phone ?? '',
    email: initialValues?.email ?? '',
    address: initialValues?.address ?? '',
    notes: initialValues?.notes ?? '',
    ingredients: normalizeInitialIngredients(initialValues, ingredients),
  }))
  const [errors, setErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false)
  const [creatingIngredient, setCreatingIngredient] = useState(false)
  const [extraIngredients, setExtraIngredients] = useState([])

  const availableIngredients = [...extraIngredients, ...ingredients]

  /**
   * Actualiza un campo del formulario y limpia su error.
   *
   * @param {string} field - Nombre del campo.
   * @param {string} value - Nuevo valor.
   */
  const setValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  /**
   * Alterna la selección de un ingrediente en el proveedor.
   *
   * @param {string|number} id - Identificador del ingrediente.
   */
  const toggleIngredient = (id) => {
    const key = String(id)

    setValues((prev) => {
      const next = { ...prev.ingredients }
      if (key in next) delete next[key]
      else {
        const ingredient = availableIngredients.find((item) => String(item.id) === key)
        next[key] = { price: '', quantity: '1', unit: ingredient?.unit ?? '' }
      }
      return { ...prev, ingredients: next }
    })
    setErrors((prev) => {
      const keys = [`price-${key}`, `quantity-${key}`]
      if (!keys.some((errorKey) => prev[errorKey])) return prev
      const next = { ...prev }
      keys.forEach((errorKey) => delete next[errorKey])
      return next
    })
  }

  /**
   * Actualiza un campo de la presentación de un ingrediente y limpia su error.
   *
   * @param {string|number} id - Identificador del ingrediente.
   * @param {string} field - Campo a actualizar ('price' | 'quantity' | 'unit').
   * @param {string} value - Nuevo valor.
   */
  const setIngredientField = (id, field, value) => {
    const key = String(id)

    setValues((prev) => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [key]: { ...prev.ingredients[key], [field]: value },
      },
    }))
    setErrors((prev) => {
      const errorKey = `${field}-${key}`
      if (!prev[errorKey]) return prev
      const next = { ...prev }
      delete next[errorKey]
      return next
    })
  }

  /**
   * Calcula el costo por unidad base del ingrediente (precio / cantidad base).
   *
   * La cantidad de la presentación se convierte a la unidad base del
   * ingrediente (ej. si el ingrediente es kg y compras 500 g, cuenta como 0.5).
   *
   * @param {string} id - Identificador del ingrediente.
   * @returns {number|null} Costo unitario o null si los datos no son válidos.
   */
  const unitCostFor = (id) => {
    const entry = values.ingredients[String(id)]
    if (!entry) return null

    const ingredient = availableIngredients.find((item) => String(item.id) === String(id))
    const baseUnit = ingredient?.unit
    if (!baseUnit) return null

    const price = Number(entry.price)
    const baseQuantity = convert(entry.quantity, entry.unit, baseUnit)
    if (!Number.isFinite(price) || baseQuantity == null || baseQuantity <= 0) return null
    return round(price / baseQuantity)
  }

  /**
   * Texto que muestra el costo unitario calculado (ej. "= $25.19 / g").
   *
   * @param {string} id - Identificador del ingrediente.
   * @param {string} baseUnit - Unidad base del ingrediente.
   * @returns {string} Hint formateado o ''.
   */
  const hintFor = (id, baseUnit) => {
    const cost = unitCostFor(id)
    if (cost == null) return ''
    return `= ${formatUnitCost(cost)} / ${baseUnit}`
  }

  /**
   * Valida y envía el formulario.
   *
   * @param {React.FormEvent} event - Evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setCurrentStep(nextErrors.name || nextErrors.email ? 0 : 1)
      return
    }

    const ingredientPackaging = {}
    Object.entries(values.ingredients).forEach(([id, entry]) => {
      ingredientPackaging[id] = {
        price: Number(entry.price),
        quantity: Number(entry.quantity),
        unit: entry.unit,
      }
    })

    onSubmit({
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      notes: values.notes.trim(),
      ingredientPackaging,
    })
  }

  /**
   * Valida el paso actual y avanza al siguiente si es válido.
   *
   * @param {React.MouseEvent} event - Evento de clic.
   */
  const goNext = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const validators = [validateBasic, validateIngredientsStep]
    const stepErrors = validators[currentStep](values)
    setErrors(stepErrors)
    if (Object.keys(stepErrors).length > 0) return
    setCurrentStep((step) => Math.min(step + 1, 1))
  }

  /** Retrocede al paso anterior. */
  const goPrev = () => {
    setCurrentStep((step) => Math.max(step - 1, 0))
  }

  /**
   * Evita que la tecla Enter envíe el formulario de forma implícita.
   *
   * Solo permite el submit con Enter cuando se está en el último paso
   * y el target no es un textarea.
   *
   * @param {React.KeyboardEvent} event - Evento de teclado.
   */
  const handleFormKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      if (currentStep < 1) {
        event.preventDefault()
      }
    }
  }

  /** Abre el modal para registrar un nuevo ingrediente. */
  const openIngredientModal = () => {
    setIngredientModalOpen(true)
  }

  /** Cierra el modal de registro de ingrediente si no hay un envío en curso. */
  const closeIngredientModal = () => {
    if (creatingIngredient) return
    setIngredientModalOpen(false)
  }

  /**
   * Crea un ingrediente, lo añade a la lista disponible y lo selecciona
   * automáticamente sin perder los datos del proveedor.
   *
   * @param {object} payload - Datos del ingrediente.
   */
  const handleCreateIngredient = async (payload) => {
    setCreatingIngredient(true)
    try {
      const created = await onCreateIngredient(payload)
      const id = String(created.id)
      setExtraIngredients((prev) =>
        prev.some((item) => String(item.id) === id) ? prev : [...prev, created],
      )
      setValues((prev) => ({
        ...prev,
        ingredients: {
          ...prev.ingredients,
          [id]: { price: '', quantity: '1', unit: created.unit ?? '' },
        },
      }))
      setIngredientModalOpen(false)
    } catch {
      /* noop */
    } finally {
      setCreatingIngredient(false)
    }
  }

  const stepLabels = ['Datos', 'Ingredientes']

  return (
    <>
      <Form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate autoComplete="off">
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Datos del proveedor</SectionTitle>
                <SectionDescription>Información de contacto y notas</SectionDescription>
              </SectionTitleBlock>
            </SectionHeader>

            <Field>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                autoComplete="off"
                placeholder="Ej. Distribuidora La Plaza"
                value={values.name}
                onChange={(event) => setValue('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <ErrorText>{errors.name}</ErrorText>}
            </Field>

            <Row>
              <Field>
                <Label htmlFor="contactName">Contacto</Label>
                <Input
                  id="contactName"
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. María Pérez"
                  value={values.contactName}
                  onChange={(event) => setValue('contactName', event.target.value)}
                  aria-invalid={Boolean(errors.contactName)}
                />
                {errors.contactName && <ErrorText>{errors.contactName}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="off"
                  placeholder="Ej. 300 123 4567"
                  value={values.phone}
                  onChange={(event) => setValue('phone', event.target.value)}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </Field>
            </Row>

            <Field>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="off"
                placeholder="Ej. ventas@proveedor.com"
                value={values.email}
                onChange={(event) => setValue('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                type="text"
                autoComplete="off"
                placeholder="Ej. Cra 10 # 20-30"
                value={values.address}
                onChange={(event) => setValue('address', event.target.value)}
                aria-invalid={Boolean(errors.address)}
              />
              {errors.address && <ErrorText>{errors.address}</ErrorText>}
            </Field>

            <Field>
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                autoComplete="off"
                placeholder="Observaciones del proveedor"
                value={values.notes}
                onChange={(event) => setValue('notes', event.target.value)}
                aria-invalid={Boolean(errors.notes)}
              />
              {errors.notes && <ErrorText>{errors.notes}</ErrorText>}
            </Field>
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
                  <path d="m7.5 4.27 9 5.15" />
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                  <path d="m3.3 7 8.7 5 8.7-5" />
                  <path d="M12 22V12" />
                </svg>
              </SectionIcon>
              <SectionTitleBlock>
                <SectionTitle>Ingredientes y costos</SectionTitle>
                <SectionDescription>
                  Selecciona los ingredientes que provee y define su presentación
                </SectionDescription>
              </SectionTitleBlock>
            </SectionHeader>

            <Field>
              <HelperText>
                Ingresa el precio y la cantidad de la presentación que compras (ej. $10.000 por
                397 g). El costo por unidad se calcula solo.
              </HelperText>
              <AddIngredientWrap>
                <Button type="button" variant="ghost" onClick={openIngredientModal}>
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Registrar ingrediente
                </Button>
              </AddIngredientWrap>
              {availableIngredients.length === 0 ? (
                <EmptyText>No hay ingredientes registrados.</EmptyText>
              ) : (
                <IngredientList>
                  {availableIngredients.map((ingredient) => {
                    const id = String(ingredient.id)
                    const selected = Object.prototype.hasOwnProperty.call(values.ingredients, id)
                    const entry = values.ingredients[id] ?? {
                      price: '',
                      quantity: '1',
                      unit: ingredient.unit ?? '',
                    }
                    const baseUnit = ingredient.unit
                    const hint = selected ? hintFor(id, baseUnit) : ''

                    return (
                      <IngredientRow key={ingredient.id}>
                        <Checkbox
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleIngredient(ingredient.id)}
                        />
                        <IngredientInfo>
                          <IngredientName>{ingredient.name}</IngredientName>
                          <IngredientStock>
                            Stock: {ingredient.stock} {ingredient.unit}
                          </IngredientStock>
                        </IngredientInfo>
                        <CostInput
                          type="number"
                          min="0"
                          placeholder="Precio"
                          disabled={!selected}
                          value={selected ? entry.price : ''}
                          onChange={(event) => setIngredientField(id, 'price', event.target.value)}
                          aria-invalid={Boolean(errors[`price-${id}`])}
                          aria-label={`Precio de ${ingredient.name}`}
                        />
                        <CostInput
                          type="number"
                          min="0"
                          placeholder="Cant."
                          disabled={!selected}
                          value={selected ? entry.quantity : ''}
                          onChange={(event) => setIngredientField(id, 'quantity', event.target.value)}
                          aria-invalid={Boolean(errors[`quantity-${id}`])}
                          aria-label={`Cantidad de ${ingredient.name}`}
                        />
                        <UnitSelect
                          disabled={!selected}
                          value={selected ? entry.unit : ''}
                          onChange={(event) => setIngredientField(id, 'unit', event.target.value)}
                          aria-label={`Unidad de ${ingredient.name}`}
                        >
                          {compatibleUnitOptions(baseUnit).map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </UnitSelect>
                        {hint && <IngredientHint>{hint}</IngredientHint>}
                        {errors[`price-${id}`] && <IngredientError>{errors[`price-${id}`]}</IngredientError>}
                        {errors[`quantity-${id}`] && (
                          <IngredientError>{errors[`quantity-${id}`]}</IngredientError>
                        )}
                      </IngredientRow>
                    )
                  })}
                </IngredientList>
              )}
            </Field>
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
        {currentStep < 1 ? (
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

      <Modal
        open={ingredientModalOpen}
        title="Agregar ingrediente"
        description="Registra un nuevo ingrediente sin perder los datos del proveedor."
        onClose={closeIngredientModal}
        size="sm"
      >
        <IngredientForm
          submitting={creatingIngredient}
          submitLabel="Guardar ingrediente"
          onSubmit={handleCreateIngredient}
          onCancel={closeIngredientModal}
        />
      </Modal>
    </>
  )
}

export default SupplierForm
