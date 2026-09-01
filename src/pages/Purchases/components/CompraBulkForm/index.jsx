import { useState } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { computeUnitCost } from '../../../../utils/suppliers.js'
import { convert, compatibleUnitOptions, formatQuantity } from '../../../../utils/units.js'
import { round } from '../../../../utils/format.js'
import {
  Form,
  Fields,
  RowCard,
  RowHeader,
  RowBadge,
  RowGrid,
  Field,
  Label,
  Input,
  Select,
  Textarea,
  Hint,
  ErrorText,
  RemoveButton,
  AddRowWrap,
  Actions,
} from './styles.js'

/** Devuelve la fecha actual en formato yyyy-mm-dd (hora local). */
function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
}

/**
 * Resuelve el costo unitario de un ingrediente para un proveedor dado.
 *
 * @param {string} ingredientId - Id del ingrediente.
 * @param {string} supplierId - Id del proveedor.
 * @param {Array} suppliers - Proveedores disponibles.
 * @param {Array} ingredients - Ingredientes disponibles (para unidad base).
 * @returns {string} Costo como texto o '' si no hay coincidencia.
 */
function resolveCost(ingredientId, supplierId, suppliers, ingredients) {
  if (!ingredientId || !supplierId) return ''

  const supplier = suppliers.find((item) => String(item.id) === String(supplierId))
  const ingredient = ingredients.find((item) => String(item.id) === String(ingredientId))
  const pkg = supplier?.ingredientPackaging?.[String(ingredientId)]
  const cost = computeUnitCost(pkg, ingredient?.unit)
  return cost != null ? String(round(cost)) : ''
}

/**
 * Resuelve la presentación (cantidad + unidad) que vende un proveedor para un
 * ingrediente dado.
 *
 * @param {string} ingredientId - Id del ingrediente.
 * @param {string} supplierId - Id del proveedor.
 * @param {Array} suppliers - Proveedores disponibles.
 * @returns {{ quantity: string, unit: string }|null} Presentación o null.
 */
function resolvePackaging(ingredientId, supplierId, suppliers) {
  if (!ingredientId || !supplierId) return null

  const supplier = suppliers.find((item) => String(item.id) === String(supplierId))
  const packaging = supplier?.ingredientPackaging?.[String(ingredientId)]
  if (!packaging) return null

  return {
    quantity: packaging.quantity != null ? String(packaging.quantity) : '',
    unit: packaging.unit ?? '',
  }
}

/**
 * Valida la cantidad (obligatoria y mayor que cero).
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

/** Contador de keys para las filas del formulario. */
let nextKey = 0

/**
 * Valida el costo (opcional, numérico y no negativo).
 *
 * @param {string|number|null|undefined} value - Valor a validar.
 * @returns {string|null} Mensaje de error o null si es válido.
 */
function validateCost(value) {
  if (value === '' || value === null || value === undefined) return null

  const number = Number(value)
  if (!Number.isFinite(number)) {
    return 'El costo debe ser un número válido.'
  }
  if (number < 0) {
    return 'El costo no puede ser negativo.'
  }

  return null
}

/**
 * Formulario de carga masiva de compras. Permite agregar varias filas
 * (ingrediente, proveedor, cantidad y costo) y guardarlas todas de una vez.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {Array} [props.ingredients=[]] - Ingredientes disponibles.
 * @param {Array} [props.suppliers=[]] - Proveedores disponibles.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {Function} props.onSubmit - Callback con el array de compras a guardar.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario de compras masivas.
 */
