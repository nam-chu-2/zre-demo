const LEDGER_ROWS: [string, string][] = [
  ['Purchase Price:', '565,000'],
  ['Down Payment:', '113,000'],
  ['Interest Rate:', '1.89%'],
  ['Amortization:', '30 yrs'],
  ['Payment (P&I):', '1,645.93'],
  ['Rental Income:', '2,300'],
  ['Net / Month:', '267.99'],
]

/**
 * Hero. The signature element is ZRE's own artefact: the 277 Stoneway sheet
 * from "Zapp's Number Checker v2.0", redrawn as a paper ledger flowing into
 * a live decision panel — the whole pitch in one picture.
 */
export function Hero() {
  return (
    <header className="relative overflow-hidden bg-navy-900 text-paper">
      {/* faint contour of a property grid */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#c9a45c" strokeWidth="0.25" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
            <rect width="32" height="32" rx="6" fill="#10254a" />
            <path
              d="M8 21.5 16 9l8 12.5"
              fill="none"
              stroke="#c9a45c"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display text-lg tracking-wide">
            Zappavigna <span className="text-brass-400">Real Estate</span>
          </span>
        </span>
        <div className="hidden gap-6 text-[13px] text-paper/70 sm:flex">
          <a href="#decisions" className="transition-colors hover:text-paper">
            The three decisions
          </a>
          <a href="#calculator" className="transition-colors hover:text-paper">
            Calculator
          </a>
          <a href="#roadmap" className="transition-colors hover:text-paper">
            Roadmap
          </a>
        </div>
      </nav>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-12 sm:pb-28 sm:pt-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="text-[12px] font-semibold tracking-[0.24em] uppercase text-brass-400">
            Proof of concept · Phase 1
          </p>
          <h1 className="mt-4 font-display text-[2.6rem] leading-[1.08] sm:text-[3.4rem]">
            Decision support for ZRE: buy, sell, and rent with{' '}
            <em className="text-brass-300 not-italic underline decoration-brass-600/60 decoration-2 underline-offset-8">
              data
            </em>
            , not guesswork.
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-paper/75">
            ZRE already checks the numbers — on paper, one property at a time. This
            demo takes that same discipline and makes it instant, visual, and ready
            to grow into a full rental-intelligence platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#calculator"
              className="rounded-lg bg-brass-500 px-5 py-2.5 text-[14px] font-semibold text-navy-950 shadow transition-colors hover:bg-brass-400"
            >
              Open the calculator
            </a>
            <a
              href="#decisions"
              className="rounded-lg border border-paper/25 px-5 py-2.5 text-[14px] font-medium text-paper/85 transition-colors hover:border-paper/50"
            >
              See what it covers
            </a>
          </div>
        </div>

        {/* Signature: the ledger → live panel */}
        <div className="relative mx-auto w-full max-w-md" aria-hidden>
          <div className="rotate-[-2deg] rounded-md border border-brass-300/30 bg-paper p-5 text-ink shadow-2xl">
            <div className="flex items-baseline justify-between border-b border-line pb-2">
              <span className="font-mono text-[11px] font-semibold tracking-wide text-ink-soft">
                Zapp&rsquo;s Number Checker
              </span>
              <span className="font-mono text-[10px] text-ink-muted">Ver 2.0 · 277 STONEWAY DRIVE</span>
            </div>
            <table className="mt-2 w-full">
              <tbody>
                {LEDGER_ROWS.map(([k, v]) => (
                  <tr key={k} className="border-b border-line-soft last:border-0">
                    <td className="py-1 font-mono text-[11px] text-ink-soft">{k}</td>
                    <td className="py-1 text-right font-mono text-[11px] font-medium tabular-nums">
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto -my-2 flex w-min items-center justify-center">
            <svg width="34" height="44" viewBox="0 0 34 44" className="relative z-10">
              <path
                d="M17 2v32M8 26l9 9 9-9"
                fill="none"
                stroke="#c9a45c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="relative z-10 rotate-[1deg] rounded-xl border border-brass-400/40 bg-navy-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-brass-400">
                Same numbers, live
              </span>
              <span className="flex h-2 w-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-brass-400" />
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-paper/50">Cash flow</p>
                <p className="font-mono text-[17px] font-medium text-brass-300 tabular-nums">
                  +$268<span className="text-[11px] text-paper/50">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-paper/50">Cap rate</p>
                <p className="font-mono text-[17px] font-medium text-paper tabular-nums">4.1%</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wide text-paper/50">Cash-on-cash</p>
                <p className="font-mono text-[17px] font-medium text-paper tabular-nums">2.8%</p>
              </div>
            </div>
            <p className="mt-3 border-t border-paper/10 pt-2 text-[11px] leading-relaxed text-paper/60">
              Move any assumption — every metric, chart and projection updates instantly.
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
