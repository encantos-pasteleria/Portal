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
