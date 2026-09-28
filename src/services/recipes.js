import {
  getRecipes,
  countRecipes,
  getAllRecipes,
  createRecipe as firebaseCreateRecipe,
  updateRecipe as firebaseUpdateRecipe,
  updateRecipeActive as firebaseUpdateRecipeActive,
  deleteRecipe as firebaseDeleteRecipe,
} from '../firebase/firestore.js'

export function listRecipes(active, cursor) {
  return getRecipes(active, cursor)
}

export function countAllRecipes(active) {
  return countRecipes(active)
}

export function listAllRecipes() {
  return getAllRecipes()
}

export function createRecipe(data) {
  return firebaseCreateRecipe(data)
}

export function updateRecipe(data) {
  const { id, ...rest } = data
  return firebaseUpdateRecipe(id, rest)
}

export function updateRecipeActive(id, active) {
  return firebaseUpdateRecipeActive(id, active)
}

export function deleteRecipe(id) {
  return firebaseDeleteRecipe(id)
}
