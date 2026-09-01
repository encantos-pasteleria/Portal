import { DonutWrap, DonutSvg, DonutCenter, DonutValue, DonutLabel } from './styles.js'

/**
 * Gráfico de dona con la distribución del stock (normal, bajo, agotado).
 *
 * @param {object} props - Propiedades del gráfico.
 * @param {number} props.normal - Cantidad de ingredientes con stock normal.
 * @param {number} props.low - Cantidad de ingredientes con stock bajo.
 * @param {number} props.out - Cantidad de ingredientes agotados.
 * @returns {JSX.Element} Dona con el total en el centro.
 */
function StockDonut({ normal, low, out }) {
  const total = normal + low + out
  const size = 132
  const stroke = 16
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const segments = [
    { value: normal, color: 'var(--color-success)' },
    { value: low, color: 'var(--color-warning)' },
    { value: out, color: 'var(--color-danger)' },
  ]

  let offset = 0

  return (
    <DonutWrap>
      <DonutSvg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-neutral-soft)"
          strokeWidth={stroke}
        />
        {total > 0 &&
          segments.map((segment, index) => {
            const length = (segment.value / total) * circumference
            const dash = `${length} ${circumference - length}`
            const node = (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            )
            offset += length
            return node
          })}
      </DonutSvg>
      <DonutCenter>
        <DonutValue>{total}</DonutValue>
        <DonutLabel>ingredientes</DonutLabel>
      </DonutCenter>
    </DonutWrap>
  )
}

export default StockDonut
