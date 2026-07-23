import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { YearPoint } from '../lib/buy'
import { fmtCad, fmtCadCompact, fmtCadSigned, fmtPct } from '../lib/format'

/** Chart chrome — recessive grid and muted axis ink on the warm card surface. */
const GRID = '#ece6d8'
const AXIS_INK = '#8b8578'
const BASELINE = '#d4cdbc'
export const SERIES_BLUE = '#1c5cab'
export const SERIES_BRASS = '#c96f1e'
/** Ordinal 3-step blue ramp (validated light→dark) for the vacancy scenarios. */
const ORDINAL_BLUES = ['#86b6ef', '#3987e5', '#1c5cab']

const axisTick = { fill: AXIS_INK, fontSize: 11, fontFamily: 'Public Sans, sans-serif' }

function TooltipShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-card px-3 py-2 shadow-md">
      {children}
    </div>
  )
}

function TooltipRow({
  color,
  label,
  value,
}: {
  color?: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-[12px]">
      <span className="flex items-center gap-1.5 text-ink-soft">
        {color && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: color }}
          />
        )}
        {label}
      </span>
      <span className="font-mono font-medium text-navy-900 tabular-nums">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Buy: 10-year projection — equity vs cumulative cash flow            */
/* ------------------------------------------------------------------ */

export function ProjectionChart({ data }: { data: YearPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="year"
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: BASELINE }}
          tickFormatter={(y: number) => (y === 0 ? 'Now' : `Yr ${y}`)}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtCadCompact}
          width={52}
        />
        <Tooltip
          cursor={{ stroke: BASELINE, strokeDasharray: '3 3' }}
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload as YearPoint
            return (
              <TooltipShell>
                <p className="mb-1 text-[11px] font-semibold text-ink-muted">
                  {label === 0 ? 'At purchase' : `Year ${label}`}
                </p>
                <TooltipRow color={SERIES_BLUE} label="Equity" value={fmtCad(p.equity)} />
                <TooltipRow
                  color={SERIES_BRASS}
                  label="Cum. cash flow"
                  value={fmtCadSigned(p.cumulativeCashFlow)}
                />
              </TooltipShell>
            )
          }}
        />
        <ReferenceLine y={0} stroke={BASELINE} />
        <Line
          type="monotone"
          dataKey="equity"
          stroke={SERIES_BLUE}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Equity"
        />
        <Line
          type="monotone"
          dataKey="cumulativeCashFlow"
          stroke={SERIES_BRASS}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          name="Cumulative cash flow"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ */
/* Buy: cash flow vs mortgage rate sensitivity                         */
/* ------------------------------------------------------------------ */

export function SensitivityChart({
  data,
  currentRate,
  currentCashFlow,
}: {
  data: { rate: number; cashFlow: number }[]
  currentRate: number
  currentCashFlow: number
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: 4 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="rate"
          tick={axisTick}
          tickLine={false}
          axisLine={{ stroke: BASELINE }}
          tickFormatter={(r: number) => `${(r * 100).toFixed(1)}%`}
          interval={3}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtCadCompact}
          width={52}
        />
        <Tooltip
          cursor={{ stroke: BASELINE, strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload as { rate: number; cashFlow: number }
            return (
              <TooltipShell>
                <p className="mb-1 text-[11px] font-semibold text-ink-muted">
                  Rate {fmtPct(p.rate, 2)}
                </p>
                <TooltipRow
                  color={SERIES_BLUE}
                  label="Cash flow / mo"
                  value={fmtCadSigned(p.cashFlow)}
                />
              </TooltipShell>
            )
          }}
        />
        <ReferenceLine
          y={0}
          stroke={AXIS_INK}
          strokeDasharray="4 3"
          label={{
            value: 'break-even',
            position: 'insideBottomLeft',
            fill: AXIS_INK,
            fontSize: 10,
          }}
        />
        <Line
          type="monotone"
          dataKey="cashFlow"
          stroke={SERIES_BLUE}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <ReferenceDot
          x={currentRate}
          y={currentCashFlow}
          r={5}
          fill={SERIES_BRASS}
          stroke="#fdfcf9"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ */
/* Sell: sell now vs hold 5 more years                                 */
/* ------------------------------------------------------------------ */

export function SellCompareChart({
  sellNow,
  holdFiveYears,
}: {
  sellNow: number
  holdFiveYears: number
}) {
  const data = [
    { name: 'Sell now', value: sellNow },
    { name: 'Hold 5 more years', value: holdFiveYears },
  ]
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 26, right: 12, bottom: 0, left: 4 }} barCategoryGap="32%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ ...axisTick, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: BASELINE }}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtCadCompact}
          width={52}
        />
        <Tooltip
          cursor={{ fill: 'rgba(28,92,171,0.06)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload as { name: string; value: number }
            return (
              <TooltipShell>
                <TooltipRow label={p.name} value={fmtCadSigned(p.value)} />
              </TooltipShell>
            )
          }}
        />
        <ReferenceLine y={0} stroke={BASELINE} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={110}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? SERIES_BLUE : '#6da7ec'} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) => fmtCadSigned(Number(v))}
            style={{
              fill: '#1a2436',
              fontSize: 12,
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 500,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ------------------------------------------------------------------ */
/* Rent: annual revenue at three vacancy scenarios                     */
/* ------------------------------------------------------------------ */

export function VacancyChart({
  scenarios,
}: {
  scenarios: { vacancyPct: number; annualRevenue: number }[]
}) {
  const data = scenarios.map((s) => ({
    name: `${(s.vacancyPct * 100).toFixed(0)}% vacancy`,
    value: s.annualRevenue,
  }))
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 26, right: 12, bottom: 0, left: 4 }} barCategoryGap="30%">
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ ...axisTick, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: BASELINE }}
        />
        <YAxis
          tick={axisTick}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtCadCompact}
          width={52}
        />
        <Tooltip
          cursor={{ fill: 'rgba(28,92,171,0.06)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload as { name: string; value: number }
            return (
              <TooltipShell>
                <TooltipRow label={p.name} value={fmtCad(p.value)} />
              </TooltipShell>
            )
          }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={90}>
          {data.map((_, i) => (
            <Cell key={i} fill={ORDINAL_BLUES[i]} />
          ))}
          <LabelList
            dataKey="value"
            position="top"
            formatter={(v) => fmtCad(Number(v))}
            style={{
              fill: '#1a2436',
              fontSize: 12,
              fontFamily: 'IBM Plex Mono, monospace',
              fontWeight: 500,
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
