import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
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
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  border-radius: 8px;
`

export const AvailableItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
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
  gap: 12px;
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

export const PercentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const PercentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`
