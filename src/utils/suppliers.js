import { convert } from './units.js'
import { round } from './format.js'

/**
 * Calcula el costo unitario (por unidad base) desde una presentación de compra.
 *
 * @param {{ price: number, quantity: number, unit: string }|null|undefined} pkg - Presentación.
 * @param {string} baseUnit - Unidad base del ingrediente.
 * @returns {number|null} Costo por unidad base o null si no se puede calcular.
 */
export function computeUnitCost(pkg, baseUnit) {
  if (!pkg || !baseUnit) return null
  const price = Number(pkg.price)
  const baseQuantity = convert(pkg.quantity, pkg.unit, baseUnit)
  if (!Number.isFinite(price) || baseQuantity == null || baseQuantity <= 0) return null
  return round(price / baseQuantity)
}

/**
 * Devuelve las entradas `[id, packaging]` de un proveedor.
 *
 * @param {object|undefined} packaging - Campo `ingredientPackaging` del proveedor.
 * @returns {Array<[string, object]>} Entradas de ingredientes.
 */
export function getIngredientEntries(packaging) {
  return Object.entries(packaging ?? {})
}

/**
 * Devuelve el costo unitario más barato (por unidad base) de un ingrediente
 * entre todos los proveedores que lo venden.
 *
 * @param {object} ingredient - Ingrediente (con `id` y `unit`).
 * @param {Array} suppliers - Proveedores disponibles.
 * @returns {number|null} Costo unitario más bajo o null si nadie lo vende.
 */
export function bestUnitCost(ingredient, suppliers) {
  const baseUnit = ingredient?.unit
  if (!baseUnit) return null

  let best = null
  for (const supplier of suppliers) {
    const pkg = supplier?.ingredientPackaging?.[String(ingredient.id)]
    const cost = computeUnitCost(pkg, baseUnit)
    if (cost != null && (best == null || cost < best)) {
      best = cost
    }
  }

  return best
}
