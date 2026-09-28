import { createPortal } from 'react-dom'
import {
  Overlay,
  Panel,
  Header,
  Heading,
  Title,
  Subtitle,
  CloseButton,
  Body,
} from './styles.js'

/**
 * Modal accesible renderizado mediante un portal.
 *
 * @param {object} props - Propiedades del modal.
 * @param {boolean} props.open - Indica si el modal está visible.
 * @param {string} props.title - Título del modal.
 * @param {string} [props.description] - Subtítulo descriptivo opcional.
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Ancho del modal.
 * @param {Function} props.onClose - Callback al cerrar el modal.
 * @param {React.ReactNode} props.children - Contenido del modal.
 * @returns {JSX.Element|null} Modal o null si está cerrado.
 */
function Modal({ open, title, description, onClose, size = 'md', children }) {
  if (!open) return null

  return createPortal(
    <Overlay>
      <Panel role="dialog" aria-modal="true" aria-label={title} $size={size}>
        <Header>
          <Heading>
            <Title>{title}</Title>
            {description && <Subtitle>{description}</Subtitle>}
          </Heading>
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
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Overlay>,
    document.body,
  )
}

export default Modal
