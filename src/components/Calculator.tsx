import { useState } from 'react'
import { BuyTab } from './BuyTab'
import { RentTab } from './RentTab'
import { SellTab } from './SellTab'
import { Reveal, SectionHeading } from './ui'

type Tab = 'buy' | 'sell' | 'rent'

const TABS: { id: Tab; label: string; hint: string }[] = [
  { id: 'buy', label: 'Buy', hint: 'Does this property pay for itself?' },
  { id: 'sell', label: 'Sell', hint: 'What do we actually walk away with?' },
  { id: 'rent', label: 'Rent', hint: 'What should this unit list for?' },
]

export function Calculator() {
  const [tab, setTab] = useState<Tab>('buy')

  return (
    <section id="calculator" className="scroll-mt-16 bg-paper py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="The calculator"
            title="Zapp's Number Checker, made dynamic"
            lede="The same math as the spreadsheet — now every number reacts the moment an assumption moves. No formulas to maintain, no cells to break."
          />
        </Reveal>

        <Reveal delay={100}>
          <div
            role="tablist"
            aria-label="Calculator mode"
            className="mx-auto mt-10 flex max-w-xl overflow-hidden rounded-xl border border-line bg-card shadow-sm"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 px-2 py-3 text-center transition-colors ${
                  tab === t.id
                    ? 'bg-navy-900 text-paper'
                    : 'text-ink-soft hover:bg-line-soft'
                }`}
              >
                <span className="block text-[15px] font-semibold">{t.label}</span>
                <span
                  className={`mt-0.5 hidden text-[11px] sm:block ${
                    tab === t.id ? 'text-brass-300' : 'text-ink-muted'
                  }`}
                >
                  {t.hint}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-8">
          {tab === 'buy' && <BuyTab />}
          {tab === 'sell' && <SellTab />}
          {tab === 'rent' && <RentTab />}
        </div>
      </div>
    </section>
  )
}
