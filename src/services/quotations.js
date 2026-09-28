import {
  getQuotations,
  countQuotations,
  getAllQuotations,
  getQuotation as firebaseGetQuotation,
  previewQuotation as firebasePreviewQuotation,
  computeQuotationCost as firebaseComputeQuotationCost,
  createQuotation as firebaseCreateQuotation,
  updateQuotation as firebaseUpdateQuotation,
  updateQuotationActive as firebaseUpdateQuotationActive,
  deleteQuotation as firebaseDeleteQuotation,
} from '../firebase/firestore.js'

export function listQuotations(active, cursor) {
  return getQuotations(active, cursor)
}

export function previewQuotation(data) {
  return firebasePreviewQuotation(data)
}

export function computeQuotationCost(lines, supplierSelections, quotationPercentages) {
  return firebaseComputeQuotationCost(lines, supplierSelections, quotationPercentages)
}

export function countAllQuotations(active) {
  return countQuotations(active)
}

export function listAllQuotations() {
  return getAllQuotations()
}

export function getQuotation(id) {
  return firebaseGetQuotation(id)
}

export function createQuotation(data) {
  return firebaseCreateQuotation(data)
}

export function updateQuotation(data) {
  const { id, ...rest } = data
  return firebaseUpdateQuotation(id, rest)
}

export function updateQuotationActive(id, active) {
  return firebaseUpdateQuotationActive(id, active)
}

export function deleteQuotation(id) {
  return firebaseDeleteQuotation(id)
}
