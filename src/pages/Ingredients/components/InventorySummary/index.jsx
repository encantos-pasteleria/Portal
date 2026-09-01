import { Summary, Stat, Icon, StatText, StatValue, StatLabel } from './styles.js'

const iconProps = {
  width: 17,
  height: 17,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

/**
 * Resumen del inventario (total, stock bajo y agotados).
 *
 * @param {object} props - Propiedades del resumen.
 * @param {number} props.total - Total de ingredientes.
 * @param {number} props.lowStock - Cantidad con stock bajo.
 * @param {number} props.outOfStock - Cantidad agotados.
 * @returns {JSX.Element} Resumen del inventario.
 */
function InventorySummary({ total, lowStock, outOfStock }) {
  return (
    <Summary>
      <Stat>
        <Icon $tone="total">
          <svg {...iconProps}>
            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
            <path d="M3.3 8.3L12 13l8.7-4.7" />
            <line x1="12" y1="22" x2="12" y2="13" />
          </svg>
        </Icon>
        <StatText>
          <StatValue>{total}</StatValue>
          <StatLabel>Ingredientes</StatLabel>
        </StatText>
      </Stat>

      <Stat>
        <Icon $tone="low">
          <svg {...iconProps}>
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </svg>
        </Icon>
        <StatText>
          <StatValue>{lowStock}</StatValue>
          <StatLabel>Stock bajo</StatLabel>
        </StatText>
      </Stat>

      <Stat>
        <Icon $tone="out">
          <svg {...iconProps}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </Icon>
        <StatText>
          <StatValue>{outOfStock}</StatValue>
          <StatLabel>Agotados</StatLabel>
        </StatText>
      </Stat>
    </Summary>
  )
}

export default InventorySummary
