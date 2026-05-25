export type PeptideCategory = 'approved-rx' | 'investigational' | 'grey-market'

export type PeptidePurpose =
  | 'weight-loss'
  | 'diabetes'
  | 'cardiovascular'
  | 'gh-release'
  | 'healing'
  | 'nootropic'
  | 'cancer'
  | 'sexual-health'
  | 'anti-aging'
  | 'immune'
  | 'hormonal'
  | 'osteoporosis'
  | 'gut-health'
  | 'neuroprotection'
  | 'skin-hair'
  | 'antimicrobial'
  | 'muscle-recovery'
  | 'longevity'
  | string

export interface PeptideFrontmatter {
  name: string
  slug: string
  aliases: string[]
  category: PeptideCategory
  status: string
  purpose: PeptidePurpose[]
  brands: string[]
  producer: string
  buyable: boolean
  requiresRx: boolean
  sportsBan: boolean
  legalNote: string
  summary: string
  halfLife?: string
  route?: string
  molecularWeight?: string
  sequence?: string
  sideEffects: string[]
  pubchemCid?: number
  dosage?: string
  safetyRating: number
  performanceRating: number
  sources: Array<{ label: string; url: string }>
}

export interface PeptideData extends PeptideFrontmatter {
  content: string
}

export type PeptideListItem = Omit<PeptideData, 'content'>

export interface ActiveFilters {
  category: PeptideCategory | ''
  purposes: string[]
  minSafetyRating: number
  minPerformanceRating: number
}
