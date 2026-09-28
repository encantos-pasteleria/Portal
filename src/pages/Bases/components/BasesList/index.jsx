import Switch from '../../../../components/Switch/index.jsx'
import Button from '../../../../components/Button/index.jsx'
import {
  List,
  Row,
  Main,
  NameRow,
  Avatar,
  Name,
  StatusBadge,
  Meta,
  Stats,
  StatItem,
  StatValue,
  StatLabel,
  Actions,
  DetailButton,
  CostButton,
} from './styles.js'

/**
 * Vista en lista de las bases.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Bases a mostrar.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id de la base en proceso de cambio.
 * @param {Function} props.onViewDetail - Callback al ver detalles.
 * @param {Function} props.onViewCost - Callback al ver valor aproximado.
 * @param {Function} props.onDelete - Callback al eliminar una base.
 * @param {string|number|null} props.deletingId - Id de la base en proceso de borrado.
 * @returns {JSX.Element} Lista de bases.
 */
function BasesList({
  items,
  onToggleActive,
  togglingId,
  onViewDetail,
  onViewCost,
  onDelete,
  deletingId,
}) {
  return (
    <List>
      {items.map((item) => {
        const ingredientCount = Object.keys(item.ingredients ?? {}).length
        const stepCount = Array.isArray(item.steps) ? item.steps.length : 0
        const initial = item.name ? item.name.charAt(0) : '?'

        return (
          <Row key={item.id ?? item.name} $inactive={!item.active}>
            <Main>
              <NameRow>
                <Avatar>{initial}</Avatar>
                <Name>{item.name}</Name>
              </NameRow>
              <StatusBadge $active={item.active}>
                {item.active ? 'Activo' : 'Inactivo'}
              </StatusBadge>
              {item.portions != null && (
                <Meta>
                  {item.portions} {item.portions === 1 ? 'porción' : 'porciones'}
                </Meta>
              )}
            </Main>

            <Stats>
              <StatItem>
                <StatValue>{ingredientCount}</StatValue>
                <StatLabel>Ingred.</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stepCount}</StatValue>
                <StatLabel>Pasos</StatLabel>
              </StatItem>
              {item.portions != null && (
                <StatItem>
                  <StatValue>{item.portions}</StatValue>
                  <StatLabel>Porc.</StatLabel>
                </StatItem>
              )}
            </Stats>

            <Actions>
              <DetailButton type="button" onClick={() => onViewDetail(item)}>
                Detalles
              </DetailButton>
              <CostButton type="button" onClick={() => onViewCost(item)}>
                Valor aprox.
              </CostButton>
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
            </Actions>
          </Row>
        )
      })}
    </List>
  )
}

export default BasesList
