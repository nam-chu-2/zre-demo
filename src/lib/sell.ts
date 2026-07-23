/**
 * Sell-side analysis: net proceeds after selling costs, mortgage payout and
 * Canadian capital-gains tax, plus a "sell now vs hold 5 more years" compare.
 */

export interface SellInputs {
  /** Original purchase price (adjusted cost base, simplified), dollars. */
  originalPrice: number
  /** Years the property has been held. */
  yearsHeld: number
  /** Current market value, dollars. */
  marketValue: number
  /** Remaining mortgage balance, dollars. */
  mortgageBalance: number
  /** Selling costs (realtor, legal, staging) as a fraction of sale price. */
  sellingCostsPct: number
  /** Owner's marginal income-tax rate as a decimal. */
  marginalTaxRate: number
  /** Assumed annual appreciation for the hold scenario, decimal. */
  appreciationPct: number
}

export interface SellOutputs {
  sellingCosts: number
  /** Taxable capital gain before inclusion = value − costs − original price (min 0). */
  capitalGain: number
  /** Tax owed = gain × 50% inclusion × marginal rate (Canadian treatment). */
  capitalGainsTax: number
  /** Cash to seller = value − costs − tax − mortgage payout. */
  netProceeds: number
  /** Total appreciation return net of costs & tax, vs original price. */
  totalReturn: number
  /** Geometric (IRR-style) annualized rate over the holding period. */
  annualizedReturn: number
  /** Net proceeds if sold today vs after 5 more years of appreciation. */
  sellNow: number
  holdFiveYears: number
}

/**
 * Net proceeds of a sale.
 *
 * Formula: net = V − V·c − tax − B
 *   where V = market value, c = selling-costs %, B = mortgage balance,
 *   tax = max(0, V − V·c − ACB) × 0.5 × marginal rate.
 *
 * Canadian convention: 50% of a capital gain is included in taxable income
 * (inclusion rate 0.5); the gain is measured net of selling costs against the
 * adjusted cost base (simplified here to the original purchase price).
 */
export function netProceeds(
  marketValue: number,
  originalPrice: number,
  mortgageBalance: number,
  sellingCostsPct: number,
  marginalTaxRate: number,
): { sellingCosts: number; capitalGain: number; capitalGainsTax: number; netProceeds: number } {
  const sellingCosts = marketValue * sellingCostsPct
  const capitalGain = Math.max(0, marketValue - sellingCosts - originalPrice)
  const capitalGainsTax = capitalGain * 0.5 * marginalTaxRate
  return {
    sellingCosts,
    capitalGain,
    capitalGainsTax,
    netProceeds: marketValue - sellingCosts - capitalGainsTax - mortgageBalance,
  }
}

/**
 * Full sell-side analysis.
 *
 * Total return is measured on the asset (net-of-cost-and-tax value vs the
 * original price); annualized return is the geometric mean over years held:
 *   (1 + total)^(1/years) − 1.
 * The hold scenario grows value at `appreciationPct` for 5 years and
 * conservatively assumes no additional principal paydown.
 */
export function analyzeSell(inputs: SellInputs): SellOutputs {
  const now = netProceeds(
    inputs.marketValue,
    inputs.originalPrice,
    inputs.mortgageBalance,
    inputs.sellingCostsPct,
    inputs.marginalTaxRate,
  )

  const netValueVsBasis =
    inputs.marketValue - now.sellingCosts - now.capitalGainsTax
  const totalReturn =
    inputs.originalPrice > 0
      ? (netValueVsBasis - inputs.originalPrice) / inputs.originalPrice
      : 0
  const annualizedReturn =
    inputs.yearsHeld > 0 && 1 + totalReturn > 0
      ? Math.pow(1 + totalReturn, 1 / inputs.yearsHeld) - 1
      : 0

  const futureValue =
    inputs.marketValue * Math.pow(1 + inputs.appreciationPct, 5)
  const hold = netProceeds(
    futureValue,
    inputs.originalPrice,
    inputs.mortgageBalance,
    inputs.sellingCostsPct,
    inputs.marginalTaxRate,
  )

  return {
    ...now,
    totalReturn,
    annualizedReturn,
    sellNow: now.netProceeds,
    holdFiveYears: hold.netProceeds,
  }
}
