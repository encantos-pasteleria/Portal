import styled from 'styled-components'

export const Wrap = styled.div`
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
`

export const Table = styled.table`
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
`

export const Th = styled.th`
  padding: 10px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  background: var(--color-neutral-soft);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
`

export const SortButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    color: var(--color-text);
  }
`

export const SortArrow = styled.span`
  font-size: 10px;
  color: var(--color-accent);
`

export const Row = styled.tr`
  &:hover {
    background: var(--color-neutral-soft);
  }
`

export const Td = styled.td`
  padding: 10px 14px;
  font-size: 14px;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  vertical-align: top;

  &:last-child {
    text-align: right;
  }
`

export const CellName = styled.span`
  display: block;
  font-weight: 700;
  color: var(--color-text);
`

export const CellSub = styled.span`
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Quantity = styled.span`
  font-weight: 700;
  color: var(--color-success);
  white-space: nowrap;
`

export const Cost = styled.span`
  white-space: nowrap;
`
