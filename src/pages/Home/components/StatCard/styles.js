import styled from 'styled-components'

const tones = {
  primary: { color: 'var(--color-accent)', background: 'var(--color-accent-soft)' },
  success: { color: 'var(--color-success)', background: 'var(--color-success-soft)' },
  warning: { color: 'var(--color-warning)', background: 'var(--color-warning-soft)' },
  danger: { color: 'var(--color-danger)', background: 'var(--color-danger-soft)' },
  neutral: { color: 'var(--color-text)', background: 'var(--color-neutral-soft)' },
}

export const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
`

export const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 11px;
  flex-shrink: 0;
  color: ${({ $tone }) => tones[$tone].color};
  background: ${({ $tone }) => tones[$tone].background};
`

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const Value = styled.span`
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.01em;
`

export const Label = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Sub = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`
