import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
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

export const Count = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
`

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
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

export const Toast = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--color-text);
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
`
