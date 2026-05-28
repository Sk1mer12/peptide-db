import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const audit = JSON.parse(readFileSync('scripts/pubchem-audit.json', 'utf8'))

let updated = 0
let alreadySet = 0
let malformed = 0

for (const entry of audit.matched) {
  const path = join('content', 'peptides', entry.file)
  const raw = readFileSync(path, 'utf8')

  const crlf = raw.includes('\r\n')
  const NL = crlf ? '\r\n' : '\n'
  const open = `---${NL}`
  const close = `${NL}---${NL}`

  if (!raw.startsWith(open)) {
    console.warn(`! ${entry.slug}: no frontmatter, skipping`)
    malformed++
    continue
  }

  const end = raw.indexOf(close, open.length)
  if (end === -1) {
    console.warn(`! ${entry.slug}: unterminated frontmatter, skipping`)
    malformed++
    continue
  }

  const frontmatter = raw.slice(open.length, end)
  const body = raw.slice(end)

  // Already pinned?
  const existing = frontmatter.match(/^pubchemCid:\s*(\d+)\s*$/m)
  if (existing) {
    if (parseInt(existing[1], 10) === entry.cid) {
      alreadySet++
      continue
    }
    // Replace existing line
    const updatedFm = frontmatter.replace(/^pubchemCid:\s*\d+\s*$/m, `pubchemCid: ${entry.cid}`)
    writeFileSync(path, `${open}${updatedFm}${body}`)
    updated++
    console.log(`~ ${entry.slug} cid updated -> ${entry.cid}`)
    continue
  }

  // Insert at end of frontmatter
  const insertion = `pubchemCid: ${entry.cid}${NL}`
  const newFrontmatter = frontmatter.endsWith(NL) ? frontmatter + insertion : frontmatter + NL + insertion
  writeFileSync(path, `${open}${newFrontmatter}${body}`)
  updated++
  console.log(`+ ${entry.slug} -> cid=${entry.cid}`)
}

console.log(`\nUpdated:      ${updated}`)
console.log(`Already set:  ${alreadySet}`)
console.log(`Skipped:      ${malformed}`)
