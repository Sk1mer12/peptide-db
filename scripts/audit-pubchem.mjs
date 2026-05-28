import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = join(process.cwd(), 'content', 'peptides')
const CATEGORIES = ['approved-rx', 'investigational', 'grey-market']

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function nameToCid(name) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    return data?.IdentifierList?.CID?.[0] ?? null
  } catch {
    return null
  }
}

const results = { matched: [], unmatched: [] }

for (const cat of CATEGORIES) {
  const dir = join(CONTENT_DIR, cat)
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'))
  for (const file of files) {
    const raw = readFileSync(join(dir, file), 'utf8')
    const { data } = matter(raw)
    const candidates = [data.name, ...(data.aliases ?? [])].filter(Boolean)
    let cid = null
    let matchedName = null
    for (const candidate of candidates) {
      cid = await nameToCid(candidate)
      if (cid) { matchedName = candidate; break }
      await sleep(200)
    }
    if (cid) {
      results.matched.push({ slug: data.slug, file: `${cat}/${file}`, name: data.name, matchedName, cid })
      console.log(`OK   ${data.slug.padEnd(28)} cid=${cid} (via "${matchedName}")`)
    } else {
      results.unmatched.push({ slug: data.slug, file: `${cat}/${file}`, name: data.name, aliases: data.aliases ?? [] })
      console.log(`MISS ${data.slug.padEnd(28)} tried: ${candidates.join(' | ')}`)
    }
    await sleep(150)
  }
}

console.log(`\n=== SUMMARY ===`)
console.log(`Matched:   ${results.matched.length}`)
console.log(`Unmatched: ${results.unmatched.length}`)
console.log(`\nUnmatched list:`)
for (const u of results.unmatched) console.log(`  - ${u.slug} (${u.name})`)

import { writeFileSync } from 'fs'
writeFileSync('scripts/pubchem-audit.json', JSON.stringify(results, null, 2))
console.log(`\nWrote scripts/pubchem-audit.json`)
