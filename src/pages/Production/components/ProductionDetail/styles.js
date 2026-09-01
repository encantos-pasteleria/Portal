import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 760px;
  margin: 0 auto;
  padding: 8px 0 48px;
`

export const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  cursor: pointer;
  width: fit-content;

  &:hover {
    color: var(--color-accent);
  }
`

export const Sheet = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(31, 41, 51, 0.04),
    0 12px 32px rgba(31, 41, 51, 0.07);
`

export const TopRule = styled.div`
  height: 4px;
  background: var(--color-accent);
`

export const Masthead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px;
  flex-wrap: wrap;
`

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const BrandName = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-text);

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--color-accent);
    flex-shrink: 0;
  }
`

export const BrandTagline = styled.div`
  font-size: 12px;
  color: var(--color-text-muted);
  padding-left: 20px;
`

export const DocBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  text-align: right;
`

export const DocLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);
`

export const DocNumber = styled.div`
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: 0.04em;
`

export const DocDate = styled.div`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const Stamp = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 4px 12px;
  border: 2px solid currentColor;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transform: rotate(-6deg);
  color: ${({ $status }) =>
    $status === 'finalizado'
      ? 'var(--color-success)'
      : $status === 'en_progreso'
        ? 'var(--color-warning)'
        : 'var(--color-text-muted)'};
`

export const Rule = styled.div`
  height: 1px;
  background: var(--color-border);
  margin: 0 24px;
`

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  padding: 18px 24px;
`

export const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const MetaLabel = styled.span`
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
`

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  overflow-wrap: anywhere;
`

export const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 24px 20px;
`

export const ProgressLabel = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-muted);

  span:first-child {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  span:last-child {
    font-variant-numeric: tabular-nums;
  }
`

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--color-border);
  overflow: hidden;
`

export const ProgressFill = styled.div`
  height: 100%;
  background: var(--color-accent);
  transition: width 300ms ease;
  width: ${({ $percent }) => $percent}%;
`

export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 24px 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent);

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-border);
  }
`

export const BaseTabBar = styled.div`
  display: flex;
  flex: 1;
  gap: 4px;
  overflow-x: auto;
  padding: 2px 0 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    height: 0;
  }
`

export const BaseToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  border-bottom: 1px solid var(--color-border);
`

export const CompleteAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  background: var(--color-accent);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: filter 120ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const BaseTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border: none;
  border-bottom: 2px solid
    ${({ $active, $done }) =>
      $active ? 'var(--color-accent)' : $done ? 'var(--color-success)' : 'transparent'};
  background: transparent;
  color: ${({ $active, $done }) =>
    $active ? 'var(--color-accent)' : $done ? 'var(--color-success)' : 'var(--color-text-muted)'};
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: default;
  white-space: nowrap;
  margin-bottom: -1px;
`

export const StepsList = styled.ol`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 4px 24px;
  list-style: none;
`

export const StepItem = styled.li`
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  opacity: ${({ $locked }) => ($locked ? 0.45 : 1)};
  transition: opacity 200ms ease;

  &:last-child {
    border-bottom: none;
  }
`

export const StepNumber = styled.div`
  flex-shrink: 0;
  width: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $status }) =>
    $status === 'completado'
      ? 'var(--color-success)'
      : $status === 'omitido'
        ? 'var(--color-text-muted)'
        : 'var(--color-accent)'};
`

export const StepBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const StepDescription = styled.p`
  font-size: 14px;
  line-height: 1.45;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  text-decoration: ${({ $status }) => ($status === 'omitido' ? 'line-through' : 'none')};
`

export const OptionalTag = styled.span`
  margin-left: 6px;
  padding: 1px 7px;
  border: 1px solid var(--color-border);
  border-radius: 3px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`

export const StepIngredients = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const IngredientLine = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;

  &::before {
    content: '·';
    margin-right: 6px;
    color: var(--color-accent);
    font-weight: 800;
  }
`

export const StepActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  align-self: center;

  @media (max-width: ${breakpoints.mobileMax}) {
    flex-direction: column;
    align-items: flex-end;
  }
`

export const StepStatus = styled.span`
  flex-shrink: 0;
  align-self: center;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $status }) =>
    $status === 'completado' ? 'var(--color-success)' : 'var(--color-text-muted)'};
`

export const CompleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--color-success);
  border-radius: 6px;
  background: var(--color-success);
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 120ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const SkipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;

  &:hover:not(:disabled) {
    background: var(--color-neutral-soft);
    border-color: var(--color-text-muted);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px;
  border-top: 2px solid var(--color-accent);
  background: var(--color-accent-soft);
`

export const Totals = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  max-width: 260px;
`

export const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  font-size: 13px;
  color: var(--color-text-muted);
`

export const TotalValue = styled.span`
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--color-text);
`

export const GrandTotal = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding-top: 10px;
  margin-top: 4px;
  border-top: 1px solid var(--color-border);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text);
`

export const GrandTotalValue = styled.span`
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 800;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
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

export const FinishedBanner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 48px 24px;
  text-align: center;
`

export const FinishedStamp = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  border: 3px solid var(--color-success);
  border-radius: 6px;
  color: var(--color-success);
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transform: rotate(-5deg);
`

export const FinishedText = styled.p`
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
`
