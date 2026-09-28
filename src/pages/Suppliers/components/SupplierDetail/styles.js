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

export const SupplierHeader = styled.div`
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

export const SupplierName = styled.h2`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.3;
`

export const SupplierContact = styled.span`
  font-size: 14px;
  color: var(--color-text-muted);
  margin-top: 2px;
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

export const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const InfoRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 14px;
  line-height: 1.5;
`

export const InfoLabel = styled.span`
  flex-shrink: 0;
  width: 80px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  padding-top: 1px;
`

export const InfoValue = styled.span`
  color: var(--color-text);
  word-break: break-word;
  min-width: 0;
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0;
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

export const IngredientTable = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  overflow: hidden;
`

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 80px 80px;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-neutral-soft);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
`

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px 80px 80px;
  gap: 8px;
  padding: 10px 14px;
  align-items: center;
  border-top: 1px solid var(--color-border);
  font-size: 13px;

  &:first-of-type {
    border-top: none;
  }
`

export const TableCell = styled.span`
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;

  ${({ $right }) =>
    $right &&
    `
    text-align: right;
    font-variant-numeric: tabular-nums;
  `}

  ${({ $bold }) =>
    $bold &&
    `
    font-weight: 600;
  `}

  ${({ $muted }) =>
    $muted &&
    `
    color: var(--color-text-muted);
  `}
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 20px;
  text-align: center;
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

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-danger);
  font: inherit;
  font-size: 13px;
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

export const ToggleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const ToggleLabel = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`
