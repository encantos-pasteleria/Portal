import { create } from 'zustand'
import {
  listProductionsByDateRange,
  countProductionsByDateRange,
} from '../services/productions.js'

/** Cantidad de días que cubre cada ventana de consulta. */
const DAYS_PER_WINDOW = 5

/**
 * Formatea una fecha como YYYY-MM-DD en hora local.
 *
 * @param {Date} date - Fecha a formatear.
 * @returns {string} Fecha en formato ISO.
 */
function toISODate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Calcula el rango de fechas (inclusive) para un desplazamiento de ventana.
 * El offset 0 corresponde a los últimos días (terminando hoy).
 *
 * @param {number} offset - Cantidad de ventanas hacia el pasado.
 * @returns {{start: string, end: string}} Rango de fechas ISO.
 */
function windowForOffset(offset) {
  const end = new Date()
  end.setDate(end.getDate() - offset * DAYS_PER_WINDOW)
  const start = new Date(end)
  start.setDate(start.getDate() - (DAYS_PER_WINDOW - 1))
  return { start: toISODate(start), end: toISODate(end) }
}

export const useProductionsStore = create((set, get) => {
  /** Carga las producciones de una ventana de días y actualiza el estado. */
  const fetchWindow = async (offset) => {
    const { start, end } = windowForOffset(offset)
    set({ status: 'loading', offset, windowStart: start, windowEnd: end })
    try {
      const [result, count] = await Promise.all([
        listProductionsByDateRange(start, end),
        countProductionsByDateRange(start, end),
      ])
      set({ items: result, total: count, status: 'success' })
    } catch {
      set({ status: 'error' })
    }
  }

  return {
    items: [],
    status: 'loading',
    total: 0,
    offset: 0,
    windowStart: '',
    windowEnd: '',

    load: () => fetchWindow(0),

    prev: () => fetchWindow(get().offset + 1),

    next: () => {
      if (get().offset <= 0) return
      fetchWindow(get().offset - 1)
    },
  }
})
