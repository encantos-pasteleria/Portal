import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 76px;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`

export const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 260px;
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

export const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr 96px 64px 84px;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const IngredientName = styled.span`
  font-size: 13px;
  color: var(--color-text);
`

export const IngredientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const IngredientStock = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const CostInput = styled.input`
  width: 100%;
  padding: 7px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

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
  width: 100%;
  padding: 7px 8px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  font: inherit;
  font-size: 12px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }

  &:disabled {
    background: var(--color-neutral-soft);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }
`

export const IngredientHint = styled.span`
  grid-column: 1 / -1;
  font-size: 12px;
  color: var(--color-text-muted);
`

export const HelperText = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
`

export const IngredientError = styled.span`
  grid-column: 1 / -1;
  font-size: 12px;
  color: var(--color-danger);
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`

/* ---------- Sección (card con encabezado) ---------- */

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

export const Spacer = styled.div`
  flex: 1;
`

export const AddIngredientWrap = styled.div`
  display: flex;
  justify-content: flex-start;
`

