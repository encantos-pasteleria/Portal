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
  gap: 10px 14px;
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    border-color: var(--color-accent-hover);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  }

  @media (min-width: ${breakpoints.tabletMin}) {
    flex-wrap: nowrap;
  }
`

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`

export const Name = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
`

export const Meta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const StockText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  min-width: 52px;
  text-align: right;
  white-space: nowrap;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;

  @media (min-width: ${breakpoints.tabletMin}) {
    width: auto;
    justify-content: flex-end;
    margin-left: auto;
  }
`
