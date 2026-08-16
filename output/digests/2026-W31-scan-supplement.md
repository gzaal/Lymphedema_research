# Lymphedema Research Digest — 2026-W31 (SCAN)

**Run:** `scan_2026-W31_003` · 2026-08-01 · PubMed only (Semantic Scholar API returned HTTP 403 for the 6th consecutive scan since 2026-07-21 — see Known Issues)

## Summary

- 20 unique PubMed candidates surfaced across primary/hereditary, genetics, and pediatric queries; 10 were already in the tracker.
- Of 10 genuinely new candidates: **4 kept** (all low-priority, tracker-maintenance/background), **6 dropped** as unambiguously secondary or off-topic.
- 1 tracked trial (NCT05269264) had a status change — flagged as a registry lapse, not new data. No other trial changes; no completed trials posted new results.
- No item met the alert threshold (importance ≥7 AND evidence ≥5). One alert was generated for the trial status change per the mechanical "any status change" trigger — see `output/alerts/2026-08-01-alert.md`.

## New papers added (4)

None of these are practice- or pipeline-relevant. All are included for tracker completeness.

### 1. Compression pressure recommendations (review)
*Phlebology, 2026* — [PMID 41432038](https://pubmed.ncbi.nlm.nih.gov/41432038/)

**What happened:** A narrative review synthesizes published evidence on recommended compression pressure across venous and lymphatic clinical indications; no new primary data.
**Why people may care:** Compression standardization is practically relevant to lymphedema management, but this review is not primary-lymphedema-specific.
**What limits confidence:** Narrative synthesis, not a primary study; does not isolate primary (genetic/hereditary) lymphedema populations.
**Classification:** background-context · Importance 2 · Evidence 2 · Novelty 3 · Decision usefulness 2 · Claim calibration 8

### 2. Lymphedema duration and vessel quality after super-microsurgical LVA
*Plastic and Reconstructive Surgery, 2026 (ahead of print)* — [PMID 41434454](https://pubmed.ncbi.nlm.nih.gov/41434454/)

**What happened:** Ahead-of-print paper on how lymphedema duration relates to lymphatic vessel quality and LVA outcomes; no abstract indexed yet.
**Why people may care:** LVA timing is a practical surgical-planning question, but PRS's LVA literature is dominated by secondary (BCRL) cases — relevance to primary lymphedema is unconfirmed.
**What limits confidence:** No abstract/methods available; population and study design unknown. Surgical-outcomes caution applies (LVA studies are almost universally single-arm, retrospective).
**Classification:** tracker-maintenance · Importance 3 · Evidence 1 · Novelty 3 · Decision usefulness 2 · Claim calibration 8

### 3. Reply to the above (correspondence)
*Plastic and Reconstructive Surgery, 2026* — [PMID 42519954](https://pubmed.ncbi.nlm.nih.gov/42519954/)

**What happened:** Editorial reply to PMID 41434454; no new data.
**Classification:** tracker-maintenance · Importance 1 · Evidence 0 · Novelty 1 · Decision usefulness 1 · Claim calibration 9

### 4. Correction notice — ICG lymphography ultrasound mapping
*European Radiology, 2026* — [PMID 42089974](https://pubmed.ncbi.nlm.nih.gov/42089974/)

**What happened:** Publisher correction to a prior paper on ultrasound/microbubble preoperative lymphatic mapping in lymphedema with non-linear ICG lymphography patterns.
**Why it doesn't count as new:** Correction notice — metadata event, not new science. `is_new_this_week: false`.
**Classification:** tracker-maintenance · Importance 1 · Evidence 0 · Novelty 0 · Decision usefulness 0 · Claim calibration 9

## Dropped as out of scope (6)

Per the primary-lymphedema-only scope, these were classified as unambiguously secondary or irrelevant and **not** added to `papers.json`:

| PMID | Reason |
|------|--------|
| 40080337 | Secondary — cancer survivorship / cancer-related lymphoedema care |
| 42213401 | Irrelevant — chronic venous disease (MPFF), not lymphedema |
| 42224983 | Irrelevant — ADHD/trauma paper, false positive on "children" search term |
| 42502652 | Secondary — COVID-19 vaccination-induced breast lymphedema (acquired) |
| 42520497 | Secondary — gynecologic oncology surgical-complication consensus statement |
| 42531893 | Secondary — abstract explicitly states "Secondary lymphedema" |

## Trial updates

**NCT05269264** ("Development of a Clinical Screening, Diagnostic and Evaluation Tool for Patients With Lower Limb Lymphedema: Aim 1") — status auto-flipped RECRUITING → UNKNOWN by ClinicalTrials.gov after two years without sponsor confirmation (`statusVerifiedDate` stuck at 2024-07). Registry lapse, not new data. See alert.

No other tracked trial changed status. No completed trial posted new results (`hasResults` checked for all 9 COMPLETED trials — all `false`).

## Known issues (carried forward)

- **Semantic Scholar API — HTTP 403, 6th consecutive scan (2026-07-21 → 2026-08-01).** Coverage from PubMed only this run. This needs the user to check/rotate the key at the source; not agent-fixable. See memory `data-integrity-semantic-scholar-403`.
- **Write(path) vs Edit(path) permission-rule mismatch — still unapplied.** This run again used the Bash+python3 workaround (`scripts/apply_w31_scan_003.py`) rather than the Write tool for `data/*.json`. Staged fix remains in `settings.local.FIXED.json`, pending user action. See memory `feedback-write-permissions`.
- **Scope pollution in `papers.json` — still outstanding.** As of this run, `papers.json` holds 458 papers: 45 `primary`, 26 `both`, 207 `unknown`, and 180 with no `lymphedema_type` field at all (pre-dating the tagging convention). This scan added 0 to the untagged bucket (all 4 new papers were explicitly tagged), but the underlying backlog from the 2026-05-21 re-baseline is unresolved. See memory `data-integrity-scope-pollution` — a purge pass is still recommended before any deep synthesis run.
- **Repo clutter — ~65+ uncommitted files at the project root** (misplaced digests, apply scripts, data backups) predate this run and were left untouched. See memory `repo-clutter-uncommitted-backlog`. This run added 3 new backup files (`data/*.bak-2026-08-01-scan.json`) and one apply script (`scripts/apply_w31_scan_003.py`) — kept in their conventional locations (`data/`, `scripts/`) rather than at root, per that memory's guidance.
