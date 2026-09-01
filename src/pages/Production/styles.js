import styled from 'styled-components'
import { NavLink } from 'react-router'
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

export const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`

export const DateTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #4f172a;
`

export const DateGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Count = styled.p`
  font-size: 13px;
  color: var(--color-text-muted);
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
  background: ${({ $error }) => ($error ? '#dc2626' : 'var(--color-text)')};
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
`

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
  padding: 14px 16px;
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
  gap: 4px;
  min-width: 0;
  flex: 1;
`

export const Name = styled.span`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
`

export const Meta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const CostText = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
`

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  padding: 2px 10px;
  border-radius: 999px;
  color: ${({ $status }) =>
    $status === 'finalizado'
      ? 'var(--color-success)'
      : $status === 'en_progreso'
        ? 'var(--color-accent)'
        : 'var(--color-text-muted)'};
  background: ${({ $status }) =>
    $status === 'finalizado'
      ? 'rgba(34, 197, 94, 0.1)'
      : $status === 'en_progreso'
        ? 'var(--color-accent-soft)'
        : 'var(--color-neutral-soft)'};

  &::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
  }
`

export const OpenLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-accent);
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const WindowNav = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`

export const WindowLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
`
