import styled from 'styled-components'

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
`

export const IngredientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const IngredientName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`

export const IngredientAmount = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const SupplierSelect = styled.select`
  max-width: 100%;
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 12px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const CostValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 72px;
`

export const NoSupplier = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const TotalRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
`

export const TotalLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const TotalLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`

export const TotalValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
`

export const TotalSub = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
  padding: 16px 0;
`
