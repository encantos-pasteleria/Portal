import { NavLink } from 'react-router'
import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1160px;
  margin: 0 auto;
`

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;

  &::after {
    content: '';
    display: block;
    width: 44px;
    height: 3px;
    margin-top: 6px;
    border-radius: 999px;
    background: var(--color-accent);
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    font-size: 22px;
  }
`

export const Subtitle = styled.p`
  margin-top: -12px;
  font-size: 13px;
  color: var(--color-text-muted);
  text-transform: capitalize;
`

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${breakpoints.tabletMax}) {
    grid-template-columns: 1fr;
  }
`

export const Panel = styled.section`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
`

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
`

export const PanelTitle = styled.h2`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
`

export const PanelLink = styled(NavLink)`
  font-size: 12px;
  font-weight: 600;
  color: var(--color-accent);

  &:hover {
    text-decoration: underline;
  }
`

export const PanelBody = styled.div`
  padding: 16px;
`

export const DonutRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`

export const Legend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`

export const LegendDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
`

export const LegendLabel = styled.span`
  color: var(--color-text);
`

export const LegendValue = styled.span`
  color: var(--color-text-muted);
  font-weight: 600;
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const ItemMain = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const ItemTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ItemMeta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const ItemValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
`

const badgeTones = {
  out: { color: 'var(--color-danger)', background: 'var(--color-danger-soft)' },
  low: { color: 'var(--color-warning)', background: 'var(--color-warning-soft)' },
}

export const Badge = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: ${({ $tone }) => badgeTones[$tone].color};
  background: ${({ $tone }) => badgeTones[$tone].background};
`

export const BarListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const BarItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const BarRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
`

export const BarLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const BarSub = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
  margin-left: 6px;
  font-weight: 400;
`

export const BarValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
`

export const BarTrack = styled.div`
  height: 8px;
  border-radius: 999px;
  background: var(--color-neutral-soft);
  overflow: hidden;
`

export const BarFill = styled.div`
  height: 100%;
  width: ${({ $width }) => $width}%;
  border-radius: 999px;
  background: var(--color-accent);
  transition: width 300ms ease;
`

export const EmptyText = styled.p`
  padding: 12px 0;
  font-size: 13px;
  color: var(--color-text-muted);
  text-align: center;
`

export const StateWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 56px 16px;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 14px;
`

export const Spinner = styled.span`
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`

export const RetryButton = styled.button`
  padding: 8px 18px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: var(--color-accent-hover);
  }
`
