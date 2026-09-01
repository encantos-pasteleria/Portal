import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const RowCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-neutral-soft);
`

export const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const RowBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: 13px;
  background: var(--color-accent);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
`

export const RowGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const Select = styled(Input)`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 76px;
  resize: vertical;
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

export const Hint = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
`

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;

  &:hover:not(:disabled) {
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }
`

export const AddRowWrap = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`
