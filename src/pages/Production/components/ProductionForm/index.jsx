import { useState, Fragment } from 'react'
import Button from '../../../../components/Button/index.jsx'
import { formatCurrency, formatUnitCost } from '../../../../utils/format.js'
import { formatAmount } from '../../../../utils/units.js'
import { previewProduction } from '../../../../services/productions.js'
import {
  Form,
  Fields,
  Field,
  Label,
  Select,
  Input,
  EmptyText,
  ErrorText,
  Actions,
  Summary,
  ItemCard,
  ItemHeader,
  ItemName,
  ItemCost,
  ItemMeta,
  SupplierWrap,
  SupplierChip,
  TotalRow,
  TotalValue,
  Stepper,
  StepperItem,
  StepperDot,
  StepperLabel,
  StepperLine,
  Spacer,
  BaseSection,
  BaseTitle,
  SupplierRow,
  SupplierInfo,
  SupplierSelect,
  SupplierCost,
} from './styles.js'

const STEP_LABELS = ['Receta', 'Proveedores', 'Resumen']

/**
 * Formulario de producción en tres pasos: receta y porciones, selección de
 * proveedores (con stock) por base y resumen final.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {Array} [props.recipes=[]] - Recetas activas.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {Function} props.onSubmit - Callback con { recipeId, portions, notes, supplierSelections }.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario de producción.
 */
