import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatAmount } from '../../../../utils/units.js'
import Switch from '../../../../components/Switch/index.jsx'
import {
  Overlay,
  Panel,
  DrawerHeader,
  DrawerTitle,
  CloseButton,
  DrawerBody,
  BaseHeader,
  HeaderLeft,
  Avatar,
  BaseName,
  StatusBadge,
  MetaRow,
  MetaChip,
  IngredientsHeader,
  SectionLabel,
  IngredientCount,
  IngredientsSection,
  IngredientList,
  IngredientRow,
  IngredientName,
  IngredientAmount,
  EmptyText,
  StepsSection,
  StepsList,
  StepItem,
  StepNum,
  StepContent,
  StepText,
  OptionalTag,
  StepIngredients,
  MiniChip,
  DrawerFooter,
  FooterLeft,
  EditButton,
  ToggleWrap,
  ToggleLabel,
} from './styles.js'

/**
 * Panel lateral con el detalle completo de una base (ingredientes + preparación).
 *
 * @param {object} props - Propiedades del drawer.
 * @param {object} props.base - Base a mostrar.
 * @param {Map} props.ingredientMap - Mapa de id de ingrediente a objeto.
 * @param {Function} props.onClose - Callback al cerrar.
 * @param {Function} props.onEdit - Callback al editar.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id de la base en proceso de cambio.
 * @returns {JSX.Element|null} Drawer o null.
 */
function BaseDetail({ base, ingredientMap, onClose, onEdit, onToggleActive, togglingId }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!base) return null

  const entries = Object.entries(base.ingredients ?? {})
  const steps = Array.isArray(base.steps) ? base.steps : []

  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Panel
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${base.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <DrawerHeader>
          <DrawerTitle>Detalle de la base</DrawerTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          <BaseHeader>
            <HeaderLeft>
              <Avatar>{base.name ? base.name.charAt(0) : '?'}</Avatar>
              <div>
                <BaseName>{base.name}</BaseName>
                <StatusBadge $active={base.active}>
                  {base.active ? 'Activo' : 'Inactivo'}
                </StatusBadge>
              </div>
            </HeaderLeft>
          </BaseHeader>

          <MetaRow>
            {base.portions != null && (
              <MetaChip>
                {base.portions} {base.portions === 1 ? 'porción' : 'porciones'}
              </MetaChip>
            )}
            {entries.length > 0 && (
              <MetaChip>
                {entries.length} {entries.length === 1 ? 'ingrediente' : 'ingredientes'}
              </MetaChip>
            )}
            {steps.length > 0 && (
              <MetaChip>
                {steps.length} {steps.length === 1 ? 'paso' : 'pasos'}
              </MetaChip>
            )}
          </MetaRow>

          <IngredientsSection>
            <IngredientsHeader>
              <SectionLabel>Ingredientes</SectionLabel>
              <IngredientCount>{entries.length}</IngredientCount>
            </IngredientsHeader>

            {entries.length === 0 ? (
              <EmptyText>Sin ingredientes registrados</EmptyText>
            ) : (
              <IngredientList>
                {entries.map(([id, quantity]) => {
                  const ingredient = ingredientMap.get(String(id))
                  const amount = ingredient?.unit
                    ? formatAmount(quantity, ingredient.unit)
                    : String(quantity)
                  return (
                    <IngredientRow key={id}>
                      <IngredientName>{ingredient?.name ?? id}</IngredientName>
                      <IngredientAmount>{amount}</IngredientAmount>
                    </IngredientRow>
                  )
                })}
              </IngredientList>
            )}
          </IngredientsSection>

          {steps.length > 0 && (
            <StepsSection>
              <SectionLabel>Preparación</SectionLabel>
              <StepsList>
                {steps.map((step, index) => (
                  <StepItem key={index}>
                    <StepNum>{index + 1}</StepNum>
                    <StepContent>
                      <StepText>
                        {step.description}
                        {step.optional && <OptionalTag>opcional</OptionalTag>}
                      </StepText>
                      {Array.isArray(step.ingredientIds) && step.ingredientIds.length > 0 && (
                        <StepIngredients>
                          {step.ingredientIds.map((id) => {
                            const ingredient = ingredientMap.get(String(id))
                            return ingredient ? (
                              <MiniChip key={id}>{ingredient.name}</MiniChip>
                            ) : null
                          })}
                        </StepIngredients>
                      )}
                    </StepContent>
                  </StepItem>
                ))}
              </StepsList>
            </StepsSection>
          )}
        </DrawerBody>

        <DrawerFooter>
          <FooterLeft>
            <EditButton type="button" onClick={() => onEdit(base)}>
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
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </EditButton>
          </FooterLeft>
          <ToggleWrap>
            <ToggleLabel>{base.active ? 'Activo' : 'Inactivo'}</ToggleLabel>
            <Switch
              checked={base.active}
              disabled={togglingId === base.id}
              onChange={(active) => onToggleActive(base, active)}
            />
          </ToggleWrap>
        </DrawerFooter>
      </Panel>
    </>,
    document.body,
  )
}

export default BaseDetail
