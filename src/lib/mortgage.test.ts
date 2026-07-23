import { describe, expect, it } from 'vitest'
import { monthlyMortgagePayment, remainingBalance } from './mortgage'

describe('monthlyMortgagePayment', () => {
  it('reproduces the Zapp Number Checker baseline (277 Stoneway Drive)', () => {
    // Spreadsheet: PMT(1.89%/12, 30*12, 452000) = -1645.9264143368039
    expect(monthlyMortgagePayment(452_000, 0.0189, 30)).toBeCloseTo(
      1645.9264143368039,
      6,
    )
  })

  it('matches Excel PMT for a typical current-rate scenario', () => {
    // PMT(4.5%/12, 25*12, 400000) = -2223.33 (Excel)
    expect(monthlyMortgagePayment(400_000, 0.045, 25)).toBeCloseTo(2223.33, 1)
  })

  it('handles a zero rate as straight principal division', () => {
    expect(monthlyMortgagePayment(120_000, 0, 10)).toBeCloseTo(1000, 10)
  })

  it('returns 0 for non-positive principal', () => {
    expect(monthlyMortgagePayment(0, 0.05, 25)).toBe(0)
    expect(monthlyMortgagePayment(-5, 0.05, 25)).toBe(0)
  })
})

describe('remainingBalance', () => {
  it('is the full principal at month 0 and 0 at the end of the term', () => {
    expect(remainingBalance(452_000, 0.0189, 30, 0)).toBeCloseTo(452_000, 6)
    expect(remainingBalance(452_000, 0.0189, 30, 360)).toBeCloseTo(0, 4)
  })

  it('declines monotonically', () => {
    const b5 = remainingBalance(452_000, 0.0189, 30, 60)
    const b10 = remainingBalance(452_000, 0.0189, 30, 120)
    expect(b5).toBeGreaterThan(b10)
    expect(b5).toBeLessThan(452_000)
  })
})
