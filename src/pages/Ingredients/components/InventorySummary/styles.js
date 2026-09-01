import styled from 'styled-components'

const toneStyles = {
  total: { color: 'var(--color-accent)', background: 'var(--color-accent-soft)' },
  low: { color: 'var(--color-warning)', background: 'var(--color-warning-soft)' },
  out: { color: 'var(--color-danger)', background: 'var(--color-danger-soft)' },
}

export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
`

export const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex-shrink: 0;
  color: ${({ $tone }) => toneStyles[$tone].color};
  background: ${({ $tone }) => toneStyles[$tone].background};
`

export const StatText = styled.div`
  display: flex;
  flex-direction: column;
`

export const StatValue = styled.span`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
`

export const StatLabel = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`
