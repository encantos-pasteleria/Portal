import { getStockStatus } from '../../../../utils/stock.js'
import { Track, Fill } from './styles.js'

/**
 * Barra de progreso que representa el nivel de stock.
 *
 * @param {object} props - Propiedades de la barra.
 * @param {number|string} props.stock - Cantidad disponible.
 * @param {number|string} props.minStock - Stock mínimo requerido.
 * @returns {JSX.Element} Barra de nivel de stock.
 */
function StockBar({ stock, minStock }) {
  const { status, ratio } = getStockStatus(stock, minStock)

  return (
    <Track
      role="progressbar"
      aria-label="Nivel de stock"
      aria-valuenow={Math.round(ratio * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <Fill $status={status} $ratio={ratio} />
    </Track>
  )
}

export default StockBar
