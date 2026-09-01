import Button from '../../../../components/Button/index.jsx'
import { Toolbar, SearchWrap, SearchIcon, Input, FilterSelect } from './styles.js'

/**
 * Barra de herramientas de compras (búsqueda, filtros y alta).
 *
 * @param {object} props - Propiedades de la barra.
 * @param {string} props.search - Texto de búsqueda actual.
 * @param {Function} props.onSearchChange - Callback al cambiar la búsqueda.
 * @param {Array} [props.ingredients=[]] - Ingredientes para el filtro.
 * @param {string} props.ingredientFilter - Id del ingrediente filtrado ('' = todos).
 * @param {Function} props.onIngredientFilterChange - Callback al cambiar el filtro por ingrediente.
 * @param {Array} [props.suppliers=[]] - Proveedores para el filtro.
 * @param {string} props.supplierFilter - Id del proveedor filtrado ('' = todos).
 * @param {Function} props.onSupplierFilterChange - Callback al cambiar el filtro por proveedor.
 * @param {Function} props.onAdd - Callback al agregar una compra.
 * @returns {JSX.Element} Barra de herramientas.
 */
function ComprasToolbar({
  search,
  onSearchChange,
  ingredients = [],
  ingredientFilter = '',
  onIngredientFilterChange,
  suppliers = [],
  supplierFilter = '',
  onSupplierFilterChange,
  onAdd,
}) {
  return (
    <Toolbar>
      <SearchWrap>
        <SearchIcon
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </SearchIcon>
        <Input
          type="search"
          placeholder="Buscar compras..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar compras"
        />
      </SearchWrap>

      <FilterSelect
        value={ingredientFilter}
        onChange={(event) => onIngredientFilterChange(event.target.value)}
        aria-label="Filtrar por ingrediente"
      >
        <option value="">Todos los ingredientes</option>
        {ingredients.map((ingredient) => (
          <option key={ingredient.id} value={ingredient.id}>
            {ingredient.name}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        value={supplierFilter}
        onChange={(event) => onSupplierFilterChange(event.target.value)}
        aria-label="Filtrar por proveedor"
      >
        <option value="">Todos los proveedores</option>
        <option value="__none__">Sin proveedor</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </FilterSelect>

      <Button type="button" onClick={onAdd}>
        + Agregar compra
      </Button>
    </Toolbar>
  )
}

export default ComprasToolbar
