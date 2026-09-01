import styled from 'styled-components'

const statusColors = {
  normal: 'var(--color-success)',
  low: 'var(--color-warning)',
  out: 'var(--color-danger)',
}

export const Track = styled.div`
  height: 6px;
  border-radius: 999px;
  background: var(--color-neutral-soft);
  overflow: hidden;
`

export const Fill = styled.div`
  height: 100%;
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  border-radius: 999px;
  background: ${({ $status }) => statusColors[$status]};
  transition: width 200ms ease, background-color 200ms ease;
`
