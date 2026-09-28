import { formatCurrency, formatDate } from './format.js'

/** Escapa caracteres especiales para insertarlos de forma segura en HTML. */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Construye el bloque HTML del resumen de costos por receta.
 *
 * @param {Array<object>} costRecipes - Recetas costeadas de la cotización.
 * @returns {string} HTML del resumen por receta.
 */
function buildRecipesSummary(costRecipes) {
  if (!Array.isArray(costRecipes) || costRecipes.length === 0) return ''

  const blocks = costRecipes
    .map((recipe) => {
      const percentageAmount = (recipe.percentages ?? []).reduce(
        (sum, percentage) => sum + (Number(percentage.amount) || 0),
        0,
      )
      const percentageRow =
        (recipe.percentages ?? []).length > 0
          ? `
              <tr class="muted-row">
                <td>Otros ítems</td>
                <td class="num">${formatCurrency(percentageAmount)}</td>
              </tr>`
          : ''

      return `
        <div class="recipe">
          <div class="recipe-head">
            <span class="recipe-name">${escapeHtml(recipe.name)}</span>
            <span class="recipe-qty">${escapeHtml(recipe.quantity)} ${
              recipe.quantity === 1 ? 'porción' : 'porciones'
            }</span>
          </div>
          <table class="table">
            <tbody>
              <tr>
                <td>Subtotal recetas</td>
                <td class="num">${formatCurrency(recipe.subtotal)}</td>
              </tr>
              ${percentageRow}
              <tr class="strong-row">
                <td>Total receta</td>
                <td class="num">${formatCurrency(recipe.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>`
    })
    .join('')

  return `
    <section class="section">
      <h2>Costos por receta</h2>
      ${blocks}
    </section>`
}

/**
 * Construye el bloque HTML de los porcentajes propios de la cotización,
 * agrupados en una sola línea «Otros ítems» (solo el monto, sin el porcentaje).
 *
 * @param {Array<object>} percentages - Porcentajes con nombre, valor e importe.
 * @returns {string} HTML de los otros ítems de la cotización.
 */
function buildQuotationPercentages(percentages) {
  if (!Array.isArray(percentages) || percentages.length === 0) return ''

  const amount = percentages.reduce(
    (sum, percentage) => sum + (Number(percentage.amount) || 0),
    0,
  )

  return `
    <section class="section">
      <h2>Otros ítems</h2>
      <table class="table">
        <tbody>
          <tr class="muted-row">
            <td>Otros ítems</td>
            <td class="num">${formatCurrency(amount)}</td>
          </tr>
        </tbody>
      </table>
    </section>`
}

/**
 * Construye el documento HTML completo de una cotización para imprimir o
 * guardar como PDF.
 *
 * @param {object} quotation - Cotización a exportar.
 * @returns {string} Documento HTML autocontenido.
 */
