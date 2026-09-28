import { useState } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { UNIT_LIST } from '../../../../utils/units.js'
import {
  Form,
  Fields,
  Field,
  Label,
  Input,
  Select,
  Hint,
  ErrorText,
  Actions,
} from './styles.js'

/**
 * Valida que un valor numérico sea obligatorio, numérico y no negativo.
 *
 * @param {string|number|null|undefined} value - Valor a validar.
 * @param {string} label - Nombre del campo (para el mensaje de error).
 * @returns {string|null} Mensaje de error o null si es válido.
 */
function validateNumber(value, label) {
  if (value === '' || value === null || value === undefined) {
    return `${label} es obligatorio.`
  }

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return `${label} debe ser un número válido.`
  }
  if (number < 0) {
    return `${label} no puede ser negativo.`
  }

  return null
}

/**
 * Valida todos los campos del formulario.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'
  if (!values.unit) errors.unit = 'La unidad es obligatoria.'

  const minStockError = validateNumber(values.minStock, 'El stock mínimo')
  if (minStockError) errors.minStock = minStockError

  return errors
}

/**
 * Formulario para crear o editar un ingrediente.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {string} [props.submitLabel='Guardar ingrediente'] - Texto del botón de envío.
 * @param {Function} props.onSubmit - Callback al enviar el formulario.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario del ingrediente.
 */
function IngredientForm({
  initialValues,
  submitting = false,
  submitLabel = 'Guardar ingrediente',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? '',
    unit: initialValues?.unit ?? '',
    minStock: initialValues?.minStock ?? '',
  }))
  const [errors, setErrors] = useState({})

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
   * Valida y envía el formulario.
   *
   * @param {React.FormEvent} event - Evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: values.name.trim(),
      unit: values.unit,
      minStock: Number(values.minStock),
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Fields>
        <Field>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            autoComplete="off"
            placeholder="Ej. Harina de trigo"
            value={values.name}
            onChange={(event) => setValue('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="unit">Unidad</Label>
          <Select
            as="select"
            id="unit"
            autoComplete="off"
            value={values.unit}
            onChange={(event) => setValue('unit', event.target.value)}
            aria-invalid={Boolean(errors.unit)}
          >
            <option value="" disabled>
              Selecciona una unidad
            </option>
            {UNIT_LIST.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          {errors.unit && <ErrorText>{errors.unit}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="minStock">Stock mínimo</Label>
          <Input
            id="minStock"
            type="number"
            autoComplete="off"
            min="0"
            placeholder="0"
            value={values.minStock}
            onChange={(event) => setValue('minStock', event.target.value)}
            aria-invalid={Boolean(errors.minStock)}
          />
          {errors.minStock && <ErrorText>{errors.minStock}</ErrorText>}
          <Hint>El stock se agrega a través de compras.</Hint>
        </Field>

      </Fields>

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

export default IngredientForm
