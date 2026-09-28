import { Nav, Button, Ellipsis } from './styles.js'

/**
 * Calcula la lista de páginas a mostrar, con elipses cuando hay muchas.
 *
 * @param {number} current - Página actual.
 * @param {number} total - Total de páginas.
 * @returns {(number|string)[]} Páginas y elipses ('...').
 */
function getPages(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  if (start > 2) pages.push('...')
  for (let index = start; index <= end; index += 1) pages.push(index)
  if (end < total - 1) pages.push('...')
  pages.push(total)

  return pages
}

/**
 * Controles de paginación.
 *
 * @param {object} props - Propiedades de la paginación.
 * @param {number} props.page - Página actual.
 * @param {number} props.totalPages - Total de páginas.
 * @param {Function} props.onPageChange - Callback al cambiar de página.
 * @returns {JSX.Element|null} Controles de paginación o null si hay una sola página.
 */
function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = getPages(page, totalPages)

  return (
    <Nav aria-label="Paginación">
      <Button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        Anterior
      </Button>
      {pages.map((item, index) =>
        item === '...' ? (
          <Ellipsis key={`ellipsis-${index}`}>…</Ellipsis>
        ) : (
          <Button
            key={item}
            type="button"
            className={item === page ? 'current' : undefined}
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Siguiente
      </Button>
    </Nav>
  )
}

export default Pagination
