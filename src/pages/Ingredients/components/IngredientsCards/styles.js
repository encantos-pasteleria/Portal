import styled from 'styled-components'

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 120ms ease, box-shadow 120ms ease;

  &:hover {
    border-color: var(--color-accent-hover);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }
`

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`

export const CardTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`

export const CardName = styled.h3`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
`

export const CardMeta = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`

export const StockSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const StockLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
`

export const StockRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`

export const StockAmount = styled.span`
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
`

export const StockUnit = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
`

export const Details = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const DetailLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
`

export const DetailValue = styled.span`
  font-size: 14px;
  color: var(--color-text);
`

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border);
`
