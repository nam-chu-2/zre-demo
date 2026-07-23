export type UnitType = 'studio' | 'oneBed' | 'twoBed' | 'threeBed' | 'townhouse'

export interface Neighbourhood {
  id: string
  name: string
  /** One-line character note shown in the rent explanation. */
  note: string
  /** Demo benchmark monthly rents by unit type (CAD). Illustrative only. */
  benchmarkRents: Record<UnitType, number>
}
