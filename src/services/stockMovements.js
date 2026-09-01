import {
  getStockMovements,
  countStockMovements,
  createPurchases as firebaseCreatePurchases,
} from '../firebase/firestore.js'

export function listStockMovements(cursor) {
  return getStockMovements(cursor)
}

export function countAllStockMovements() {
  return countStockMovements()
}

export function createPurchases(items) {
  return firebaseCreatePurchases(items)
}
