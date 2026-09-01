import { Card, Icon, Text, Value, Label, Sub } from './styles.js'

/**
 * Tarjeta de indicador (KPI) del dashboard.
 *
 * @param {object} props - Propiedades del indicador.
 * @param {string} props.tone - Tono visual ('primary' | 'success' | 'warning' | 'danger' | 'neutral').
 * @param {JSX.Element} props.icon - Ícono del indicador.
 * @param {string|number} props.value - Valor principal.
 * @param {string} props.label - Etiqueta del indicador.
 * @param {string} [props.sub] - Texto secundario opcional.
 * @returns {JSX.Element} Tarjeta con el indicador.
 */
function StatCard({ tone, icon, value, label, sub }) {
  return (
    <Card>
      <Icon $tone={tone}>{icon}</Icon>
      <Text>
        <Value>{value}</Value>
        <Label>{label}</Label>
        {sub && <Sub>{sub}</Sub>}
      </Text>
    </Card>
  )
}

export default StatCard
