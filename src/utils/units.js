/**
 * Catálogo de unidades de cocina y funciones de conversión.
 *
 * Las conversiones solo se hacen dentro de la misma categoría (peso, volumen,
 * conteo). No se convierte peso <-> volumen porque depende de la densidad de
 * cada ingrediente (1 taza de harina no pesa lo mismo que 1 taza de azúcar).
 */

/** Unidades soportadas. `factor` es la cantidad de la unidad base que contiene. */
export const UNITS = {
  g: { category: 'mass', factor: 1, label: 'g', plural: 'g' },
  kg: { category: 'mass', factor: 1000, label: 'kg', plural: 'kg' },
  ml: { category: 'volume', factor: 1, label: 'ml', plural: 'ml' },
  l: { category: 'volume', factor: 1000, label: 'l', plural: 'l' },
  taza: { category: 'volume', factor: 250, label: 'taza', plural: 'tazas' },
  unidad: { category: 'count', factor: 1, label: 'unidad', plural: 'unidades' },
  docena: { category: 'count', factor: 12, label: 'docena', plural: 'docenas' },
}

/** Unidad base de cada categoría (a la que se normaliza todo). */
export const BASE_UNITS = {
  mass: 'g',
  volume: 'ml',
  count: 'unidad',
}

/** Lista ordenada de unidades para los selectores de formulario. */
export const UNIT_LIST = [
  { value: 'g', label: 'g' },
  { value: 'kg', label: 'kg' },
  { value: 'ml', label: 'ml' },
  { value: 'l', label: 'l' },
  { value: 'taza', label: 'taza' },
  { value: 'unidad', label: 'unidad' },
  { value: 'docena', label: 'docena' },
]

/**
 * Devuelve los metadatos de una unidad.
 *
 * @param {string} unit - Clave de la unidad (ej. 'kg').
 * @returns {object|undefined} Metadatos { category, factor, label, plural }.
 */
export function getUnit(unit) {
  return UNITS[unit]
}

/**
 * Devuelve la categoría de una unidad.
 *
 * @param {string} unit - Clave de la unidad.
 * @returns {string|undefined} Categoría ('mass' | 'volume' | 'count').
 */
export function categoryOf(unit) {
  return UNITS[unit]?.category
}

/**
 * Indica si dos unidades se pueden convertir entre sí (misma categoría).
 *
 * @param {string} from - Unidad de origen.
 * @param {string} to - Unidad de destino.
 * @returns {boolean} True si son compatibles.
 */
export function isCompatible(from, to) {
  const a = UNITS[from]
  const b = UNITS[to]
  return Boolean(a && b && a.category === b.category)
}

/**
 * Convierte un valor a la unidad base de su categoría.
 *
 * @param {number|string} value - Cantidad a convertir.
 * @param {string} unit - Unidad del valor.
 * @returns {number|null} Valor en unidad base, o null si no es convertible.
 */
export function toBase(value, unit) {
  const meta = UNITS[unit]
  if (!meta) return null
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return number * meta.factor
}

/**
 * Convierte un valor en unidad base a otra unidad de la misma categoría.
 *
 * @param {number|string} value - Cantidad en unidad base.
 * @param {string} unit - Unidad de destino.
 * @returns {number|null} Valor convertido, o null si no es convertible.
 */
export function fromBase(value, unit) {
  const meta = UNITS[unit]
  if (!meta) return null
  const number = Number(value)
  if (!Number.isFinite(number)) return null
  return number / meta.factor
}

/**
 * Convierte una cantidad de una unidad a otra (misma categoría).
 *
 * @param {number|string} value - Cantidad a convertir.
 * @param {string} from - Unidad de origen.
 * @param {string} to - Unidad de destino.
 * @returns {number|null} Valor convertido, o null si no son compatibles.
 */
export function convert(value, from, to) {
  if (!isCompatible(from, to)) return null
  const base = toBase(value, from)
  if (base == null) return null
  return fromBase(base, to)
}

