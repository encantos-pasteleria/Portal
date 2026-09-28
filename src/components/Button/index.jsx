import { StyledButton } from './styles.js'

/**
 * Botón reutilizable con soporte de variantes visuales.
 *
 * @param {object} props - Propiedades del botón.
 * @param {string} [props.type='button'] - Tipo HTML del botón.
 * @param {'primary'|'secondary'|'ghost'} [props.variant='primary'] - Variante visual.
 * @param {React.ReactNode} props.children - Contenido del botón.
 * @returns {JSX.Element} Botón estilizado.
 */
function Button({ type = 'button', variant = 'primary', children, ...props }) {
  return (
    <StyledButton type={type} $variant={variant} {...props}>
      {children}
    </StyledButton>
  )
}

export default Button
