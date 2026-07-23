import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Scroll-reveal wrapper (respects prefers-reduced-motion via CSS). */
export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede?: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold tracking-[0.22em] uppercase text-brass-600">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-4xl text-navy-900 sm:text-[2.75rem] leading-[1.1]">
        {title}
      </h2>
      {lede && <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">{lede}</p>}
    </div>
  )
}

/** Labelled slider with a synchronized numeric input — everything live. */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
  inputStep,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  /** Formatted display of the current value (e.g. "$565,000" or "1.89%"). */
  format: (v: number) => string
  /** Step for the typed input if finer than the slider's. */
  inputStep?: number
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
          {label}
        </label>
        <output
          htmlFor={id}
          className="font-mono text-[13px] font-medium text-navy-900 tabular-nums"
        >
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={inputStep ?? step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
      />
    </div>
  )
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 py-1"
    >
      <span className="text-[13px] font-medium text-ink-soft">{label}</span>
      <span
        className={`relative inline-flex h-[22px] w-[40px] shrink-0 items-center rounded-full transition-colors duration-150 ${
          checked ? 'bg-navy-900' : 'bg-line'
        }`}
      >
        <span
          className={`absolute h-[16px] w-[16px] rounded-full bg-card shadow-sm transition-transform duration-150 ${
            checked ? 'translate-x-[21px]' : 'translate-x-[3px]'
          }`}
        />
      </span>
    </button>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return (
    <div>
      <label htmlFor={id} className="text-[13px] font-medium text-ink-soft">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-line bg-card px-3 py-2 text-[14px] text-navy-900 shadow-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Headline metric tile. Values wear mono figures; color only marks sign. */
export function KpiCard({
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  label: string
  value: string
  sub?: string
  tone?: 'neutral' | 'pos' | 'neg'
}) {
  const valueColor =
    tone === 'pos' ? 'text-pos' : tone === 'neg' ? 'text-neg' : 'text-navy-900'
  return (
    <div className="rounded-xl border border-line bg-card px-4 py-3.5 shadow-[0_1px_2px_rgba(11,27,51,0.04)]">
      <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">
        {label}
      </p>
      <p className={`mt-1 font-mono text-[22px] font-medium tabular-nums ${valueColor}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[12px] text-ink-soft">{sub}</p>}
    </div>
  )
}

/** Card wrapper for a chart with title and optional caption. */
export function ChartCard({
  title,
  caption,
  children,
  legend,
}: {
  title: string
  caption?: string
  children: ReactNode
  legend?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-[0_1px_2px_rgba(11,27,51,0.04)] sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="text-[14px] font-semibold text-navy-900">{title}</h4>
        {legend}
      </div>
      {caption && <p className="mt-0.5 text-[12px] text-ink-soft">{caption}</p>}
      <div className="mt-3">{children}</div>
    </div>
  )
}

export function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-ink-soft">
      <span
        className="inline-block h-[3px] w-[14px] rounded-full"
        style={{ background: color }}
        aria-hidden
      />
      {label}
    </span>
  )
}
