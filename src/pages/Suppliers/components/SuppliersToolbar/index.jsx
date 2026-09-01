import { useEffect, useRef, useState } from 'react'
import Button from '../../../../components/Button/index.jsx'
import {
  Toolbar,
  SearchWrap,
  SearchIcon,
  Input,
  FilterGroup,
  FilterButton,
  IngredientFilterWrap,
  IngredientFilterButton,
  Badge,
  Chevron,
  Dropdown,
  DropdownList,
  DropdownItem,
  Checkbox,
  EmptyText,
  DropdownFooter,
  ClearButton,
} from './styles.js'

/**
 * Barra de herramientas de proveedores (búsqueda, filtro por estado, ingredientes y alta).
 *
 * @param {object} props - Propiedades de la barra.
 * @param {string} props.search - Texto de búsqueda actual.
 * @param {Function} props.onSearchChange - Callback al cambiar la búsqueda.
 * @param {boolean} props.active - Filtro por estado (true: activos, false: inactivos).
 * @param {Function} props.onActiveChange - Callback al cambiar el filtro por estado.
 * @param {Array} [props.ingredients=[]] - Ingredientes disponibles para filtrar.
 * @param {Array} [props.ingredientFilter=[]] - Ids de ingredientes seleccionados.
 * @param {Function} props.onIngredientFilterChange - Callback al cambiar el filtro por ingredientes.
 * @param {Function} props.onAdd - Callback al agregar un proveedor.
 * @returns {JSX.Element} Barra de herramientas.
 */
function SuppliersToolbar({
  search,
  onSearchChange,
  active,
  onActiveChange,
  ingredients = [],
  ingredientFilter = [],
  onIngredientFilterChange,
  onAdd,
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  /** Alterna la selección de un ingrediente en el filtro. */
  const toggleIngredient = (id) => {
    const next = ingredientFilter.includes(id)
      ? ingredientFilter.filter((ingredientId) => ingredientId !== id)
      : [...ingredientFilter, id]
    onIngredientFilterChange(next)
  }

  /** Limpia el filtro por ingredientes. */
  const clearIngredients = () => onIngredientFilterChange([])

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
          placeholder="Buscar proveedores..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          aria-label="Buscar proveedores"
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
      <IngredientFilterWrap ref={dropdownRef}>
        <IngredientFilterButton
          type="button"
          $active={ingredientFilter.length > 0}
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((value) => !value)}
        >
          Ingredientes
          {ingredientFilter.length > 0 && <Badge>{ingredientFilter.length}</Badge>}
          <Chevron
            $open={open}
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
            <polyline points="6 9 12 15 18 9" />
          </Chevron>
        </IngredientFilterButton>
        {open && (
          <Dropdown role="listbox" aria-label="Filtrar por ingredientes">
            {ingredients.length === 0 ? (
              <EmptyText>No hay ingredientes registrados.</EmptyText>
            ) : (
              <>
                <DropdownList>
                  {ingredients.map((ingredient) => (
                    <DropdownItem key={ingredient.id} role="option" aria-selected={ingredientFilter.includes(ingredient.id)}>
                      <Checkbox
                        type="checkbox"
                        checked={ingredientFilter.includes(ingredient.id)}
                        onChange={() => toggleIngredient(ingredient.id)}
                      />
                      {ingredient.name}
                    </DropdownItem>
                  ))}
                </DropdownList>
                {ingredientFilter.length > 0 && (
                  <DropdownFooter>
                    <ClearButton type="button" onClick={clearIngredients}>
                      Limpiar filtro
                    </ClearButton>
                  </DropdownFooter>
                )}
              </>
            )}
          </Dropdown>
        )}
      </IngredientFilterWrap>
      <Button type="button" onClick={onAdd}>
        + Agregar proveedor
      </Button>
    </Toolbar>
  )
}

export default SuppliersToolbar
