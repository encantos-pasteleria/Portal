import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import {
  getProduction,
  completeProductionStep,
  skipProductionStep,
  completeProductionBase,
} from '../../../../services/productions.js'
import { formatAmount } from '../../../../utils/units.js'
import { formatCurrency, formatDate } from '../../../../utils/format.js'
import {
  Page,
  BackLink,
  Sheet,
  TopRule,
  Masthead,
  Brand,
  BrandName,
  BrandTagline,
  DocBlock,
  DocLabel,
  DocNumber,
  DocDate,
  Stamp,
  Rule,
  MetaGrid,
  MetaItem,
  MetaLabel,
  MetaValue,
  ProgressSection,
  ProgressLabel,
  ProgressBar,
  ProgressFill,
  SectionLabel,
  BaseTabBar,
  BaseTab,
  BaseToolbar,
  CompleteAllButton,
  StepsList,
  StepItem,
  StepNumber,
  StepBody,
  StepDescription,
  OptionalTag,
  StepIngredients,
  IngredientLine,
  StepActions,
  StepStatus,
  CompleteButton,
  SkipButton,
  Footer,
  Totals,
  TotalRow,
  TotalValue,
  GrandTotal,
  GrandTotalValue,
  StateWrap,
  Spinner,
  Toast,
  FinishedBanner,
  FinishedStamp,
  FinishedText,
} from './styles.js'

const STATUS_LABELS = {
  nuevo: 'Nuevo',
  en_progreso: 'En progreso',
  finalizado: 'Finalizado',
}

function groupStepsByBase(steps) {
  const groups = []
  let currentBase = null

  for (const step of steps) {
    if (step.baseId !== currentBase) {
      currentBase = step.baseId
      groups.push({ baseId: step.baseId, baseName: step.baseName, steps: [] })
    }
    groups[groups.length - 1].steps.push(step)
  }

  const percentageSteps = groups.find((g) => g.baseId === 'percentage')
  const baseGroups = groups.filter((g) => g.baseId !== 'percentage')

  if (percentageSteps) {
    baseGroups.push({
      baseId: 'percentage',
      baseName: 'Porcentajes',
      steps: percentageSteps.steps,
    })
  }

  return baseGroups
}

function findActiveBaseIndex(baseGroups) {
  for (let i = 0; i < baseGroups.length; i++) {
    const hasPending = baseGroups[i].steps.some((s) => s.status === 'pendiente')
    if (hasPending) return i
  }
  return baseGroups.length - 1
}

