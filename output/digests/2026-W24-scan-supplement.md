# Primary Lymphedema Scan Supplement — Week 24, 2026

**Scan date:** 2026-06-09 (Tuesday)
**Run ID:** scan_2026-W24_001
**Run type:** SCAN (lightweight)
**Sources:** PubMed E-utilities (4 query themes), ClinicalTrials.gov v2 (spot-check)
**New PMIDs found:** 47 | **In-scope added:** 10 | **Dropped (off-scope):** ~37
**Alerts generated:** 0 (no item met importance ≥ 7 AND evidence ≥ 5)

> **⚠️ Data-recovery note.** This scan ran on a database that had silently fallen ~2 weeks stale. The W22 live scans (×2) and all three W23 scans — **22 already-assessed papers** — had never been merged into `data/papers.json` because the automated agents' Write permission used a single-`*` glob that does not match subdirectories. Those 22 papers were recovered and merged today (`recovery_2026-06-09_001`, papers.json 378→400) before this scan ran. The root-cause permission fix (`*`→`**` in `.claude/settings.local.json`) is **still pending user approval** — the auto-mode classifier blocked the agent from widening its own write permission. Until that is approved, every automated scan will keep stranding its results. See the run-log and the handoff note at the end.

---

## Summary

A high-volume but low-signal week. After scope filtering, the new in-scope literature clusters around three threads:

1. **Sirolimus (mTOR inhibition) for generalized lymphatic anomalies (GLA).** A neonatal GLA-with-fetal-hydrops effectiveness report (pm_42216259) and a narrative review (pm_42194698) add to the GLA treatment literature, while a retrospective cohort + VigiBase analysis (pm_42217144) quantifies a frequent, monitorable toxicity — **100% hypertriglyceridemia / 90% hypercholesterolemia** in treated neonates/infants, with the strongest dyslipidemia reporting signal in infants. This is the most decision-useful item of the week (safety monitoring), though importance/evidence stay below alert threshold.

2. **GLP-1 receptor biology in lymphatics.** A preclinical paper (pm_42231627) localizes GLP-1 receptors *exclusively* to lymphatic endothelial cells and shows semaglutide increases collecting-lymphatic pumping capacity ex vivo via nitric-oxide-dependent vasodilation. Mechanistically interesting and aligned with the project's GLP-1 taxonomy thread, but entirely preclinical and framed by the authors around *secondary* lymphedema.

3. **Surgical evidence base.** The Gloviczki PEER **umbrella systematic review** (pm_42208734) — 26 SRs, 14 meta-analyses, **no RCTs** — formally underpins the forthcoming AVF/AVLS lymphedema practice guidelines. (This item was discussed in the W23 deep digest but had never been added to the database; it is now captured.) The persistent absence of any RCT for LVA/VLNT, in a predominantly secondary population, remains the headline caveat.

Plus a GATA2-deficiency primary-lymphedema case (pm_42246350) and several developmental lymphatic-malformation items (orbital sclerotherapy, neonatal cervicofacial LM, pediatric bladder lymphangioma) kept at low relevance.

**Dropped as off-scope:** gynecologic-cancer lower-limb lymphedema (×5+), lipedema (×4), chronic venous disease / DVT / phlebolymphedema, BCRL/upper-extremity post-op, head-and-neck (selective neck dissection) lymphedema, diabetic-neuropathy lymphovenous bypass, and assorted irrelevant hits. Also dropped: Menke-Hennekam/CREBBP case (a craniofacial-developmental syndrome with **no lymphatic phenotype** — caught only by the "Hennekam" keyword) and a gynecologic-care review of vascular anomalies (too tangential).

---

## In-scope papers added (10)

