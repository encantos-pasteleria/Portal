import { bestUnitCost } from './suppliers.js'
import { round } from './format.js'

/**
 * Calcula el costo de una receta a partir del mejor costo de compra de los
 * ingredientes de cada base y de los porcentajes configurados.
 *
 * @param {object|null} recipe - Receta con `items` (bases) y `percentages`.
 * @param {object} data - Datos de apoyo.
 * @param {Map<string, object>} data.baseMap - Mapa de id de base a objeto.
 * @param {Map<string, object>} data.ingredientMap - Mapa de id de ingrediente a objeto.
 * @param {Array} data.suppliers - Proveedores disponibles.
 * @returns {{
 *   bases: Array<{ baseId: string, name: string, quantity: number, cost: number|null }>,
 *   subtotal: number,
 *   percentages: Array<{ name: string, value: number, amount: number }>,
 *   total: number,
 *   perPortion: number|null,
 *   hasCost: boolean,
 * }} Costeo de la receta.
 */
export function computeRecipeCost(recipe, { baseMap, ingredientMap, suppliers }) {
  const baseRows = []
  let subtotal = 0
  let hasCost = false

  for (const item of recipe?.items ?? []) {
    const base = baseMap?.get(String(item.baseId)) ?? null
    const factor = (Number(item.quantity) || 0) / (Number(base?.portions) || 1)

    let baseCost = 0
    for (const [ingredientId, quantity] of Object.entries(base?.ingredients ?? {})) {
      const ingredient = ingredientMap?.get(String(ingredientId)) ?? null
      const unitCost = ingredient ? bestUnitCost(ingredient, suppliers) : null
      if (unitCost == null) continue
      hasCost = true
      baseCost += Number(quantity) * factor * unitCost
    }

    subtotal += baseCost
    baseRows.push({
      baseId: String(item.baseId),
      name: base?.name ?? String(item.baseId),
      quantity: Number(item.quantity) || 0,
      cost: round(baseCost),
    })
  }

  subtotal = round(subtotal)

  const percentages = (recipe?.percentages ?? []).map((percentage) => {
    const value = Number(percentage.value) || 0
    return {
      name: percentage.name,
      value,
      amount: round((subtotal * value) / 100),
    }
  })

  const percentageSum = percentages.reduce((sum, percentage) => sum + percentage.value, 0)
  const total = round(subtotal * (1 + percentageSum / 100))
  const portions = Number(recipe?.portions) || 0

  return {
    bases: baseRows,
    subtotal,
    percentages,
    total,
    perPortion: portions > 0 ? round(total / portions) : null,
    hasCost,
  }
}
