import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'peptides')

// safetyRating: 1–5 (5 = excellent safety profile, well-studied)
// performanceRating: 1–5 (5 = strong RCT/clinical evidence of efficacy)
const RATINGS = {
  // Approved Rx
  'semaglutide':        { s: 4, p: 5 },
  'tirzepatide':        { s: 4, p: 5 },
  'liraglutide':        { s: 4, p: 4 },
  'tesamorelin':        { s: 3, p: 4 },
  'bremelanotide':      { s: 3, p: 3 },
  'oxytocin':           { s: 4, p: 5 },
  'desmopressin':       { s: 3, p: 4 },
  'octreotide':         { s: 3, p: 4 },
  'lanreotide':         { s: 3, p: 4 },
  'teriparatide':       { s: 3, p: 5 },
  'abaloparatide':      { s: 3, p: 4 },
  'leuprolide':         { s: 3, p: 5 },
  'goserelin':          { s: 3, p: 4 },
  'cetrorelix':         { s: 4, p: 4 },
  'ganirelix':          { s: 4, p: 4 },
  'linaclotide':        { s: 4, p: 4 },
  'plecanatide':        { s: 4, p: 4 },
  'teduglutide':        { s: 3, p: 4 },
  'enfuvirtide':        { s: 3, p: 3 },
  'vasopressin':        { s: 2, p: 4 },
  'glucagon':           { s: 4, p: 5 },
  'angiotensin-ii':     { s: 2, p: 3 },
  'triptorelin':        { s: 3, p: 4 },
  'degarelix':          { s: 3, p: 4 },
  'relugolix':          { s: 3, p: 4 },
  'pasireotide':        { s: 2, p: 4 },
  'calcitonin-salmon':  { s: 3, p: 3 },
  'afamelanotide':      { s: 4, p: 4 },
  'zilucoplan':         { s: 3, p: 4 },
  // Investigational
  'retatrutide':        { s: 3, p: 4 },
  'cagrilintide':       { s: 3, p: 4 },
  'amycretin':          { s: 2, p: 3 },
  'survodutide':        { s: 3, p: 3 },
  'pemvidutide':        { s: 3, p: 3 },
  'mazdutide':          { s: 3, p: 3 },
  'elamipretide':       { s: 3, p: 2 },
  'aviptadil':          { s: 2, p: 2 },
  // Grey-market
  'bpc-157':            { s: 2, p: 2 },
  'tb-500':             { s: 2, p: 2 },
  'cjc-1295':           { s: 1, p: 2 },
  'ipamorelin':         { s: 2, p: 2 },
  'ghrp-2':             { s: 2, p: 2 },
  'ghrp-6':             { s: 2, p: 2 },
  'sermorelin':         { s: 2, p: 2 },
  'aod-9604':           { s: 1, p: 1 },
  'melanotan-ii':       { s: 1, p: 2 },
  'epitalon':           { s: 2, p: 1 },
  'ghk-cu':             { s: 2, p: 2 },
  'mots-c':             { s: 1, p: 2 },
  'humanin':            { s: 1, p: 1 },
  'kpv':                { s: 1, p: 1 },
  'll-37':              { s: 1, p: 2 },
  'thymosin-alpha-1':   { s: 3, p: 3 },
  'selank':             { s: 2, p: 2 },
  'semax':              { s: 2, p: 2 },
  'dihexa':             { s: 1, p: 1 },
  'foxo4-dri':          { s: 1, p: 1 },
  'igf-1-lr3':          { s: 1, p: 2 },
  'peg-mgf':            { s: 1, p: 1 },
  'mechano-growth-factor': { s: 1, p: 1 },
  'kisspeptin-10':      { s: 2, p: 2 },
  '5-amino-1mq':        { s: 1, p: 1 },
  'hexarelin':          { s: 2, p: 2 },
  'dsip':               { s: 2, p: 1 },
  'pe-22-28':           { s: 1, p: 1 },
  'p21':                { s: 1, p: 1 },
  'pinealon':           { s: 2, p: 1 },
}

const categories = ['approved-rx', 'investigational', 'grey-market']
let updated = 0, skipped = 0

for (const cat of categories) {
  const dir = path.join(CONTENT_DIR, cat)
  if (!fs.existsSync(dir)) continue
  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))) {
    const slug = file.replace('.mdx', '')
    const rating = RATINGS[slug]
    if (!rating) { console.log(`  no rating defined for: ${slug}`); skipped++; continue }

    const filePath = path.join(dir, file)
    let content = fs.readFileSync(filePath, 'utf-8')

    // Skip if already has ratings
    if (content.includes('safetyRating:')) { skipped++; continue }

    // Insert before closing ---
    content = content.replace(
      /^(---\n[\s\S]*?)(---)/m,
      (_, frontmatter, close) =>
        `${frontmatter}safetyRating: ${rating.s}\nperformanceRating: ${rating.p}\n${close}`
    )

    fs.writeFileSync(filePath, content)
    updated++
    console.log(`  ✓ ${slug}  safety=${rating.s}  perf=${rating.p}`)
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped`)
