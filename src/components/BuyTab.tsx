import { useMemo, useState } from 'react'
import { analyzeBuy, rateSensitivity, type BuyInputs } from '../lib/buy'
import { fmtCad, fmtCadSigned, fmtPct } from '../lib/format'
import {
  ProjectionChart,
  SensitivityChart,
  SERIES_BLUE,
  SERIES_BRASS,
} from './charts'
import { ChartCard, KpiCard, LegendChip, SliderField } from './ui'

/**
 * UI state holds human-friendly units (percent points, yearly dollars);
 * conversion to the engine's decimal fractions happens in one place below.
 */
interface BuyForm {
  purchasePrice: number
  downPaymentPct: number
  mortgageRate: number
  amortizationYears: number
  monthlyRent: number
  vacancyPct: number
  propertyTaxAnnual: number
  insuranceAnnual: number
  maintenancePctOfRent: number
  condoFeesMonthly: number
  appreciationPct: number
  rentGrowthPct: number
}

/** 277 Stoneway Drive — the exact scenario in Zapp's Number Checker v2.0. */
const STONEWAY: BuyForm = {
  purchasePrice: 565_000,
  downPaymentPct: 20,
  mortgageRate: 1.89,
  amortizationYears: 30,
  monthlyRent: 2300,
  vacancyPct: 0,
  propertyTaxAnnual: 3633,
  insuranceAnnual: 1000,
  maintenancePctOfRent: 0,
  condoFeesMonthly: 0,
  appreciationPct: 3,
  rentGrowthPct: 2.5,
}

/** A realistic 2026 Ottawa duplex scenario for contrast. */
const OTTAWA_2026: BuyForm = {
  purchasePrice: 685_000,
  downPaymentPct: 20,
  mortgageRate: 4.4,
  amortizationYears: 25,
  monthlyRent: 3300,
  vacancyPct: 3,
  propertyTaxAnnual: 5400,
  insuranceAnnual: 1600,
  maintenancePctOfRent: 5,
  condoFeesMonthly: 0,
  appreciationPct: 3,
  rentGrowthPct: 2.5,
}

function toInputs(f: BuyForm): BuyInputs {
  return {
    purchasePrice: f.purchasePrice,
    downPaymentPct: f.downPaymentPct / 100,
    mortgageRate: f.mortgageRate / 100,
    amortizationYears: f.amortizationYears,
    monthlyRent: f.monthlyRent,
    vacancyPct: f.vacancyPct / 100,
    propertyTaxAnnual: f.propertyTaxAnnual,
    insuranceAnnual: f.insuranceAnnual,
    maintenancePctOfRent: f.maintenancePctOfRent / 100,
    condoFeesMonthly: f.condoFeesMonthly,
    appreciationPct: f.appreciationPct / 100,
    rentGrowthPct: f.rentGrowthPct / 100,
  }
}

