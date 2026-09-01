import styled from 'styled-components'

const statusStyles = {
  normal: { color: 'var(--color-success)', background: 'var(--color-success-soft)' },
  low: { color: 'var(--color-warning)', background: 'var(--color-warning-soft)' },
  out: { color: 'var(--color-danger)', background: 'var(--color-danger-soft)' },
}

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ $status }) => statusStyles[$status].color};
  background: ${({ $status }) => statusStyles[$status].background};
`

export const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
`
