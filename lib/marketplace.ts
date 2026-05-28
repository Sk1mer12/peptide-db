import fs from 'fs'
import path from 'path'
import type { MarketplaceData, Vendor, MarketplaceCountry } from '@/types'

const FILE = path.join(process.cwd(), 'content', 'marketplace.json')

let cached: MarketplaceData | null = null

export function getMarketplace(): MarketplaceData {
  if (cached) return cached
  const raw = fs.readFileSync(FILE, 'utf-8')
  cached = JSON.parse(raw) as MarketplaceData
  return cached
}

export function getCountries(): MarketplaceCountry[] {
  return getMarketplace().countries
}

export function getVendorsForPeptide(slug: string): Record<string, Vendor[]> {
  return getMarketplace().vendors[slug] ?? {}
}

export function getPeptidesWithVendors(): string[] {
  return Object.keys(getMarketplace().vendors)
}

export function getVendorCountForPeptide(slug: string): number {
  const v = getVendorsForPeptide(slug)
  return Object.values(v).reduce((acc, list) => acc + list.length, 0)
}
