import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const Layout = styled.div`
  display: flex;
  min-height: 100%;
  background: var(--color-bg);
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
`

export const Header = styled.header`
  display: none;

  @media (max-width: ${breakpoints.mobileMax}) {
    display: flex;
    align-items: center;
    height: var(--header-height);
    flex-shrink: 0;
    padding: 0 16px;
    background: var(--color-sidebar);
    border-bottom: 1px solid var(--color-border);
  }
`

export const HeaderBrand = styled.span`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
`

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 40px 48px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #9ca3af;
    border-radius: 10px;
    
    &:hover {
      background: #6b7280;
    }
  }
  
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;

  @media (max-width: ${breakpoints.mobileMax}) {
    padding: 24px 20px calc(24px + var(--tab-bar-height) + env(safe-area-inset-bottom));
  }

  @media (min-width: ${breakpoints.tabletMin}) and (max-width: ${breakpoints.tabletMax}) {
    padding: 32px 32px;
  }
`
