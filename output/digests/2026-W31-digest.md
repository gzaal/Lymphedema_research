# Lymphedema Research Digest — Week 31, 2026

*Deep synthesis run — 2026-08-02 (`deep_2026-W31_001`). Scope: primary (genetic / developmental / hereditary) lymphedema only.*

> **Data-integrity note (read first):** Before this synthesis ran, `data/papers.json` was audited and purged. The corpus had grown to 458 papers, but only 71 (45 `primary` + 26 `both`) carried a confirmed in-scope tag — 176 papers had no `lymphedema_type` field at all (residue of the 2026-05-21 re-baseline) and 211 were tagged `unknown`. Re-running `classify_lymphedema_type()` against the untagged/unknown backlog reclassified 180 records; 128 were confirmed secondary (BCRL, filarial, post-surgical) and purged, plus 2 more caught by manual review during this synthesis (a BCRL-prevention risk score and a scrotal case report whose actual patient was secondary, despite background text mentioning "primary lymphedema"). **Net: 458 → 328 papers.** Full pre-purge backup at `data/papers.bak-2026-08-02-pre-deep-purge.json`; purge audit trail at `data/papers-purged-2026-08-02.json`. This resolves the data-integrity issue flagged as outstanding since the 2026-05-21 re-baseline (memory: `data-integrity-scope-pollution`).
>
> This synthesis processed the 34 papers tagged `primary`/`both` with status `new` (2 of which were the manual reclassifications above, dropped; 2 more were already cited in existing findings but never marked `incorporated`). **211 papers remain tagged `unknown`** (ambiguous — no primary or secondary signal detected, e.g. general LVA/VLNT literature not identifying patient population) and were **not** processed this run; they remain a lower-priority backlog for a future pass. See Watchlist.

## Highlights

**1. Italian cohort (n=408) publishes a fifth installment: 18 likely-pathogenic transcription-factor-network variants across FOXC1, NOTCH1, RORC, FOXC2, SOX18.**
- **What happened:** The same systematically-screened 408-patient Italian primary lymphedema cohort behind the previously tracked HGF-MET and RAS-MAPK reports has now published variant screening across 5 transcription-factor genes, finding 18 likely-pathogenic variants, most novel.
- **Why people may care:** FOXC2 and SOX18 are established lymphedema genes; this extends the known variant catalog and proposes 3 additional network-adjacent candidate genes (FOXC1, NOTCH1, RORC).
- **What limits confidence:** In silico/rarity-based variant calling only — no functional validation for most variants in this paper, and the 3 novel candidate genes rest on known protein-network interactions with FOXC2/SOX18, not independent evidence in this cohort.
- **Classification:** hypothesis-generating
- **Scores:** Importance 5/10 | Evidence 3/10 | Novelty 6/10 | Decision 2/10 | Calibration 8/10

**2. A 2024 mechanistic paper is identified as the missing source for the PIEZO1→ANGPT2→TIE1/FOXO1 pathway this knowledge base has described since April without a citation.**
- **What happened:** Sabine et al. (JCI, May 2024) show PIEZO1 activation in lymphatic endothelial cells triggers ANGPT2 exocytosis and TIE1 ectodomain shedding, directly linking PIEZO1 to a previously separate line of angiopoietin/TIE genetics; a 2023 case report additionally extends the PIEZO1 phenotype to isolated persistent chylothorax.
- **Why people may care:** This is one of the better-mechanistically-supported convergence points in primary lymphedema genetics — human genetic association, a defined molecular mechanism, and a mouse pharmacologic proof-of-concept (PIEZO1 agonist Yoda1) all point the same direction.
- **What limits confidence:** The pharmacologic angle is mouse-only; lymphedema preclinical models have a poor record of translating to human primary disease, and Yoda1 has not been tested in humans.
- **Classification:** hypothesis-generating
- **Scores:** Importance 6/10 | Evidence 5/10 | Novelty 4/10 | Decision 3/10 | Calibration 8/10

**3. Case-report evidence for mTOR/MEK-targeted therapy in lymphatic malformations continues to accumulate across distinct subtypes and genetic backgrounds.**
- **What happened:** Three new case reports describe sirolimus and/or trametinib for complex lymphatic anomaly (including a case where MEK inhibitor was added after sirolimus effectiveness waned), tongue lymphangioma circumscriptum, and Noonan-syndrome-associated chylothorax.
- **Why people may care:** This is now a multi-subtype, multi-genetic-background pattern (isolated complex lymphatic anomaly and RASopathy-associated disease), which is more informative than any single case, and is relevant to clinicians managing severe pediatric/neonatal lymphatic malformations who lack surgical options.
- **What limits confidence:** Still entirely case-report level — no control arm, no standardized outcome measure, and a prior report in this same finding's history flagged an infant dyslipidemia safety signal that these new cases do not address.
- **Classification:** hypothesis-generating
- **Scores:** Importance 5/10 | Evidence 3/10 | Novelty 4/10 | Decision 4/10 | Calibration 7/10

