import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

/* ---------- Sección (card con número) ---------- */

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 14px rgba(0, 0, 0, 0.03);
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

export const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-top: 1px;
  border-radius: 9px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
`

export const SectionTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`

export const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
`

export const SectionDescription = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
`

export const SectionMeta = styled.span`
  flex-shrink: 0;
  margin-top: 3px;
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`

export const SectionAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-top: 1px;
  padding: 6px 12px;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: var(--color-accent);
    color: #fff;
  }
`

/* ---------- Campos ---------- */

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
    background: var(--color-surface);
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.12);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const Hint = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 20px;
  align-items: start;

  @media (max-width: ${breakpoints.mobileMax}) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

/* ---------- Porciones ---------- */

export const PortionsControl = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`

export const PortionsButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const PortionsDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
`

export const PortionsInput = styled.input`
  width: 64px;
  padding: 6px 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
  font: inherit;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  outline: none;
  text-align: center;
  font-variant-numeric: tabular-nums;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    border-color: var(--color-accent);
    background: var(--color-surface);
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.12);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const PortionsLabel = styled.span`
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

/* ---------- Selector de ingredientes ---------- */

export const IngredientPicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const IngredientSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.12);
  }

  svg {
    flex-shrink: 0;
    color: var(--color-text-muted);
  }
`

export const IngredientSearchInput = styled.input`
  width: 100%;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }
`

export const IngredientColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-items: start;

  @media (min-width: ${breakpoints.tabletMin}) {
    grid-template-columns: 1fr 1.15fr;
  }
`

export const IngredientColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`

export const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const ColumnTitle = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
`

export const ColumnCount = styled.span`
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--color-neutral-soft);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 600;
`

export const AvailableList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
  padding: 2px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 10px;

    &:hover {
      background: #6b7280;
    }
  }

  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
`

export const AvailableItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  font: inherit;
  text-align: left;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 120ms ease, background-color 120ms ease;

  &:hover {
    border-color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.2);
  }
`

export const AvailableInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const AvailableName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`

export const AvailableMeta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const AddBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  transition: background-color 120ms ease, color 120ms ease;

  ${AvailableItem}:hover & {
    background: var(--color-accent);
    color: #fff;
  }
`

export const DropdownEmpty = styled.div`
  padding: 20px 12px;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
  border: 1px dashed var(--color-border);
  border-radius: 10px;
`

/* ---------- Lista de ingredientes seleccionados ---------- */

export const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 2px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 10px;

    &:hover {
      background: #6b7280;
    }
  }

  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
`

export const IngredientWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px 10px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow: inset 3px 0 0 var(--color-accent), 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    border-color: var(--color-accent-hover);
    box-shadow: inset 3px 0 0 var(--color-accent), 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`

export const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export const IngredientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const IngredientName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`

export const IngredientMeta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const QuantityGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

export const QuantityInput = styled.input`
  width: 78px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  text-align: right;
  font-variant-numeric: tabular-nums;
  transition: border-color 150ms ease;

  &:focus {
    border-color: var(--color-accent);
  }

  &:disabled {
    background: var(--color-neutral-soft);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const UnitSelect = styled.select`
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;
  transition: border-color 150ms ease;

  &:focus {
    border-color: var(--color-accent);
  }

  &:disabled {
    background: var(--color-neutral-soft);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 120ms ease;

  &:hover {
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }
`

export const IngredientError = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 16px;
  text-align: center;
  border: 1px dashed var(--color-border);
  border-radius: 10px;
`

/* ---------- Pasos de preparación ---------- */

export const StepsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const StepItem = styled.div`
  display: flex;
  gap: 14px;
`

export const StepRail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

export const StepNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
`

export const StepLine = styled.span`
  width: 2px;
  flex: 1;
  background: var(--color-border);
  margin-top: 8px;
`

export const StepCard = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg);
`

export const StepHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const StepOptional = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 12px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;

  svg {
    opacity: 0.5;
    transition: opacity 120ms ease;
  }

  &[aria-pressed='true'] {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);

    svg {
      opacity: 1;
    }
  }
`

export const StepRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 120ms ease;

  &:hover:not(:disabled) {
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`

export const StepTextarea = styled.textarea`
  width: 100%;
  min-height: 72px;
  resize: vertical;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  line-height: 1.5;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(160, 82, 45, 0.12);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const StepChipLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
`

export const StepIngredientsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const StepIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const StepChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 11px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms ease;

  svg {
    opacity: 0;
    transition: opacity 120ms ease;
  }

  &[aria-pressed='true'] {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;

    svg {
      opacity: 1;
    }
  }
`

/* ---------- Stepper (pasos) ---------- */

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
`

export const StepperItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const StepperDot = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 150ms ease;

  &[data-active='true'] {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }

  &[data-done='true'] {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

export const StepperLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;

  &[data-active='true'] {
    color: var(--color-text);
  }
`

export const StepperLine = styled.span`
  flex: 1;
  height: 1.5px;
  min-width: 12px;
  background: var(--color-border);
  border-radius: 2px;
  transition: background-color 150ms ease;

  &[data-done='true'] {
    background: var(--color-accent);
  }
`

/* ---------- Acciones ---------- */

export const Spacer = styled.div`
  flex: 1;
`

export const Actions = styled.div`
  position: sticky;
  bottom: -20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin: 4px -20px -20px;
  padding: 14px 20px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -6px 16px -12px rgba(0, 0, 0, 0.2);
`
