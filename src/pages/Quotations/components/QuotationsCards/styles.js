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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 12px;
`

export const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 0;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const Notes = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.4;
`

export const RecipesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
`

export const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
`

export const RecipeList = styled.div`
  display: flex;
  flex-direction: column;
`

export const RecipeRow = styled.div`
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

export const RecipeName = styled.span`
  font-size: 12px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
`

export const RecipeAmount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const EmptyRecipes = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 4px 0;
`

export const PercentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
`

export const PercentList = styled.div`
  display: flex;
  flex-direction: column;
`

export const PercentLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`

export const PercentLabel = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const PercentValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-warning);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const CostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg);
`

export const CostLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
`

export const CostName = styled.span`
  color: var(--color-text);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const CostSupplier = styled.span`
  color: var(--color-text-muted);
  font-size: 11px;
  white-space: nowrap;
`

export const CostAmount = styled.span`
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border);
`

export const TotalLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text);
`

export const TotalValue = styled.span`
  font-size: 16px;
  font-weight: 800;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
`

export const TotalSub = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const EditButton = styled.button`
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
