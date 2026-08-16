# Lymphedema Research Digest — Week 24, 2026

*Deep synthesis run — 2026-06-14. Scope: primary (genetic / developmental / hereditary) lymphedema only.*

> **Data-integrity note (read first):** This digest was produced after diagnosing a scope-filter breach in the raw corpus. On 2026-05-21 two baseline ingestion runs bulk-loaded 361 papers **without applying `classify_lymphedema_type()`**; ~81 are breast-cancer-related (BCRL), ~17 head/neck or gynaecologic, and ~32 are clearly off-topic (retina, cardiac, liver, bone mechanistic). These inflate `papers.json` to 411 and account for most of the 366 "new"-status records — they are **unpurged secondary/off-topic noise, not incorporation candidates.** The synthesis layer (findings.json, knowledge base) remains clean: this deep run incorporated **only** in-scope primary papers, as the prior W22 deep run did. A purge of the corrupt baseline is recommended but was **not** performed this run (left for explicit sign-off). See "Skepticism Notes" and "Watchlist."

## Highlights

**1. mTOR/MEK-targeted therapy for neonatal central & generalized lymphatic anomalies — efficacy signal, plus a new infant dyslipidemia safety signal**
- **What happened:** A CCLA case series (pm_40835771) reported substantial clinical improvement and improved MR-lymphangiography flow with sirolimus and/or MEK inhibitors (no relapse at mean 10.3 months), echoed by a neonatal-GLA-with-hydrops report (pm_42216259) and a narrative review (pm_42194698); a paired safety analysis (pm_42217144) found near-universal dyslipidemia in sirolimus-treated infants (100% hypertriglyceridemia, 90% hypercholesterolemia, n=10) with a strong VigiBase signal (aROR 147).
- **Why people may care:** For otherwise life-threatening neonatal primary lymphatic anomalies, genotype-directed pharmacotherapy is one of the few options that may change outcomes.
- **What limits confidence:** All efficacy data are uncontrolled case series with short follow-up; the safety data are retrospective/disproportionality analyses. None of this is an RCT, and it does not generalize to adult-onset primary lymphedema.
- **Classification:** pipeline-relevant (efficacy) / practice-relevant (the safety/monitoring message)
- **Scores:** Importance 7/10 | Evidence 3/10 | Novelty 7/10 | Decision 5/10 | Calibration 9/10

**2. Primary lymphedema may be a barrier/permeability problem, not a fibrotic one**
- **What happened:** A single-center case-control study (pm_42198873, n=15 vs 8 controls) found *reduced* cutaneous fibrosis in primary lymphedema — the opposite of secondary/BCRL — with downregulated CLDN5 and VEGFD and decreased TJP1 (ZO-1) in affected limbs only.
- **Why people may care:** If replicated, it would mechanistically separate primary from secondary lymphedema and shift therapeutic targets toward endothelial-junction/permeability biology rather than anti-fibrotic strategies.
- **What limits confidence:** n=15, single center, molecular surrogate endpoints with no functional correlation and multiple-comparison risk; hypothesis-generating only.
- **Classification:** hypothesis-generating
- **Scores:** Importance 6/10 | Evidence 3/10 | Novelty 7/10 | Decision 2/10 | Calibration 9/10

**3. Surgical evidence gap reaffirmed by a guideline-feeding umbrella review: 26 systematic reviews, 0 RCTs**
- **What happened:** A PEER umbrella SR (pm_42208734) synthesizing 26 systematic reviews / 14 meta-analyses (2010–2025) for the forthcoming AVF/AVLS clinical practice guidelines identified **no RCTs** for lymphatic microsurgery; conclusions rested on 4 moderate-quality treatment SRs + 1 high-quality prevention SR.
- **Why people may care:** Guideline bodies are formalizing recommendations on LVA/VLNT/ILR on an evidence base that still contains no randomized trials — patients and clinicians should weigh that.
- **What limits confidence:** An umbrella review inherits the limitations of its included reviews; it adds no new primary data. (A companion retrospective, pm_42001630, compared LVA vs VLNT but is single-center and non-randomized.)
- **Classification:** practice-relevant
- **Scores:** Importance 6/10 | Evidence 6/10 | Novelty 5/10 | Decision 6/10 | Calibration 9/10

