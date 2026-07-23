import { monthlyMortgagePayment, remainingBalance } from './mortgage'

/**
 * Buy-side (rental acquisition) analysis.
 *
 * The monthly cash-flow model reproduces "Zapp's Number Checker v2.0":
 *   net/month = total rental income − (mortgage + operating expenses)
 * then extends it with vacancy, maintenance-as-%-of-rent, growth assumptions,
 * and the return metrics ZRE currently has no way to see on paper.
 */

export interface BuyInputs {
  /** Purchase price, dollars. */
  purchasePrice: number
  /** Down payment as a fraction of price (0.2 = 20%). */
  downPaymentPct: number
  /** Nominal annual mortgage rate as a decimal. */
  mortgageRate: number
  /** Amortization period, years. */
  amortizationYears: number
  /** Gross monthly rent, dollars. */
  monthlyRent: number
  /** Expected vacancy as a fraction of rent (0.03 = 3%). */
  vacancyPct: number
  /** Property tax, dollars per YEAR (spreadsheet enters it yearly). */
  propertyTaxAnnual: number
  /** Insurance, dollars per YEAR (spreadsheet enters it yearly). */
  insuranceAnnual: number
  /** Maintenance reserve as a fraction of gross rent. */
  maintenancePctOfRent: number
  /** Condo / property-management fees, dollars per MONTH. */
  condoFeesMonthly: number
  /** Expected annual property appreciation as a decimal. */
  appreciationPct: number
  /** Expected annual rent growth as a decimal. */
  rentGrowthPct: number
}

export interface YearPoint {
  year: number
  /** Owner equity = market value − remaining mortgage balance. */
  equity: number
  /** Cumulative pre-tax cash flow since purchase. */
  cumulativeCashFlow: number
}

export interface BuyOutputs {
  downPayment: number
  loanAmount: number
  mortgageMonthly: number
  /** Effective rent after vacancy, monthly. */
  effectiveRentMonthly: number
  /** Operating expenses (tax, insurance, maintenance, condo), monthly — excludes mortgage. */
  operatingExpensesMonthly: number
  /** Pre-tax cash flow per month. */
  cashFlowMonthly: number
  cashFlowAnnual: number
  /** Cap rate = NOI / purchase price. */
  capRate: number
  /** Cash-on-cash = annual cash flow / cash invested (down payment). */
  cashOnCash: number
  /** Gross rent at which monthly cash flow is exactly zero. */
  breakEvenRent: number
  projection: YearPoint[]
}

/**
 * Capitalization rate.
 *
 * Formula (standard convention): cap rate = NOI / purchase price, where
 * NOI = effective gross income − operating expenses (mortgage excluded —
 * cap rate measures the asset, not the financing).
 *
 * @param annualNOI     Net operating income, dollars per year.
 * @param purchasePrice Purchase price, dollars.
 */
export function capRate(annualNOI: number, purchasePrice: number): number {
  if (purchasePrice <= 0) return 0
  return annualNOI / purchasePrice
}

/**
 * Full buy-side analysis. All values pre-tax.
 *
 * Break-even rent solves cashFlow(rent) = 0 with vacancy and maintenance
 * scaling with rent:  rent = fixedMonthlyCosts / (1 − vacancy − maintenance%).
 *
 * 10-year projection: property value grows at `appreciationPct`, rent at
 * `rentGrowthPct`; fixed operating costs are held flat (demo simplification,
 * stated in the UI); equity = value − remaining balance.
 */
export function analyzeBuy(inputs: BuyInputs): BuyOutputs {
  const downPayment = inputs.purchasePrice * inputs.downPaymentPct
  const loanAmount = inputs.purchasePrice - downPayment
  const mortgageMonthly = monthlyMortgagePayment(
    loanAmount,
    inputs.mortgageRate,
    inputs.amortizationYears,
  )

  const fixedOpsMonthly =
    inputs.propertyTaxAnnual / 12 +
    inputs.insuranceAnnual / 12 +
    inputs.condoFeesMonthly

  const maintenanceMonthly = inputs.monthlyRent * inputs.maintenancePctOfRent
  const operatingExpensesMonthly = fixedOpsMonthly + maintenanceMonthly
  const effectiveRentMonthly = inputs.monthlyRent * (1 - inputs.vacancyPct)

  const cashFlowMonthly =
    effectiveRentMonthly - operatingExpensesMonthly - mortgageMonthly
  const annualNOI = (effectiveRentMonthly - operatingExpensesMonthly) * 12

  const denom = 1 - inputs.vacancyPct - inputs.maintenancePctOfRent
  const breakEvenRent =
    denom > 0 ? (fixedOpsMonthly + mortgageMonthly) / denom : Infinity

  const projection: YearPoint[] = []
  let cumulative = 0
  for (let year = 0; year <= 10; year++) {
    if (year > 0) {
      const rentY = inputs.monthlyRent * Math.pow(1 + inputs.rentGrowthPct, year - 1)
      const cfY =
        rentY * (1 - inputs.vacancyPct) -
        (fixedOpsMonthly + rentY * inputs.maintenancePctOfRent) -
        mortgageMonthly
      cumulative += cfY * 12
    }
    const value = inputs.purchasePrice * Math.pow(1 + inputs.appreciationPct, year)
    const balance = remainingBalance(
      loanAmount,
      inputs.mortgageRate,
      inputs.amortizationYears,
      year * 12,
    )
    projection.push({
      year,
      equity: value - balance,
      cumulativeCashFlow: cumulative,
    })
  }

  return {
    downPayment,
    loanAmount,
    mortgageMonthly,
    effectiveRentMonthly,
    operatingExpensesMonthly,
    cashFlowMonthly,
    cashFlowAnnual: cashFlowMonthly * 12,
    capRate: capRate(annualNOI, inputs.purchasePrice),
    cashOnCash: downPayment > 0 ? (cashFlowMonthly * 12) / downPayment : 0,
    breakEvenRent,
    projection,
  }
}

/**
 * Monthly cash flow across a band of mortgage rates (± 2 points around the
 * chosen rate, 0.25-pt steps) with every other input held constant.
 */
export function rateSensitivity(
  inputs: BuyInputs,
): { rate: number; cashFlow: number }[] {
  const points: { rate: number; cashFlow: number }[] = []
  const base = inputs.mortgageRate
  for (let d = -2; d <= 2.001; d += 0.25) {
    const rate = Math.max(0, base + d / 100)
    const out = analyzeBuy({ ...inputs, mortgageRate: rate })
    points.push({ rate, cashFlow: out.cashFlowMonthly })
  }
  return points
}
