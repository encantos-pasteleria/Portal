import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getCountFromServer,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './config.js'
import { convert, isCompatible } from '../utils/units.js'
import { round } from '../utils/format.js'

const PAGE_SIZE = 10

const INGREDIENTS_COLLECTION = 'ingredients'
const BASES_COLLECTION = 'bases'
const SUPPLIERS_COLLECTION = 'suppliers'
const STOCK_MOVEMENTS_COLLECTION = 'stock_movements'
const PRODUCTIONS_COLLECTION = 'productions'
const RECIPES_COLLECTION = 'recipes'

/**
 * Calcula el costo unitario de un ingrediente desde la presentación de un proveedor.
 */
function supplierUnitCost(supplier, ingredientId, ingredientMap) {
  const key = String(ingredientId)
  const pkg = supplier.ingredientPackaging?.[key]
  if (!pkg) return null
  const baseUnit = ingredientMap.get(key)?.unit
  if (!baseUnit) return null
  const price = Number(pkg.price)
  const baseQuantity = convert(pkg.quantity, pkg.unit, baseUnit)
  if (!Number.isFinite(price) || baseQuantity == null || baseQuantity <= 0) return null
  return round(price / baseQuantity)
}

function mapDoc(docSnap) {
  return { id: docSnap.id, ...docSnap.data() }
}

/** Carga ingredientes, bases y proveedores para calcular una producción. */
async function loadProductionData() {
  const [ingredients, bases, suppliers] = await Promise.all([
    getDocs(collection(db, INGREDIENTS_COLLECTION)),
    getDocs(collection(db, BASES_COLLECTION)),
    getDocs(collection(db, SUPPLIERS_COLLECTION)),
  ])

  const ingredientMap = new Map(
    ingredients.docs.map(mapDoc).map((item) => [String(item.id), item]),
  )
  const baseMap = new Map(bases.docs.map(mapDoc).map((item) => [String(item.id), item]))

  return { ingredientMap, baseMap, suppliers: suppliers.docs.map(mapDoc) }
}

/** Suma las cantidades de ingredientes necesarias para una receta escalada. */
function computeIngredientTotals(recipe, baseMap, scaleFactor) {
  const totals = new Map()

  for (const item of recipe.items || []) {
    const base = baseMap.get(String(item.baseId))
    if (!base) continue

    const factor = (item.quantity || 0) / (base.portions || 1)

    for (const [ingredientId, quantity] of Object.entries(base.ingredients || {})) {
      const needed = Number(quantity) * factor * scaleFactor
      totals.set(String(ingredientId), (totals.get(String(ingredientId)) || 0) + needed)
    }
  }

  return totals
}

/**
 * Devuelve, para cada ingrediente, los proveedores que han registrado compras
 * (movimientos de entrada) de ese ingrediente.
 *
 * @param {string[]} ingredientIds - Ids de ingredientes a consultar.
 * @returns {Promise<Map<string, Set<string>>>} Mapa de id de ingrediente a set de ids de proveedor.
 */
async function getSupplierPurchaseMap(ingredientIds) {
  const map = new Map()
  const ids = ingredientIds.filter(Boolean)
  if (ids.length === 0) return map

  const CHUNK = 10
  const chunks = []
  for (let i = 0; i < ids.length; i += CHUNK) {
    chunks.push(ids.slice(i, i + CHUNK))
  }

  const snapshots = await Promise.all(
    chunks.map((chunk) =>
      getDocs(
        query(
          collection(db, STOCK_MOVEMENTS_COLLECTION),
          where('type', '==', 'in'),
          where('ingredientId', 'in', chunk),
        ),
      ),
    ),
  )

  for (const snapshot of snapshots) {
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data()
      if (data.supplierId == null) continue
      const key = String(data.ingredientId)
      if (!map.has(key)) map.set(key, new Set())
      map.get(key).add(String(data.supplierId))
    }
  }

  return map
}

