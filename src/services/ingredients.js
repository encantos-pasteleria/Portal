import {
  getIngredients,
  countIngredients,
  getAllIngredients,
  createIngredient as firebaseCreateIngredient,
  updateIngredient as firebaseUpdateIngredient,
  updateIngredientActive as firebaseUpdateIngredientActive,
  deleteIngredient as firebaseDeleteIngredient,
} from '../firebase/firestore.js'

export function listIngredients(active, cursor) {
  return getIngredients(active, cursor)
}

export function countAllIngredients(active) {
  return countIngredients(active)
}

export function listAllIngredients() {
  return getAllIngredients()
}

export function createIngredient(data) {
  return firebaseCreateIngredient(data)
}

export function updateIngredient(data) {
  const { id, ...rest } = data
  return firebaseUpdateIngredient(id, rest)
}

export function updateIngredientActive(id, active) {
  return firebaseUpdateIngredientActive(id, active)
}

export function deleteIngredient(id) {
  return firebaseDeleteIngredient(id)
}
