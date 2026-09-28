import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  align-items: stretch;

  @media (max-width: ${breakpoints.mobileMax}) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  opacity: ${({ $inactive }) => ($inactive ? 0.65 : 1)};

  &:hover {
    border-color: var(--color-accent-hover);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  }
`

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
`

export const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const CardName = styled.h3`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
`

export const CardContact = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ $active }) =>
    $active ? 'var(--color-success)' : 'var(--color-text-muted)'};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`

export const IngredientsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
  flex: 1;
`

export const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
`

export const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 160px;
  overflow-y: auto;
  padding-right: 8px;
  margin-right: -4px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
  
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
`

export const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`

export const IngredientName = styled.span`
  font-size: 12px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`

export const IngredientAmount = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
  white-space: nowrap;
`

export const IngredientPrice = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  padding-right: 4px;
`

export const EmptyIngredients = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 8px 0;
`

export const StatsRow = styled.div`
  display: flex;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
`

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
`

export const StatRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const StatIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  opacity: 0.7;
`

export const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
`

export const StatLabel = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const DetailButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 8px 14px;
  margin-top: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;

  &:hover {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
`

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  padding: 8px 14px;
  margin-top: 6px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-danger);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;

  &:hover:not(:disabled) {
    background: var(--color-danger-soft);
    border-color: var(--color-danger);
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`
