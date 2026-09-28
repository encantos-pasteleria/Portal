import styled from 'styled-components'

const variantStyles = {
  primary: `
    background: var(--color-accent);
    color: #fff;

    &:hover:not(:disabled) {
      filter: brightness(0.92);
    }
  `,
  secondary: `
    background: var(--color-surface);
    border-color: var(--color-border);
    color: var(--color-text);

    &:hover:not(:disabled) {
      background: var(--color-accent-hover);
    }
  `,
  ghost: `
    padding: 6px 10px;
    background: transparent;
    color: var(--color-accent);
    font-size: 13px;

    &:hover:not(:disabled) {
      background: var(--color-accent-soft);
    }
  `,
  danger: `
    padding: 6px 10px;
    background: transparent;
    color: var(--color-danger);
    font-size: 13px;

    &:hover:not(:disabled) {
      background: var(--color-danger-soft);
    }
  `,
}

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, filter 120ms ease;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }

  ${({ $variant }) => variantStyles[$variant] ?? variantStyles.primary}
`
