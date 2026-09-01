import { NavLink } from 'react-router'
import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const SidebarContainer = styled.aside`
  display: none;

  @media (min-width: ${breakpoints.tabletMin}) {
    display: flex;
    flex-direction: column;
    width: var(--sidebar-width-tablet);
    flex-shrink: 0;
    background: var(--color-sidebar);
    border-right: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    height: 100vh;
  }

  @media (min-width: ${breakpoints.desktopMin}) {
    width: var(--sidebar-width);
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px 0 20px;
  height: var(--header-height);
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
`

export const Nav = styled.nav`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  padding: 12px 10px;
`

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    background-color: var(--color-accent-hover);
    color: var(--color-text);
  }

  &.active {
    background-color: var(--color-accent-soft);
    color: var(--color-accent);
  }
`

export const FooterLink = styled(NavLink)`
  display: flex;
  align-items: center;
  margin-top: auto;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    background-color: var(--color-accent-hover);
    color: var(--color-text);
  }
`