## New Papers

### Genetics & Biomarkers
- **pm_41589511** — *Bleeding diathesis in HLTS (SOX18) due to decreased von Willebrand factor* (AJMG Part A). First reported HLTS–vWF association; SOX18 nonsense variant, no VWF mutation, vWF secondary to SOX18 dysfunction. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 2 | Nov 7 | Dec 4 | Cal 9. *Limits:* single case; practice point (assess vWF before procedures) is a cautious extrapolation.
- **pm_42246350** — *Childhood-onset primary lymphedema unmasking GATA2 deficiency* (Dermatol Online J). Lymphedema as sentinel sign of GATA2 deficiency (Emberger/MonoMAC) with MDS/AML risk. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 2 | Nov 4 | Dec 4 | Cal 9. *Limits:* single case; the recognition message itself is established.
- **pm_42198873** — *Pathophysiological changes in primary lymphedema* (Lymphat Res Biol). See Highlight 2. **Scores:** Imp 6 | Evi 3 | Nov 7 | Dec 2 | Cal 9.
- **ss_3c57b92f…** — *Disruption of VEGFR3–HSPG2 interaction induces lymphatic reflux and sepsis* (bioRxiv **preprint**). Novel VEGFR3 (Milroy gene) binding partner in an animal model. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 2 | Nov 7 | Dec 2 | Cal 9. *Limits:* not peer-reviewed; animal model; poor lymphatic preclinical-to-clinical translation record.
- **pm_42223480** — *Aquaporin-1 sustains lymphangiogenesis in hyperosmotic inflammatory microenvironments* (J Exp Med). AQP1 required for lacteal LEC migration; upregulated in human lymphedema and lymphatic malformations but not embryonic lymphangiogenesis. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 4 | Nov 6 | Dec 2 | Cal 9. *Limits:* mouse/scRNA-seq mechanistic; primarily intestinal-lacteal biology.

### Pharmacological
- **pm_40835771 / pm_42216259 / pm_42194698 / pm_42217144** — mTOR/MEK therapy for neonatal CCLA/GLA + infant dyslipidemia safety. See Highlight 1.
- **pm_42231627** — *GLP-1 receptors enriched in lymphatic endothelium; semaglutide improves lymphatic pumping ex vivo* (Microcirculation). Glp1r localized to LECs; semaglutide raised collecting-lymphatic pumping via NO. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 3 | Nov 7 | Dec 3 | Cal 9. *Limits:* ex-vivo/animal; no human or primary-LE outcome; updates `finding_glp1_agonists_investigational` (stays LOW).

### Disease Management & Surgery
- **pm_42208734** — PEER umbrella SR / AVF–AVLS guidelines. See Highlight 3. **Scores:** Imp 6 | Evi 6 | Nov 5 | Dec 6 | Cal 9.
- **pm_42001630** — *LVA vs VLNT long-term comparative, lower limb* (JPRAS). Retrospective; LVA faster <3-month gains, VLNT slower gains through 12 months; complications 7.1% VLNT vs 0% LVA. **Classification:** hypothesis-generating. **Scores:** Imp 5 | Evi 3 | Nov 5 | Dec 3 | Cal 8. *Limits:* single-center retrospective, no randomization (standard LVA/VLNT caution).
- **pm_42235636** — *Patient-reported outcomes in >10,000 patients using pneumatic compression* (JVS-VL). Daily use associated with self-reported swelling −58%, heaviness −34%, pain −25%. **Classification:** hypothesis-generating. **Scores:** Imp 4 | Evi 2 | Nov 5 | Dec 3 | Cal 8. *Limits:* uncontrolled industry-adjacent satisfaction survey; self-report only; mixed etiology (not primary-specific); volume claims unverified by functional measures.

### Background / Context
- **pm_42062115** — *Is lymphedema an inflammatory disease?* (Vascular Diseases). Editorial by S. Vignes; no original data. **Classification:** background/context. **Scores:** Imp 4 | Evi 1 | Nov 4 | Dec 2 | Cal 9.

