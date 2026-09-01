import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: var(--z-header);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--color-accent);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
  transition: filter 120ms ease;

  &:hover {
    filter: brightness(0.92);
  }

  @media (max-width: ${breakpoints.mobileMax}) {
    bottom: calc(20px + var(--tab-bar-height) + env(safe-area-inset-bottom));
  }
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }
`

export const Hint = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
`

export const SwitchLabel = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`
