import { Outlet } from 'react-router'
import Sidebar from '../Sidebar/index.jsx'
import BottomNav from '../BottomNav/index.jsx'
import Settings from '../Settings/index.jsx'
import { operationalMenu, catalogMenu } from '../../navigation/menuItems.js'
import { Layout, Column, Header, HeaderBrand, Main } from './styles.js'

/**
 * Estructura general de la aplicación (barra lateral, cabecera y contenido).
 *
 * @param {object} props - Propiedades del layout.
 * @param {string} [props.variant='operational'] - Variante del layout:
 *   'operational' (tema claro) o 'catalog' (tema gris).
 * @returns {JSX.Element} Diseño con menú lateral (escritorio), menú inferior
 *   (móvil) y área de contenido.
 */
function AppLayout({ variant = 'operational' }) {
  const isCatalog = variant === 'catalog'
  const menu = isCatalog ? catalogMenu : operationalMenu

  return (
    <Layout data-theme={isCatalog ? 'catalog' : undefined}>
      <Sidebar items={menu.items} footerLink={menu.footerLink} />
      <Column>
        <Header>
          <HeaderBrand>Encantos</HeaderBrand>
        </Header>
        <Main>
          <Outlet />
        </Main>
        <BottomNav items={menu.items} footerLink={menu.footerLink} />
      </Column>
      {isCatalog && <Settings />}
    </Layout>
  )
}

export default AppLayout
