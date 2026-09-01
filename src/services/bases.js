import {
  getBases,
  countBases,
  getAllBases,
  createBase as firebaseCreateBase,
  updateBase as firebaseUpdateBase,
  updateBaseActive as firebaseUpdateBaseActive,
} from '../firebase/firestore.js'

export function listBases(active, cursor) {
  return getBases(active, cursor)
}

export function countAllBases(active) {
  return countBases(active)
}

export function listAllBases() {
  return getAllBases()
}

export function createBase(data) {
  return firebaseCreateBase(data)
}

export function updateBase(data) {
  const { id, ...rest } = data
  return firebaseUpdateBase(id, rest)
}

export function updateBaseActive(id, active) {
  return firebaseUpdateBaseActive(id, active)
}
