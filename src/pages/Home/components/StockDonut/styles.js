import styled from 'styled-components'

export const DonutWrap = styled.div`
  position: relative;
  width: 132px;
  height: 132px;
  flex-shrink: 0;
`

export const DonutSvg = styled.svg`
  display: block;
`

export const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

export const DonutValue = styled.span`
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
`

export const DonutLabel = styled.span`
  font-size: 11px;
  color: var(--color-text-muted);
`
