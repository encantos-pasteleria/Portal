import {
  getProductions,
  countProductions,
  getProductionsByDateRange,
  countProductionsByDateRange as firebaseCountProductionsByDateRange,
  previewProduction as firebasePreviewProduction,
  createProduction as firebaseCreateProduction,
  getProduction as firebaseGetProduction,
  completeProductionStep as firebaseCompleteProductionStep,
  skipProductionStep as firebaseSkipProductionStep,
  completeProductionBase as firebaseCompleteProductionBase,
} from '../firebase/firestore.js'

export function previewProduction(data) {
  return firebasePreviewProduction(data)
}

export function createProduction(data) {
  return firebaseCreateProduction(data)
}

export function listProductions(cursor) {
  return getProductions(cursor)
}

export function countAllProductions() {
  return countProductions()
}

export function listProductionsByDateRange(startDate, endDate) {
  return getProductionsByDateRange(startDate, endDate)
}

export function countProductionsByDateRange(startDate, endDate) {
  return firebaseCountProductionsByDateRange(startDate, endDate)
}

export function getProduction(id) {
  return firebaseGetProduction(id)
}

export function completeProductionStep(productionId, stepIndex) {
  return firebaseCompleteProductionStep(productionId, stepIndex)
}

export function skipProductionStep(productionId, stepIndex) {
  return firebaseSkipProductionStep(productionId, stepIndex)
}

export function completeProductionBase(productionId, baseId) {
  return firebaseCompleteProductionBase(productionId, baseId)
}
