import Button from '../../../../components/Button/index.jsx'
import Switch from '../../../../components/Switch/index.jsx'
import StockBadge from '../StockBadge/index.jsx'
import { formatAmount } from '../../../../utils/units.js'
import { List, Row, Main, Name, Meta, Info, StockText, Actions } from './styles.js'

/**
 * Vista en lista de los ingredientes.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Ingredientes a mostrar.
 * @param {Function} props.onEdit - Callback al editar un ingrediente.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del ingrediente en proceso de cambio.
 * @returns {JSX.Element} Lista de ingredientes.
 */
function IngredientsList({ items, onEdit, onToggleActive, togglingId }) {
  return (
    <List>
      {items.map((item) => (
        <Row key={item.id ?? item.name}>
          <Main>
            <Name>{item.name}</Name>
            <Meta>{item.unit}</Meta>
          </Main>
          <Info>
            <StockBadge stock={item.stock} minStock={item.minStock} />
            <StockText>{formatAmount(item.stock, item.unit)}</StockText>
          </Info>
          <Actions>
            <Button variant="ghost" onClick={() => onEdit(item)}>
              Editar
            </Button>
            <Switch
              checked={item.active}
              disabled={togglingId === item.id}
              onChange={(active) => onToggleActive(item, active)}
            />
          </Actions>
        </Row>
      ))}
    </List>
  )
}

export default IngredientsList
