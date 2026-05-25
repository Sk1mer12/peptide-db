import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT = path.join(__dirname, '..', 'content', 'peptides')

// slug → dosage string
const DOSAGES = {
  // ── APPROVED RX ──────────────────────────────────────────────────────────
  'abaloparatide':    '80 mcg SC once daily (fixed dose)',
  'afamelanotide':    '16 mg SC implant every 60 days (fixed dose)',
  'angiotensin-ii':   '20 ng/kg/min IV infusion (titrate to target MAP)',
  'bivalirudin':      '0.75 mg/kg IV bolus, then 1.75 mg/kg/h infusion',
  'bremelanotide':    '1.75 mg SC up to 45 min before activity (fixed dose, max 1×/day)',
  'calcitonin':       '4–8 IU/kg SC/IM q6–12h (hypercalcaemia); 200 IU/day intranasal (osteoporosis)',
  'carfilzomib':      '20–56 mg/m² IV days 1, 8, 15 of 28-day cycle (BSA-based)',
  'cetrorelix':       '0.25 mg SC once daily or 3 mg SC single-dose (fixed dose)',
  'cosyntropin':      '250 mcg SC/IV single dose (diagnostic; fixed)',
  'cyclosporine':     '2–15 mg/kg/day oral in 2 divided doses (indication-dependent)',
  'degarelix':        '240 mg SC loading (2×120 mg), then 80 mg SC monthly (fixed dose)',
  'desmopressin':     '0.3 mcg/kg IV (haemostasis); 0.1–1.2 mg/day oral (diabetes insipidus)',
  'dulaglutide':      '0.75–4.5 mg SC once weekly (fixed dose; titrate monthly)',
  'enfuvirtide':      '90 mg SC twice daily (fixed dose)',
  'eptifibatide':     '180 mcg/kg IV bolus, then 2 mcg/kg/min infusion for up to 96h',
  'etelcalcetide':    '2.5–15 mg IV 3×/week at end of dialysis (fixed; titrate q4w)',
  'exenatide':        '5–10 mcg SC twice daily; 2 mg SC once weekly (extended-release)',
  'ganirelix':        '250 mcg SC once daily during stimulation (fixed dose)',
  'glucagon':         '0.02–0.03 mg/kg IM/SC (pediatric); 0.5–1 mg adults (fixed)',
  'goserelin':        '3.6 mg SC implant monthly or 10.8 mg SC implant q3months (fixed)',
  'histrelin':        '50 mg SC implant annually (fixed dose)',
  'icatibant':        '30 mg SC single dose; may repeat q6h, max 3 doses/24h (fixed)',
  'lanreotide':       '60–120 mg SC deep injection every 28 days (fixed dose)',
  'leuprolide':       '1 mg/day SC (daily); 3.75–22.5 mg depot IM q1–3 months (fixed)',
  'linaclotide':      '72–290 mcg oral once daily on empty stomach (fixed dose)',
  'liraglutide':      '0.6–3 mg SC once daily (fixed; titrate weekly)',
  'mecasermin':       '0.04–0.12 mg/kg SC twice daily (max 0.12 mg/kg/dose)',
  'nafarelin':        '200–400 mcg intranasal twice daily (fixed dose)',
  'nesiritide':       '2 mcg/kg IV bolus, then 0.01 mcg/kg/min continuous infusion',
  'octreotide':       '50–1500 mcg/day SC in 2–4 doses; 10–40 mg depot IM monthly',
  'oxytocin':         '0.5–2 mU/min IV (induction); titrate up to 20 mU/min (units-based)',
  'pasireotide':      '0.3–0.9 mg SC twice daily (Cushing\'s; fixed dose)',
  'pegcetacoplan':    '1080 mg SC twice weekly (fixed dose)',
  'plecanatide':      '3–6 mg oral once daily with or without food (fixed dose)',
  'pramlintide':      '15–120 mcg SC immediately before major meals (fixed; titrate)',
  'relugolix':        '120 mg oral loading dose, then 40 mg oral once daily (fixed)',
  'romidepsin':       '14 mg/m² IV infusion over 4h on days 1, 8, 15 of 28-day cycle (BSA-based)',
  'semaglutide':      '0.25–2.4 mg SC once weekly; 3–14 mg oral once daily (fixed; titrate)',
  'setmelanotide':    '1–3 mg SC once daily (fixed; titrate over 2 weeks)',
  'sincalide':        '0.02 mcg/kg IV over 30–60 min (diagnostic; weight-based)',
  'teduglutide':      '0.05 mg/kg SC once daily',
  'teriparatide':     '20 mcg SC once daily (fixed dose; max 2 years)',
  'terlipressin':     '0.85–1 mg IV q4–6h (fixed for hepatorenal syndrome)',
  'tesamorelin':      '2 mg SC once daily at bedtime (fixed dose)',
  'tirzepatide':      '2.5–15 mg SC once weekly (fixed; titrate every 4 weeks)',
  'triptorelin':      '3.75 mg IM monthly or 11.25 mg IM q3months depot (fixed)',
  'vasopressin':      '0.01–0.1 units/kg/h IV infusion; 20 units IM bolus (vasodilatory shock)',
  'voclosporin':      '23.7 mg oral twice daily (fixed dose)',
  'vosoritide':       '15 mcg/kg SC once daily',
  'zilucoplan':       '0.3 mg/kg SC once daily',

  // ── INVESTIGATIONAL ──────────────────────────────────────────────────────
  'amycretin':        'Phase 1/2; dose not publicly established',
  'aviptadil':        '50–150 pmol/kg/min IV infusion (ARDS/COVID-19 trials)',
  'cagrilintide':     '0.16–4.5 mg SC once weekly (fixed; phase 2 titration)',
  'elamipretide':     '40 mg SC once daily (phase 2 heart failure trials)',
  'mazdutide':        '3–9 mg SC once weekly (fixed; phase 2 dose range)',
  'pemvidutide':      '1.2–2.4 mg SC once weekly (fixed; phase 2)',
  'retatrutide':      '1–12 mg SC once weekly (fixed; phase 2 titration)',
  'survodutide':      '0.6–6 mg SC once weekly (fixed; phase 2 titration)',

  // ── GREY MARKET ──────────────────────────────────────────────────────────
  '5-amino-1mq':      '50–100 mg oral once daily (anecdotal; no clinical standard)',
  'aod-9604':         '250–500 mcg SC once daily (anecdotal; ~3–7 mcg/kg for 80 kg adult)',
  'argireline':       'Topical: 5–10% w/v concentration; no systemic dosing established',
  'bpc-157':          '2–10 mcg/kg SC or IP once daily (animal studies); 200–500 mcg/day SC (anecdotal human)',
  'buserelin':        '200–500 mcg SC 3×/day or 400–800 mcg/day intranasal (fixed)',
  'cerebrolysin':     '5–30 mL/day IV infusion over 60 min (Russian clinical protocols)',
  'cjc-1295':         '1–2 mg SC once weekly (anecdotal; no clinical standard)',
  'cortagen':         '~10 mcg/kg SC or IM once daily (Khavinson protocol)',
  'dihexa':           '5–20 mg oral daily (anecdotal; no clinical standard)',
  'dsip':             '25–50 mcg/kg IV slow infusion (research doses only)',
  'epitalon':         '~0.1 mg/kg SC or IV per course; 5–10 mg total per treatment course (Khavinson protocol)',
  'foxo4-dri':        '1–5 mg/kg SC (mouse senolytic studies); human dose not established',
  'ghk-cu':           '1–2 mg/day SC (anecdotal); topical 1–5% concentration',
  'ghk':              'Topical cosmetic use only; systemic dosing not established',
  'ghrp-2':           '~1–2 mcg/kg SC per dose, up to 3×/day (anecdotal)',
  'ghrp-6':           '~1–2 mcg/kg SC per dose, up to 3×/day (anecdotal)',
  'hexarelin':        '1–2 mcg/kg SC per dose (research); 100–200 mcg/dose (anecdotal)',
  'humanin':          '2–4 mg SC 2–3×/week (anecdotal; no clinical standard)',
  'igf-1-lr3':        '20–100 mcg/day SC (~0.3–1.5 mcg/kg for 70 kg adult; anecdotal)',
  'ipamorelin':       '~2–3 mcg/kg SC per dose, 1–3×/day (anecdotal)',
  'kisspeptin-10':    '0.24–0.96 nmol/kg/h IV (research only); no established self-administration dose',
  'kpv':              '500–1000 mcg/day SC or oral (anecdotal; no clinical standard)',
  'larazotide':       '0.5 mg oral 3×/day before meals (phase 2 trial dose)',
  'll-37':            '0.3–3 mg/kg topical or intralesional (research; no systemic standard)',
  'matrixyl':         'Topical: 3–5 ppm (0.0003–0.0005%) in formulation; no systemic dosing',
  'mechano-growth-factor': '100–200 mcg SC 2×/week (anecdotal; no clinical standard)',
  'melanotan-ii':     '0.025 mg/kg SC (research); 0.25–1 mg SC (anecdotal, titrate from low)',
  'mots-c':           '~0.05–0.15 mg/kg SC 2–3×/week (anecdotal)',
  'n-acetyl-selank':  '300–600 mcg intranasal/day in split doses (anecdotal)',
  'n-acetyl-semax':   '200–600 mcg intranasal/day in split doses (anecdotal)',
  'p21':              '50–200 mcg/day SC (anecdotal; no clinical standard)',
  'pe-22-28':         '50–150 mcg/day SC (anecdotal; no clinical standard)',
  'peg-mgf':          '100–200 mcg SC 2×/week (anecdotal; no clinical standard)',
  'pinealon':         '1–5 mg oral or intranasal/day (Khavinson protocol; anecdotal)',
  'selank':           '250–750 mcg/day intranasal in 2–3 doses (Russian approved range)',
  'semax':            '300–600 mcg/day intranasal in 2–3 doses (Russian approved range)',
  'sermorelin':       '1–2 mcg/kg SC at bedtime; clinical: 0.2–0.3 mg/day SC',
  'snap-8':           'Topical: 4–8% w/v in formulation; no systemic dosing established',
  'tb-500':           '2–2.5 mg SC 2×/week (anecdotal; no clinical standard)',
  'thymalin':         '10–20 mg IM once daily for 5–10 days (Russian clinical protocol)',
  'thymosin-alpha-1': '1.6 mg SC twice weekly (clinical trial standard dose)',
  'thymosin-beta-4':  '1.5–4 mg SC 2×/week (anecdotal; no approved clinical dose)',
  'vilon':            '~10 mcg/kg SC once daily (Khavinson protocol)',
  'vip':              '50–100 mcg intranasal/day (Shoemaker CIRS protocol); 0.2–0.4 pmol/kg/min IV (research)',
  'n-acetyl-semax':   '200–600 mcg intranasal/day in split doses (anecdotal)',
  'n-acetyl-selank':  '300–600 mcg intranasal/day in split doses (anecdotal)',
  'cerebrolysin':     '5–30 mL/day IV infusion over 60 min (Russian clinical protocols)',
  'thymalin':         '10–20 mg IM once daily for 5–10 days (Russian clinical protocol)',
}

let updated = 0
let skipped = 0
let missing = 0

const categories = ['approved-rx', 'investigational', 'grey-market']

for (const cat of categories) {
  const dir = path.join(CONTENT, cat)
  if (!fs.existsSync(dir)) continue

  for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))) {
    const filePath = path.join(dir, file)
    let raw = fs.readFileSync(filePath, 'utf-8')

    // Extract slug from frontmatter
    const slugMatch = raw.match(/^slug:\s+"?([^"\n]+)"?/m)
    if (!slugMatch) { skipped++; continue }
    const slug = slugMatch[1].trim()

    const dosage = DOSAGES[slug]
    if (!dosage) {
      console.warn(`  [MISSING] ${slug}`)
      missing++
      continue
    }

    // Skip if dosage already present
    if (/^dosage:/m.test(raw)) {
      // Update existing
      raw = raw.replace(/^dosage:.*$/m, `dosage: "${dosage}"`)
    } else {
      // Insert after safetyRating line
      raw = raw.replace(
        /^(safetyRating:)/m,
        `dosage: "${dosage}"\n$1`
      )
    }

    fs.writeFileSync(filePath, raw)
    updated++
    console.log(`  ✓ ${slug}`)
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${missing} missing dosage data`)
