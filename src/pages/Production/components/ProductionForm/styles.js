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

export const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }
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

  &:focus {
    border-color: var(--color-accent);
  }
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
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

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 280px;
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

export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const ItemName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
`

export const ItemCost = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
`

export const ItemMeta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const SupplierWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const SupplierChip = styled.span`
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 500;
`

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-accent-soft);
  font-size: 14px;
`

export const TotalValue = styled.strong`
  font-size: 16px;
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

/* ---------- Paso de proveedores ---------- */

export const BaseSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const BaseTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
`

export const SupplierRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const SupplierInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const SupplierSelect = styled.select`
  width: 100%;
  padding: 9px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const SupplierCost = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: right;
`
