import { Reveal, SectionHeading } from './ui'

const DECISIONS = [
  {
    id: 'buy',
    title: 'Buy',
    decision: 'Is this property worth acquiring at this price?',
    data: 'Financing terms, market rents, taxes, operating costs, appreciation history.',
    ai: 'Stress-tests every assumption at once — a rate move, a vacancy spike, a rent shift — and shows the 10-year picture before an offer goes in.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <path
          d="M6 22 20 9l14 13"
          fill="none"
          stroke="#c9a45c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 20v11h18V20"
          fill="none"
          stroke="#10254a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M17 31v-7h6v7" fill="none" stroke="#10254a" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'sell',
    title: 'Sell',
    decision: 'Is now the time to exit — and at what real, after-tax number?',
    data: 'Market value, remaining mortgage, selling costs, capital-gains treatment, appreciation outlook.',
    ai: 'Computes true net proceeds and compares selling now against holding, so timing is a calculation — not a gut call.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <path
          d="M7 30 17 20l6 5 10-11"
          fill="none"
          stroke="#10254a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 13h7v7"
          fill="none"
          stroke="#c9a45c"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'rent',
    title: 'Rent',
    decision: 'What should this unit list for to maximize revenue, not vacancy?',
    data: 'Neighbourhood benchmarks, unit type and size, inclusions, seasonal demand.',
    ai: 'Prices against the whole market at once and shows the revenue cost of guessing high (vacancy) or low (money left on the table).',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <rect
          x="8"
          y="8"
          width="24"
          height="24"
          rx="3"
          fill="none"
          stroke="#10254a"
          strokeWidth="2.5"
        />
        <path
          d="M14 8v24M8 15h24"
          stroke="#10254a"
          strokeWidth="2"
        />
        <circle cx="24" cy="24" r="4.5" fill="none" stroke="#c9a45c" strokeWidth="2.5" />
      </svg>
    ),
  },
]

export function Decisions() {
  return (
    <section id="decisions" className="scroll-mt-16 border-b border-line bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="The three decisions"
            title="Every dollar ZRE makes passes through one of three calls"
            lede="Today each call is made on paper, from memory and word-of-mouth. Each one has data behind it — and a tool that can put that data to work."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {DECISIONS.map((d, i) => (
            <Reveal key={d.id} delay={i * 120}>
              <article className="flex h-full flex-col rounded-xl border border-line bg-paper p-6">
                {d.icon}
                <h3 className="mt-4 font-display text-2xl text-navy-900">{d.title}</h3>
                <p className="mt-1.5 text-[14px] font-medium leading-snug text-ink">
                  {d.decision}
                </p>
                <dl className="mt-4 space-y-3 border-t border-line pt-4 text-[13px] leading-relaxed">
                  <div>
                    <dt className="font-semibold tracking-[0.08em] uppercase text-[11px] text-ink-muted">
                      The data behind it
                    </dt>
                    <dd className="mt-0.5 text-ink-soft">{d.data}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold tracking-[0.08em] uppercase text-[11px] text-brass-700">
                      What paper can&rsquo;t do
                    </dt>
                    <dd className="mt-0.5 text-ink-soft">{d.ai}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
