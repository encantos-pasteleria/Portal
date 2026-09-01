import { create } from 'zustand'
import { SCRIPT_ID } from '../config.js'

const STORAGE_KEY = 'encantos-settings'

/**
 * Lee la configuración guardada en localStorage.
 *
 * @returns {object} Configuración almacenada (puede estar vacía).
 */
function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Guarda la configuración en localStorage.
 *
 * @param {object} settings - Configuración a guardar.
 */
function persist(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* noop */
  }
}

export const useSettingsStore = create((set) => {
  const stored = loadStored()

  return {
    scriptId: stored.scriptId ?? SCRIPT_ID,
    showErrors: stored.showErrors ?? true,

    /**
     * Guarda la configuración de la aplicación.
     *
     * @param {object} settings - Nueva configuración.
     * @param {string} settings.scriptId - Id de la API de Google Apps Script.
     * @param {boolean} settings.showErrors - Indica si se muestran los errores.
     */
    saveSettings: ({ scriptId, showErrors }) => {
      persist({ scriptId, showErrors })
      set({ scriptId, showErrors })
    },
  }
})
