import { Reveal, SectionHeading } from './ui'

const PHASES = [
  {
    phase: 'Phase 1',
    status: 'this demo',
    title: 'Dynamic decision support',
    body: 'The Number Checker rebuilt as a live tool: buy, sell and rent analysis with instant what-if scenarios.',
    current: true,
  },
  {
    phase: 'Phase 2',
    status: 'next',
    title: 'Rent prediction models',
    body: 'Replace demo benchmarks with models trained on live Ottawa listings — suggested rents backed by the actual market, updated continuously.',
    current: false,
  },
  {
    phase: 'Phase 3',
    status: 'planned',
    title: 'Vacancy & appreciation forecasts',
    body: 'Forecast vacancy risk and neighbourhood appreciation, so buy and sell timing uses predicted growth instead of a hand-set assumption.',
    current: false,
  },
  {
    phase: 'Phase 4',
    status: 'planned',
    title: 'Portfolio Monte Carlo',
    body: 'Simulate thousands of market paths across the whole ZRE portfolio to see the range of outcomes — and the moves that hold up in all of them.',
    current: false,
  },
]

export function Roadmap() {
  return (
    <section id="roadmap" className="scroll-mt-16 border-t border-line bg-card py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionHeading
            eyebrow="What's next"
            title="This demo is the first step, not the destination"
            lede="Each phase builds on the same engine you just used — the architecture is already in place for what comes next."
          />
        </Reveal>

        <div className="mt-14 grid gap-0 md:grid-cols-4">
          {PHASES.map((p, i) => (
            <Reveal key={p.phase} delay={i * 120}>
              <div className="relative flex h-full flex-col px-1 pb-2 md:px-5">
                {/* timeline rail */}
                <div className="flex items-center" aria-hidden>
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                      p.current
                        ? 'border-brass-500 bg-brass-500'
                        : 'border-navy-600 bg-card'
                    }`}
                  />
                  {i < PHASES.length - 1 && (
                    <span className="ml-2 hidden h-[2px] flex-1 bg-line md:block" />
                  )}
                </div>
                <p
                  className={`mt-4 text-[11px] font-semibold tracking-[0.18em] uppercase ${
                    p.current ? 'text-brass-700' : 'text-ink-muted'
                  }`}
                >
                  {p.phase} · {p.status}
                </p>
                <h3 className="mt-2 font-display text-xl leading-snug text-navy-900">
                  {p.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
