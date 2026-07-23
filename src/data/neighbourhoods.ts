import raw from './neighbourhoods.json'
import type { Neighbourhood } from './types'

/**
 * Demo benchmark rents for 8 Ottawa areas — illustrative seed data, clearly
 * labelled as such in the UI. Phase 2 replaces this file with live market
 * data feeding a rent-prediction model.
 */
export const NEIGHBOURHOODS: Neighbourhood[] = raw as Neighbourhood[]
