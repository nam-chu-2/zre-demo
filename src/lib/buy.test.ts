import { describe, expect, it } from 'vitest'
import { analyzeBuy, capRate, type BuyInputs } from './buy'

/** The exact 277 Stoneway Drive scenario from Zapp's Number Checker v2.0. */
const STONEWAY: BuyInputs = {
  purchasePrice: 565_000,
  downPaymentPct: 0.2,
  mortgageRate: 0.0189,
  amortizationYears: 30,
  monthlyRent: 2300,
  vacancyPct: 0,
  propertyTaxAnnual: 3633,
  insuranceAnnual: 1000,
  maintenancePctOfRent: 0,
  condoFeesMonthly: 0,
  appreciationPct: 0.03,
  rentGrowthPct: 0.025,
}

describe('capRate', () => {
  it('is NOI / price', () => {
    expect(capRate(28_250, 565_000)).toBeCloseTo(0.05, 10)
  })

  it('guards against zero price', () => {
    expect(capRate(10_000, 0)).toBe(0)
  })
})

describe('analyzeBuy — spreadsheet baseline fidelity', () => {
  it('reproduces the Number Checker monthly net of $267.99', () => {
    const out = analyzeBuy(STONEWAY)
    // Spreadsheet C43: 267.99025232986287
    expect(out.cashFlowMonthly).toBeCloseTo(267.99025232986287, 6)
    // Spreadsheet D43 (yearly): 3215.8830279583544
    expect(out.cashFlowAnnual).toBeCloseTo(3215.8830279583544, 6)
    expect(out.downPayment).toBeCloseTo(113_000, 6)
    expect(out.loanAmount).toBeCloseTo(452_000, 6)
    expect(out.mortgageMonthly).toBeCloseTo(1645.9264143368039, 6)
  })

  it('computes cap rate on NOI excluding the mortgage', () => {
    const out = analyzeBuy(STONEWAY)
    // NOI = (2300 − 3633/12 − 1000/12) × 12 = 22,967
    expect(out.capRate).toBeCloseTo(22_967 / 565_000, 10)
  })

  it('finds the rent at which cash flow is exactly zero', () => {
    const out = analyzeBuy({ ...STONEWAY, vacancyPct: 0.05, maintenancePctOfRent: 0.05 })
    const atBreakEven = analyzeBuy({
      ...STONEWAY,
      vacancyPct: 0.05,
      maintenancePctOfRent: 0.05,
      monthlyRent: out.breakEvenRent,
    })
    expect(atBreakEven.cashFlowMonthly).toBeCloseTo(0, 8)
  })

  it('produces an 11-point projection starting at the down payment', () => {
    const out = analyzeBuy(STONEWAY)
    expect(out.projection).toHaveLength(11)
    expect(out.projection[0].equity).toBeCloseTo(113_000, 6)
    expect(out.projection[0].cumulativeCashFlow).toBe(0)
    expect(out.projection[10].equity).toBeGreaterThan(113_000)
  })
})
