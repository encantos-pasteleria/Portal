import { useState, useMemo, useEffect } from 'react'
import Modal from '../../../../components/Modal/index.jsx'
import { formatAmount } from '../../../../utils/units.js'
import { formatCurrency } from '../../../../utils/format.js'
import { computeUnitCost } from '../../../../utils/suppliers.js'
import {
  Body,
  IngredientList,
  IngredientRow,
  IngredientInfo,
  IngredientName,
  IngredientAmount,
  SupplierSelect,
  CostValue,
  NoSupplier,
  TotalRow,
  TotalLine,
  TotalLabel,
  TotalValue,
  TotalSub,
  EmptyText,
} from './styles.js'

/**
 * Modal que estima el costo de una base seleccionando el proveedor
 * de cada ingrediente.
 *
 * @param {object} props - Propiedades del modal.
 * @param {object|null} props.base - Base a evaluar.
 * @param {Map} props.ingredientMap - Mapa de id a objeto ingrediente.
 * @param {Array} props.suppliers - Lista de proveedores.
 * @param {Function} props.onClose - Callback al cerrar.
 * @returns {JSX.Element|null} Modal o null.
 */
function BaseCostModal({ base, ingredientMap, suppliers, onClose }) {
  const entries = useMemo(
    () => Object.entries(base?.ingredients ?? {}),
    [base],
  )

  const suppliersByIngredient = useMemo(() => {
    const map = {}
    entries.forEach(([id]) => {
      const key = String(id)
      map[id] = suppliers.filter(
        (supplier) =>
          supplier.ingredientPackaging &&
          Object.prototype.hasOwnProperty.call(supplier.ingredientPackaging, key),
      )
    })
    return map
  }, [entries, suppliers])

  const [selections, setSelections] = useState({})

  useEffect(() => {
    const initial = {}
    entries.forEach(([id]) => {
      const available = suppliersByIngredient[id]
      if (available && available.length > 0) {
        initial[id] = String(available[0].id)
      }
    })
    setSelections(initial)
  }, [entries, suppliersByIngredient])

  const selectedSupplier = (id) =>
    suppliers.find((s) => String(s.id) === selections[id]) ?? null

  const getCost = (ingredientId, quantity) => {
    const supplier = selectedSupplier(ingredientId)
    if (!supplier) return null
    const ingredient = ingredientMap.get(String(ingredientId))
    const pkg = supplier.ingredientPackaging?.[String(ingredientId)]
    const unitCost = computeUnitCost(pkg, ingredient?.unit)
    if (unitCost == null) return null
    return Number(quantity) * unitCost
  }

  const setSupplier = (ingredientId, supplierId) => {
    setSelections((prev) => ({ ...prev, [ingredientId]: supplierId }))
  }

  const total = entries.reduce((sum, [id, quantity]) => {
    const cost = getCost(id, quantity)
    return sum + (cost ?? 0)
  }, 0)

  const portions = base ? Number(base.portions) : 0
  const perServing = portions > 0 ? total / portions : null

  return (
    <Modal
      open={Boolean(base)}
      title="Valor aproximado"
      description={base ? `Costo estimado de ${base.name}` : ''}
      onClose={onClose}
      size="md"
    >
      <Body>
        {entries.length === 0 ? (
          <EmptyText>Esta base no tiene ingredientes registrados.</EmptyText>
        ) : (
          <>
            <IngredientList>
              {entries.map(([id, quantity]) => {
                const ingredient = ingredientMap.get(String(id))
                const available = suppliersByIngredient[id] ?? []
                const cost = getCost(id, quantity)
                const amount = ingredient?.unit
                  ? formatAmount(quantity, ingredient.unit)
                  : String(quantity)

                return (
                  <IngredientRow key={id}>
                    <IngredientInfo>
                      <IngredientName>{ingredient?.name ?? id}</IngredientName>
                      <IngredientAmount>{amount}</IngredientAmount>
                    </IngredientInfo>
                    {available.length > 0 ? (
                      <SupplierSelect
                        value={selections[id] ?? ''}
                        onChange={(event) => setSupplier(id, event.target.value)}
                        aria-label={`Proveedor de ${ingredient?.name ?? id}`}
                      >
                        <option value="" disabled>
                          Elegir proveedor
                        </option>
                        {available.map((supplier) => (
                          <option key={supplier.id} value={String(supplier.id)}>
                            {supplier.name}
                          </option>
                        ))}
                      </SupplierSelect>
                    ) : (
                      <NoSupplier>Sin proveedor</NoSupplier>
                    )}
                    <CostValue>{cost != null ? formatCurrency(cost) : '—'}</CostValue>
                  </IngredientRow>
                )
              })}
            </IngredientList>

            <TotalRow>
              <TotalLine>
                <TotalLabel>Costo total estimado</TotalLabel>
                <TotalValue>{formatCurrency(total)}</TotalValue>
              </TotalLine>
              {perServing != null && (
                <TotalSub>
                  ≈ {formatCurrency(perServing)} por porción · rinde {portions}{' '}
                  {portions === 1 ? 'porción' : 'porciones'}
                </TotalSub>
              )}
            </TotalRow>
          </>
        )}
      </Body>
    </Modal>
  )
}

export default BaseCostModal
