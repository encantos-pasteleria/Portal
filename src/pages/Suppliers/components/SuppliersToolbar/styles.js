import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Toolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: ${breakpoints.tabletMin}) {
    flex-direction: row;
    align-items: center;
  }
`

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;
`

export const SearchIcon = styled.svg`
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
  pointer-events: none;
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 14px 10px 38px;
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
`

export const FilterGroup = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--color-neutral-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
`

export const FilterButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 7px;
  background: ${({ $active }) => ($active ? 'var(--color-surface)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-text)' : 'var(--color-text-muted)')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    color: var(--color-text);
  }
`

export const IngredientFilterWrap = styled.div`
  position: relative;
`

export const IngredientFilterButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: ${({ $active }) => ($active ? 'var(--color-text)' : 'var(--color-text-muted)')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 120ms ease, color 120ms ease;

  &:hover {
    border-color: var(--color-accent);
    color: var(--color-text);
  }
`

export const Badge = styled.span`
  min-width: 18px;
  padding: 1px 6px;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
`

export const Chevron = styled.svg`
  flex-shrink: 0;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  transition: transform 120ms ease;
`

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  z-index: var(--z-modal);
  width: 240px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`

export const DropdownList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 6px;

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

export const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 7px;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-soft);
  }
`

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
`

export const EmptyText = styled.span`
  padding: 14px;
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
`

export const DropdownFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 6px;
  border-top: 1px solid var(--color-border);
`

export const ClearButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: var(--color-neutral-soft);
  }
`
