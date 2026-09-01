import Button from '../../../../components/Button/index.jsx'
import { Toolbar, SearchWrap, SearchIcon, Input, FilterGroup, FilterButton } from './styles.js'

/**
 * Barra de herramientas de ingredientes (búsqueda, filtro por estado y alta).
 *
 * @param {object} props - Propiedades de la barra.
 * @param {string} props.search - Texto de búsqueda actual.
 * @param {Function} props.onSearchChange - Callback al cambiar la búsqueda.
 * @param {boolean} props.active - Filtro por estado (true: activos, false: inactivos).
 * @param {Function} props.onActiveChange - Callback al cambiar el filtro por estado.
 * @param {Function} props.onAdd - Callback al agregar un ingrediente.
 * @returns {JSX.Element} Barra de herramientas.
 */
function IngredientsToolbar({ search, onSearchChange, active, onActiveChange, onAdd }) {
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
          placeholder="Buscar ingredientes..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar ingredientes"
        />
      </SearchWrap>
      <FilterGroup role="group" aria-label="Filtrar por estado">
        <FilterButton type="button" $active={active} onClick={() => onActiveChange(true)}>
          Activos
        </FilterButton>
        <FilterButton type="button" $active={!active} onClick={() => onActiveChange(false)}>
          Inactivos
        </FilterButton>
      </FilterGroup>
      <Button type="button" onClick={onAdd}>
        + Agregar ingrediente
      </Button>
    </Toolbar>
  )
}

export default IngredientsToolbar