## Negative / Null Results This Week
- **pm_42254563** — *Lymphaticovenous anastomosis reduces pain in selected patients with lower limb lymphedema* (the title overstates a **null** primary endpoint). Mean VAS 3.1 → 2.9, **p=0.23**; only 35.7% improved, 21.4% worsened. Pain improvement correlated with post-op weight loss (r=0.49) and limb-circumference reduction (r=0.42) — i.e., the apparent benefit is confounded by weight/volume change, not demonstrably an LVA effect. Subgroup signal (sharp/throbbing pain responded; heaviness worsened) is exploratory. **Decision value:** moderate — it does **not** support LVA as a pain treatment, and its title/headline overstates the evidence. **Scores:** Imp 4 | Evi 3 | Nov 5 | Dec 5 | Cal 9 (headline calibration of the *paper itself* is poor; our framing corrects it).

## Trial Updates
- No changes. W24 scans verified NCT05629026, NCT05269264, NCT03991897, NCT05546593, NCT06228937, NCT05064176, NCT06325618 — all **recruiting**, no status/phase changes; last-update dates predate the window. Registry metadata only.

## Evolving Understanding
- **Targeted pharmacotherapy for severe paediatric primary lymphatic anomalies is consolidating as a theme** (CCLA/GLA), but the field is reporting efficacy and toxicity in the same breath this week — the infant dyslipidemia signal (pm_42217144) is a useful counterweight to uncontrolled optimism. Net: promising but unproven; monitoring obligations are now better defined than efficacy.
- **GLP-1 rationale gains a concrete lymphatic mechanism** (pm_42231627) — a pumping effect plausibly independent of weight loss — but it remains ex-vivo/animal. `finding_glp1_agonists_investigational` stays LOW; the open question (benefit beyond weight loss) is still open.
- **Primary ≠ secondary lymphedema histology** (pm_42198873) is the most conceptually interesting item, hinting that anti-fibrotic framing borrowed from BCRL may not apply to primary disease. Confidence is low; flagged for replication.
- **Surgical evidence gap is now being codified into guidelines without RCTs** (pm_42208734) — reinforces `finding_surgical_evidence_gap_global` (unchanged at HIGH).
- No existing finding's confidence was downgraded this week.

## Skepticism Notes
- **Corpus scope breach (highest priority):** the 2026-05-21 re-baseline reintroduced ~130 secondary + ~32 off-topic papers that the project explicitly purges. They are not in the synthesis but they pollute `papers.json` and the dashboard counts. Recommend re-running `classify_lymphedema_type()` over `baseline_2026-05-21_001` and `baseline_pubmed_2026-05-21_001` and purging non-primary records (with backup), as was done for the April baseline.
- **pm_42254563** headline ("reduces pain") contradicts its own null primary endpoint — a textbook headline-vs-evidence mismatch; reframed above.
- **pm_42235636** is an uncontrolled satisfaction survey with large self-reported volume claims and mixed etiology — not primary-specific and not evidence of lymphatic-function change.
- **ss_3c57b92f…** is a non-peer-reviewed preprint; tracked only because it touches the VEGFR3/Milroy axis.
- **pm_42216259** full text/abstract was not retrievable from PubMed; the finding rests on title-level information plus corroborating reports.

## Watchlist
- **Corpus remediation:** scope purge of the 2026-05-21 baseline (see Skepticism Notes); decision pending.
- **Working-tree hygiene:** ~40 uncommitted temp/backup/apply-script files and a pending `settings.local.json` `*`→`**` permission fix (the documented automated-write bug) remain unresolved.
- **AVF/AVLS lymphedema management guidelines** — formal publication expected to follow pm_42208734; will set the reference standard despite the RCT void.
- Replication of the primary-LE barrier/permeability pathophysiology (pm_42198873) in an independent cohort.

## Data Summary
- Papers tracked: 411 total (corpus inflated by the 2026-05-21 breach; ~52 tagged primary/both are the genuine in-scope core). This run reviewed **15 genuinely-new in-scope primary papers** from the W22–W24 scan window.
- Trials monitored: 24 (0 with substantive updates)
- Findings updated: 7 (2 updated — GLP-1, surgical-gap; 5 new — mTOR/MEK neonatal, primary-LE pathophysiology, HLTS/SOX18-vWF, VEGFR3-HSPG2 preprint, GATA2/Emberger). findings.json 24 → 29.
- Papers incorporated this run: 11
- Papers flagged for skepticism: 4 (plus the corpus-wide breach)
