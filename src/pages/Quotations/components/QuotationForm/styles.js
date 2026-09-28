import styled from 'styled-components'
import { breakpoints } from '../../../../styles/breakpoints.js'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

export const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
`

export const StepperItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

export const StepperDot = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-muted);
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 150ms ease;

  &[data-active='true'] {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
  }

  &[data-done='true'] {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }
`

export const StepperLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted);
  white-space: nowrap;

  &[data-active='true'] {
    color: var(--color-text);
  }
`

export const StepperLine = styled.span`
  flex: 1;
  height: 1.5px;
  min-width: 12px;
  background: var(--color-border);
  border-radius: 2px;
  transition: background-color 150ms ease;

  &[data-done='true'] {
    background: var(--color-accent);
  }
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Select = styled.select`
  width: 100%;
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

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`

export const BaseSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const BaseTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
`

export const SupplierRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const SupplierInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const ItemName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
`

export const ItemMeta = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const SupplierSelect = styled.select`
  width: 100%;
  padding: 9px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const SupplierCost = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
  text-align: right;
`

export const SectionAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: auto;
  padding: 7px 12px;
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms ease;

  &:hover {
    background: var(--color-accent-soft);
  }
`

export const PercentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PercentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`

export const PercentFields = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
`

export const PercentNameInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }
`

export const PercentValueWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

export const PercentValueInput = styled.input`
  width: 84px;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  text-align: right;
  outline: none;
  font-variant-numeric: tabular-nums;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const PercentSuffix = styled.span`
  position: absolute;
  right: 10px;
  font-size: 13px;
  color: var(--color-text-muted);
  pointer-events: none;
`

export const RecipePercentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const RecipePercentNote = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
`

export const RecipePercentRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border: 1px dashed var(--color-border);
  border-radius: 8px;
  background: var(--color-bg);
`

export const RecipePercentLabel = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const RecipePercentValue = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: var(--color-warning);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const ItemCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const ItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

export const ItemCost = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: var(--color-text);
  white-space: nowrap;
`

export const SupplierWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const SupplierChip = styled.span`
  padding: 2px 9px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 11px;
  font-weight: 500;
`

export const Breakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
`

export const BreakdownRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  color: ${({ $muted }) =>
    $muted ? 'var(--color-text-muted)' : 'var(--color-text)'};
  font-variant-numeric: tabular-nums;

  & strong {
    font-weight: 700;
  }

  & span:last-child {
    white-space: nowrap;
  }
`

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-accent-soft);
  font-size: 14px;
`

export const TotalValue = styled.strong`
  font-size: 16px;
`

export const Spacer = styled.div`
  flex: 1;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  flex-shrink: 0;
`

export const SectionTitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
`

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
`

export const SectionDescription = styled.p`
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.4;
`

export const SectionMeta = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`

export const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (min-width: ${breakpoints.tabletMin}) {
    flex-direction: row;
  }

  & > ${Field} {
    flex: 1;
  }
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
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

export const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;
  resize: vertical;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const BaseSearch = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text-muted);

  &:focus-within {
    border-color: var(--color-accent);
  }
`

export const BaseSearchInput = styled.input`
  flex: 1;
  padding: 10px 0;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }
`

export const AvailableList = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 220px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
`

export const AvailableItem = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-border);
  }

  &:hover {
    background: var(--color-accent-soft);
  }
`

export const AvailableInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
`

export const AvailableName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
`

export const AvailableMeta = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const AvailablePrice = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: var(--color-accent);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
`

export const AddBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  color: var(--color-accent);
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`

export const DropdownEmpty = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 14px 0;
  text-align: center;
`

export const EmptySelected = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
  padding: 6px 0;
`

export const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
`

export const SelectedInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
`

export const SelectedName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const SelectedMeta = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const QuantityInput = styled.input`
  width: 64px;
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 13px;
  color: var(--color-text);
  text-align: center;
  outline: none;
  font-variant-numeric: tabular-nums;

  &:focus {
    border-color: var(--color-accent);
  }
`

export const SelectedPrice = styled.span`
  min-width: 72px;
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  @media (max-width: ${breakpoints.mobileMax}) {
    display: none;
  }
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  flex-shrink: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }
`

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-bg);
`

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const SummaryLabel = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`

export const SummaryValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
`

export const SummaryTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid var(--color-border);

  ${SummaryLabel} {
    font-weight: 700;
    color: var(--color-text);
  }

  ${SummaryValue} {
    font-size: 16px;
    font-weight: 800;
    color: var(--color-accent);
  }
`

export const SummarySub = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`
