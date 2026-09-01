import { NavLink } from 'react-router'
import styled, { css } from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const TabBar = styled.nav`
  display: none;

  @media (max-width: ${breakpoints.mobileMax}) {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--z-header);
    height: calc(var(--tab-bar-height) + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: rgba(255, 255, 255, 0.82);
    border-top: 0.5px solid var(--color-border);
    backdrop-filter: saturate(180%) blur(20px);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
  }
`

export const TabItem = styled(NavLink)`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--color-text-muted);
  transition: color 120ms ease, background-color 120ms ease;

  &:active {
    opacity: 0.6;
  }

  &.active {
    color: var(--color-accent);
  }

  ${({ $primary }) =>
    $primary &&
    css`
      margin: 4px 6px;
      border-radius: 12px;
      color: var(--color-accent);
      background: var(--color-accent-soft);

      &.active {
        color: #fff;
        background: var(--color-accent);
      }
    `}
`

export const TabLabel = styled.span`
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
`
