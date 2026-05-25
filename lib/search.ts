import Fuse from 'fuse.js'
import type { PeptideListItem } from '@/types'

export function buildFuseIndex(peptides: PeptideListItem[]) {
  return new Fuse(peptides, {
    keys: [
      { name: 'name', weight: 2 },
      { name: 'aliases', weight: 1.5 },
      { name: 'brands', weight: 1.5 },
      { name: 'summary', weight: 0.5 },
      { name: 'purpose', weight: 0.3 },
    ],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  })
}
