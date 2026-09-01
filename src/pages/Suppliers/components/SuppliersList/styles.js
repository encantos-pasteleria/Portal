import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const Row = styled.li`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 16px;
  padding: 14px 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
  opacity: ${({ $inactive }) => ($inactive ? 0.6 : 1)};

  &:hover {
    border-color: var(--color-accent-hover);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: ${breakpoints.tabletMin}) {
    flex-wrap: nowrap;
  }
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  flex: 1;
`

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: uppercase;
`

export const Name = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  color: ${({ $active }) =>
    $active ? 'var(--color-success)' : 'var(--color-text-muted)'};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`

export const Meta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Stats = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`

export const StatValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
`

export const StatLabel = styled.span`
  font-size: 10px;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

export const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ContactText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  white-space: nowrap;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  @media (min-width: ${breakpoints.tabletMin}) {
    width: auto;
    margin-left: auto;
  }
`

export const DetailButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;

  &:hover {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
`
