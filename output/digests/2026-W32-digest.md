# Lymphedema Research Digest — Week 32, 2026

*Deep synthesis run — 2026-08-09 (`deep_2026-W32_001`). Scope: primary (genetic / developmental / hereditary) lymphedema only.*

> **Data-integrity note (read first):** At the start of this run, 212 papers carried `status: new`. Triage found that **110 of them (52%) do not contain the word "lymph" anywhere in title or abstract** — they are not lymphedema papers at all. This looks like a fetch-pipeline scope bug: candidates appear to have been pulled in by unconstrained gene-name searches (PIEZO1, VEGFC, FLT4, mTOR, etc.) with no lymphedema-relevance gate. Examples actually in the queue this week: a VEGF-C gene-therapy trial for refractory angina, an mTOR-inhibitor trial in kidney-transplant vaccine response, two AMD gene-therapy papers, an atrial-fibrillation fibrosis review, and — the clearest sign something is wrong — a case report titled *"Prohibited Olympic Medalist with PIEZO1 VUS Who Claims Innocence,"* matched purely on the gene name. Of the remaining 102 papers that do mention lymphedema/lymphatic, the project's own `classify_lymphedema_type()` classifier (added to `scripts/baseline_process.py` in an uncommitted change; never wired into the actual fetch/ingestion pipeline) returned **"unknown" for all 102** — its phrase-matching is too brittle to resolve real cases (e.g. "VLNT donor-site meta-analysis" doesn't literally say "breast cancer" but is BCRL-dominated literature in practice). This run used a manual/agent-based title-abstract triage instead and found only **18 of 212 (8.5%)** were genuinely in-scope primary/both lymphedema literature; 66 were secondary lymphedema and 14 were unrelated-disease papers that happened to mention "lymph." All 190 out-of-scope papers were purged from `data/papers.json` into `data/papers-purged-2026-08-09.json` (full audit trail, nothing deleted) rather than synthesized. **This is a pipeline bug, not a one-time cleanup — it will recur on the next scan/deep run until the fetch step itself is scoped.** See Watchlist.

## Highlights

