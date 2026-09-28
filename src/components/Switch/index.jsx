import { Track, Knob } from './styles.js'

/**
 * Interruptor accesible (switch) para alternar un valor booleano.
 *
 * @param {object} props - Propiedades del interruptor.
 * @param {boolean} props.checked - Estado actual.
 * @param {Function} props.onChange - Callback al alternar el estado.
 * @param {boolean} [props.disabled=false] - Deshabilita el interruptor.
 * @param {string} [props.label='Cambiar estado'] - Etiqueta accesible.
 * @returns {JSX.Element} Interruptor estilizado.
 */
function Switch({ checked, onChange, disabled = false, label = 'Cambiar estado' }) {
  return (
    <Track
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      $checked={checked}
      onClick={() => onChange(!checked)}
    >
      <Knob $checked={checked} />
    </Track>
  )
}

export default Switch