export async function getIngredients(active, cursor = null) {
  const constraints = [
    where('active', '==', active),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, INGREDIENTS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function countIngredients(active) {
  const q = query(collection(db, INGREDIENTS_COLLECTION), where('active', '==', active))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function getAllIngredients() {
  const snapshot = await getDocs(collection(db, INGREDIENTS_COLLECTION))
  return snapshot.docs.map(mapDoc)
}

export async function createIngredient(data) {
  const docRef = await addDoc(collection(db, INGREDIENTS_COLLECTION), {
    ...data,
    active: true,
    stock: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const newDoc = await getDoc(docRef)
  return mapDoc(newDoc)
}

export async function updateIngredient(id, data) {
  const docRef = doc(db, INGREDIENTS_COLLECTION, id)
  const currentSnap = await getDoc(docRef)
  const current = currentSnap.exists() ? currentSnap.data() : null

  const nextData = { ...data }

  if (current && data.unit && current.unit && data.unit !== current.unit) {
    if (!isCompatible(current.unit, data.unit)) {
      throw new Error(
        `No se puede cambiar la unidad de ${current.unit} a ${data.unit}: pertenecen a categorías distintas.`,
      )
    }

    const stock = convert(current.stock, current.unit, data.unit)
    nextData.stock = stock != null ? round(stock) : (current.stock ?? 0)
  }

  await updateDoc(docRef, {
    ...nextData,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function updateIngredientActive(id, active) {
  const docRef = doc(db, INGREDIENTS_COLLECTION, id)
  await updateDoc(docRef, {
    active,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function getBases(active, cursor = null) {
  const constraints = [
    where('active', '==', active),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, BASES_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function countBases(active) {
  const q = query(collection(db, BASES_COLLECTION), where('active', '==', active))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function getAllBases() {
  const snapshot = await getDocs(collection(db, BASES_COLLECTION))
  return snapshot.docs.map(mapDoc)
}

export async function createBase(data) {
  const docRef = await addDoc(collection(db, BASES_COLLECTION), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const newDoc = await getDoc(docRef)
  return mapDoc(newDoc)
}

export async function updateBase(id, data) {
  const docRef = doc(db, BASES_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function updateBaseActive(id, active) {
  const docRef = doc(db, BASES_COLLECTION, id)
  await updateDoc(docRef, {
    active,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function getSuppliers(active, cursor = null) {
  const constraints = [
    where('active', '==', active),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, SUPPLIERS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function countSuppliers(active) {
  const q = query(collection(db, SUPPLIERS_COLLECTION), where('active', '==', active))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function getAllSuppliers() {
  const snapshot = await getDocs(collection(db, SUPPLIERS_COLLECTION))
  return snapshot.docs.map(mapDoc)
}

export async function createSupplier(data) {
  const docRef = await addDoc(collection(db, SUPPLIERS_COLLECTION), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const newDoc = await getDoc(docRef)
  return mapDoc(newDoc)
}

export async function updateSupplier(id, data) {
  const docRef = doc(db, SUPPLIERS_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function updateSupplierActive(id, active) {
  const docRef = doc(db, SUPPLIERS_COLLECTION, id)
  await updateDoc(docRef, {
    active,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function getStockMovements(cursor = null) {
  const constraints = [
    orderBy('date', 'desc'),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, STOCK_MOVEMENTS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function countStockMovements() {
  const snapshot = await getCountFromServer(collection(db, STOCK_MOVEMENTS_COLLECTION))
  return snapshot.data().count
}

export async function createPurchases(items) {
  return runTransaction(db, async (transaction) => {
    const ingredientData = new Map()

    for (const item of items) {
      const ingredientRef = doc(db, INGREDIENTS_COLLECTION, item.ingredientId)
      const ingredientSnap = await transaction.get(ingredientRef)

      if (!ingredientSnap.exists()) {
        throw new Error(`Ingrediente ${item.ingredientId} no encontrado`)
      }

      ingredientData.set(item.ingredientId, {
        ref: ingredientRef,
        currentStock: ingredientSnap.data().stock || 0,
      })
    }

    const stockAccumulator = new Map()
    for (const item of items) {
      const data = ingredientData.get(item.ingredientId)
      const accumulated = stockAccumulator.get(item.ingredientId) || 0
      const newStock = data.currentStock + accumulated + Number(item.quantity)
      stockAccumulator.set(item.ingredientId, accumulated + Number(item.quantity))

      transaction.update(data.ref, {
        stock: newStock,
        updatedAt: serverTimestamp(),
      })
    }

    for (const item of items) {
      const movementRef = doc(collection(db, STOCK_MOVEMENTS_COLLECTION))
      transaction.set(movementRef, {
        type: 'in',
        reason: 'purchase',
        ingredientId: item.ingredientId,
        quantity: Number(item.quantity),
        supplierId: item.supplierId || null,
        cost: item.cost != null ? Number(item.cost) : null,
        date: item.date,
        notes: item.notes || '',
        createdAt: serverTimestamp(),
      })
    }

    return { success: true }
  })
}

export async function getProductions(cursor = null) {
  const constraints = [
    orderBy('date', 'desc'),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, PRODUCTIONS_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function countProductions() {
  const snapshot = await getCountFromServer(collection(db, PRODUCTIONS_COLLECTION))
  return snapshot.data().count
}

/**
 * Lista producciones dentro de un rango de fechas (inclusive), ordenadas
 * de más reciente a más antigua.
 */
export async function getProductionsByDateRange(startDate, endDate) {
  const q = query(
    collection(db, PRODUCTIONS_COLLECTION),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'desc'),
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapDoc)
}

/**
 * Cuenta las producciones dentro de un rango de fechas (inclusive).
 */
export async function countProductionsByDateRange(startDate, endDate) {
  const q = query(
    collection(db, PRODUCTIONS_COLLECTION),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
  )
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function previewProduction({ recipeId, portions }) {
  const recipeSnap = await getDoc(doc(db, RECIPES_COLLECTION, recipeId))
  if (!recipeSnap.exists()) throw new Error('Receta no encontrada')

  const recipe = recipeSnap.data()
  const scale = portions / (recipe.portions || 1)
  const { ingredientMap, baseMap, suppliers } = await loadProductionData()
  const totals = computeIngredientTotals(recipe, baseMap, scale)
  const purchaseMap = await getSupplierPurchaseMap([...totals.keys()])
  const supplierMap = new Map(suppliers.map((supplier) => [String(supplier.id), supplier]))

  const items = []
  let totalCost = 0

  for (const [ingredientId, quantity] of totals) {
    const ingredient = ingredientMap.get(ingredientId)
    if (!ingredient) continue

    const supplierOptions = []
    for (const supplierId of purchaseMap.get(ingredientId) || []) {
      const supplier = supplierMap.get(supplierId)
      if (!supplier) continue
      const cost = supplierUnitCost(supplier, ingredientId, ingredientMap)
      supplierOptions.push({ supplierId, name: supplier.name, cost })
    }
    supplierOptions.sort((a, b) => (a.cost ?? Infinity) - (b.cost ?? Infinity))

    const defaultSupplierId = supplierOptions.length > 0 ? supplierOptions[0].supplierId : null
    const defaultCost = supplierOptions.length > 0 ? supplierOptions[0].cost : null
    const itemCost = defaultCost != null ? defaultCost * quantity : 0
    totalCost += itemCost

    items.push({
      ingredientId,
      ingredientName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      available: ingredient.stock || 0,
      cost: itemCost,
      supplierOptions,
      defaultSupplierId,
    })
  }

  const bases = []
  for (const item of recipe.items || []) {
    const base = baseMap.get(String(item.baseId))
    if (!base) continue

    const factor = (item.quantity || 0) / (base.portions || 1)
    const ingredients = []
    for (const [ingredientId, quantity] of Object.entries(base.ingredients || {})) {
      if (!ingredientMap.has(String(ingredientId))) continue
      ingredients.push({
        ingredientId: String(ingredientId),
        quantity: Number(quantity) * factor * scale,
      })
    }

    bases.push({ baseId: String(item.baseId), name: base.name, ingredients })
  }

  return { items, bases, totalCost }
}

function computeProductionSteps(recipe, baseMap, ingredientMap, scale) {
  const steps = []
  const consumedIngredients = new Set()

  for (const item of recipe.items || []) {
    const base = baseMap.get(String(item.baseId))
    if (!base) continue

    const factor = (item.quantity || 0) / (base.portions || 1)
    const baseSteps = Array.isArray(base.steps) ? base.steps : [{ description: '', ingredientIds: [], optional: false }]

    for (const step of baseSteps) {
      const ingredientIds = Array.isArray(step.ingredientIds) ? step.ingredientIds : []
      const ingredients = []

      for (const ingId of ingredientIds) {
        const ingredient = ingredientMap.get(String(ingId))
        if (!ingredient) continue

        const baseQuantity = Number(base.ingredients?.[String(ingId)] || 0)
        const scaledQuantity = baseQuantity * factor * scale
        const alreadyConsumed = consumedIngredients.has(String(ingId))

        ingredients.push({
          ingredientId: String(ingId),
          name: ingredient.name,
          quantity: alreadyConsumed ? 0 : scaledQuantity,
          unit: ingredient.unit,
        })

        if (!alreadyConsumed) {
          consumedIngredients.add(String(ingId))
        }
      }

      steps.push({
        baseId: String(item.baseId),
        baseName: base.name,
        description: step.description || '',
        optional: step.optional === true,
        ingredientIds: ingredientIds.map(String),
        ingredients,
        status: 'pendiente',
      })
    }
  }

  for (const percentage of recipe.percentages || []) {
    steps.push({
      baseId: 'percentage',
      baseName: 'Porcentajes',
      description: `Aplicar ${percentage.value}% de ${percentage.name}`,
      optional: true,
      ingredientIds: [],
      ingredients: [],
      percentageName: percentage.name,
      percentageValue: Number(percentage.value) || 0,
      status: 'pendiente',
    })
  }

  return steps
}

export async function getProduction(id) {
  const docSnap = await getDoc(doc(db, PRODUCTIONS_COLLECTION, id))
  if (!docSnap.exists()) throw new Error('Producción no encontrada')
  return mapDoc(docSnap)
}

/**
 * Calcula el costo final de una producción aplicando los porcentajes
 * de los pasos que fueron completados.
 *
 * @param {number} totalCost - Costo base de la producción.
 * @param {Array} steps - Pasos de la producción.
 * @returns {number} Costo final con porcentajes aplicados.
 */
function computeFinalCost(totalCost, steps) {
  const appliedPctSum = (steps || [])
    .filter((step) => step.baseId === 'percentage' && step.status === 'completado')
    .reduce((sum, step) => sum + (Number(step.percentageValue) || 0), 0)
  return (Number(totalCost) || 0) * (1 + appliedPctSum / 100)
}

export async function completeProductionStep(productionId, stepIndex) {
  return runTransaction(db, async (transaction) => {
    const productionRef = doc(db, PRODUCTIONS_COLLECTION, productionId)
    const productionSnap = await transaction.get(productionRef)

    if (!productionSnap.exists()) throw new Error('Producción no encontrada')

    const production = productionSnap.data()
    const steps = production.steps || []

    if (stepIndex < 0 || stepIndex >= steps.length) {
      throw new Error('Paso inválido')
    }

    const step = steps[stepIndex]
    if (step.status !== 'pendiente') {
      throw new Error('Este paso ya fue procesado')
    }

    const ingredientReads = new Map()
    for (const ing of step.ingredients || []) {
      if (ing.quantity > 0) {
        const ingredientRef = doc(db, INGREDIENTS_COLLECTION, ing.ingredientId)
        const ingredientSnap = await transaction.get(ingredientRef)
        if (!ingredientSnap.exists()) throw new Error(`Ingrediente ${ing.name} no encontrado`)
        ingredientReads.set(ing.ingredientId, {
          ref: ingredientRef,
          data: ingredientSnap.data(),
        })
      }
    }

    for (const ing of step.ingredients || []) {
      if (ing.quantity <= 0) continue
      const read = ingredientReads.get(ing.ingredientId)
      const currentStock = read.data.stock || 0
      const newStock = currentStock - ing.quantity

      if (newStock < -0.0001) {
        throw new Error(`Stock insuficiente para ${ing.name}`)
      }

      transaction.update(read.ref, {
        stock: newStock,
        updatedAt: serverTimestamp(),
      })

      transaction.set(doc(collection(db, STOCK_MOVEMENTS_COLLECTION)), {
        type: 'out',
        reason: 'production',
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        productionId,
        stepIndex,
        date: new Date().toISOString().split('T')[0],
        notes: production.notes || '',
        createdAt: serverTimestamp(),
      })
    }

    const updatedSteps = [...steps]
    updatedSteps[stepIndex] = { ...step, status: 'completado' }

    const allDone = updatedSteps.every((s) => s.status === 'completado' || s.status === 'omitido')
    const newStatus = allDone ? 'finalizado' : 'en_progreso'

    const updateData = {
      steps: updatedSteps,
      status: newStatus,
      updatedAt: serverTimestamp(),
    }
    if (allDone) {
      updateData.finalCost = computeFinalCost(production.totalCost, updatedSteps)
    }

    transaction.update(productionRef, updateData)

    return { success: true, status: newStatus }
  })
}

export async function skipProductionStep(productionId, stepIndex) {
  return runTransaction(db, async (transaction) => {
    const productionRef = doc(db, PRODUCTIONS_COLLECTION, productionId)
    const productionSnap = await transaction.get(productionRef)

    if (!productionSnap.exists()) throw new Error('Producción no encontrada')

    const production = productionSnap.data()
    const steps = production.steps || []

    if (stepIndex < 0 || stepIndex >= steps.length) {
      throw new Error('Paso inválido')
    }

    const step = steps[stepIndex]
    if (step.status !== 'pendiente') {
      throw new Error('Este paso ya fue procesado')
    }

    if (!step.optional) {
      throw new Error('Solo se pueden omitir pasos opcionales')
    }

    const updatedSteps = [...steps]
    updatedSteps[stepIndex] = { ...step, status: 'omitido' }

    const allDone = updatedSteps.every((s) => s.status === 'completado' || s.status === 'omitido')
    const newStatus = allDone ? 'finalizado' : 'en_progreso'

    const updateData = {
      steps: updatedSteps,
      status: newStatus,
      updatedAt: serverTimestamp(),
    }
    if (allDone) {
      updateData.finalCost = computeFinalCost(production.totalCost, updatedSteps)
    }

    transaction.update(productionRef, updateData)

    return { success: true, status: newStatus }
  })
}

export async function completeProductionBase(productionId, baseId) {
  return runTransaction(db, async (transaction) => {
    const productionRef = doc(db, PRODUCTIONS_COLLECTION, productionId)
    const productionSnap = await transaction.get(productionRef)

    if (!productionSnap.exists()) throw new Error('Producción no encontrada')

    const production = productionSnap.data()
    const steps = production.steps || []

    const target = steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) => step.baseId === baseId && step.status === 'pendiente')

    if (target.length === 0) {
      throw new Error('No hay pasos pendientes en esta base')
    }

    const ingredientTotals = new Map()
    for (const { step } of target) {
      for (const ing of step.ingredients || []) {
        if (ing.quantity > 0) {
          const existing = ingredientTotals.get(String(ing.ingredientId))
          if (existing) {
            existing.quantity += ing.quantity
          } else {
            ingredientTotals.set(String(ing.ingredientId), {
              name: ing.name,
              quantity: ing.quantity,
            })
          }
        }
      }
    }

    for (const [ingredientId, info] of ingredientTotals) {
      const ingredientRef = doc(db, INGREDIENTS_COLLECTION, ingredientId)
      const ingredientSnap = await transaction.get(ingredientRef)
      if (!ingredientSnap.exists()) {
        throw new Error(`Ingrediente ${info.name} no encontrado`)
      }
      info.ref = ingredientRef
      info.data = ingredientSnap.data()
    }

    for (const [ingredientId, info] of ingredientTotals) {
      const currentStock = info.data.stock || 0
      const newStock = currentStock - info.quantity

      if (newStock < -0.0001) {
        throw new Error(`Stock insuficiente para ${info.name}`)
      }

      transaction.update(info.ref, {
        stock: newStock,
        updatedAt: serverTimestamp(),
      })

      transaction.set(doc(collection(db, STOCK_MOVEMENTS_COLLECTION)), {
        type: 'out',
        reason: 'production',
        ingredientId,
        quantity: info.quantity,
        productionId,
        date: new Date().toISOString().split('T')[0],
        notes: production.notes || '',
        createdAt: serverTimestamp(),
      })
    }

    const updatedSteps = [...steps]
    for (const { index } of target) {
      updatedSteps[index] = { ...updatedSteps[index], status: 'completado' }
    }

    const allDone = updatedSteps.every((s) => s.status === 'completado' || s.status === 'omitido')
    const newStatus = allDone ? 'finalizado' : 'en_progreso'

    const updateData = {
      steps: updatedSteps,
      status: newStatus,
      updatedAt: serverTimestamp(),
    }
    if (allDone) {
      updateData.finalCost = computeFinalCost(production.totalCost, updatedSteps)
    }

    transaction.update(productionRef, updateData)

    return { success: true, status: newStatus, completed: target.length }
  })
}

export async function createProduction({ recipeId, portions, notes, supplierSelections = {} }) {
  const recipeSnap = await getDoc(doc(db, RECIPES_COLLECTION, recipeId))
  if (!recipeSnap.exists()) throw new Error('Receta no encontrada')

  const recipe = recipeSnap.data()
  const scale = portions / (recipe.portions || 1)
  const { ingredientMap, baseMap, suppliers } = await loadProductionData()
  const totals = computeIngredientTotals(recipe, baseMap, scale)
  const steps = computeProductionSteps(recipe, baseMap, ingredientMap, scale)
  const supplierMap = new Map(suppliers.map((supplier) => [String(supplier.id), supplier]))

  const items = []
  let totalCost = 0

  for (const [ingredientId, quantity] of totals) {
    const ingredient = ingredientMap.get(ingredientId)
    if (!ingredient) continue

    const supplierId = supplierSelections[String(ingredientId)] ?? null
    const supplier = supplierId ? supplierMap.get(String(supplierId)) : null
    const cost = supplier ? supplierUnitCost(supplier, ingredientId, ingredientMap) : null
    const itemCost = cost != null ? cost * quantity : 0
    totalCost += itemCost

    items.push({
      ingredientId,
      ingredientName: ingredient.name,
      quantity,
      unit: ingredient.unit,
      cost: itemCost,
      supplierId: supplierId ?? null,
    })
  }

  const docRef = await addDoc(collection(db, PRODUCTIONS_COLLECTION), {
    recipeId,
    recipeName: recipe.name,
    portions,
    totalCost,
    items,
    steps,
    status: 'nuevo',
    date: new Date().toISOString().split('T')[0],
    notes: notes || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return { success: true, id: docRef.id, totalCost }
}

export async function getRecipes(active, cursor = null) {
  const constraints = [
    where('active', '==', active),
    limit(PAGE_SIZE + 1),
  ]
  if (cursor) constraints.push(startAfter(cursor))
  const q = query(collection(db, RECIPES_COLLECTION), ...constraints)
  const snapshot = await getDocs(q)
  const docs = snapshot.docs
  const hasMore = docs.length > PAGE_SIZE
  const items = docs.slice(0, PAGE_SIZE).map(mapDoc)
  const lastDoc = docs.length > 0 ? docs[Math.min(PAGE_SIZE, docs.length) - 1] : null
  return { items, lastDoc, hasMore }
}

export async function getAllRecipes() {
  const q = query(collection(db, RECIPES_COLLECTION), where('active', '==', true))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapDoc)
}

export async function countRecipes(active) {
  const q = query(collection(db, RECIPES_COLLECTION), where('active', '==', active))
  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

export async function createRecipe(data) {
  const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
    ...data,
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  const newDoc = await getDoc(docRef)
  return mapDoc(newDoc)
}

export async function updateRecipe(id, data) {
  const docRef = doc(db, RECIPES_COLLECTION, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}

export async function updateRecipeActive(id, active) {
  const docRef = doc(db, RECIPES_COLLECTION, id)
  await updateDoc(docRef, {
    active,
    updatedAt: serverTimestamp(),
  })
  const updatedDoc = await getDoc(docRef)
  return mapDoc(updatedDoc)
}
