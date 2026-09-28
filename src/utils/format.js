/**
 * Normaliza un texto para búsquedas (minúsculas y sin tildes).
 *
 * @param {string} value - Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
export function normalizeText(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Redondea un número a una cantidad de decimales (por defecto 4) para evitar
 * ruido de coma flotante.
 *
 * @param {number|string} value - Valor a redondear.
 * @param {number} [decimals=4] - Decimales deseados.
 * @returns {number} Valor redondeado.
 */
export function round(value, decimals = 4) {
  const factor = 10 ** decimals
  return Math.round(Number(value) * factor) / factor
}

/**
 * Formatea un número como moneda en pesos colombianos (enteros, sin centavos).
 *
 * @param {number|string} value - Valor a formatear.
 * @returns {string} Valor formateado con prefijo $.
 */
export function formatCurrency(value) {
  return `$${Number(value).toLocaleString('es-CO', { maximumFractionDigits: 0 })}`
}

/**
 * Formatea un costo unitario (por unidad base) con hasta 4 decimales.
 *
 * @param {number|string} value - Valor a formatear.
 * @returns {string} Valor formateado con prefijo $.
 */
export function formatUnitCost(value) {
  return `$${Number(value).toLocaleString('es-CO', { maximumFractionDigits: 4 })}`
}

/**
 * Formatea una fecha como dd/mm/aaaa.
 *
 * @param {string|number|Date} value - Fecha a formatear.
 * @returns {string} Fecha formateada o cadena original si no es válida.
 */
export function formatDate(value) {
  if (value === null || value === undefined || value === '') return ''

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