export function BuyTab() {
  const [form, setForm] = useState<BuyForm>(STONEWAY)
  const set = (patch: Partial<BuyForm>) => setForm((f) => ({ ...f, ...patch }))

  const out = useMemo(() => analyzeBuy(toInputs(form)), [form])
  const sensitivity = useMemo(() => rateSensitivity(toInputs(form)), [form])

  const isStoneway = JSON.stringify(form) === JSON.stringify(STONEWAY)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-ink-soft">Scenarios:</span>
        <button
          type="button"
          onClick={() => setForm(STONEWAY)}
          className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors ${
            isStoneway
              ? 'border-navy-900 bg-navy-900 text-paper'
              : 'border-line bg-card text-ink-soft hover:border-navy-600'
          }`}
        >
          277 Stoneway baseline
        </button>
        <button
          type="button"
          onClick={() => setForm(OTTAWA_2026)}
          className="rounded-full border border-line bg-card px-3 py-1 text-[12px] font-medium text-ink-soft transition-colors hover:border-navy-600"
        >
          Ottawa 2026 example
        </button>
        {isStoneway && (
          <span className="text-[12px] text-brass-700">
            Loaded from Zapp&rsquo;s Number Checker v2.0 — matches the spreadsheet to the cent.
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Inputs */}
        <div className="space-y-4 rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(11,27,51,0.04)] self-start">
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
            Property &amp; financing
          </p>
          <SliderField
            label="Purchase price"
            value={form.purchasePrice}
            onChange={(v) => set({ purchasePrice: v })}
            min={200_000}
            max={1_500_000}
            step={5000}
            format={fmtCad}
          />
          <SliderField
            label="Down payment"
            value={form.downPaymentPct}
            onChange={(v) => set({ downPaymentPct: v })}
            min={5}
            max={50}
            step={1}
            format={(v) => `${v}% · ${fmtCad((v / 100) * form.purchasePrice)}`}
          />
          <SliderField
            label="Mortgage rate"
            value={form.mortgageRate}
            onChange={(v) => set({ mortgageRate: v })}
            min={0.5}
            max={9}
            step={0.01}
            format={(v) => `${v.toFixed(2)}%`}
          />
          <SliderField
            label="Amortization"
            value={form.amortizationYears}
            onChange={(v) => set({ amortizationYears: v })}
            min={10}
            max={30}
            step={1}
            format={(v) => `${v} years`}
          />

          <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
            Income
          </p>
          <SliderField
            label="Monthly rent"
            value={form.monthlyRent}
            onChange={(v) => set({ monthlyRent: v })}
            min={1000}
            max={7000}
            step={25}
            format={fmtCad}
          />
          <SliderField
            label="Vacancy rate"
            value={form.vacancyPct}
            onChange={(v) => set({ vacancyPct: v })}
            min={0}
            max={15}
            step={0.5}
            format={(v) => `${v.toFixed(1)}%`}
          />

          <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
            Operating costs
          </p>
          <SliderField
            label="Property tax (yearly)"
            value={form.propertyTaxAnnual}
            onChange={(v) => set({ propertyTaxAnnual: v })}
            min={0}
            max={15_000}
            step={50}
            format={fmtCad}
          />
          <SliderField
            label="Insurance (yearly)"
            value={form.insuranceAnnual}
            onChange={(v) => set({ insuranceAnnual: v })}
            min={0}
            max={6000}
            step={50}
            format={fmtCad}
          />
          <SliderField
            label="Maintenance (% of rent)"
            value={form.maintenancePctOfRent}
            onChange={(v) => set({ maintenancePctOfRent: v })}
            min={0}
            max={15}
            step={0.5}
            format={(v) => `${v.toFixed(1)}%`}
          />
          <SliderField
            label="Condo / management fees (monthly)"
            value={form.condoFeesMonthly}
            onChange={(v) => set({ condoFeesMonthly: v })}
            min={0}
            max={1200}
            step={10}
            format={fmtCad}
          />

          <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
            Growth assumptions
          </p>
          <SliderField
            label="Annual appreciation"
            value={form.appreciationPct}
            onChange={(v) => set({ appreciationPct: v })}
            min={-2}
            max={8}
            step={0.25}
            format={(v) => `${v.toFixed(2)}%`}
          />
          <SliderField
            label="Annual rent growth"
            value={form.rentGrowthPct}
            onChange={(v) => set({ rentGrowthPct: v })}
            min={0}
            max={8}
            step={0.25}
            format={(v) => `${v.toFixed(2)}%`}
          />
        </div>

        {/* Outputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <KpiCard
              label="Cash flow / month"
              value={fmtCadSigned(out.cashFlowMonthly)}
              sub={`${fmtCadSigned(out.cashFlowAnnual)} per year`}
              tone={out.cashFlowMonthly >= 0 ? 'pos' : 'neg'}
            />
            <KpiCard
              label="Cap rate"
              value={fmtPct(out.capRate)}
              sub="NOI ÷ purchase price"
            />
            <KpiCard
              label="Cash-on-cash"
              value={fmtPct(out.cashOnCash)}
              sub={`on ${fmtCad(out.downPayment)} invested`}
              tone={out.cashOnCash >= 0 ? 'neutral' : 'neg'}
            />
            <KpiCard
              label="Break-even rent"
              value={fmtCad(out.breakEvenRent)}
              sub={`mortgage ${fmtCad(out.mortgageMonthly)}/mo`}
            />
          </div>

          <ChartCard
            title="10-year projection"
            caption="Value grows at your appreciation rate, rent at your rent-growth rate; fixed costs held flat."
            legend={
              <span className="flex gap-3">
                <LegendChip color={SERIES_BLUE} label="Equity" />
                <LegendChip color={SERIES_BRASS} label="Cumulative cash flow" />
              </span>
            }
          >
            <ProjectionChart data={out.projection} />
          </ChartCard>

          <ChartCard
            title="Rate sensitivity"
            caption={`Monthly cash flow if the mortgage rate moves ±2 points around ${form.mortgageRate.toFixed(2)}% — the dot marks your current rate.`}
          >
            <SensitivityChart
              data={sensitivity}
              currentRate={form.mortgageRate / 100}
              currentCashFlow={out.cashFlowMonthly}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