## New Papers

### Genetics & Biomarkers

**FLT4/VEGFR3 (Milroy disease) — variant catalog and mechanism, 4 papers.** Extends `finding_flt4_vus_characterization_2026`.
- *Monaghan et al., Clinical Genetics, Dec 2024* — Screened 24 primary lymphedema patients; identified novel likely-pathogenic c.3028A>C and supported pathogenicity of 2 previously-described VUS. Hypothesis-generating · Importance 4 · Evidence 4 · Novelty 3 · Decision 2 · Calibration 8. *Limits: small cohort (n=24), in vitro/in silico support only for most variants.*
- *Birth Defects Research, Mar 2023* — 2 novel FLT4 variants in prenatally-diagnosed hereditary lymphedema type 1 (n=2 fetuses). Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 3 · Decision 1 · Calibration 8. *Limits: n=2, no functional characterization.*
- *Cardiovascular Research, Sep 2024* — Cell-based mechanistic study shows Tetralogy-of-Fallot-causing and Milroy-causing FLT4 variants aggregate differently in endothelial cells, a candidate explanation for non-overlapping phenotypes. Hypothesis-generating · Importance 4 · Evidence 3 · Novelty 5 · Decision 2 · Calibration 7. *Limits: transfected-cell preclinical model; poor lymphedema preclinical-to-clinical translation record applies.*
- *Int J Mol Sci, Nov 2024* (review) — Catalogs understudied molecules in lymphatic endothelial cells. Background/context · Importance 2 · Evidence 2 · Novelty 2 · Decision 1 · Calibration 9. *Limits: narrative review, no new data.*

**FOXC2 / lymphedema-distichiasis syndrome — 4 papers.**
- *BMC Ophthalmology, Apr 2026* — Novel corneal amyloid phenotype in a FOXC2-distichiasis patient, histologically identical to a TACSTD2-associated dystrophy. New finding `finding_foxc2_corneal_amyloid_phenotype_2026`. Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 6 · Decision 1 · Calibration 8. *Limits: n=1, TACSTD2 co-pathology not excluded by sequencing.*
- *Stem Cell Research, Jun 2025* — Generation of a patient-derived iPSC line from an LDS/FOXC2 patient — a research resource, not a clinical finding. Background/context · Importance 3 · Evidence n/a · Novelty 4 · Decision 1 · Calibration 9. *Limits: enabling resource only, no disease-model results reported yet.*
- *Arch Soc Esp Oftalmol, Apr 2024* and *Chinese J Med Genet, Oct 2024* (2 pedigrees) — Diagnostic/clinical-features reports on LDS via FOXC2 testing, geographically extending known phenotype. Background/context · Importance 2-3 · Evidence 2-3 · Novelty 2 · Decision 1 · Calibration 8. *Limits: no new gene or mechanism, case-series/diagnostic-education framing.*

**Italian cohort (n=408) transcription-factor network** — see Highlight #1. New finding `finding_italian_cohort_tf_network_2026`.

**PIEZO1 pathway and phenotype** — see Highlight #2. Extends `finding_piezo1_pathway_preclinical`.

**GJA4 novel candidate gene** — *Cureus, Nov 2025.* Homozygous nonsense GJA4 variant in a fetus with increased nuchal fold thickness (no lymphedema diagnosis reported). New finding `finding_gja4_valvulogenesis_variant_2026`. Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 6 · Decision 1 · Calibration 8. *Limits: n=1, prenatal soft-marker association only, not a lymphedema phenotype.*

**HGF familial case (2024)** — Independent single-family HGF variant, predates and may inform the Italian cohort's HGF/MET/CBL panel selection. Extends `finding_hgf_met_primary_le_2025`. Hypothesis-generating · Importance 2 · Evidence 2 · Novelty 2 · Decision 1 · Calibration 8. *Limits: n=1 family, no functional validation.*

**Updated classification system (n=1,013)** — *Lymphology, Jun 2024.* Largest single-cohort primary lymphedema series tracked to date; proposes an onset-age/imaging/genetics classification framework. New finding `finding_primary_le_classification_1013_2024`. Hypothesis-generating · Importance 5 · Evidence 4 · Novelty 3 · Decision 3 · Calibration 8. *Limits: single-center, not externally validated, purely descriptive (no treatment/outcome claim).*

**SOX18 zebrafish model** — *Cells, Sep 2023.* Zebrafish sox18 mutant lymphatic defects exacerbated by VEGFC perturbation, masked by elevated sox7. Background/context · Importance 2 · Evidence 2 · Novelty 3 · Decision 1 · Calibration 9. *Limits: zebrafish preclinical model; translational relevance to human primary lymphedema unproven.*

