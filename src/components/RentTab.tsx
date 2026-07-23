import { useMemo, useState } from 'react'
import { NEIGHBOURHOODS } from '../data/neighbourhoods'
import type { UnitType } from '../data/types'
import { analyzeRent, TYPICAL_SIZE_SQFT, UNIT_TYPE_LABELS } from '../lib/rent'
import { fmtCad, fmtCadSigned } from '../lib/format'
import { VacancyChart } from './charts'
import { ChartCard, SelectField, SliderField, ToggleField } from './ui'

export function RentTab() {
  const [unitType, setUnitType] = useState<UnitType>('twoBed')
  const [sizeSqft, setSizeSqft] = useState(TYPICAL_SIZE_SQFT.twoBed)
  const [hoodId, setHoodId] = useState('centretown')
  const [parking, setParking] = useState(false)
  const [utilities, setUtilities] = useState(false)

  const neighbourhood =
    NEIGHBOURHOODS.find((n) => n.id === hoodId) ?? NEIGHBOURHOODS[0]

  const out = useMemo(
    () =>
      analyzeRent({
        unitType,
        sizeSqft,
        neighbourhood,
        parkingIncluded: parking,
        utilitiesIncluded: utilities,
      }),
    [unitType, sizeSqft, neighbourhood, parking, utilities],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="space-y-4 rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(11,27,51,0.04)] self-start">
        <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
          The unit
        </p>
        <SelectField
          label="Unit type"
          value={unitType}
          onChange={(v) => {
            const t = v as UnitType
            setUnitType(t)
            setSizeSqft(TYPICAL_SIZE_SQFT[t])
          }}
          options={Object.entries(UNIT_TYPE_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
        />
        <SliderField
          label="Size"
          value={sizeSqft}
          onChange={setSizeSqft}
          min={300}
          max={2200}
          step={10}
          format={(v) => `${v.toLocaleString()} sq ft`}
        />
        <SelectField
          label="Neighbourhood"
          value={hoodId}
          onChange={setHoodId}
          options={NEIGHBOURHOODS.map((n) => ({ value: n.id, label: n.name }))}
        />
        <p className="text-[12px] leading-relaxed text-ink-soft">{neighbourhood.note}.</p>

        <p className="pt-2 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink-muted">
          Included in rent
        </p>
        <ToggleField label="Parking spot" checked={parking} onChange={setParking} />
        <ToggleField label="Utilities" checked={utilities} onChange={setUtilities} />

        <p className="rounded-lg bg-line-soft px-3 py-2 text-[11px] leading-relaxed text-ink-soft">
          Benchmark rents are illustrative demo data. Phase 2 replaces them with a
          model trained on live Ottawa listings.
        </p>
      </div>

      <div className="space-y-4">
        {/* Suggested range */}
        <div className="rounded-xl border border-line bg-card p-5 shadow-[0_1px_2px_rgba(11,27,51,0.04)]">
          <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-ink-muted">
            Suggested monthly rent
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[34px] font-medium text-navy-900 tabular-nums">
              {fmtCad(out.suggestedRent)}
            </span>
            <span className="text-[14px] text-ink-soft">
              list between {fmtCad(out.rentLow)} and {fmtCad(out.rentHigh)}
            </span>
          </div>

          <div className="mt-4 border-t border-line-soft pt-3">
            <p className="text-[12px] font-semibold text-navy-900">
              What drives this number
            </p>
            <ul className="mt-2 space-y-1.5">
              {out.drivers.map((d) => (
                <li
                  key={d.label}
                  className="flex items-baseline justify-between gap-4 text-[13px]"
                >
                  <span className="text-ink-soft">{d.label}</span>
                  <span className="font-mono font-medium text-navy-900 tabular-nums">
                    {d.amount >= 0 && d.label !== out.drivers[0].label ? '+' : ''}
                    {fmtCadSigned(d.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ChartCard
          title="Expected annual revenue by vacancy scenario"
          caption={`At the suggested rent of ${fmtCad(out.suggestedRent)}/month. Vacancy is the % of the year the unit sits empty.`}
        >
          <VacancyChart scenarios={out.vacancyScenarios} />
        </ChartCard>
      </div>
    </div>
  )
}
