import { SidebarContainer, Brand, Nav, FooterLink, StyledNavLink } from './styles.js'

/**
 * Menú lateral de navegación (tablet y escritorio).
 *
 * @param {object} props - Propiedades de la barra lateral.
 * @param {Array} props.items - Elementos de navegación del menú.
 * @param {object} props.footerLink - Enlace inferior (cambio de sección/layout).
 * @returns {JSX.Element} Barra lateral con enlaces de navegación.
 */
function Sidebar({ items, footerLink }) {
  return (
    <SidebarContainer>
      <Brand>
        <span>Encantos</span>
      </Brand>
      <Nav>
        {items.map((item) => (
          <StyledNavLink
            key={item.path}
            to={item.path}
            end={item.end}
          >
            {item.label}
          </StyledNavLink>
        ))}
        {footerLink && (
          <FooterLink to={footerLink.to} end={footerLink.end}>
            {footerLink.label}
          </FooterLink>
        )}
      </Nav>
    </SidebarContainer>
  )
}

export default Sidebar
