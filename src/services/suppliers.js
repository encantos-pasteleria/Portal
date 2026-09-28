import {
  getSuppliers,
  countSuppliers,
  getAllSuppliers,
  createSupplier as firebaseCreateSupplier,
  updateSupplier as firebaseUpdateSupplier,
  updateSupplierActive as firebaseUpdateSupplierActive,
  deleteSupplier as firebaseDeleteSupplier,
} from '../firebase/firestore.js'

export function listSuppliers(active, cursor) {
  return getSuppliers(active, cursor)
}

export function countAllSuppliers(active) {
  return countSuppliers(active)
}

export function listAllSuppliers() {
  return getAllSuppliers()
}

export function createSupplier(data) {
  return firebaseCreateSupplier(data)
}

export function updateSupplier(data) {
  const { id, ...rest } = data
  return firebaseUpdateSupplier(id, rest)
}

export function updateSupplierActive(id, active) {
  return firebaseUpdateSupplierActive(id, active)
}

export function deleteSupplier(id) {
  return firebaseDeleteSupplier(id)
}
