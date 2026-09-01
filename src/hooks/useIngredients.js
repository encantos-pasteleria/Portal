import { create } from 'zustand'
import { listIngredients, countAllIngredients, listAllIngredients } from '../services/ingredients.js'

export const useIngredientsStore = create((set, get) => ({
  items: [],
  allItems: [],
  status: 'loading',
  search: '',
  active: true,
  page: 1,
  total: 0,
  cursors: [null],
  hasMore: false,

  load: async () => {
    const state = get()
    set({ status: 'loading' })
    try {
      const [result, count] = await Promise.all([
        listIngredients(state.active, null),
        countAllIngredients(state.active),
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
      const result = await listIngredients(state.active, cursor)
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

  loadAll: async () => {
    try {
      const allItems = await listAllIngredients()
      set({ allItems })
    } catch {
      /* noop */
    }
  },

  setSearch: (search) => {
    set({ search, page: 1 })
    get().load()
  },

  setActive: (active) => {
    set({ active, page: 1 })
    get().load()
  },

  setPage: (page) => {
    get().loadPage(page)
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      total: Math.max(0, state.total - 1),
    })),
}))
