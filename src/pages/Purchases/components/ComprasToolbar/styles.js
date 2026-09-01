import styled from 'styled-components'

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const SearchWrap = styled.div`
  position: relative;
  flex: 1 1 220px;
  min-width: 200px;
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

export const FilterSelect = styled.select`
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
