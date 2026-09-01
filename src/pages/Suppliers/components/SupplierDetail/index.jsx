import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { formatCurrency } from '../../../../utils/format.js'
import { formatAmount } from '../../../../utils/units.js'
import { getIngredientEntries } from '../../../../utils/suppliers.js'
import Switch from '../../../../components/Switch/index.jsx'
import {
  Overlay,
  Panel,
  DrawerHeader,
  DrawerTitle,
  CloseButton,
  DrawerBody,
  SupplierHeader,
  HeaderLeft,
  Avatar,
  SupplierName,
  SupplierContact,
  StatusBadge,
  InfoSection,
  InfoRow,
  InfoLabel,
  InfoValue,
  Divider,
  IngredientsHeader,
  SectionLabel,
  IngredientCount,
  IngredientTable,
  TableHeader,
  TableRow,
  TableCell,
  EmptyText,
  DrawerFooter,
  FooterLeft,
  EditButton,
  ToggleWrap,
  ToggleLabel,
} from './styles.js'

/**
 * Panel lateral con el detalle completo de un proveedor.
 *
 * @param {object} props - Propiedades del drawer.
 * @param {object} props.supplier - Proveedor a mostrar.
 * @param {Map} props.ingredientNames - Mapa de id de ingrediente a nombre.
 * @param {Array} props.allIngredients - Todos los ingredientes (para stock).
 * @param {Function} props.onClose - Callback al cerrar.
 * @param {Function} props.onEdit - Callback al editar.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del proveedor en proceso de cambio.
 * @returns {JSX.Element|null} Drawer o null.
 */
function SupplierDetail({
  supplier,
  ingredientNames,
  allIngredients = [],
  onClose,
  onEdit,
  onToggleActive,
  togglingId,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!supplier) return null

  const ingredientEntries = getIngredientEntries(supplier.ingredientPackaging)
  const ingredientMap = new Map(
    allIngredients.map((i) => [String(i.id), i]),
  )

  return createPortal(
    <>
      <Overlay onClick={onClose} />
      <Panel
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${supplier.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <DrawerHeader>
          <DrawerTitle>Detalle del proveedor</DrawerTitle>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </DrawerHeader>

        <DrawerBody>
          <SupplierHeader>
            <HeaderLeft>
              <Avatar>{supplier.name ? supplier.name.charAt(0) : '?'}</Avatar>
              <div>
                <SupplierName>{supplier.name}</SupplierName>
                <StatusBadge $active={supplier.active}>
                  {supplier.active ? 'Activo' : 'Inactivo'}
                </StatusBadge>
                {supplier.contactName && (
                  <SupplierContact>{supplier.contactName}</SupplierContact>
                )}
              </div>
            </HeaderLeft>
          </SupplierHeader>

          <InfoSection>
            {supplier.phone && (
              <InfoRow>
                <InfoLabel>Teléfono</InfoLabel>
                <InfoValue>{supplier.phone}</InfoValue>
              </InfoRow>
            )}
            {supplier.email && (
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{supplier.email}</InfoValue>
              </InfoRow>
            )}
            {supplier.address && (
              <InfoRow>
                <InfoLabel>Dirección</InfoLabel>
                <InfoValue>{supplier.address}</InfoValue>
              </InfoRow>
            )}
            {supplier.notes && (
              <InfoRow>
                <InfoLabel>Notas</InfoLabel>
                <InfoValue>{supplier.notes}</InfoValue>
              </InfoRow>
            )}
          </InfoSection>

          <Divider />

          <IngredientsHeader>
            <SectionLabel>Ingredientes</SectionLabel>
            <IngredientCount>{ingredientEntries.length}</IngredientCount>
          </IngredientsHeader>

          {ingredientEntries.length === 0 ? (
            <EmptyText>Sin ingredientes registrados</EmptyText>
          ) : (
            <IngredientTable>
              <TableHeader>
                <span>Ingrediente</span>
                <span style={{ textAlign: 'right' }}>Stock</span>
                <span style={{ textAlign: 'right' }}>Compra</span>
                <span style={{ textAlign: 'right' }}>Precio</span>
              </TableHeader>
              {ingredientEntries.map(([id, pkg]) => {
                const name = ingredientNames.get(String(id)) ?? id
                const ingredient = ingredientMap.get(String(id))
                const stock = ingredient
                  ? `${ingredient.stock} ${ingredient.unit}`
                  : '—'
                const amount = pkg
                  ? formatAmount(pkg.quantity, pkg.unit)
                  : '—'
                const price = pkg
                  ? formatCurrency(pkg.price)
                  : '—'

                return (
                  <TableRow key={id}>
                    <TableCell>{name}</TableCell>
                    <TableCell $right $muted>
                      {stock}
                    </TableCell>
                    <TableCell $right>{amount}</TableCell>
                    <TableCell $right $bold>
                      {price}
                    </TableCell>
                  </TableRow>
                )
              })}
            </IngredientTable>
          )}
        </DrawerBody>

        <DrawerFooter>
          <FooterLeft>
            <EditButton type="button" onClick={() => onEdit(supplier)}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar
            </EditButton>
          </FooterLeft>
          <ToggleWrap>
            <ToggleLabel>{supplier.active ? 'Activo' : 'Inactivo'}</ToggleLabel>
            <Switch
              checked={supplier.active}
              disabled={togglingId === supplier.id}
              onChange={(active) => onToggleActive(supplier, active)}
            />
          </ToggleWrap>
        </DrawerFooter>
      </Panel>
    </>,
    document.body,
  )
}

export default SupplierDetail