export function buildQuotationDocument(quotation) {
  const recipes = quotation.items ?? []
  const costRecipes = quotation.costRecipes ?? []
  const quotationPercentages =
    (quotation.quotationCostPercentages ?? []).length > 0
      ? quotation.quotationCostPercentages
      : quotation.percentages ?? []

  const recipesRows =
    recipes.length === 0
      ? '<tr><td colspan="2" class="muted">Sin recetas asociadas</td></tr>'
      : recipes
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(row.recipeName || row.recipeId)}</td>
                <td class="num">× ${escapeHtml(row.quantity ?? 1)}</td>
              </tr>`,
          )
          .join('')

  const contactRows = [
    quotation.clientPhone
      ? `<div><span class="label">Teléfono</span> ${escapeHtml(quotation.clientPhone)}</div>`
      : '',
    quotation.clientEmail
      ? `<div><span class="label">Correo</span> ${escapeHtml(quotation.clientEmail)}</div>`
      : '',
    quotation.date
      ? `<div><span class="label">Fecha</span> ${escapeHtml(formatDate(quotation.date))}</div>`
      : '',
  ]
    .filter(Boolean)
    .join('')

  const total =
    quotation.estimatedCost != null ? formatCurrency(quotation.estimatedCost) : 'Por definir'

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Cotización · ${escapeHtml(quotation.clientName ?? '')}</title>
    <style>
      @page { size: A4; margin: 16mm; }

      * { box-sizing: border-box; }

      body {
        margin: 0;
        font-family: 'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        color: #1f2933;
        font-size: 13px;
        line-height: 1.45;
      }

      h1, h2 { margin: 0; letter-spacing: -0.02em; }

      .header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        padding-bottom: 14px;
        border-bottom: 3px solid #4f172a;
      }

      .brand { font-size: 22px; font-weight: 800; color: #4f172a; }
      .brand small {
        display: block;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #6b7280;
      }

      .doc-meta { text-align: right; }
      .doc-meta .title { font-size: 16px; font-weight: 800; }
      .doc-meta .status {
        display: inline-block;
        margin-top: 4px;
        font-size: 11px;
        font-weight: 700;
        color: ${quotation.active ? '#2f7d4f' : '#6b7280'};
      }

      .client {
        display: flex;
        flex-wrap: wrap;
        gap: 4px 24px;
        margin-top: 18px;
        padding: 14px 16px;
        background: #f6e9ed;
        border-radius: 10px;
      }
      .client .name { width: 100%; font-size: 16px; font-weight: 800; }
      .client .label {
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #6b7280;
        margin-right: 4px;
      }

      .notes {
        margin-top: 12px;
        padding: 10px 14px;
        border-left: 3px solid #e7e5e4;
        color: #6b7280;
        white-space: pre-wrap;
      }

      .section { margin-top: 22px; break-inside: avoid; }
      .section h2 {
        font-size: 12px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #4f172a;
        margin-bottom: 8px;
      }

      .table { width: 100%; border-collapse: collapse; }
      .table td, .table th {
        padding: 6px 8px;
        text-align: left;
        vertical-align: top;
        border-bottom: 1px solid #e7e5e4;
      }
      .table th {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #6b7280;
      }
      .table .num { text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }
      .table-bordered th, .table-bordered td { border: 1px solid #e7e5e4; }

      .muted { color: #6b7280; }
      .muted-row td { color: #6b7280; font-size: 12px; }
      .strong-row td { font-weight: 800; color: #1f2933; }

      .recipe { margin-top: 10px; break-inside: avoid; }
      .recipe-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
        padding: 6px 8px;
        background: #faf9f7;
        border-radius: 6px;
      }
      .recipe-name { font-weight: 700; }
      .recipe-qty { font-size: 12px; color: #6b7280; }

      .total {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24px;
        padding-top: 14px;
        border-top: 3px solid #4f172a;
      }
      .total span:first-child {
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }
      .total span:last-child { font-size: 22px; font-weight: 800; color: #4f172a; }

      .footnote { margin-top: 8px; font-size: 11px; color: #6b7280; }
      .footer {
        margin-top: 28px;
        padding-top: 10px;
        border-top: 1px solid #e7e5e4;
        font-size: 10px;
        text-align: center;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="brand">
        Encantos Pastelería
        <small>Cotización</small>
      </div>
      <div class="doc-meta">
        <div class="title">${escapeHtml(quotation.clientName ?? 'Cliente')}</div>
        <div class="status">${quotation.active ? 'Activa' : 'Inactiva'}</div>
      </div>
    </header>

    <section class="client">
      <div class="name">${escapeHtml(quotation.clientName ?? '')}</div>
      ${contactRows}
    </section>

    ${quotation.clientNotes ? `<div class="notes">${escapeHtml(quotation.clientNotes)}</div>` : ''}

    <section class="section">
      <h2>Recetas</h2>
      <table class="table">
        <tbody>${recipesRows}</tbody>
      </table>
    </section>

    ${buildRecipesSummary(costRecipes)}
    ${buildQuotationPercentages(quotationPercentages)}

    <div class="total">
      <span>Total estimado</span>
      <span>${total}</span>
    </div>

    ${quotation.hasCost === false ? '<p class="footnote">Sin costos de proveedor registrados.</p>' : ''}

    <footer class="footer">
      Documento generado el ${escapeHtml(formatDate(new Date()))} · Encantos Pastelería
    </footer>
  </body>
</html>`
}

/**
 * Exporta una cotización a PDF usando el diálogo de impresión del navegador
 * (el usuario elige «Guardar como PDF»). Se usa un iframe oculto para no
 * abandonar la aplicación.
 *
 * @param {object} quotation - Cotización a exportar.
 * @returns {void}
 */
export function exportQuotationPdf(quotation) {
  if (typeof document === 'undefined') return

  const html = buildQuotationDocument(quotation)
  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = '0'
  document.body.appendChild(iframe)

  const win = iframe.contentWindow
  const doc = win.document

  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
  }

  const print = () => {
    try {
      win.focus()
      win.print()
    } finally {
      setTimeout(cleanup, 1000)
    }
  }

  doc.open()
  doc.write(html)
  doc.close()

  if (doc.readyState === 'complete') {
    print()
  } else {
    iframe.onload = print
  }
}
