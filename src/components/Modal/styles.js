import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);

  @media (min-width: ${breakpoints.tabletMin}) {
    align-items: center;
    padding: 24px;
  }
`

const sizeMap = {
  sm: '420px',
  md: '520px',
  lg: '720px',
}

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: ${({ $size }) => sizeMap[$size] ?? sizeMap.md};
  max-height: 92vh;
  background: var(--color-surface);
  border-radius: 16px 16px 0 0;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.16);

  @media (min-width: ${breakpoints.tabletMin}) {
    border-radius: 12px;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
`

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const Title = styled.h2`
  font-size: 16px;
  font-weight: 700;
`

export const Subtitle = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.4;
`

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;

  &:hover {
    background: var(--color-accent-hover);
    color: var(--color-text);
  }
`

export const Body = styled.div`
  padding: 20px;
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
`
