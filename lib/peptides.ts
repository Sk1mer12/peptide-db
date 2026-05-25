import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { PeptideFrontmatter, PeptideListItem } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'peptides')
const CATEGORIES = ['approved-rx', 'investigational', 'grey-market'] as const

function readPeptideFile(filePath: string): PeptideListItem {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  const fm = data as PeptideFrontmatter
  return {
    name: fm.name,
    slug: fm.slug,
    aliases: fm.aliases ?? [],
    category: fm.category,
    status: fm.status,
    purpose: fm.purpose ?? [],
    brands: fm.brands ?? [],
    producer: fm.producer ?? '',
    buyable: fm.buyable ?? false,
    requiresRx: fm.requiresRx ?? false,
    sportsBan: fm.sportsBan ?? false,
    legalNote: fm.legalNote ?? '',
    summary: fm.summary ?? '',
    halfLife: fm.halfLife,
    route: fm.route,
    molecularWeight: fm.molecularWeight,
    sequence: fm.sequence,
    sideEffects: fm.sideEffects ?? [],
    pubchemCid: fm.pubchemCid,
    dosage: fm.dosage,
    safetyRating: fm.safetyRating ?? 1,
    performanceRating: fm.performanceRating ?? 1,
    sources: fm.sources ?? [],
  }
}

export function getAllPeptides(): PeptideListItem[] {
  const peptides: PeptideListItem[] = []
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      peptides.push(readPeptideFile(path.join(dir, file)))
    }
  }
  return peptides.sort((a, b) => a.name.localeCompare(b.name))
}

export function getPeptideBySlug(slug: string): { frontmatter: PeptideFrontmatter; content: string } | null {
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
    for (const file of files) {
      const filePath = path.join(dir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const fm = data as PeptideFrontmatter
      if (fm.slug === slug) {
        return { frontmatter: fm, content }
      }
    }
  }
  return null
}

export function getAllSlugs(): string[] {
  return getAllPeptides().map(p => p.slug)
}

export function getAllPurposes(peptides: PeptideListItem[]): string[] {
  const set = new Set<string>()
  for (const p of peptides) {
    for (const pur of p.purpose) set.add(pur)
  }
  return Array.from(set).sort()
}