/**
 * Devuelve las opciones de unidad compatibles con una unidad dada.
 *
 * @param {string} unit - Unidad de referencia.
 * @returns {Array<{value: string, label: string}>} Unidades de la misma categoría.
 */
export function compatibleUnitOptions(unit) {
  const category = categoryOf(unit)
  if (!category) return []
  return UNIT_LIST.filter((option) => UNITS[option.value].category === category)
}

/** Redondea un número a 4 decimales y elimina el ruido de coma flotante. */
function formatNumber(number) {
  if (!Number.isFinite(number)) return ''
  return String(Math.round(number * 10000) / 10000)
}

/**
 * Devuelve la etiqueta de una unidad en singular o plural según la cantidad.
 *
 * @param {number|string} value - Cantidad a mostrar.
 * @param {string} unit - Clave de la unidad.
 * @returns {string} Etiqueta con la concordancia adecuada.
 */
export function unitLabel(value, unit) {
  const meta = UNITS[unit]
  if (!meta) return unit ?? ''
  const number = Number(value)
  if (Number.isFinite(number) && number !== 1) return meta.plural
  return meta.label
}

/**
 * Elige la unidad "más cómoda" para mostrar un valor dentro de su categoría.
 *
 * @param {number|string} value - Cantidad.
 * @param {string} unit - Unidad actual del valor.
 * @returns {string|undefined} Unidad recomendada para mostrar.
 */
export function bestUnit(value, unit) {
  const meta = UNITS[unit]
  if (!meta) return undefined
  const base = toBase(value, unit)
  if (base == null) return undefined

  if (meta.category === 'mass') return base >= 1000 ? 'kg' : 'g'
  if (meta.category === 'volume') return base >= 1000 ? 'l' : 'ml'
  if (meta.category === 'count') {
    const isWholeDozens = base >= 12 && Math.abs(base / 12 - Math.round(base / 12)) < 1e-9
    return isWholeDozens ? 'docena' : 'unidad'
  }
  return unit
}

/**
 * Formatea una cantidad en su mejor unidad (ej. 0.15 kg -> "150 g").
 *
 * @param {number|string} value - Cantidad.
 * @param {string} unit - Unidad actual del valor.
 * @returns {string} Texto formateado, o '' si no es válido.
 */
export function formatAmount(value, unit) {
  const number = Number(value)
  if (!Number.isFinite(number)) return ''
  const best = bestUnit(value, unit)
  if (!best) return ''
  const amount = convert(value, unit, best)
  if (amount == null) return ''
  return `${formatNumber(amount)} ${unitLabel(amount, best)}`
}

/**
 * Devuelve la cantidad formateada en su mejor unidad, separando número y unidad.
 *
 * @param {number|string} value - Cantidad.
 * @param {string} unit - Unidad actual del valor.
 * @returns {{ amount: string, unit: string }} Partes formateadas.
 */
export function formatAmountParts(value, unit) {
  const number = Number(value)
  if (!Number.isFinite(number)) return { amount: '', unit: '' }
  const best = bestUnit(value, unit)
  if (!best) return { amount: '', unit: '' }
  const amount = convert(value, unit, best)
  if (amount == null) return { amount: '', unit: '' }
  return { amount: formatNumber(amount), unit: unitLabel(amount, best) }
}

/**
 * Formatea una cantidad en una unidad específica (ej. 0.5 kg -> "0.5 kg").
 *
 * @param {number|string} value - Cantidad.
 * @param {string} unit - Unidad a usar.
 * @returns {string} Texto formateado, o '' si no es válido.
 */
export function formatQuantity(value, unit) {
  const number = Number(value)
  if (!Number.isFinite(number)) return ''
  const meta = UNITS[unit]
  if (!meta) return ''
  return `${formatNumber(number)} ${unitLabel(number, unit)}`
}
