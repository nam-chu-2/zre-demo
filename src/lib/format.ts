/** Formatting helpers — all currency is CAD with no decimals. */

const cad = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
})

/** "$1,646" — CAD, no decimals. */
export function fmtCad(value: number): string {
  if (!Number.isFinite(value)) return '—'
  return cad.format(Math.round(value))
}

/** "$1,646" or "−$1,646" with a typographic minus. */
export function fmtCadSigned(value: number): string {
  if (!Number.isFinite(value)) return '—'
  const s = cad.format(Math.abs(Math.round(value)))
  return value < 0 ? `−${s}` : s
}

/** "4.2%" from a decimal fraction (0.042). */
export function fmtPct(fraction: number, decimals = 1): string {
  if (!Number.isFinite(fraction)) return '—'
  return `${(fraction * 100).toFixed(decimals)}%`
}

/** Compact axis money: "$450k", "$1.2M". */
export function fmtCadCompact(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '−' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`
  return `${sign}$${Math.round(abs)}`
}
