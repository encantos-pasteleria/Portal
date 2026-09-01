import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(0, 0, 0, 0.35);
  animation: fadeIn 200ms ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: calc(var(--z-modal) + 1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  background: var(--color-surface);
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.12);
  animation: slideIn 250ms cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${breakpoints.mobileMax}) {
    max-width: 100%;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
`

export const DrawerTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-muted);
`

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-soft);
    color: var(--color-text);
  }
`

export const DrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;

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

export const BaseHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
`

export const BaseName = styled.h2`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.3;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ $active }) =>
    $active ? 'var(--color-success)' : 'var(--color-text-muted)'};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
  }
`

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 12px;
  font-weight: 500;
`

export const IngredientsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const IngredientsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const SectionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
`

export const IngredientCount = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
`

export const IngredientRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
  font-size: 13px;

  &:first-of-type {
    border-top: none;
  }
`

export const IngredientName = styled.span`
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`

export const IngredientAmount = styled.span`
  flex-shrink: 0;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 20px;
  text-align: center;
`

export const StepsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const StepsList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const StepItem = styled.li`
  display: flex;
  gap: 12px;
`

export const StepNum = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
`

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const StepText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text);
  margin: 0;
`

export const OptionalTag = styled.span`
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--color-neutral-soft);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 500;
`

export const StepIngredients = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const MiniChip = styled.span`
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 500;
`

export const DrawerFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
`

export const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;

  &:hover {
    background: var(--color-accent-hover);
    border-color: var(--color-accent);
  }
`

export const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ToggleLabel = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`