function ProductionDetail() {
  const { id } = useParams()
  const [production, setProduction] = useState(null)
  const [status, setStatus] = useState('loading')
  const [processingStep, setProcessingStep] = useState(null)
  const [processingAll, setProcessingAll] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProduction(id)
        setProduction(data)
        setStatus('success')
      } catch {
        setStatus('error')
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const handleComplete = async (stepIndex) => {
    setProcessingStep(stepIndex)
    try {
      await completeProductionStep(id, stepIndex)
      const updated = await getProduction(id)
      setProduction(updated)
      setToast({ message: 'Paso completado', error: false })
    } catch (error) {
      setToast({ message: error.message || 'Error al completar el paso', error: true })
    } finally {
      setProcessingStep(null)
    }
  }

  const handleSkip = async (stepIndex) => {
    setProcessingStep(stepIndex)
    try {
      await skipProductionStep(id, stepIndex)
      const updated = await getProduction(id)
      setProduction(updated)
      setToast({ message: 'Paso omitido', error: false })
    } catch (error) {
      setToast({ message: error.message || 'Error al omitir el paso', error: true })
    } finally {
      setProcessingStep(null)
    }
  }

  const handleCompleteAll = async () => {
    if (!currentBase) return
    setProcessingAll(true)
    try {
      await completeProductionBase(id, currentBase.baseId)
      const updated = await getProduction(id)
      setProduction(updated)
      setToast({ message: 'Base completada', error: false })
    } catch (error) {
      setToast({ message: error.message || 'Error al completar la base', error: true })
    } finally {
      setProcessingAll(false)
    }
  }

  const steps = production?.steps || []
  const completedCount = steps.filter((s) => s.status === 'completado').length
  const skippedCount = steps.filter((s) => s.status === 'omitido').length
  const totalSteps = steps.length
  const progressPercent = totalSteps > 0 ? ((completedCount + skippedCount) / totalSteps) * 100 : 0
  const baseGroups = useMemo(() => groupStepsByBase(steps), [steps])
  const activeBaseIndex = useMemo(() => findActiveBaseIndex(baseGroups), [baseGroups])
  const isFinished = production?.status === 'finalizado'

  const currentBase = baseGroups[activeBaseIndex]
  const currentStepIndex = currentBase?.steps.findIndex((s) => s.status === 'pendiente')
  const currentBasePendingCount =
    currentBase?.steps.filter((s) => s.status === 'pendiente').length ?? 0

  const ingredientCostMap = useMemo(() => {
    const map = new Map()
    for (const item of production?.items || []) {
      if (item.cost != null && item.ingredientId) {
        map.set(String(item.ingredientId), item.cost)
      }
    }
    return map
  }, [production?.items])

  const baseCost = useMemo(() => {
    if (!currentBase) return 0
    let total = 0
    for (const step of currentBase.steps) {
      for (const ing of step.ingredients || []) {
        if (ing.quantity > 0) {
          const cost = ingredientCostMap.get(String(ing.ingredientId)) || 0
          total += cost
        }
      }
    }
    return total
  }, [currentBase, ingredientCostMap])

  const percentageSteps = steps.filter((s) => s.baseId === 'percentage')
  const appliedPctSum = percentageSteps
    .filter((s) => s.status === 'completado')
    .reduce((sum, s) => sum + (Number(s.percentageValue) || 0), 0)
  const hasPercentages = percentageSteps.length > 0
  const baseTotal = Number(production?.totalCost) || 0
  const finalCost = baseTotal * (1 + appliedPctSum / 100)

  if (status === 'loading') {
    return (
      <Page>
        <StateWrap>
          <Spinner role="status" aria-label="Cargando" />
          <span>Cargando producción…</span>
        </StateWrap>
      </Page>
    )
  }

  if (status === 'error' || !production) {
    return (
      <Page>
        <StateWrap>
          <span>No se pudo cargar la producción.</span>
          <Link to="/produccion">Volver</Link>
        </StateWrap>
      </Page>
    )
  }

  return (
    <>
      <Page>
        <BackLink href="#/produccion">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Volver a producción
        </BackLink>

        <Sheet>
          <TopRule />

          <Masthead>
            <Brand>
              <BrandName>Encantos</BrandName>
              <BrandTagline>Taller de producción</BrandTagline>
            </Brand>
            <DocBlock>
              <DocLabel>Hoja de producción</DocLabel>
              <DocNumber>Nº {production.id.slice(0, 8).toUpperCase()}</DocNumber>
              {production.date && <DocDate>{formatDate(production.date)}</DocDate>}
              <Stamp $status={production.status || 'nuevo'}>
                {STATUS_LABELS[production.status] || 'Nuevo'}
              </Stamp>
            </DocBlock>
          </Masthead>

          <Rule />

          <MetaGrid>
            <MetaItem>
              <MetaLabel>Receta</MetaLabel>
              <MetaValue>{production.recipeName}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Porciones</MetaLabel>
              <MetaValue>
                {production.portions} {production.portions === 1 ? 'porción' : 'porciones'}
              </MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Pasos</MetaLabel>
              <MetaValue>{totalSteps}</MetaValue>
            </MetaItem>
            {production.notes && (
              <MetaItem>
                <MetaLabel>Notas</MetaLabel>
                <MetaValue>{production.notes}</MetaValue>
              </MetaItem>
            )}
          </MetaGrid>

          {totalSteps > 0 && (
            <ProgressSection>
              <ProgressLabel>
                <span>Progreso</span>
                <span>
                  {completedCount} completados{skippedCount > 0 ? `, ${skippedCount} omitidos` : ''} de{' '}
                  {totalSteps}
                </span>
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill $percent={progressPercent} />
              </ProgressBar>
            </ProgressSection>
          )}

          {isFinished ? (
            <FinishedBanner>
              <FinishedStamp>
                <svg
                  width="20"
                  height="20"
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
                Finalizado
              </FinishedStamp>
              <FinishedText>Todos los pasos han sido completados.</FinishedText>
            </FinishedBanner>
          ) : (
            baseGroups.length > 0 && (
              <>
                <SectionLabel>Paso a paso</SectionLabel>

                <BaseToolbar>
                  <BaseTabBar>
                    {baseGroups.map((group, index) => {
                      const isDone = group.steps.every(
                        (s) => s.status === 'completado' || s.status === 'omitido',
                      )
                      const isCurrent = index === activeBaseIndex
                      return (
                        <BaseTab key={group.baseId} $active={isCurrent} $done={isDone}>
                          {isDone && (
                            <svg
                              width="12"
                              height="12"
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
                          )}
                          {group.baseName}
                        </BaseTab>
                      )
                    })}
                  </BaseTabBar>
                  {currentBase.baseId !== 'percentage' && currentBasePendingCount >= 1 && (
                    <CompleteAllButton
                      type="button"
                      onClick={handleCompleteAll}
                      disabled={processingAll}
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                        <polyline points="20 12 9 17 4 18" />
                      </svg>
                      {processingAll ? 'Completando…' : 'Completar todo'}
                    </CompleteAllButton>
                  )}
                </BaseToolbar>

                <StepsList>
                  {currentBase.steps.map((step, localIndex) => {
                    const globalIndex = steps.indexOf(step)
                    const isProcessing = processingStep === globalIndex
                    const isPending = step.status === 'pendiente'
                    const isCurrentStep = isPending && localIndex === currentStepIndex
                    const isLocked = isPending && localIndex !== currentStepIndex
                    const isPercentageStep = step.baseId === 'percentage'

                    return (
                      <StepItem key={globalIndex} $locked={isLocked}>
                        <StepNumber $status={step.status}>
                          {step.status === 'completado' ? (
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
                          ) : step.status === 'omitido' ? (
                            '—'
                          ) : (
                            String(localIndex + 1).padStart(2, '0')
                          )}
                        </StepNumber>

                        <StepBody>
                          <StepDescription $status={step.status}>
                            {step.description}
                            {step.optional && <OptionalTag>opcional</OptionalTag>}
                          </StepDescription>
                          {step.ingredients && step.ingredients.length > 0 && (
                            <StepIngredients>
                              {step.ingredients
                                .filter((ing) => ing.quantity > 0)
                                .map((ing) => (
                                  <IngredientLine key={ing.ingredientId}>
                                    {ing.name} — {formatAmount(ing.quantity, ing.unit)}
                                  </IngredientLine>
                                ))}
                            </StepIngredients>
                          )}
                        </StepBody>

                        {isCurrentStep ? (
                          <StepActions>
                            <CompleteButton
                              type="button"
                              onClick={() => handleComplete(globalIndex)}
                              disabled={isProcessing}
                            >
                              <svg
                                width="12"
                                height="12"
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
                              {isProcessing
                                ? 'Procesando…'
                                : isPercentageStep
                                  ? 'Aplicar'
                                  : 'Completar'}
                            </CompleteButton>
                            {step.optional && (
                              <SkipButton
                                type="button"
                                onClick={() => handleSkip(globalIndex)}
                                disabled={isProcessing}
                              >
                                {isPercentageStep ? 'No aplicar' : 'Omitir'}
                              </SkipButton>
                            )}
                          </StepActions>
                        ) : step.status === 'completado' ? (
                          <StepStatus $status="completado">
                            {isPercentageStep ? 'Aplicados' : 'Completado'}
                          </StepStatus>
                        ) : step.status === 'omitido' ? (
                          <StepStatus $status="omitido">
                            {isPercentageStep ? 'No aplicados' : 'Omitido'}
                          </StepStatus>
                        ) : null}
                      </StepItem>
                    )
                  })}
                </StepsList>
              </>
            )
          )}

          <Footer>
            <Totals>
              {!isFinished && currentBase && currentBase.baseId !== 'percentage' && (
                <TotalRow>
                  <span>Costo {currentBase.baseName}</span>
                  <TotalValue>{formatCurrency(baseCost)}</TotalValue>
                </TotalRow>
              )}
              {hasPercentages && (
                <TotalRow>
                  <span>Costo base</span>
                  <TotalValue>{formatCurrency(baseTotal)}</TotalValue>
                </TotalRow>
              )}
              <GrandTotal>
                <span>{hasPercentages ? 'Costo final' : 'Costo total'}</span>
                <GrandTotalValue>{formatCurrency(finalCost)}</GrandTotalValue>
              </GrandTotal>
            </Totals>
          </Footer>
        </Sheet>
      </Page>

      {toast && (
        <Toast role="status" $error={toast.error}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {toast.error ? (
              <circle cx="12" cy="12" r="10" />
            ) : (
              <polyline points="20 6 9 17 4 12" />
            )}
          </svg>
          {toast.message}
        </Toast>
      )}
    </>
  )
}

export default ProductionDetail
