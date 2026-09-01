import { Routes, Route, Navigate } from 'react-router'
import AppLayout from './components/AppLayout/index.jsx'
import ErrorModal from './components/ErrorModal/index.jsx'
import Home from './pages/Home/index.jsx'
import Ingredients from './pages/Ingredients/index.jsx'
import Suppliers from './pages/Suppliers/index.jsx'
import Bases from './pages/Bases/index.jsx'
import Recipes from './pages/Recipes/index.jsx'
import Purchases from './pages/Purchases/index.jsx'
import Production from './pages/Production/index.jsx'
import ProductionDetail from './pages/Production/components/ProductionDetail/index.jsx'

/**
 * Componente raíz de la aplicación.
 *
 * @returns {JSX.Element} Las rutas principales del portal.
 */
function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="compras" element={<Purchases />} />
          <Route path="produccion" element={<Production />} />
          <Route path="produccion/:id" element={<ProductionDetail />} />
        </Route>
        <Route path="catalogo" element={<AppLayout variant="catalog" />}>
          <Route index element={<Navigate to="ingredientes" replace />} />
          <Route path="ingredientes" element={<Ingredients />} />
          <Route path="proveedores" element={<Suppliers />} />
          <Route path="bases" element={<Bases />} />
          <Route path="recetas" element={<Recipes />} />
        </Route>
      </Routes>
      <ErrorModal />
    </>
  )
}

export default App
