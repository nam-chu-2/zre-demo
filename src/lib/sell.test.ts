import { describe, expect, it } from 'vitest'
import { analyzeSell, netProceeds } from './sell'

describe('netProceeds', () => {
  it('applies selling costs, 50% inclusion capital-gains tax, and mortgage payout', () => {
    // Value 800k, bought 565k, balance 400k, costs 5%, marginal rate 43%.
    // costs = 40,000; gain = 800k − 40k − 565k = 195,000
    // tax = 195,000 × 0.5 × 0.43 = 41,925
    // net = 800,000 − 40,000 − 41,925 − 400,000 = 318,075
    const r = netProceeds(800_000, 565_000, 400_000, 0.05, 0.43)
    expect(r.sellingCosts).toBeCloseTo(40_000, 6)
    expect(r.capitalGain).toBeCloseTo(195_000, 6)
    expect(r.capitalGainsTax).toBeCloseTo(41_925, 6)
    expect(r.netProceeds).toBeCloseTo(318_075, 6)
  })

  it('charges no tax when the sale is at a loss', () => {
    const r = netProceeds(500_000, 565_000, 300_000, 0.05, 0.43)
    expect(r.capitalGain).toBe(0)
    expect(r.capitalGainsTax).toBe(0)
    expect(r.netProceeds).toBeCloseTo(500_000 - 25_000 - 300_000, 6)
  })
})

describe('analyzeSell', () => {
  const base = {
    originalPrice: 565_000,
    yearsHeld: 8,
    marketValue: 800_000,
    mortgageBalance: 400_000,
    sellingCostsPct: 0.05,
    marginalTaxRate: 0.43,
    appreciationPct: 0.03,
  }

  it('annualizes the total return geometrically', () => {
    const out = analyzeSell(base)
    // net value vs basis = 800k − 40k − 41,925 = 718,075
    const total = (718_075 - 565_000) / 565_000
    expect(out.totalReturn).toBeCloseTo(total, 10)
    expect(out.annualizedReturn).toBeCloseTo(Math.pow(1 + total, 1 / 8) - 1, 10)
  })

  it('hold scenario grows value 5 years at the appreciation rate', () => {
    const out = analyzeSell(base)
    expect(out.sellNow).toBeCloseTo(318_075, 6)
    const fv = 800_000 * Math.pow(1.03, 5)
    const gain = fv - fv * 0.05 - 565_000
    const expected = fv - fv * 0.05 - gain * 0.5 * 0.43 - 400_000
    expect(out.holdFiveYears).toBeCloseTo(expected, 6)
    expect(out.holdFiveYears).toBeGreaterThan(out.sellNow)
  })
})
