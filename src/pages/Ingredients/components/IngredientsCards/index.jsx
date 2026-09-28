import Button from '../../../../components/Button/index.jsx'
import Switch from '../../../../components/Switch/index.jsx'
import StockBadge from '../StockBadge/index.jsx'
import StockBar from '../StockBar/index.jsx'
import { formatAmount, formatAmountParts } from '../../../../utils/units.js'
import {
  Grid,
  Card,
  CardHeader,
  CardTitle,
  CardName,
  CardMeta,
  StockSection,
  StockLabel,
  StockRow,
  StockAmount,
  StockUnit,
  Details,
  Detail,
  DetailLabel,
  DetailValue,
  CardFooter,
  FooterActions,
} from './styles.js'

/**
 * Vista en tarjetas de los ingredientes.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Ingredientes a mostrar.
 * @param {Function} props.onEdit - Callback al editar un ingrediente.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {Function} props.onDelete - Callback al eliminar un ingrediente.
 * @param {string|number|null} props.togglingId - Id del ingrediente en proceso de cambio.
 * @param {string|number|null} props.deletingId - Id del ingrediente en proceso de borrado.
 * @returns {JSX.Element} Rejilla de tarjetas de ingredientes.
 */
function IngredientsCards({ items, onEdit, onToggleActive, onDelete, togglingId, deletingId }) {
  return (
    <Grid>
      {items.map((item) => {
        const stock = formatAmountParts(item.stock, item.unit)
        const minimum = formatAmount(item.minStock, item.unit)

        return (
          <Card key={item.id ?? item.name}>
            <CardHeader>
              <CardTitle>
                <CardName>{item.name}</CardName>
                <CardMeta>{item.unit}</CardMeta>
              </CardTitle>
              <StockBadge stock={item.stock} minStock={item.minStock} />
            </CardHeader>

            <StockSection>
              <StockLabel>Stock</StockLabel>
              <StockRow>
                <StockAmount>{stock.amount}</StockAmount>
                <StockUnit>{stock.unit}</StockUnit>
              </StockRow>
              <StockBar stock={item.stock} minStock={item.minStock} />
            </StockSection>

            <Details>
              <Detail>
                <DetailLabel>Mínimo</DetailLabel>
                <DetailValue>{minimum}</DetailValue>
              </Detail>
            </Details>

            <CardFooter>
              <Button variant="ghost" onClick={() => onEdit(item)}>
                Editar
              </Button>
              <FooterActions>
                <Button
                  variant="danger"
                  disabled={deletingId === item.id}
                  onClick={() => onDelete(item)}
                >
                  Eliminar
                </Button>
                <Switch
                  checked={item.active}
                  disabled={togglingId === item.id}
                  onChange={(active) => onToggleActive(item, active)}
                />
              </FooterActions>
            </CardFooter>
          </Card>
        )
      })}
    </Grid>
  )
}

export default IngredientsCards