function ProductionForm({ recipes = [], submitting = false, onSubmit, onCancel }) {
  const [recipeId, setRecipeId] = useState('')
  const [portions, setPortions] = useState('')
  const [notes, setNotes] = useState('')
  const [preview, setPreview] = useState(null)
  const [selections, setSelections] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [calculating, setCalculating] = useState(false)
  const [calcError, setCalcError] = useState(null)

  /** Mapa de id de ingrediente a su item de la vista previa. */
  const itemMap = new Map((preview?.items ?? []).map((item) => [item.ingredientId, item]))

  /**
   * Cambia la receta seleccionada y precarga sus porciones.
   *
   * @param {string} value - Id de la receta.
   */
  const handleRecipeChange = (value) => {
    setRecipeId(value)
    setPreview(null)
    setSelections({})
    setCurrentStep(0)
    setCalcError(null)
    const recipe = recipes.find((item) => String(item.id) === String(value))
    setPortions(recipe?.portions != null ? String(recipe.portions) : '')
  }

  /**
   * Cambia las porciones e invalida la vista previa.
   *
   * @param {string} value - Cantidad de porciones.
   */
  const handlePortionsChange = (value) => {
    setPortions(value)
    setPreview(null)
    setSelections({})
    setCurrentStep(0)
    setCalcError(null)
  }

  /** Calcula la vista previa y avanza al paso de proveedores. */
  const handleCalculate = async () => {
    if (!recipeId) return
    setCalculating(true)
    setPreview(null)
    setCalcError(null)
    try {
      const result = await previewProduction({ recipeId, portions: Number(portions) })
      setPreview(result)
      const initial = {}
      result.items.forEach((item) => {
        initial[item.ingredientId] = item.defaultSupplierId ?? null
      })
      setSelections(initial)
      setCurrentStep(1)
    } catch (error) {
      setCalcError(error.message || 'No se pudo calcular la vista previa.')
    } finally {
      setCalculating(false)
    }
  }

  /**
   * Actualiza el proveedor seleccionado de un ingrediente.
   *
   * @param {string} ingredientId - Id del ingrediente.
   * @param {string} supplierId - Id del proveedor ('' = sin proveedor).
   */
  const handleSupplierChange = (ingredientId, supplierId) => {
    setSelections((prev) => ({ ...prev, [ingredientId]: supplierId || null }))
  }

  /** Costo total estimado a partir de los proveedores seleccionados. */
  const computeTotal = () => {
    if (!preview) return 0
    return preview.items.reduce((sum, item) => {
      const option = item.supplierOptions.find((opt) => opt.supplierId === selections[item.ingredientId])
      const cost = option?.cost ?? null
      return sum + (cost != null ? cost * item.quantity : 0)
    }, 0)
  }

  /**
   * Envía el formulario (solo en el último paso).
   *
   * @param {React.FormEvent} event - Evento de envío.
   */
  const handleSubmit = (event) => {
    event.preventDefault()
    if (!preview || currentStep !== 2) return
    onSubmit({ recipeId, portions: Number(portions), notes: notes.trim(), supplierSelections: selections })
  }

  /**
   * Evita el envío implícito con Enter fuera del último paso.
   *
   * @param {React.KeyboardEvent} event - Evento de teclado.
   */
  const handleFormKeyDown = (event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA' && currentStep < 2) {
      event.preventDefault()
    }
  }

  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0))

  return (
    <Form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} noValidate autoComplete="off">
      <Stepper>
        {STEP_LABELS.map((label, index) => (
          <Fragment key={label}>
            <StepperItem>
              <StepperDot
                type="button"
                data-active={currentStep === index}
                data-done={currentStep > index}
                onClick={() => setCurrentStep(index)}
                disabled={index > currentStep}
              >
                {currentStep > index ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  index + 1
                )}
              </StepperDot>
              <StepperLabel data-active={currentStep === index}>{label}</StepperLabel>
            </StepperItem>
            {index < STEP_LABELS.length - 1 && <StepperLine data-done={currentStep > index} />}
          </Fragment>
        ))}
      </Stepper>

      <Fields>
        {currentStep === 0 && (
          <>
            <Field>
              <Label htmlFor="recipe">Receta</Label>
              <Select
                as="select"
                id="recipe"
                autoComplete="off"
                value={recipeId}
                onChange={(event) => handleRecipeChange(event.target.value)}
              >
                <option value="" disabled>
                  Selecciona una receta
                </option>
                {recipes.map((recipe) => (
                  <option key={recipe.id} value={recipe.id}>
                    {recipe.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <Label htmlFor="portions">Porciones a producir</Label>
              <Input
                id="portions"
                type="number"
                autoComplete="off"
                min="1"
                placeholder="Ej. 6"
                value={portions}
                onChange={(event) => handlePortionsChange(event.target.value)}
              />
            </Field>

            {recipes.length === 0 && <EmptyText>No hay recetas activas registradas.</EmptyText>}
            {calcError && <ErrorText>{calcError}</ErrorText>}
          </>
        )}

        {currentStep === 1 && (
          <>
            {preview.bases.length === 0 && <EmptyText>Esta receta no tiene bases con ingredientes.</EmptyText>}
            {preview.bases.map((base) => (
              <BaseSection key={base.baseId}>
                <BaseTitle>{base.name}</BaseTitle>
                {base.ingredients.map((baseIngredient) => {
                  const item = itemMap.get(baseIngredient.ingredientId)
                  if (!item) return null
                  const selected = item.supplierOptions.find(
                    (opt) => opt.supplierId === selections[item.ingredientId],
                  )
                  return (
                    <SupplierRow key={baseIngredient.ingredientId}>
                      <SupplierInfo>
                        <ItemName>{item.ingredientName}</ItemName>
                        <ItemMeta>
                          Necesario: {formatAmount(baseIngredient.quantity, item.unit)} · Stock:{' '}
                          {formatAmount(item.available, item.unit)}
                        </ItemMeta>
                      </SupplierInfo>
                      <SupplierSelect
                        value={selections[item.ingredientId] ?? ''}
                        onChange={(event) =>
                          handleSupplierChange(item.ingredientId, event.target.value)
                        }
                        aria-label={`Proveedor de ${item.ingredientName}`}
                      >
                        <option value="">Sin proveedor</option>
                        {item.supplierOptions.map((opt) => (
                          <option key={opt.supplierId} value={opt.supplierId}>
                            {opt.name}
                          </option>
                        ))}
                      </SupplierSelect>
                      <SupplierCost>
                        {selected?.cost != null
                          ? `${formatUnitCost(selected.cost)} / ${item.unit}`
                          : item.supplierOptions.length === 0
                            ? 'Sin compras registradas'
                            : 'Sin costo'}
                      </SupplierCost>
                    </SupplierRow>
                  )
                })}
              </BaseSection>
            ))}
          </>
        )}

        {currentStep === 2 && (
          <>
            <Summary>
              {preview.items.map((item) => {
                const option = item.supplierOptions.find(
                  (opt) => opt.supplierId === selections[item.ingredientId],
                )
                const cost = option?.cost != null ? option.cost * item.quantity : 0
                return (
                  <ItemCard key={item.ingredientId}>
                    <ItemHeader>
                      <ItemName>{item.ingredientName}</ItemName>
                      <ItemCost>{formatCurrency(cost)}</ItemCost>
                    </ItemHeader>
                    <ItemMeta>
                      Necesario: {formatAmount(item.quantity, item.unit)} · Stock:{' '}
                      {formatAmount(item.available, item.unit)}
                    </ItemMeta>
                    <SupplierWrap>
                      <SupplierChip>{option ? option.name : 'Sin proveedor'}</SupplierChip>
                    </SupplierWrap>
                  </ItemCard>
                )
              })}
            </Summary>

            <TotalRow>
              <span>Costo total estimado</span>
              <TotalValue>{formatCurrency(computeTotal())}</TotalValue>
            </TotalRow>

            <Field>
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                type="text"
                autoComplete="off"
                placeholder="Opcional"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </Field>
          </>
        )}
      </Fields>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Spacer />
        {currentStep > 0 && (
          <Button type="button" variant="secondary" onClick={goBack}>
            Anterior
          </Button>
        )}
        {currentStep === 0 && (
          <Button
            type="button"
            disabled={!recipeId || !Number(portions) || calculating}
            onClick={handleCalculate}
          >
            {calculating ? 'Calculando…' : 'Continuar'}
          </Button>
        )}
        {currentStep === 1 && (
          <Button type="button" onClick={() => setCurrentStep(2)}>
            Continuar
          </Button>
        )}
        {currentStep === 2 && (
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Iniciando…' : 'Iniciar producción'}
          </Button>
        )}
      </Actions>
    </Form>
  )
}

export default ProductionForm
