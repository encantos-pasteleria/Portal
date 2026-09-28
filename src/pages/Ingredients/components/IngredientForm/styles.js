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

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const Hint = styled.span`
  font-size: 12px;
  color: var(--color-text-muted);
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
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`