**S1PR1 lymphatic valve development** — *J Exp Med, Sep 2025.* Mouse S1PR1 deletion causes lymphatic valve loss and ectopic tertiary lymphoid organs in the ileum. General lymphatic developmental biology, not disease-specific. Background/context · Importance 3 · Evidence 3 · Novelty 3 · Decision 1 · Calibration 8. *Limits: mouse mechanistic model, no direct primary lymphedema patient data.*

**Intestinal ultrasound in primary intestinal lymphangiectasia (Waldmann's disease)** — *J Ultrasound, Jul 2026.* Scoping review (15 studies) describing a sonographic signature; diagnostic-accuracy support from only 1 small study (n=20). Background/context · Importance 3 · Evidence 3 · Novelty 3 · Decision 2 · Calibration 7. *Limits: review, not primary data; diagnostic-accuracy claim thinly supported.*

### Disease Management

**LVA/VLNT for primary lymphedema specifically — 2 papers.** Extends `finding_surgical_evidence_gap_global` (confidence unchanged: still no RCT).
- *JPRAS, Feb 2024* — Retrospective, single-arm LVA outcomes in adult-onset primary lower-limb lymphedema. Hypothesis-generating · Importance 4 · Evidence 3 · Novelty 3 · Decision 2 · Calibration 7. *Limits: no control arm, standard surgical-evidence-gap caveats apply.*
- *J Surg Res, Dec 2025 (Zurich)* — Retrospective comparison of LVA/VLNT outcomes between primary and secondary lymphedema patients (2016-2023). Notable as one of the few studies with a defined etiology-based comparator. Hypothesis-generating · Importance 5 · Evidence 4 · Novelty 4 · Decision 3 · Calibration 7. *Limits: comparator is etiology, not surgery-vs-no-surgery; still retrospective, no standardized outcome measure.*

**mTOR/MEK case accumulation** — see Highlight #3. Extends `finding_mtor_mek_neonatal_lymphatic_anomalies_2026`.

**Bleomycin sclerotherapy for orbital-adnexal lymphatic malformations (n=51)** — *Indian J Ophthalmol, May 2026.* Retrospective series, non-image-guided injection, outcomes vary by lesion morphology. New finding `finding_bleomycin_sclerotherapy_orbital_lm_2026`. Hypothesis-generating · Importance 4 · Evidence 4 · Novelty 3 · Decision 3 · Calibration 7. *Limits: no comparator arm, subjective regression grading.*

**Pneumatic compression patient-reported outcomes survey (n=10,543)** — *JVS-VL, 2026.* High self-reported satisfaction with pneumatic compression devices. New finding `finding_pneumatic_compression_pro_survey_2026`. Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 3 · Decision 2 · Calibration 6. *Limits: no control arm, all self-reported, response-bias risk, possible undisclosed device-manufacturer sponsorship not confirmable from the record available — large N does not offset design weakness.*

**Pediatric CDT summer-camp data (n=38 campers)** — *Lymphatic Research and Biology, Aug 2025.* Retrospective, mixed primary/secondary pediatric population, significant volume reduction over 4 days of twice-daily CDT. New finding `finding_pediatric_cdt_camp_2025`. Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 2 · Decision 2 · Calibration 6. *Limits: mixed-etiology cohort not stratified, no control, short intervention window — chronic-disease fluid-shift caution applies.*

**ICG lymphography differentiates lipedema from bilateral lymphedema** — *Clinical Obesity, Jun 2023.* Retrospective cross-sectional study. New finding `finding_icg_lipedema_differentiation_2023`. Hypothesis-generating · Importance 4 · Evidence 4 · Novelty 3 · Decision 3 · Calibration 7. *Limits: single center, not a prespecified diagnostic-accuracy study; addresses lipedema-vs-lymphedema broadly, not primary-vs-secondary etiology.*

**Lymphatic malformation general management — 4 papers, background/context.**
- *Radiologie, May 2025* (review) and *Best Practice & Research Clin Obstet Gynaecol, Oct 2025* (fetal mTOR-inhibitor review) — general/narrative reviews, no new primary data. Background/context · Importance 2-3 · Evidence 2 · Novelty 2 · Decision 1 · Calibration 9.
- *Lymphology, 2025* — 10-year retrospective (n=13) on LM recurrence risk factors and surgical-vs-endovascular treatment comparison. Hypothesis-generating · Importance 3 · Evidence 2 · Novelty 2 · Decision 2 · Calibration 7. *Limits: very small n, retrospective, underpowered for the multivariable comparison attempted.*
- *J Craniofac Surg, May 2026* — Case report, airway/anesthetic management of a hemorrhagic neonatal cervicofacial lymphatic malformation. Background/context · Importance 2 · Evidence 1 · Novelty 2 · Decision 1 · Calibration 8. *Limits: single case, procedural/anesthetic focus rather than generalizable treatment evidence.*

## Negative / Null Results This Week

None. No negative or null-result studies were identified among this week's 30 synthesized papers — all are either descriptive/mechanistic reports or uncontrolled positive-direction case series. This is itself worth flagging: the surgical and lymphatic-malformation-treatment literature this week continues the field-wide pattern of near-exclusively single-arm, positively-framed retrospective series (see `finding_surgical_evidence_gap_global`), which the evaluation framework treats as a systematic bias, not evidence of uniform treatment success.

## Trial Updates

No deep-run-relevant trial data changes. The one trial status event this week (NCT05269264: RECRUITING → UNKNOWN, a registry lapse) was already covered in the 2026-08-01 scan digest (`output/digests/2026-W31-scan-supplement.md`); it is a registry-verification lapse, not new data, and is not repeated here.

## Evolving Understanding

- **PIEZO1 pathway:** Upgraded from an uncited mechanistic claim to a `low_to_moderate`-confidence finding now that its source paper (Sabine et al., JCI 2024) has been identified and linked. This is a data-hygiene correction as much as a scientific update — the underlying claim was already in the knowledge base, just previously unsupported by a traceable citation.
- **Italian cohort (n=408):** Now has 3 tracked publications in this system (HGF-MET, RAS-MAPK, and this week's transcription-factor network). Per standing guidance in project memory, these should continue to be read as installments of one systematic screening program, not independent discoveries — the cumulative picture is a broadening candidate-gene panel from one well-characterized cohort, not yet independently replicated elsewhere.
- **Surgical evidence gap:** Reinforced, not narrowed. Two more primary-lymphedema-specific LVA/VLNT studies were added this week, both retrospective and single-arm or etiology-comparator (not surgery-vs-no-surgery). The core conclusion — no RCT exists for LVA/VLNT in primary lymphedema — is unchanged after 6 supporting studies.
- **mTOR/MEK-targeted therapy:** The evidence base is broadening across lymphatic-malformation subtypes (isolated CLA, RASopathy-associated) rather than deepening in any one subtype. This raises plausibility that the pathway is broadly relevant but does not raise the evidence tier, since no comparative study has been published.

## Skepticism Notes

- **Pneumatic compression survey (n=10,543):** Flagged for likely device-manufacturer connection (unconfirmed from the record available), self-report-only design, and no control arm. Large sample size should not be read as compensating for these design weaknesses — see `finding_pneumatic_compression_pro_survey_2026`.
- **Pediatric CDT camp study:** Mixed primary/secondary population reported as a single pooled result: readers should not infer a primary-lymphedema-specific effect size from the headline finding.
- **Bleomycin sclerotherapy and LVA/VLNT series:** Continue the field-wide pattern of uncontrolled, retrospective, single-arm reporting. None of this week's surgical/procedural papers changes the standing surgical-evidence-gap assessment.
- **Stale-item check:** No items this week were identified as re-indexed or previously-reported data appearing as "new" — all 30 processed papers had `status: new` prior to this run and had not previously appeared in any digest or finding.

## Watchlist

- **211 papers remain tagged `unknown` scope** in `papers.json` (no primary or secondary signal detected — largely general LVA/VLNT, imaging, and compression-therapy literature that does not explicitly identify its patient population). This is a lower-priority backlog for a future scan/deep pass; processing it may surface additional primary-lymphedema-relevant studies currently invisible to synthesis, but each will need manual population-scope review since automated classification could not resolve them.
- **Italian cohort (n=408):** Watch for further gene-panel publications from this group; treat future installments as continuations per the note above.
- **Semantic Scholar API:** Still returning HTTP 403 as of the most recent scan (2026-08-01, 6th consecutive failure since 2026-07-21) — see `data-integrity-semantic-scholar-403` memory. Needs user action (key check/rotation), not agent-fixable.

## Data Summary

- Papers tracked: 328 total (post-purge; down from 458). 30 newly synthesized this run + 2 already-cited-but-unmarked papers now correctly marked `incorporated` = 32 papers moved from `new` to `incorporated`.
- Papers purged as out-of-scope (secondary/non-lymphedema): 130 (128 via automated reclassification + 2 via manual review).
- Trials monitored: 22 (0 with deep-run-relevant updates this run).
- Findings updated: 13 (8 new, 5 extended with new supporting papers and evolution-log entries).
- Papers flagged for skepticism: 4 (pneumatic compression survey, pediatric CDT camp study, and the 2 surgical case series called out above).
- Papers remaining unresolved-scope (`unknown`, not processed this run): 211.
