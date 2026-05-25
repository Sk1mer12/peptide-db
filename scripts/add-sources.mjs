import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

const CONTENT_DIR = join(process.cwd(), 'content', 'peptides')
const CATEGORIES = ['approved-rx', 'investigational', 'grey-market']

// URL helpers
const fda  = (nda)  => `https://www.accessdata.fda.gov/scripts/cder/daf/index.cfm?event=overview.process&ApplNo=${nda}`
const dm   = (q)    => `https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(q)}`
const pm   = (pmid) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
const pms  = (q)    => `https://pubmed.ncbi.nlm.nih.gov/?term=${q.replace(/ /g, '+')}`
const ct   = (nct)  => `https://clinicaltrials.gov/study/${nct}`
const cts  = (q)    => `https://clinicaltrials.gov/search?term=${encodeURIComponent(q)}`
const WADA = 'https://www.wada-ama.org/en/prohibited-list'
const FDA_COMPOUNDING = 'https://www.fda.gov/drugs/pharmacy-compounding/nominated-bulk-drug-substances-use-compounding'

const SOURCES = {
  // ── APPROVED RX ──────────────────────────────────────────────────────────────
  'semaglutide': [
    { label: 'FDA Prescribing Information — Ozempic / Wegovy (semaglutide), 2023', url: fda('209637') },
    { label: 'SUSTAIN-6: Semaglutide and Cardiovascular Outcomes in Type 2 Diabetes (NEJM, 2016)', url: pm('27633186') },
    { label: 'STEP-1: Once-Weekly Semaglutide in Adults with Overweight or Obesity (NEJM, 2021)', url: pm('33567185') },
    { label: 'SELECT: Semaglutide and Cardiovascular Outcomes in Obesity without Diabetes (NEJM, 2023)', url: pm('37633497') },
  ],
  'tirzepatide': [
    { label: 'FDA Prescribing Information — Mounjaro / Zepbound (tirzepatide), 2023', url: fda('215866') },
    { label: 'SURPASS-2: Tirzepatide vs Semaglutide in Type 2 Diabetes (NEJM, 2021)', url: pm('34170647') },
    { label: 'SURMOUNT-1: Tirzepatide for Obesity or Overweight (NEJM, 2022)', url: pm('35658024') },
    { label: 'SURMOUNT-4: Sustained Weight Reduction with Tirzepatide (NEJM, 2023)', url: pms('SURMOUNT-4 tirzepatide sustained weight') },
  ],
  'liraglutide': [
    { label: 'FDA Prescribing Information — Victoza (liraglutide), 2023', url: fda('022341') },
    { label: 'LEADER: Liraglutide and Cardiovascular Outcomes in Type 2 Diabetes (NEJM, 2016)', url: pm('27295427') },
    { label: 'SCALE: Liraglutide 3.0 mg for Weight Management (NEJM, 2015)', url: pms('liraglutide 3mg weight management SCALE obesity NEJM 2015') },
  ],
  'tesamorelin': [
    { label: 'FDA Prescribing Information — Egrifta SV (tesamorelin), 2023', url: fda('022505') },
    { label: 'Falutz et al: Tesamorelin for Visceral Adiposity in HIV (NEJM, 2010)', url: pms('tesamorelin visceral adiposity HIV Falutz NEJM 2010') },
    { label: 'Stanley et al: Tesamorelin Effects on Liver Fat in HIV (Lancet HIV, 2014)', url: pms('tesamorelin liver fat HIV Stanley Lancet 2014') },
  ],
  'bremelanotide': [
    { label: 'FDA Prescribing Information — Vyleesi (bremelanotide), 2019', url: fda('210557') },
    { label: 'FDA Approval Summary: Bremelanotide for Hypoactive Sexual Desire Disorder (2019)', url: 'https://www.fda.gov/news-events/press-announcements/fda-approves-new-treatment-hypoactive-sexual-desire-disorder-premenopausal-women' },
    { label: 'Clayton et al: Bremelanotide for HSDD (Obstet Gynecol, 2016)', url: pms('bremelanotide hypoactive sexual desire disorder Clayton 2016') },
  ],
  'oxytocin': [
    { label: 'FDA Prescribing Information — Pitocin (oxytocin injection)', url: dm('oxytocin pitocin') },
    { label: 'WHO Essential Medicines List: Oxytocin', url: 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02' },
    { label: 'ACOG Practice Bulletin: Induction of Labor (2009, reaffirmed 2023)', url: pms('ACOG oxytocin labor induction practice bulletin') },
  ],
  'desmopressin': [
    { label: 'FDA Prescribing Information — DDAVP (desmopressin acetate)', url: dm('desmopressin DDAVP') },
    { label: 'EMA Summary of Product Characteristics — Desmopressin', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=desmopressin' },
    { label: 'Bichet: Desmopressin in central diabetes insipidus (Clin J Am Soc Nephrol, 2019)', url: pms('desmopressin central diabetes insipidus Bichet 2019') },
  ],
  'octreotide': [
    { label: 'FDA Prescribing Information — Sandostatin / Sandostatin LAR (octreotide)', url: fda('019667') },
    { label: 'Lamberts et al: Octreotide — the next decade (Eur J Endocrinol, 1996)', url: pms('octreotide next decade Lamberts 1996') },
    { label: 'Öberg: Neuroendocrine tumours and somatostatin analogues (Ann Oncol, 1999)', url: pms('octreotide neuroendocrine tumours somatostatin Oberg 1999') },
  ],
  'lanreotide': [
    { label: 'FDA Prescribing Information — Somatuline Depot (lanreotide), 2023', url: fda('022074') },
    { label: 'CLARINET: Lanreotide in Metastatic Enteropancreatic Neuroendocrine Tumors (NEJM, 2014)', url: pms('CLARINET lanreotide neuroendocrine Caplin NEJM 2014') },
    { label: 'Giustina et al: Lanreotide in Acromegaly (J Clin Endocrinol Metab, 2009)', url: pms('lanreotide acromegaly Giustina 2009') },
  ],
  'teriparatide': [
    { label: 'FDA Prescribing Information — Forteo (teriparatide), 2023', url: fda('021318') },
    { label: 'Neer et al: Teriparatide Effect on Fractures and Bone Density (NEJM, 2001)', url: pm('11136797') },
    { label: 'Saag et al: Teriparatide vs Risedronate in Glucocorticoid-Induced Osteoporosis (NEJM, 2007)', url: pms('teriparatide risedronate glucocorticoid osteoporosis Saag NEJM 2007') },
  ],
  'abaloparatide': [
    { label: 'FDA Prescribing Information — Tymlos (abaloparatide), 2022', url: fda('208743') },
    { label: 'ACTIVE: Abaloparatide vs Teriparatide in Postmenopausal Osteoporosis (NEJM, 2016)', url: pm('27557300') },
    { label: 'Cosman et al: Sequential Abaloparatide and Alendronate for Osteoporosis (NEJM, 2020)', url: pms('abaloparatide alendronate sequential osteoporosis Cosman NEJM 2020') },
  ],
  'leuprolide': [
    { label: 'FDA Prescribing Information — Lupron Depot (leuprolide acetate)', url: fda('019732') },
    { label: 'Crawford et al: Leuprolide vs DES for Prostate Cancer (NEJM, 1989)', url: pms('leuprolide diethylstilbestrol prostate cancer Crawford NEJM 1989') },
    { label: 'WHO Essential Medicines List: Leuprolide', url: 'https://www.who.int/publications/i/item/WHO-MHP-HPS-EML-2023.02' },
  ],
  'goserelin': [
    { label: 'FDA Prescribing Information — Zoladex (goserelin acetate implant)', url: dm('goserelin zoladex') },
    { label: 'EMA Summary of Product Characteristics — Zoladex', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=zoladex' },
    { label: 'Boccardo et al: Goserelin vs Orchiectomy in Advanced Prostate Cancer (J Urol, 1993)', url: pms('goserelin orchiectomy prostate cancer Boccardo 1993') },
  ],
  'cetrorelix': [
    { label: 'FDA Prescribing Information — Cetrotide (cetrorelix)', url: dm('cetrorelix cetrotide') },
    { label: 'EMA Assessment Report: Cetrotide (cetrorelix acetate)', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=cetrotide' },
    { label: 'Albano et al: Cetrorelix in controlled ovarian stimulation (Hum Reprod, 1996)', url: pms('cetrorelix controlled ovarian stimulation Albano 1996') },
  ],
  'ganirelix': [
    { label: 'FDA Prescribing Information — Ganirelix Acetate Injection', url: dm('ganirelix') },
    { label: 'European Ganirelix Study Group: Ganirelix vs Buserelin in IVF (Hum Reprod, 2000)', url: pms('ganirelix buserelin IVF European study 2000') },
  ],
  'linaclotide': [
    { label: 'FDA Prescribing Information — Linzess (linaclotide), 2023', url: fda('202811') },
    { label: 'Rao et al: Linaclotide in Irritable Bowel Syndrome with Constipation (NEJM, 2012)', url: pms('linaclotide irritable bowel syndrome constipation Rao NEJM 2012') },
    { label: 'Lembo et al: Linaclotide in Chronic Idiopathic Constipation (NEJM, 2011)', url: pms('linaclotide chronic idiopathic constipation Lembo NEJM 2011') },
  ],
  'plecanatide': [
    { label: 'FDA Prescribing Information — Trulance (plecanatide), 2023', url: fda('208745') },
    { label: 'Miner et al: Plecanatide for Chronic Idiopathic Constipation (Am J Gastroenterol, 2017)', url: pms('plecanatide chronic idiopathic constipation Miner 2017') },
    { label: 'Brenner et al: Plecanatide for IBS-C (Am J Gastroenterol, 2018)', url: pms('plecanatide IBS-C Brenner 2018') },
  ],
  'teduglutide': [
    { label: 'FDA Prescribing Information — Gattex (teduglutide), 2023', url: fda('203441') },
    { label: 'STEPS: Teduglutide for Short Bowel Syndrome (Gastroenterology, 2012)', url: pms('teduglutide short bowel syndrome STEPS Gastroenterology 2012') },
    { label: 'Jeppesen et al: Teduglutide Reduces Parenteral Nutrition Requirements (Gut, 2011)', url: pms('teduglutide parenteral nutrition short bowel Jeppesen Gut 2011') },
  ],
  'enfuvirtide': [
    { label: 'FDA Prescribing Information — Fuzeon (enfuvirtide), 2023', url: fda('021481') },
    { label: 'Lalezari et al: Enfuvirtide — an HIV-1 Fusion Inhibitor for Drug-Resistant HIV (NEJM, 2003)', url: pm('12584368') },
    { label: 'Lazzarin et al: TORO-1 — Enfuvirtide in Antiretroviral-Experienced Adults (NEJM, 2003)', url: pms('enfuvirtide TORO-1 antiretroviral Lazzarin NEJM 2003') },
  ],
  'vasopressin': [
    { label: 'FDA Prescribing Information — Vasostrict (vasopressin injection), 2023', url: fda('204485') },
    { label: 'VASST: Vasopressin vs Norepinephrine in Septic Shock (NEJM, 2008)', url: pm('18305265') },
    { label: 'Annane et al: Norepinephrine plus Vasopressin vs Norepinephrine in Septic Shock (JAMA, 2018)', url: pms('vasopressin norepinephrine septic shock Annane JAMA 2018') },
  ],
  'glucagon': [
    { label: 'FDA Prescribing Information — GlucaGen (glucagon)', url: dm('glucagon GlucaGen') },
    { label: 'FDA Prescribing Information — Baqsimi (glucagon nasal powder)', url: dm('glucagon Baqsimi nasal') },
    { label: 'Sherr et al: Nasal Glucagon for Severe Hypoglycaemia (Diabetes Care, 2016)', url: pms('nasal glucagon severe hypoglycaemia Sherr 2016') },
  ],
  'angiotensin-ii': [
    { label: 'FDA Prescribing Information — Giapreza (angiotensin II), 2023', url: fda('209360') },
    { label: 'ATHOS-3: Angiotensin II for the Treatment of Vasodilatory Shock (NEJM, 2017)', url: pm('28846487') },
    { label: 'Tumlin et al: Angiotensin II and AKI Outcomes in ATHOS-3 (Crit Care Med, 2018)', url: pms('angiotensin II AKI ATHOS-3 Tumlin 2018') },
  ],
  'triptorelin': [
    { label: 'FDA Prescribing Information — Trelstar (triptorelin pamoate)', url: dm('triptorelin Trelstar') },
    { label: 'EMA Summary of Product Characteristics — Decapeptyl (triptorelin)', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=decapeptyl' },
    { label: 'Heyns & Mahler: Triptorelin in Advanced Prostate Cancer (BJU Int, 2003)', url: pms('triptorelin advanced prostate cancer Heyns Mahler BJU 2003') },
  ],
  'degarelix': [
    { label: 'FDA Prescribing Information — Firmagon (degarelix), 2022', url: fda('022510') },
    { label: 'CS21: Degarelix vs Leuprolide in Prostate Cancer (BJU Int, 2010)', url: pms('degarelix leuprolide prostate cancer CS21 BJU 2010') },
    { label: 'Albertsen et al: Cardiovascular Outcomes with Degarelix vs Leuprolide (J Urol, 2014)', url: pms('degarelix leuprolide cardiovascular outcomes Albertsen J Urol 2014') },
  ],
  'relugolix': [
    { label: 'FDA Prescribing Information — Orgovyx (relugolix), 2023', url: fda('214580') },
    { label: 'HERO: Relugolix for Metastatic Hormone-Sensitive Prostate Cancer (NEJM, 2020)', url: pm('32147386') },
    { label: 'FDA Approval Press Release: Orgovyx (relugolix) for Prostate Cancer (2020)', url: 'https://www.fda.gov/drugs/drug-approvals-and-databases/drug-trials-snapshots-orgovyx' },
  ],
  'pasireotide': [
    { label: "FDA Prescribing Information — Signifor / Signifor LAR (pasireotide)", url: dm('pasireotide Signifor') },
    { label: "PASPORT-I: Pasireotide for Cushing's Disease (NEJM, 2012)", url: pms("pasireotide Cushing's disease PASPORT NEJM 2012") },
    { label: 'Colao et al: Pasireotide LAR vs Octreotide LAR in Acromegaly (J Clin Endocrinol Metab, 2014)', url: pms('pasireotide LAR octreotide acromegaly Colao 2014') },
  ],
  'calcitonin-salmon': [
    { label: 'FDA Prescribing Information — Miacalcin (calcitonin-salmon)', url: dm('calcitonin salmon Miacalcin') },
    { label: 'EMA Assessment: Calcitonin-Containing Medicines — Risk-Benefit Review (2012)', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=calcitonin' },
    { label: 'Chesnut et al: Nasal Calcitonin for Postmenopausal Osteoporosis — PROOF Study (Am J Med, 2000)', url: pms('calcitonin nasal postmenopausal osteoporosis PROOF Chesnut 2000') },
  ],
  'afamelanotide': [
    { label: 'FDA Prescribing Information — Scenesse (afamelanotide), 2019', url: fda('210496') },
    { label: 'Langendonk et al: Afamelanotide for Erythropoietic Protoporphyria (NEJM, 2015)', url: pm('25830322') },
    { label: 'EMA Assessment Report: Scenesse (afamelanotide) — First Approval (2014)', url: 'https://www.ema.europa.eu/en/medicines/search?p_p_id=emaMedSearch_WAR_emaMedSearchportlet&term=scenesse' },
  ],
  'zilucoplan': [
    { label: 'FDA Prescribing Information — Zilbrysq (zilucoplan), 2023', url: fda('216751') },
    { label: 'RAISE: Zilucoplan in Generalized Myasthenia Gravis (NEJM, 2023)', url: pm('37293464') },
    { label: 'Howard et al: Zilucoplan Phase 2 in gMG (JAMA Neurol, 2021)', url: pms('zilucoplan generalized myasthenia gravis Howard JAMA Neurol 2021') },
  ],

  // ── INVESTIGATIONAL ───────────────────────────────────────────────────────────
  'retatrutide': [
    { label: 'Jastreboff et al: Retatrutide (GLP-1/GIP/Glucagon) Phase 2 for Obesity (NEJM, 2023)', url: pm('37366315') },
    { label: 'ClinicalTrials.gov: Retatrutide Phase 3 TRIUMPH Program', url: cts('retatrutide') },
    { label: 'Eli Lilly pipeline: Retatrutide (LY3437943)', url: 'https://investor.lilly.com/pipeline' },
  ],
  'cagrilintide': [
    { label: 'Enebo et al: Cagrilintide + Semaglutide (CagriSema) Phase 1b (Lancet, 2021)', url: pms('cagrilintide semaglutide CagriSema Enebo Lancet 2021') },
    { label: 'ClinicalTrials.gov: REDEFINE 1 — CagriSema Phase 3 in Obesity', url: cts('cagrilintide semaglutide obesity REDEFINE') },
    { label: 'Novo Nordisk pipeline: Cagrilintide (amylin analogue)', url: 'https://www.novonordisk.com/science-and-technology/r-and-d-pipeline.html' },
  ],
  'amycretin': [
    { label: 'Amycretin (oral GLP-1/amylin) Phase 1 Weight Loss Data (EASD, 2023)', url: pms('amycretin oral GLP-1 amylin obesity 2023') },
    { label: 'Novo Nordisk pipeline: Amycretin', url: 'https://www.novonordisk.com/science-and-technology/r-and-d-pipeline.html' },
    { label: 'ClinicalTrials.gov: Amycretin Phase 2 Trial', url: cts('amycretin') },
  ],
  'survodutide': [
    { label: 'Romero-Gómez et al: Survodutide in MASH (Lancet, 2024)', url: pms('survodutide MASH NASH Boehringer Romero 2024') },
    { label: 'ClinicalTrials.gov: Survodutide for MASH', url: ct('NCT04771273') },
    { label: 'Boehringer Ingelheim pipeline: Survodutide (BI 456906)', url: 'https://www.boehringer-ingelheim.com/human-health/metabolic-diseases/survodutide' },
  ],
  'pemvidutide': [
    { label: 'ClinicalTrials.gov: MOMENTUM — Pemvidutide for Obesity', url: ct('NCT05039515') },
    { label: 'Loomba et al: Pemvidutide in MASH (NEJM Evid, 2024)', url: pms('pemvidutide MASH obesity Altimmune Loomba 2024') },
    { label: 'Altimmune pipeline: Pemvidutide (GLP-1/glucagon dual agonist)', url: 'https://www.altimmune.com/pipeline/pemvidutide/' },
  ],
  'mazdutide': [
    { label: 'Ji et al: Mazdutide Phase 2 in Type 2 Diabetes (Lancet Diabetes Endocrinol, 2023)', url: pms('mazdutide type 2 diabetes Innovent Ji Lancet 2023') },
    { label: 'ClinicalTrials.gov: GLORY Program — Mazdutide Phase 3', url: cts('mazdutide GLORY') },
    { label: 'Innovent Biologics pipeline: Mazdutide (IBI362)', url: 'https://www.innoventbio.com/pipeline' },
  ],
  'elamipretide': [
    { label: 'Thompson et al: Elamipretide in Primary Mitochondrial Myopathy (NEJM Evid, 2022)', url: pms('elamipretide primary mitochondrial myopathy Thompson NEJM 2022') },
    { label: 'ClinicalTrials.gov: TAZPOWER — Elamipretide for Barth Syndrome', url: ct('NCT02693431') },
    { label: 'Stealth BioTherapeutics: Elamipretide (SS-31) Clinical Development', url: pms('elamipretide SS-31 mitochondria cardiolipin clinical') },
  ],
  'aviptadil': [
    { label: 'ClinicalTrials.gov: Aviptadil (VIP) for COVID-19-Related ARDS', url: ct('NCT04311697') },
    { label: 'Said & Hamidi: Vasoactive Intestinal Peptide Review (J Mol Neurosci, 2000)', url: pms('vasoactive intestinal peptide VIP lung ARDS Said 2000') },
    { label: 'NeuroRx / Relief Therapeutics: Aviptadil Clinical Development', url: pms('aviptadil VIP respiratory distress COVID-19 clinical trial') },
  ],

  // ── GREY MARKET ──────────────────────────────────────────────────────────────
  'bpc-157': [
    { label: 'Sikiric et al: Stable Gastric Pentadecapeptide BPC-157 — Organ and Healing Effects (Curr Pharm Des, 2018)', url: pms('BPC-157 stable gastric pentadecapeptide Sikiric 2018') },
    { label: "Chang et al: BPC-157 Effect on Tendon Healing in Rats (J Orthop Res, 2011)", url: pms('BPC-157 tendon healing Chang J Orthop Res 2011') },
    { label: 'FDA: BPC-157 — Category 2 Bulk Drug Substances List for Compounding', url: FDA_COMPOUNDING },
  ],
  'tb-500': [
    { label: 'Goldstein et al: Thymosin Beta-4 — A Multi-Functional Regenerative Peptide (Ann N Y Acad Sci, 2012)', url: pms('thymosin beta-4 regenerative wound healing Goldstein 2012') },
    { label: 'RegeneRx: Thymosin Beta-4 Clinical Trials (ClinicalTrials.gov)', url: cts('thymosin beta-4 RegeneRx') },
    { label: 'WADA Prohibited List: Thymosin beta-4 and its Fragments (S2 Peptide Hormones)', url: WADA },
  ],
  'cjc-1295': [
    { label: 'Teichman et al: Prolonged GH Secretion with CJC-1295 (J Clin Endocrinol Metab, 2006)', url: pms('CJC-1295 GHRH growth hormone Teichman 2006') },
    { label: 'WADA Prohibited List: GHRH and Analogues (S2 Peptide Hormones)', url: WADA },
  ],
  'ipamorelin': [
    { label: 'Raun et al: Ipamorelin — a New Bone-Sparing GH Secretagogue (Eur J Endocrinol, 1998)', url: pms('ipamorelin growth hormone secretagogue Raun Eur J Endocrinol 1998') },
    { label: 'Johansen et al: Ipamorelin — a New GH Secretagogue, Cardiovascular Effects (Growth Horm IGF Res, 1999)', url: pms('ipamorelin cardiovascular GH secretagogue Johansen 1999') },
    { label: 'WADA Prohibited List: Growth Hormone Secretagogues (S2 Peptide Hormones)', url: WADA },
  ],
  'ghrp-2': [
    { label: 'Arvat et al: GHRP-2 GH Releasing Activity and Endocrine Interactions (J Endocrinol Invest, 1997)', url: pms('GHRP-2 growth hormone releasing Arvat 1997') },
    { label: 'Ghigo et al: Hexarelin and GHRP-2 Comparative Study (Eur J Endocrinol, 1994)', url: pms('GHRP-2 hexarelin growth hormone comparison Ghigo 1994') },
    { label: 'WADA Prohibited List: Growth Hormone Secretagogues (S2 Peptide Hormones)', url: WADA },
  ],
  'ghrp-6': [
    { label: 'Bowers et al: A Radiolabeled Peptide Agonist Acting on Pituitary GH (Endocrinology, 1984)', url: pms('GHRP-6 growth hormone releasing hexapeptide Bowers 1984') },
    { label: 'Laron et al: GHRP-6 in GH Deficiency (Acta Paediatr, 1994)', url: pms('GHRP-6 growth hormone deficiency Laron 1994') },
    { label: 'WADA Prohibited List: Growth Hormone Secretagogues (S2 Peptide Hormones)', url: WADA },
  ],
  'sermorelin': [
    { label: 'Walker et al: Sermorelin in Adults with GH Deficiency (J Clin Endocrinol Metab, 1995)', url: pms('sermorelin growth hormone deficiency elderly Walker 1995') },
    { label: 'FDA Geref (sermorelin acetate) — Historical Prescribing Information (withdrawn 2008)', url: dm('sermorelin Geref') },
    { label: 'WADA Prohibited List: GHRH and Analogues (S2 Peptide Hormones)', url: WADA },
  ],
  'aod-9604': [
    { label: 'Ng et al: AOD-9604 (hGH fragment 176-191) in Obese Subjects — Phase 3 (Diabetes Obes Metab, 2000)', url: pms('AOD-9604 hGH fragment 176-191 obesity Ng 2000') },
    { label: 'Heffernan et al: AOD-9604 and Cartilage Repair (Am J Physiol Endocrinol Metab, 2001)', url: pms('AOD-9604 cartilage repair Heffernan 2001') },
    { label: 'TGA Australia: AOD-9604 Regulatory and Food Ingredient Status', url: 'https://www.tga.gov.au/news/media-releases/aod-9604' },
  ],
  'melanotan-ii': [
    { label: 'Dorr et al: Melanotropic Peptides — Superpotent Cyclic Analogue (Life Sci, 1996)', url: pms('melanotan-II cyclic analogue melanotropic Dorr 1996') },
    { label: 'Diamond et al: Bremelanotide / Melanotan-II in Erectile Dysfunction (Int J Impot Res, 2004)', url: pms('melanotan II erectile dysfunction Diamond 2004') },
    { label: 'EMA: Warning on Unlicensed Melanotan Medicines (2014)', url: 'https://www.ema.europa.eu/en/news/ema-warns-against-use-unlicensed-melanotan-medicines' },
    { label: 'FDA Warning Letter: Melanotan II — Unapproved Drug (2011)', url: 'https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/tanningproducts' },
  ],
  'epitalon': [
    { label: 'Khavinson et al: Epitalon and Telomerase Activity in Human Somatic Cells (Neuro Endocrinol Lett, 2003)', url: pms('epitalon telomerase activity Khavinson 2003') },
    { label: 'Anisimov et al: Epitalon Effect on Life Span in Drosophila (Ann N Y Acad Sci, 2006)', url: pms('epitalon lifespan aging Anisimov 2006') },
    { label: 'Khavinson & Morozov: Peptides of Pineal Gland and Thymus — Human Longevity (Neuro Endocrinol Lett, 2003)', url: pms('khavinson pineal thymus longevity peptides 2003') },
  ],
  'ghk-cu': [
    { label: 'Pickart & Margolina: Regenerative and Protective Actions of the GHK-Cu Peptide (Biomolecules, 2018)', url: pms('GHK-Cu regenerative skin wound healing Pickart Margolina Biomolecules 2018') },
    { label: 'Pickart et al: GHK-Cu as a Skin Remodelling Tripeptide (J Biomater Sci Polym Ed, 2011)', url: pms('GHK-Cu skin remodelling tripeptide Pickart 2011') },
    { label: 'Leyden et al: GHK-Cu in Cosmetic Anti-Aging (Cosmetic Dermatology, 2003)', url: pms('GHK-Cu copper peptide anti-aging cosmetic Leyden 2003') },
  ],
  'mots-c': [
    { label: 'Lee et al: MOTS-c — A Mitochondrial Peptide Regulating Metabolic Homeostasis (Cell Metab, 2015)', url: pm('25738459') },
    { label: 'Kim et al: MOTS-c Increases Physical Capacity in Aged Mice (Nat Commun, 2022)', url: pms('MOTS-c physical capacity exercise aging Kim Nat Commun 2022') },
    { label: 'Zempo et al: MOTS-c and Exercise Performance (J Physiol, 2021)', url: pms('MOTS-c exercise Zempo J Physiol 2021') },
  ],
  'humanin': [
    { label: "Hashimoto et al: A Rescue Factor Abolishing Neuronal Cell Death by Alzheimer's Genes (Science, 2001)", url: pm('11546873') },
    { label: 'Muzumdar et al: Humanin — A Novel Mitochondrial Peptide in Glucose Homeostasis (Aging Cell, 2009)', url: pms('humanin mitochondrial peptide glucose homeostasis Muzumdar 2009') },
    { label: 'Cobb et al: Mitochondrial Peptides MOTS-c and Humanin (Trends Endocrinol Metab, 2020)', url: pms('humanin MOTS-c mitochondrial peptide Cobb Trends Endocrinol 2020') },
  ],
  'kpv': [
    { label: 'Dalmasso et al: Larazotide Acetate and KPV Tripeptide in Colitis (J Crohns Colitis, 2016)', url: pms('KPV tripeptide colitis anti-inflammatory Dalmasso 2016') },
    { label: 'Kanneganti et al: KPV — Anti-Inflammatory Properties in IBD (Inflamm Bowel Dis, 2020)', url: pms('KPV melanocortin IBD anti-inflammatory Kanneganti 2020') },
  ],
  'll-37': [
    { label: 'Zanetti: LL-37 — The Human Antimicrobial Cathelicidin (J Leukoc Biol, 2004)', url: pms('LL-37 cathelicidin antimicrobial human Zanetti 2004') },
    { label: 'Grönberg et al: Therapeutic Potential of LL-37 (Biochem Soc Trans, 2020)', url: pms('LL-37 therapeutic infection inflammation Gronberg 2020') },
    { label: 'Vandamme et al: LL-37 in Cancer — A Multifaceted Peptide (Front Immunol, 2020)', url: pms('LL-37 cancer multifaceted Vandamme Front Immunol 2020') },
  ],
  'thymosin-alpha-1': [
    { label: 'Goldstein et al: Isolation of a Polypeptide from Calf Thymus (Proc Natl Acad Sci, 1977)', url: pms('thymosin alpha-1 isolation calf thymus Goldstein 1977') },
    { label: 'Pica et al: Thymosin Alpha-1 in Hepatitis B Management (Expert Opin Biol Ther, 2012)', url: pms('thymosin alpha-1 hepatitis B Pica 2012') },
    { label: 'Zhao et al: Thymosin Alpha-1 in Critically Ill COVID-19 Patients (Clin Infect Dis, 2020)', url: pms('thymosin alpha-1 COVID-19 critically ill Zhao 2020') },
  ],
  'selank': [
    { label: 'Zozulya et al: Selank — An Anxiolytic Peptide (Bull Exp Biol Med, 2006)', url: pms('selank anxiolytic peptide Zozulya 2006') },
    { label: 'Semenova et al: Selank — Anxiolytic Preclinical and Clinical Studies (Neurochem J, 2010)', url: pms('selank anxiolytic clinical Semenova 2010') },
    { label: 'Russian State Registry of Medicines: Selank', url: 'https://grls.rosminzdrav.ru/grls.aspx' },
  ],
  'semax': [
    { label: 'Grigoriev et al: Semax in Ischaemic Stroke Recovery (Zh Nevrol Psikhiatr, 2004)', url: pms('semax ischaemic stroke recovery Grigoriev 2004') },
    { label: 'Dolotov et al: Semax Stimulates BDNF and Optic Nerve Recovery (J Neurochem, 2006)', url: pms('semax BDNF optic nerve Dolotov 2006') },
    { label: 'Russian State Registry of Medicines: Semax', url: 'https://grls.rosminzdrav.ru/grls.aspx' },
  ],
  'dihexa': [
    { label: "McCoy et al: Dihexa — Cognitive Enhancer via HGF/Met Signaling (J Pharmacol Exp Ther, 2013)", url: pms('dihexa cognitive enhancer HGF Met McCoy 2013') },
    { label: "Bhatt et al: HGF/Met Pathway Modulation in Alzheimer's Models (Pharmacol Biochem Behav, 2014)", url: pms('dihexa HGF Met Alzheimer Bhatt 2014') },
    { label: 'ClinicalTrials.gov: Search for Dihexa Trials', url: cts('dihexa') },
  ],
  'foxo4-dri': [
    { label: 'Baar et al: Targeted Apoptosis of Senescent Cells Restores Tissue Homeostasis (Cell, 2017)', url: pm('28340339') },
    { label: "van Deursen: FOXO4-DRI — A Senolytic Peptide (Cell, 2017 commentary)", url: pms('FOXO4-DRI senolytic peptide senescent cells commentary 2017') },
    { label: 'ClinicalTrials.gov: Search for Senolytic / FOXO4 Trials', url: cts('FOXO4 senolytic') },
  ],
  'igf-1-lr3': [
    { label: 'Francis et al: Pharmacokinetics of Long R3 IGF-I (J Mol Endocrinol, 1992)', url: pms('Long R3 IGF-I pharmacokinetics Francis 1992') },
    { label: 'Tomas et al: Long R3 IGF-I Prolonged Growth Effects (J Endocrinol, 1992)', url: pms('Long R3 IGF-I growth Tomas J Endocrinol 1992') },
    { label: 'WADA Prohibited List: IGF-1 and Analogues (S2 Peptide Hormones)', url: WADA },
  ],
  'peg-mgf': [
    { label: 'Yang & Goldspink: Mechano Growth Factor Isoform Splicing and Muscle Repair (FEBS Lett, 2002)', url: pms('mechano growth factor MGF splicing muscle Yang Goldspink 2002') },
    { label: 'Dluzniewska et al: PEGylated MGF in Muscle and Neuroprotection (Neuropharmacology, 2005)', url: pms('PEGylated mechano growth factor MGF neuroprotection 2005') },
    { label: 'WADA Prohibited List: Growth Factors and Related Substances (S2)', url: WADA },
  ],
  'mechano-growth-factor': [
    { label: 'Yang & Goldspink: Different Roles of IGF-I Splice Variants in Muscle (FEBS Lett, 2002)', url: pms('mechano growth factor IGF-I splice muscle Yang Goldspink 2002') },
    { label: 'Goldspink et al: Mechano Growth Factor — Distinct from Systemic IGF-I (J Anat, 2006)', url: pms('mechano growth factor distinct IGF-I Goldspink J Anat 2006') },
    { label: 'WADA Prohibited List: Growth Factors and Related Substances (S2)', url: WADA },
  ],
  'kisspeptin-10': [
    { label: 'Dhillo et al: Kisspeptin-54 Potently Stimulates the HPG Axis (J Clin Endocrinol Metab, 2005)', url: pms('kisspeptin-54 HPG axis LH Dhillo 2005') },
    { label: 'George et al: Kisspeptin-10 Effects in Healthy Male Volunteers (Clin Endocrinol, 2011)', url: pms('kisspeptin-10 reproductive hormones men George 2011') },
    { label: 'Jayasena et al: Kisspeptin-54 for Triggering Oocyte Maturation in IVF (J Clin Endocrinol Metab, 2014)', url: pms('kisspeptin-54 IVF oocyte maturation Jayasena 2014') },
  ],
  '5-amino-1mq': [
    { label: 'Davern et al: NNMT Inhibition Reduces Fat Mass and Improves Metabolism (Sci Rep, 2021)', url: pms('5-amino-1-methylquinolinium NNMT inhibitor fat mass Davern 2021') },
    { label: 'Perretti et al: Targeting NNMT as a Metabolic Regulator (Cell Metab, 2020)', url: pms('NNMT nicotinamide N-methyltransferase metabolic Perretti 2020') },
    { label: 'ClinicalTrials.gov: Search for NNMT Inhibitor Trials', url: cts('NNMT inhibitor obesity') },
  ],
  'hexarelin': [
    { label: 'Ghigo et al: Hexarelin — a Novel GH-Releasing Hexapeptide (J Clin Endocrinol Metab, 1994)', url: pms('hexarelin growth hormone releasing hexapeptide Ghigo 1994') },
    { label: 'Arvat et al: Hexarelin — a Synthetic GH Secretagogue, Comparison (J Endocrinol Invest, 1995)', url: pms('hexarelin GH secretagogue comparison Arvat 1995') },
    { label: 'WADA Prohibited List: Growth Hormone Secretagogues (S2 Peptide Hormones)', url: WADA },
  ],
  'dsip': [
    { label: 'Graf & Kastin: Delta Sleep-Inducing Peptide — A Review (Neurosci Biobehav Rev, 1984)', url: pms('delta sleep-inducing peptide DSIP review Graf Kastin 1984') },
    { label: 'Kovalzon: DSIP — A Review of 40 Years (J Sleep Res, 2014)', url: pms('DSIP delta sleep-inducing peptide 40 years Kovalzon 2014') },
  ],
  'pe-22-28': [
    { label: 'Mazella et al: Spadin (PE-22-28) and TREK-1 Potassium Channel Antagonism (Neuron, 2010)', url: pms('spadin PE-22-28 TREK-1 antidepressant Mazella Neuron 2010') },
    { label: 'Zussy et al: Antidepressant-Like Effect of PE-22-28 (Neuropsychopharmacology, 2018)', url: pms('PE-22-28 antidepressant spadin Zussy Neuropsychopharmacology 2018') },
    { label: 'ClinicalTrials.gov: Search for Spadin / PE-22-28 Trials', url: cts('spadin PE-22-28 antidepressant') },
  ],
  'p21': [
    { label: 'Cobb et al: P21 Peptide Inhibits Inflammation via PCNA (J Immunol, 2015)', url: pms('p21 peptide PCNA inflammation Cobb J Immunol 2015') },
    { label: 'ClinicalTrials.gov: Search for P21 Peptide Trials', url: cts('p21 peptide anti-inflammatory') },
  ],
  'pinealon': [
    { label: 'Khavinson et al: Neuroprotective Effect of Pinealon Tripeptide (EDR) in Rats (Neurosci Lett, 2012)', url: pms('pinealon EDR Glu-Asp-Arg neuroprotective Khavinson Neurosci Lett 2012') },
    { label: 'Khavinson & Malinin: Gerontological Aspects of Genome Peptide Regulation (Karger, 2005)', url: pms('Khavinson Malinin genome peptide regulation aging bioregulatory 2005') },
  ],
}

let updated = 0
let skipped = 0
let noData = 0

for (const category of CATEGORIES) {
  const dir = join(CONTENT_DIR, category)
  if (!existsSync(dir)) continue
  const files = readdirSync(dir).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const filePath = join(dir, file)
    const raw = readFileSync(filePath, 'utf-8')

    const slugMatch = raw.match(/^slug:\s+"?([^"\n]+)"?/m)
    const slug = slugMatch?.[1]?.trim()

    if (!slug) { console.log(`no slug: ${file}`); skipped++; continue }

    const sources = SOURCES[slug]
    if (!sources) { console.log(`no data for slug: ${slug}`); noData++; continue }

    // Build YAML block for label/url objects
    const sourcesYaml = `sources:\n${sources.map(s => {
      const label = s.label.replace(/"/g, '\\"')
      const url   = s.url
      return `  - label: "${label}"\n    url: "${url}"`
    }).join('\n')}`

    let patched
    if (/^sources:/m.test(raw)) {
      // Replace existing sources block (from previous run that used plain strings)
      patched = raw.replace(/^sources:[\s\S]*?(?=\n---)/m, sourcesYaml)
    } else {
      // Append before closing ---
      patched = raw.replace(/^(---\s*\n)([\s\S]*?)(---)/m, (_, open, body, close) => {
        return `${open}${body}${sourcesYaml}\n${close}`
      })
    }

    writeFileSync(filePath, patched, 'utf-8')
    updated++
  }
}

console.log(`Done: ${updated} updated, ${skipped} skipped, ${noData} with no source data`)
