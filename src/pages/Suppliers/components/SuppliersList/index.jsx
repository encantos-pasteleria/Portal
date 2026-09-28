import { getIngredientEntries } from '../../../../utils/suppliers.js'
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
  ContactInfo,
  ContactText,
  Actions,
  DetailButton,
} from './styles.js'

/**
 * Vista en lista de los proveedores.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Proveedores a mostrar.
 * @param {Map} props.ingredientNames - Mapa de id de ingrediente a nombre.
 * @param {Function} props.onEdit - Callback al editar un proveedor.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del proveedor en proceso de cambio.
 * @param {Function} props.onViewDetail - Callback al ver detalles.
 * @param {Function} props.onDelete - Callback al eliminar un proveedor.
 * @param {string|number|null} props.deletingId - Id del proveedor en proceso de borrado.
 * @returns {JSX.Element} Lista de proveedores.
 */
function SuppliersList({
  items,
  ingredientNames,
  onToggleActive,
  togglingId,
  onViewDetail,
  onDelete,
  deletingId,
}) {
  return (
    <List>
      {items.map((item) => {
        const ingredientEntries = getIngredientEntries(item.ingredientPackaging)
        const ingredientCount = ingredientEntries.length
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
              {item.contactName && <Meta>{item.contactName}</Meta>}
            </Main>

            <Stats>
              <StatItem>
                <StatValue>{ingredientCount}</StatValue>
                <StatLabel>Ingred.</StatLabel>
              </StatItem>
            </Stats>

            <ContactInfo>
              {item.phone && <ContactText>{item.phone}</ContactText>}
              {item.email && <ContactText>{item.email}</ContactText>}
            </ContactInfo>

            <Actions>
              <DetailButton type="button" onClick={() => onViewDetail(item)}>
                Detalles
              </DetailButton>
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

export default SuppliersList