function CompraBulkForm({
  ingredients = [],
  suppliers = [],
  submitting = false,
  onSubmit,
  onCancel,
}) {
  /** Crea una fila vacía con un key único dentro del formulario. */
  const createEmptyRow = () => {
    nextKey += 1
    return { key: nextKey, ingredientId: '', supplierId: '', quantity: '', unit: '', cost: '' }
  }

  const [date, setDate] = useState(todayISO())
  const [notes, setNotes] = useState('')
  const [rows, setRows] = useState(() => [createEmptyRow()])
  const [dateError, setDateError] = useState(null)
  const [rowErrors, setRowErrors] = useState({})

  /**
   * Proveedores que venden un ingrediente (filtro local, sin llamadas extra).
   *
   * @param {string} ingredientId - Id del ingrediente.
   * @returns {Array} Proveedores que venden el ingrediente.
   */
  const suppliersForIngredient = (ingredientId) => {
    if (!ingredientId) return []
    return suppliers.filter((supplier) =>
      Object.prototype.hasOwnProperty.call(
        supplier.ingredientPackaging ?? {},
        String(ingredientId),
      ),
    )
  }

  /**
   * Limpia el error de un campo de una fila.
   *
   * @param {number} key - Key de la fila.
   * @param {string} field - Campo a limpiar.
   */
  const clearRowError = (key, field) => {
    setRowErrors((prev) => {
      const row = prev[key]
      if (!row || !row[field]) return prev
      const next = { ...prev, [key]: { ...row } }
      delete next[key][field]
      if (Object.keys(next[key]).length === 0) delete next[key]
      return next
    })
  }

  /**
   * Actualiza un campo de una fila y limpia su error.
   *
   * @param {number} key - Key de la fila.
   * @param {string} field - Campo a actualizar.
   * @param {string} value - Nuevo valor.
   */
  const updateRow = (key, field, value) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)))
    clearRowError(key, field)
  }

  /**
   * Actualiza el ingrediente de una fila, ajustando proveedor y costo.
   *
   * @param {number} key - Key de la fila.
   * @param {string} value - Id del ingrediente seleccionado.
   */
  const handleIngredientChange = (key, value) => {
    const ingredient = ingredients.find((item) => String(item.id) === String(value))
    setRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row
        const options = suppliersForIngredient(value)
        const stillAvailable = options.some((item) => String(item.id) === String(row.supplierId))
        const supplierId = stillAvailable ? row.supplierId : ''
        const packaging = resolvePackaging(value, supplierId, suppliers)
        return {
          ...row,
          ingredientId: value,
          supplierId,
          quantity: packaging ? packaging.quantity : '',
          unit: packaging ? packaging.unit : ingredient?.unit ?? '',
          cost: resolveCost(value, supplierId, suppliers, ingredients),
        }
      }),
    )
    clearRowError(key, 'ingredientId')
    clearRowError(key, 'cost')
    clearRowError(key, 'quantity')
  }

  /**
   * Actualiza el proveedor de una fila y precarga su costo.
   *
   * @param {number} key - Key de la fila.
   * @param {string} value - Id del proveedor seleccionado.
   */
  const handleSupplierChange = (key, value) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row
        const packaging = resolvePackaging(row.ingredientId, value, suppliers)
        return {
          ...row,
          supplierId: value,
          cost: resolveCost(row.ingredientId, value, suppliers, ingredients),
          quantity: packaging && row.quantity === '' ? packaging.quantity : row.quantity,
          unit: packaging && row.unit === '' ? packaging.unit : row.unit,
        }
      }),
    )
    clearRowError(key, 'cost')
    clearRowError(key, 'quantity')
  }

  /** Agrega una fila vacía al formulario. */
  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()])
  }

  /**
   * Elimina una fila (siempre queda al menos una).
   *
   * @param {number} key - Key de la fila a eliminar.
   */
  const removeRow = (key) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.key !== key) : prev))
    setRowErrors((prev) => {
      if (!prev[key]) return prev
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  /**
   * Texto que muestra el equivalente de la cantidad en la unidad base del
   * ingrediente cuando se escribe en otra unidad (ej. "= 0.5 kg").
   *
   * @param {object} row - Fila del formulario.
   * @returns {string} Equivalente formateado o ''.
   */
  const quantityHint = (row) => {
    const ingredient = ingredients.find((item) => String(item.id) === String(row.ingredientId))
    const baseUnit = ingredient?.unit
    if (!baseUnit || !row.unit || row.unit === baseUnit) return ''
    const converted = convert(row.quantity, row.unit, baseUnit)
    if (converted == null) return ''
    return `= ${formatQuantity(converted, baseUnit)}`
  }

  /**
   * Valida y envía todas las filas para el guardado masivo.
   *
   * @param {React.FormEvent} event - Evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault()

    const nextDateError = date ? null : 'La fecha es obligatoria.'
    const nextRowErrors = {}
    const payloads = []

    rows.forEach((row) => {
      const errors = {}

      if (!row.ingredientId) errors.ingredientId = 'El ingrediente es obligatorio.'

      const quantityError = validateQuantity(row.quantity)
      if (quantityError) errors.quantity = quantityError

      const costError = validateCost(row.cost)
      if (costError) errors.cost = costError

      if (Object.keys(errors).length > 0) {
        nextRowErrors[row.key] = errors
        return
      }

      const ingredient = ingredients.find((item) => String(item.id) === String(row.ingredientId))
      const baseUnit = ingredient?.unit
      const converted = baseUnit && row.unit ? convert(row.quantity, row.unit, baseUnit) : null

      payloads.push({
        ingredientId: row.ingredientId,
        quantity: converted != null ? converted : Number(row.quantity),
        supplierId: row.supplierId || null,
        cost: row.cost === '' ? null : round(Number(row.cost)),
      })
    })

    setDateError(nextDateError)
    setRowErrors(nextRowErrors)

    if (nextDateError || Object.keys(nextRowErrors).length > 0 || payloads.length === 0) return

    onSubmit(
      payloads.map((payload) => ({
        ...payload,
        date,
        notes: notes.trim(),
      })),
    )
  }

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Fields>
        <Field>
          <Label htmlFor="date">Fecha</Label>
          <Input
            id="date"
            type="date"
            autoComplete="off"
            value={date}
            onChange={(event) => {
              setDate(event.target.value)
              setDateError(null)
            }}
            aria-invalid={Boolean(dateError)}
          />
          {dateError && <ErrorText>{dateError}</ErrorText>}
        </Field>

        {rows.map((row, index) => (
          <RowCard key={row.key}>
            <RowHeader>
              <RowBadge>{index + 1}</RowBadge>
              <RemoveButton
                type="button"
                onClick={() => removeRow(row.key)}
                aria-label={`Quitar compra ${index + 1}`}
                disabled={rows.length === 1}
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
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </RemoveButton>
            </RowHeader>
            <RowGrid>
              <Field>
                <Label htmlFor={`ingredient-${row.key}`}>Ingrediente</Label>
                <Select
                  as="select"
                  id={`ingredient-${row.key}`}
                  autoComplete="off"
                  value={row.ingredientId}
                  onChange={(event) => handleIngredientChange(row.key, event.target.value)}
                  aria-invalid={Boolean(rowErrors[row.key]?.ingredientId)}
                >
                  <option value="" disabled>
                    Selecciona
                  </option>
                  {ingredients.map((ingredient) => (
                    <option key={ingredient.id} value={ingredient.id}>
                      {ingredient.name}
                    </option>
                  ))}
                </Select>
                {rowErrors[row.key]?.ingredientId && (
                  <ErrorText>{rowErrors[row.key].ingredientId}</ErrorText>
                )}
              </Field>

              <Field>
                <Label htmlFor={`supplier-${row.key}`}>Proveedor</Label>
                <Select
                  as="select"
                  id={`supplier-${row.key}`}
                  autoComplete="off"
                  value={row.supplierId}
                  onChange={(event) => handleSupplierChange(row.key, event.target.value)}
                  disabled={!row.ingredientId}
                >
                  <option value="">Sin proveedor</option>
                  {suppliersForIngredient(row.ingredientId).map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label htmlFor={`quantity-${row.key}`}>Cantidad</Label>
                <Input
                  id={`quantity-${row.key}`}
                  type="number"
                  autoComplete="off"
                  min="0"
                  placeholder="0"
                  value={row.quantity}
                  onChange={(event) => updateRow(row.key, 'quantity', event.target.value)}
                  aria-invalid={Boolean(rowErrors[row.key]?.quantity)}
                />
                {rowErrors[row.key]?.quantity && (
                  <ErrorText>{rowErrors[row.key].quantity}</ErrorText>
                )}
                {quantityHint(row) && <Hint>{quantityHint(row)}</Hint>}
              </Field>

              <Field>
                <Label htmlFor={`unit-${row.key}`}>Unidad</Label>
                <Select
                  as="select"
                  id={`unit-${row.key}`}
                  autoComplete="off"
                  value={row.unit}
                  onChange={(event) => updateRow(row.key, 'unit', event.target.value)}
                  disabled={!row.ingredientId}
                >
                  {compatibleUnitOptions(
                    ingredients.find((item) => String(item.id) === String(row.ingredientId))?.unit,
                  ).map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label htmlFor={`cost-${row.key}`}>Costo</Label>
                <Input
                  id={`cost-${row.key}`}
                  type="number"
                  autoComplete="off"
                  min="0"
                  placeholder="0"
                  value={row.cost}
                  onChange={(event) => updateRow(row.key, 'cost', event.target.value)}
                  aria-invalid={Boolean(rowErrors[row.key]?.cost)}
                />
                {rowErrors[row.key]?.cost && <ErrorText>{rowErrors[row.key].cost}</ErrorText>}
              </Field>
            </RowGrid>
          </RowCard>
        ))}

        <AddRowWrap>
          <Button type="button" variant="secondary" onClick={addRow}>
            + Agregar otra compra
          </Button>
        </AddRowWrap>

        <Field>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            autoComplete="off"
            placeholder="Observaciones (aplican a todas las compras)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </Field>
      </Fields>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : `Guardado masivo (${rows.length})`}
        </Button>
      </Actions>
    </Form>
  )
}

export default CompraBulkForm
