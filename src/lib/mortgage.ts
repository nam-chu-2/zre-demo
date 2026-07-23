/**
 * Mortgage math.
 *
 * Conventions follow ZRE's existing spreadsheet, "Zapp's Number Checker v2.0"
 * (277 Stoneway Drive sheet), which computes the payment with Excel's
 * PMT(rate/12, years*12, principal) — i.e. nominal annual rate compounded
 * monthly. Canadian fixed mortgages legally compound semi-annually, which
 * yields a slightly lower payment; we replicate the spreadsheet convention
 * so the baseline matches ZRE's own numbers, and note the refinement as a
 * Phase-2 item.
 */

/**
 * Monthly principal-and-interest payment.
 *
 * Formula (standard annuity / Excel PMT):
 *   M = P · r / (1 − (1 + r)^−n)   where r = annualRate/12, n = years·12
 * Spreadsheet source: `PMT(H12/12, H13*12, H14)` in Number_Checker_ZRE.xlsx.
 *
 * @param principal   Loan amount (purchase price − down payment), in dollars.
 * @param annualRate  Nominal annual interest rate as a decimal (0.0189 = 1.89%).
 * @param years       Amortization period in years.
 * @returns Monthly payment in dollars (positive number). 0 if principal ≤ 0.
 */
export function monthlyMortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
): number {
  if (principal <= 0 || years <= 0) return 0
  const r = annualRate / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r) / (1 - Math.pow(1 + r, -n))
}

/**
 * Remaining balance after `monthsPaid` payments on an amortizing loan.
 *
 * Formula: B_k = P(1+r)^k − M · ((1+r)^k − 1) / r
 *
 * @param principal   Original loan amount in dollars.
 * @param annualRate  Nominal annual rate as a decimal, compounded monthly.
 * @param years       Amortization period in years.
 * @param monthsPaid  Number of monthly payments already made.
 * @returns Remaining principal in dollars, floored at 0.
 */
export function remainingBalance(
  principal: number,
  annualRate: number,
  years: number,
  monthsPaid: number,
): number {
  if (principal <= 0) return 0
  const r = annualRate / 12
  const m = monthlyMortgagePayment(principal, annualRate, years)
  if (r === 0) return Math.max(0, principal - m * monthsPaid)
  const growth = Math.pow(1 + r, monthsPaid)
  return Math.max(0, principal * growth - (m * (growth - 1)) / r)
}
