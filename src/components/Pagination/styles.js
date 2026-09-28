import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
`

export const Button = styled.button`
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    color: var(--color-text);
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &.current {
    background: var(--color-accent-soft);
    color: var(--color-accent);
    font-weight: 600;
  }
`

export const Ellipsis = styled.span`
  min-width: 32px;
  text-align: center;
  color: var(--color-text-muted);
`
