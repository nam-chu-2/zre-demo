import { useMemo, useState } from 'react'
import { analyzeSell } from '../lib/sell'
import { fmtCad, fmtCadSigned, fmtPct } from '../lib/format'
import { SellCompareChart } from './charts'
import { ChartCard, KpiCard, SliderField } from './ui'

interface SellForm {
  originalPrice: number
  yearsHeld: number
  marketValue: number
  mortgageBalance: number
  sellingCostsPct: number
  marginalTaxRate: number
  appreciationPct: number
}

const DEFAULTS: SellForm = {
  originalPrice: 565_000,
  yearsHeld: 6,
  marketValue: 780_000,
  mortgageBalance: 380_000,
  sellingCostsPct: 5,
  marginalTaxRate: 43,
  appreciationPct: 3,
}

export function SellTab() {
  const [form, setForm] = useState<SellForm>(DEFAULTS)
  const set = (patch: Partial<SellForm>) => setForm((f) => ({ ...f, ...patch }))

  const out = useMemo(
    () =>
      analyzeSell({
        originalPrice: form.originalPrice,
        yearsHeld: form.yearsHeld,
        marketValue: form.marketValue,
        mortgageBalance: form.mortgageBalance,
        sellingCostsPct: form.sellingCostsPct / 100,
        marginalTaxRate: form.marginalTaxRate / 100,
        appreciationPct: form.appreciationPct / 100,
      }),
    [form],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="space-y-4 rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(11,27,51,0.04)] self-start">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
          The property
        </p>
        <SliderField
          label="Original purchase price"
          value={form.originalPrice}
          onChange={(v) => set({ originalPrice: v })}
          min={200_000}
          max={1_500_000}
          step={5000}
          format={fmtCad}
        />
        <SliderField
          label="Years held"
          value={form.yearsHeld}
          onChange={(v) => set({ yearsHeld: v })}
          min={1}
          max={30}
          step={1}
          format={(v) => `${v} years`}
        />
        <SliderField
          label="Current market value"
          value={form.marketValue}
          onChange={(v) => set({ marketValue: v })}
          min={200_000}
          max={2_000_000}
          step={5000}
          format={fmtCad}
        />
        <SliderField
          label="Remaining mortgage balance"
          value={form.mortgageBalance}
          onChange={(v) => set({ mortgageBalance: v })}
          min={0}
          max={1_500_000}
          step={5000}
          format={fmtCad}
        />

        <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
          Costs &amp; tax
        </p>
        <SliderField
          label="Selling costs (realtor, legal)"
          value={form.sellingCostsPct}
          onChange={(v) => set({ sellingCostsPct: v })}
          min={0}
          max={10}
          step={0.25}
          format={(v) => `${v.toFixed(2)}% · ${fmtCad((v / 100) * form.marketValue)}`}
        />
        <SliderField
          label="Marginal tax rate"
          value={form.marginalTaxRate}
          onChange={(v) => set({ marginalTaxRate: v })}
          min={20}
          max={54}
          step={0.5}
          format={(v) => `${v.toFixed(1)}%`}
        />
        <p className="text-[12px] leading-relaxed text-ink-soft">
          Canadian treatment: 50% of the capital gain is added to taxable income
          and taxed at your marginal rate.
        </p>

        <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
          Hold scenario
        </p>
        <SliderField
          label="Assumed annual appreciation"
          value={form.appreciationPct}
          onChange={(v) => set({ appreciationPct: v })}
          min={-2}
          max={8}
          step={0.25}
          format={(v) => `${v.toFixed(2)}%`}
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <KpiCard
            label="Net proceeds"
            value={fmtCadSigned(out.netProceeds)}
            sub="cash after costs, tax & payout"
            tone={out.netProceeds >= 0 ? 'pos' : 'neg'}
          />
          <KpiCard
            label="Capital gains tax"
            value={fmtCad(out.capitalGainsTax)}
            sub={`on a ${fmtCad(out.capitalGain)} gain`}
          />
          <KpiCard
            label="Total return"
            value={fmtPct(out.totalReturn)}
            sub="net of costs & tax, vs purchase"
            tone={out.totalReturn >= 0 ? 'neutral' : 'neg'}
          />
          <KpiCard
            label="Annualized return"
            value={fmtPct(out.annualizedReturn)}
            sub={`over ${form.yearsHeld} years (IRR-style)`}
          />
        </div>

        <ChartCard
          title="Sell now vs hold 5 more years"
          caption={`Net proceeds today vs after 5 years at ${form.appreciationPct.toFixed(2)}% appreciation. Conservative: assumes no further principal paydown.`}
        >
          <SellCompareChart sellNow={out.sellNow} holdFiveYears={out.holdFiveYears} />
        </ChartCard>

        <div className="rounded-xl border border-line bg-card p-5 text-[13px] leading-relaxed text-ink-soft shadow-[0_1px_2px_rgba(11,27,51,0.04)]">
          <p className="font-semibold text-navy-900">How to read this</p>
          <p className="mt-1">
            Holding {fmtCadSigned(out.holdFiveYears - out.sellNow)} more than selling
            today under these assumptions — before counting the rental cash flow those
            5 years would also generate. Phase 2 adds market-calibrated appreciation
            forecasts so this comparison uses predicted, not assumed, growth.
          </p>
        </div>
      </div>
    </div>
  )
}