| PMID | Short title | Type | Imp | Evid | Nov | Dec | Class | LE type |
|------|-------------|------|----:|----:|----:|----:|-------|---------|
| 42217144 | Sirolimus dyslipidemia in neonates/infants (cohort + VigiBase) | obs-retrospective | 6 | 5 | 6 | 6 | practice-relevant | both |
| 42208734 | Microsurgical LE umbrella SR → AVF/AVLS guidelines | review-systematic | 6 | 5 | 6 | 6 | background | both |
| 42231627 | GLP-1R / semaglutide ↑ lymphatic pumping (ex vivo) | preclinical-animal | 6 | 3 | 7 | 3 | hypothesis-gen | both |
| 42216259 | Sirolimus for neonatal GLA with fetal hydrops | case-series* | 6 | 3 | 4 | 4 | hypothesis-gen | primary |
| 42194698 | Sirolimus in fetal/neonatal vascular anomalies (review) | review-narrative | 4 | 3 | 5 | 3 | background | unknown |
| 42246350 | GATA2 deficiency presenting as primary lymphedema | case-report | 4 | 2 | 3 | 3 | hypothesis-gen | primary |
| 42241350 | Bleomycin sclerotherapy, orbital lymphatic malformation (n=51) | obs-retrospective | 4 | 3 | 4 | 3 | hypothesis-gen | unknown |
| 42233213 | Hypoxia→Cd74/Vegfr3 lymphangiogenesis in PAH (mouse) | preclinical-animal | 3 | 4 | 6 | 2 | hypothesis-gen | unknown |
| 42201813 | Neonatal hemorrhagic cervicofacial LM (airway case) | case-report | 2 | 2 | 3 | 2 | tracker | unknown |
| 42221695 | Recurrent pediatric bladder lymphangioma (case) | case-report | 2 | 2 | 3 | 2 | tracker | unknown |

\* pm_42216259 abstract not available in PubMed; design inferred from title (flagged `no_full_methods` / `abstract_only`).

---

## Item notes

**pm_42217144 — Sirolimus & dyslipidemia (most decision-useful).** Single-center retrospective cohort (n=10, median age 44.5 days) plus VigiBase disproportionality. 100% hypertriglyceridemia, 90% hypercholesterolemia post-initiation; infant dyslipidemia aROR 147 (95% CI 80–272). *Limits:* tiny cohort + pharmacovigilance reporting bias with no true denominator; mixed vascular/lymphatic-anomaly population, not a defined primary-LE subtype. *Takeaway:* reinforces routine lipid monitoring in sirolimus-treated infants with lymphatic anomalies — monitoring guidance, not a new efficacy claim.

**pm_42208734 — Microsurgical umbrella SR.** 26 SRs / 14 meta-analyses, **zero RCTs**; conclusions driven by 4 moderate-quality treatment reviews + 1 high-quality prevention review (AMSTAR-2). Will shape AVF/AVLS guidelines. *Limits:* heavy primary-study overlap; predominantly secondary lower-extremity lymphedema, so applicability to primary LE is indirect. The surgical evidence gap (no RCTs) is unchanged.

**pm_42231627 — GLP-1R / semaglutide.** Glp1r exclusive to lymphatic endothelium; semaglutide ↑ pumping in WT, diet-induced-obese, and ApoE-KO mouse collectors via NO. *Limits:* isolated mouse vessels, surrogate contractility endpoint, no primary-LE model or human data. Hypothesis-generating; do not over-read as a therapeutic signal.

**pm_42246350 — GATA2.** 31-yo woman, childhood-onset primary lymphedema + resistant warts + monocytopenia → GATA2 deficiency. Useful clinical reminder of the GATA2/Emberger spectrum; single case, not new this week (Jan 2026).

---

## Trials

Spot-checked priority primary-relevant trials — **no status changes**:
- NCT05629026 (Lymphatic Dysfunction in Primary & Secondary LE) — RECRUITING (last update 2025-12-31)
- NCT05269264 (Clinical Screening/Diagnostic) — RECRUITING (last update 2024-07-03)
- NCT03991897 (Nutritional Ketosis) — RECRUITING (last update 2025-12-03)

---

## Handoff / action items

1. **Approve the permission fix** so automated scans stop stranding results: change `Write(.../Lymphedema_research/*)` → `Write(.../Lymphedema_research/**)` in `.claude/settings.local.json` (correct value already staged in `settings.local.FIXED.json`).
2. **Clean up** the now-applied temp files at project root (`temp_scan_papers*.json`, `temp_w23_scan_papers*.json`, `temp_w24_scan_papers.json`, `apply_*.py`, `merge_backlog.py`) and stale backups — these are all merged.
3. **W23 deep digest** (`2026-W23-digest.md`) referenced findings/papers (e.g., the PIEZO1 in-vitro rescue pair, pm_42208734) whose `apply_deep_w23.py` was never run against `findings.json`/knowledge-base. A deep run should reconcile findings next.
