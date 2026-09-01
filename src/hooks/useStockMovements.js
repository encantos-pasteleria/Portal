import { create } from 'zustand'
import { listStockMovements, countAllStockMovements } from '../services/stockMovements.js'

export const useStockMovementsStore = create((set, get) => ({
  items: [],
  status: 'loading',
  search: '',
  page: 1,
  total: 0,
  cursors: [null],
  hasMore: false,

  load: async () => {
    set({ status: 'loading' })
    try {
      const [result, count] = await Promise.all([
        listStockMovements(null),
        countAllStockMovements(),
      ])
      set({
        items: result.items,
        total: count,
        cursors: [null, result.lastDoc],
        hasMore: result.hasMore,
        page: 1,
        status: 'success',
      })
    } catch {
      set({ status: 'error' })
    }
  },

  loadPage: async (page) => {
    const state = get()
    const cursor = state.cursors[page - 1] ?? null
    set({ status: 'loading' })
    try {
      const result = await listStockMovements(cursor)
      const newCursors = [...state.cursors]
      while (newCursors.length <= page) newCursors.push(null)
      newCursors[page] = result.lastDoc
      set({
        items: result.items,
        page,
        cursors: newCursors,
        hasMore: result.hasMore,
        status: 'success',
      })
    } catch {
      set({ status: 'error' })
    }
  },

  setSearch: (search) => set({ search, page: 1 }),

  setPage: (page) => {
    get().loadPage(page)
  },
}))
