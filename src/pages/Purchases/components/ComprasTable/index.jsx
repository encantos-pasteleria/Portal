import { formatDate, formatUnitCost } from '../../../../utils/format.js'
import { formatAmount } from '../../../../utils/units.js'
import {
  Wrap,
  Table,
  Th,
  Row,
  Td,
  CellName,
  CellSub,
  Quantity,
  Cost,
  SortButton,
  SortArrow,
} from './styles.js'

const COLUMNS = [
  { key: 'date', label: 'Fecha' },
  { key: 'ingredient', label: 'Ingrediente' },
  { key: 'quantity', label: 'Cantidad' },
  { key: 'supplier', label: 'Proveedor' },
  { key: 'cost', label: 'Costo' },
]

/**
 * Tabla de compras (entradas de stock) con columnas ordenables.
 *
 * @param {object} props - Propiedades de la tabla.
 * @param {Array} props.items - Compras a mostrar.
 * @param {Map} props.ingredientMap - Mapa de id de ingrediente a objeto.
 * @param {Map} props.supplierMap - Mapa de id de proveedor a objeto.
 * @param {string} props.sortKey - Columna ordenada.
 * @param {string} props.sortDir - Dirección de orden ('asc' | 'desc').
 * @param {Function} props.onSortChange - Callback al ordenar por una columna.
 * @returns {JSX.Element} Tabla de compras.
 */
function ComprasTable({ items, ingredientMap, supplierMap, sortKey, sortDir, onSortChange }) {
  return (
    <Wrap>
      <Table>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <Th key={column.key}>
                <SortButton type="button" onClick={() => onSortChange(column.key)}>
                  {column.label}
                  {sortKey === column.key && (
                    <SortArrow>{sortDir === 'asc' ? '↑' : '↓'}</SortArrow>
                  )}
                </SortButton>
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const ingredient = ingredientMap.get(item.ingredientId)
            const supplier = item.supplierId ? supplierMap.get(item.supplierId) : null
            const amount = ingredient?.unit
              ? formatAmount(item.quantity, ingredient.unit)
              : String(item.quantity ?? '')

            return (
              <Row key={item.id ?? `${item.date}-${item.ingredientId}-${item.quantity}`}>
                <Td>{formatDate(item.date)}</Td>
                <Td>
                  <CellName>{ingredient?.name ?? item.ingredientId}</CellName>
                  {item.notes && <CellSub>{item.notes}</CellSub>}
                </Td>
                <Td>
                  <Quantity>+{amount}</Quantity>
                </Td>
                <Td>{supplier?.name ?? '—'}</Td>
                <Td>
                  <Cost>{item.cost != null ? formatUnitCost(item.cost) : '—'}</Cost>
                </Td>
              </Row>
            )
          })}
        </tbody>
      </Table>
    </Wrap>
  )
}

export default ComprasTable