**1. Fetch pipeline is pulling in papers with no lymphedema relevance at all — 52% of this week's "new" queue.**
- **What happened:** 110 of 212 papers tagged `new` never mention "lymph" anywhere in title or abstract; most look like gene-name search overreach (PIEZO1, VEGFC, mTOR) unrelated to lymphatic disease.
- **Why people may care:** This is a data-quality risk to the whole knowledge base, not a single bad paper — every future scan/deep run inherits the same noise until the ingestion query logic is fixed.
- **What limits confidence:** This is an operational/engineering finding, not a scientific one — it says nothing about the primary-lymphedema evidence base itself, only about this project's data pipeline.
- **Classification:** practice-relevant (for the project's own operation, not clinical practice)
- **Scores:** Importance 8/10 | Evidence 10/10 (directly counted, not inferred) | Novelty 7/10 | Decision 9/10 | Calibration 9/10

**2. EPHB4-RASA1 signaling is now mechanistically linked to PIEZO1 specifically in lymphatic valve formation.**
- **What happened:** A *Circulation Research* (2024) study in lymphatic-endothelial-specific EPHB4 knockin/knockout mice, with human dermal lymphatic endothelial cells in vitro, shows EPHB4/RASA1 act upstream of PIEZO1-driven Ras signaling during lymphatic valve development, connecting two previously separate malformation-associated genes into one pathway. Extends `finding_piezo1_pathway_preclinical`.
- **Why people may care:** It's one more piece of convergent mechanistic evidence around PIEZO1, currently one of the field's more actively pursued drug-development targets.
- **What limits confidence:** Mouse knockin/knockout + in vitro only — no human patient data, no therapeutic testing, and lymphedema preclinical models translate poorly to human primary disease.
- **Classification:** hypothesis-generating
- **Scores:** Importance 4/10 | Evidence 3/10 | Novelty 4/10 | Decision 2/10 | Calibration 8/10

**3. Prenatal sirolimus reported for fetal capillary-lymphatic-venous malformation — a new timing data point in the ongoing mTOR/MEK case series.**
- **What happened:** A *Paediatric Drugs* (2025) report describes two cases of oral sirolimus started in utero (32–33 weeks' gestation) and continued postnatally for extensive fetal CLVM, in pregnancies complicated by intralesional bleeding. Extends `finding_mtor_mek_neonatal_lymphatic_anomalies_2026`.
- **Why people may care:** Nearly all prior evidence in this line was postnatal; prenatal initiation for a life-threatening congenital lymphatic anomaly is a meaningfully different clinical scenario.
- **What limits confidence:** n=2, single-arm, no comparator, and this finding's evolution history already carries an infant-dyslipidemia safety signal for sirolimus that this report does not address.
- **Classification:** hypothesis-generating
- **Scores:** Importance 4/10 | Evidence 2/10 | Novelty 5/10 | Decision 2/10 | Calibration 7/10

## New Papers

### Genetics & Biomarkers

**PIEZO1 mechanistic map** — see Highlight #2. Also extended by a single-cell RNA-seq conference abstract reporting a Piezo2–Vegfr3–Prox1 axis regulating lymphangiogenesis during adipose-tissue expansion in mice (obesity-lymphatic-dysfunction angle). Both extend `finding_piezo1_pathway_preclinical`. Hypothesis-generating · Importance 3-4 · Evidence 2-3 · Novelty 4-5 · Decision 1-2 · Calibration 7-8. *Limits: both preclinical mouse/in-vitro; conference abstract lacks full peer-reviewed methods detail.*

**Recombinant VEGF-C in experimental cirrhosis (mesenteric lymphatics)** — *JHEP Reports, 2023.* Rat model; orally-delivered nanoformulated VEGF-C improved mesenteric lymphatic drainage and reduced ascites in cirrhosis. General lymphatic pharmacology, not a lymphedema-disease study, tracked here only because the mechanism (VEGF-C improving lymphatic vessel function) is directly relevant to genetics/pathway understanding. Background/context · Importance 2 · Evidence 3 · Novelty 3 · Decision 1 · Calibration 8. *Limits: rat model, gut/cirrhosis indication, not lymphedema; preclinical translation caveat applies in full.*

**Yellow Nail Syndrome** — *Clinics in Dermatology, 2026* (narrative review). Reviews the yellow-nail/lymphedema/respiratory-disease triad, a paraneoplastic-association hypothesis, and symptomatic management only. Background/context · Importance 2 · Evidence 1 · Novelty 1 · Decision 1 · Calibration 9. *Limits: pure narrative review, no new data; no new finding created.*

### Disease Management

**Thoracic duct-to-azygous vein lymphovenous anastomosis in neonates/infants (n=8)** — *Annals of Thoracic Surgery Short Reports, 2025.* Single-institution (CHOP) retrospective series of a novel surgical decompression technique for thoracic duct obstruction in critically ill infants. Hypothesis-generating · Importance 4 · Evidence 3 · Novelty 5 · Decision 2 · Calibration 7. *Limits: n=8, single center, retrospective, no comparator — standard surgical-evidence-gap caveat applies even though this is a primary/developmental population.*

**General reviews and access/measurement studies, background/context only — 5 papers.** *Guidelines Relevant to Diagnosis, Assessment, and Management of Lymphedema* (systematic review of guidelines), *Lymphedema Imaging and AI* (review), *Predictors of the Efficacy of Lymphedema Decongestive Therapy* (review), *Fueling lymphatic health: nutrition in lymphedema management* (review), and *Finding a Certified Lymphedema Therapist: Access to Lymphedema Treatment in Minnesota* (workforce/access study). None are etiology-specific and none report new primary-lymphedema data. Background/context · Importance 2 · Evidence 2 · Novelty 1-2 · Decision 1 · Calibration 8-9. *Limits: consolidation/access literature, not new evidence; not etiology-stratified so any primary-lymphedema-specific signal is not extractable.*

**Digital combined decongestive therapy, prospective (lower extremity)** — etiology not specified in abstract. Hypothesis-generating · Importance 3 · Evidence 3 · Novelty 3 · Decision 2 · Calibration 6. *Limits: population etiology unclear; chronic-disease fluid-shift caution applies to any short-term volume outcome.*

**Preclinical regenerative-mechanism papers, 4 studies (mouse/rat models, not etiology-specific).** 3D bioprinted MSC-based artificial lymph nodes; stromal vascular fraction + lymph node transfer (rabbit hindlimb); cell-free adipose liquid extract + VLNT (rat); Poria cocos exosome-like nanoparticles reprogramming fibroblast metabolism; VEGF-C + adipose-derived stem cells for lymphatic regeneration (rat). All animal-model mechanistic/therapeutic-development work. Background/context · Importance 2-3 · Evidence 2 · Novelty 3-4 · Decision 1 · Calibration 8. *Limits: all preclinical animal models; per this knowledge base's standing caution, mouse/rat lymphedema models translate poorly to human disease — none of these should be read as near-term therapeutic progress.*

**Recurrent pediatric vesical lymphangioma — case report** — *2026.* First reported early relapse after transurethral resection of a bladder lymphatic malformation in a child. Hypothesis-generating · Importance 2 · Evidence 1 · Novelty 4 · Decision 1 · Calibration 8. *Limits: single case report.*

## Negative / Null Results This Week

None identified among the 18 in-scope papers processed this run.

## Trial Updates

None. All 22 tracked trials were already checked this week by the 2026-08-08 scan (`scan_2026-W32_003`); no status or phase changes, no results postings. See `output/digests/2026-W32-scan-supplement*.md` for scan-cycle detail (not repeated here).

## Evolving Understanding

- **PIEZO1 pathway:** Broadening, not deepening. Two new preclinical papers extend where PIEZO1 sits in lymphatic developmental signaling (valve formation via EPHB4-RASA1; adipose lymphangiogenesis via Piezo2-Vegfr3), but neither adds clinical or translational evidence. Confidence remains `low_to_moderate`.
- **mTOR/MEK-targeted therapy for lymphatic anomalies:** Now has a prenatal-initiation case, adding a new clinical-timing dimension to a still entirely case-report-level evidence base. Confidence remains `low_to_moderate`; the infant-dyslipidemia safety signal from this finding's evolution history still applies and prenatal sirolimus exposure raises additional unaddressed safety questions (not assessed in the source report).
- **What this week's pollution incidentally confirms:** Of the 66 papers triaged as secondary lymphedema, the overwhelming majority were LVA/VLNT surgical case series and compression-therapy studies — the same pattern already tracked in `finding_surgical_evidence_gap_global`. This is circumstantial support (not new evidence) for the standing observation that the general lymphedema-surgery literature is dominated by secondary/BCRL populations, which is exactly why an explicit scope gate at ingestion matters.

## Skepticism Notes

- **The classifier cannot be trusted alone.** `classify_lymphedema_type()` returned "unknown" for 100% of the 102 lymph-mentioning candidates this week, including papers this run confidently triaged as secondary (e.g. explicit "41 women with unilateral secondary leg lymphedema," "compression-refractory secondary extremity lymphedema"). Its phrase-matching approach misses real-world abstracts that don't use its exact trigger phrases. Any future automated purge based on this classifier alone should be treated with the same skepticism applied to any other unvalidated tool — spot-check it before trusting its "unknown" bucket as safe-to-keep.
- **4 papers left unresolved (`status: new`, `lymphedema_type: unknown`).** A chylothorax case report, a thoracic-duct lymphovenous-coupler series, a Morbihan disease (facial lymphedema from rosacea — acquired inflammatory, arguably out of scope) LVA case report, and a French disability-questionnaire validation study. All are low-relevance (2-4/10) even if in-scope, so leaving them unresolved this week has low cost.
- **Preclinical animal-model over-representation:** 6 of this week's 18 in-scope papers were mouse/rat/in-vitro mechanistic or regenerative-therapy studies. None should be read as near-term clinical progress — see the standing preclinical-translation caution repeated above.

## Watchlist

- **Fetch pipeline needs a lymphedema-relevance gate.** This is the actionable item from this week's data-integrity finding — not agent-fixable within a scan/deep run; needs the user or a dedicated engineering pass on `baseline_fetch.py`/`pubmed_fetch.py`/`merge_pubmed.py` to require a lymph/lymphatic term before a candidate paper enters `papers.json` at all.
- **`classify_lymphedema_type()` exists only as an uncommitted change** to `scripts/baseline_process.py` (+445/-30 lines, also adds multi-axis scoring) and has never been wired into the actual ingestion pipeline. Recommend the user review and either commit it (after tightening the phrase-matching, per the Skepticism Notes above) or discard it in favor of a different scoping approach.
- **~129 already-`incorporated`/`active`/`scan_added` papers still carry `lymphedema_type: unknown`** from before this classifier existed. Out of scope for this run (which only processed the `new` queue); flagged for a future dedicated backlog pass.
- **Semantic Scholar API 403 outage**, unresolved as of the 2026-08-08 scan — now spanning 18 days / 10 consecutive runs (`data-integrity-semantic-scholar-403` memory). Needs user key check/rotation.
- **Write(path) vs Edit(path) permission-rule-kind mismatch** in `.claude/settings.local.json` remains unresolved; this run used the established Bash+python3 workaround for JSON data files (`feedback-write-permissions` memory).
- **Repo clutter backlog** (root-level misplaced digest/apply-script files, ~15 data backup snapshots) untouched this run per standing guidance not to unilaterally delete — ask the user before cleaning up.

## Data Summary

- Papers tracked: 151 total (down from 341; 190 purged as out-of-scope this run — see data-integrity note above).
- Papers reviewed this run: 212 (100% of the `new` queue at run start).
- Papers purged as out-of-scope: 190 (110 no-lymph-mention/off-topic, 66 secondary lymphedema, 14 unrelated-disease-context). Full audit trail: `data/papers-purged-2026-08-09.json`.
- Papers incorporated into synthesis: 18 (7 primary, 11 both).
- Papers left unresolved (ambiguous scope): 4.
- Trials monitored: 22 (0 updates this run).
- Findings updated: 2 (`finding_piezo1_pathway_preclinical`, `finding_mtor_mek_neonatal_lymphatic_anomalies_2026`), both extended with new supporting papers, no new findings created.
- Papers flagged for skepticism: 4 (the unresolved-scope papers above) plus the systemic classifier-reliability concern.
