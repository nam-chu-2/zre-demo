import type { Neighbourhood, UnitType } from '../data/types'

/**
 * Rent pricing: a transparent benchmark-plus-adjustments model.
 * Phase 2 replaces the hard-coded benchmarks with a live market-data model;
 * the driver structure (location, size, unit type, inclusions) stays the same.
 */

export interface RentInputs {
  unitType: UnitType
  /** Unit size in square feet. */
  sizeSqft: number
  neighbourhood: Neighbourhood
  parkingIncluded: boolean
  utilitiesIncluded: boolean
}

export interface RentDriver {
  label: string
  /** Dollar effect on the suggested rent (signed). */
  amount: number
}

export interface RentOutputs {
  suggestedRent: number
  rentLow: number
  rentHigh: number
  /** Ordered explanation of how the suggestion was built. */
  drivers: RentDriver[]
  /** Expected annual revenue at 2%, 5% and 8% vacancy. */
  vacancyScenarios: { vacancyPct: number; annualRevenue: number }[]
}

/** Monthly premium for an included parking spot (demo assumption). */
export const PARKING_PREMIUM = 150
/** Monthly premium when utilities are included (demo assumption). */
export const UTILITIES_PREMIUM = 140
/** Size adjustment per square foot away from the unit type's typical size. */
export const PER_SQFT_ADJUSTMENT = 0.55

/**
 * Suggested rent = neighbourhood benchmark for the unit type
 *   + (size − typical size) × $/sqft
 *   + parking premium + utilities premium,
 * with a ±5% presentation band. Revenue scenario = rent × 12 × (1 − vacancy).
 */
export function analyzeRent(inputs: RentInputs): RentOutputs {
  const benchmark = inputs.neighbourhood.benchmarkRents[inputs.unitType]
  const typicalSize = TYPICAL_SIZE_SQFT[inputs.unitType]
  const sizeAdj =
    Math.round(((inputs.sizeSqft - typicalSize) * PER_SQFT_ADJUSTMENT) / 5) * 5

  const drivers: RentDriver[] = [
    {
      label: `${inputs.neighbourhood.name} benchmark · ${UNIT_TYPE_LABELS[inputs.unitType]}`,
      amount: benchmark,
    },
  ]
  if (sizeAdj !== 0) {
    drivers.push({
      label: `Size: ${inputs.sizeSqft} sq ft vs ${typicalSize} typical`,
      amount: sizeAdj,
    })
  }
  if (inputs.parkingIncluded) {
    drivers.push({ label: 'Parking included', amount: PARKING_PREMIUM })
  }
  if (inputs.utilitiesIncluded) {
    drivers.push({ label: 'Utilities included', amount: UTILITIES_PREMIUM })
  }

  const suggestedRent = Math.max(
    0,
    drivers.reduce((sum, d) => sum + d.amount, 0),
  )

  return {
    suggestedRent,
    rentLow: Math.round((suggestedRent * 0.95) / 5) * 5,
    rentHigh: Math.round((suggestedRent * 1.05) / 5) * 5,
    drivers,
    vacancyScenarios: [0.02, 0.05, 0.08].map((vacancyPct) => ({
      vacancyPct,
      annualRevenue: suggestedRent * 12 * (1 - vacancyPct),
    })),
  }
}

export const UNIT_TYPE_LABELS: Record<UnitType, string> = {
  studio: 'Studio',
  oneBed: '1 bedroom',
  twoBed: '2 bedroom',
  threeBed: '3 bedroom',
  townhouse: 'Townhouse',
}

/** Typical unit sizes (sq ft) used as the zero point for size adjustments. */
export const TYPICAL_SIZE_SQFT: Record<UnitType, number> = {
  studio: 450,
  oneBed: 650,
  twoBed: 900,
  threeBed: 1150,
  townhouse: 1400,
}
