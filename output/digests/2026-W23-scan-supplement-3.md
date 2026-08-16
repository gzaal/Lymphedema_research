# Primary Lymphedema Research — W23 Scan Supplement 3
**Period:** 2026-06-06 (Saturday — third W23 scan)
**Run type:** SCAN
**Run ID:** scan_2026-W23_003
**Papers found:** 1 new | **Papers added:** 1
**Papers dropped (out of scope or stale):** 12
**Trials checked:** 7 | **Status changes:** 0 material changes; 1 tracking error confirmed; 1 escalation note
**Alerts generated:** 0 (no item met importance ≥ 7 AND evidence ≥ 5)

---

## Context

W23 Scan 1 (2026-06-02) added 8 papers; W23 Scan 2 (2026-06-04) added 1 paper. This third scan covers papers **newly indexed 2026-06-04 to 2026-06-06** not previously tracked. The single new paper is staged in `temp_w23_scan_papers_3.json`.

Semantic Scholar was rate-limited (HTTP 429) again this cycle — PubMed-only coverage for the third consecutive Saturday scan. No meaningful coverage gap is expected given the narrow 48-hour search window.

---

## New Papers This Week

### Disease Management / Vascular Malformations

---

**pm_42244213 — Sclerotherapy Safety SR for H&N Low-Flow VMs: Doxycycline and Polidocanol Best Profiles**

*Head & Neck, June 4, 2026 (ahead of print) | Nocini R, Muneretto C, Arsie AE, Arietti V, Lorenzon B, Cinotti A, Colletti G*

**What happened:** A systematic review of 64 studies (2508 patients, 5193 sclerotherapy sessions) for head and neck low-flow vascular malformations found an overall complication rate of 11.2% per session (8.8% minor local events). Doxycycline and polidocanol had the best safety profiles with no major complications documented; bleomycin showed a 13.5% complication rate; ethanol carried the highest risk of major complications.

**Why people may care:** Lymphatic malformations (developmental lymphatic anomalies, in primary scope) are a primary indication for doxycycline sclerotherapy. This SR — co-authored by Giacomo Colletti (Italian H&N malformation group) — represents the largest published safety dataset for sclerotherapy in this context, supporting procedural risk counseling for patients with congenital lymphatic anomalies.

**What limits confidence:** The population aggregates multiple VM types (predominantly venous malformations, with LMs as an unquantified subset); LM-specific safety data is not isolated from the aggregate results; component studies are mostly retrospective case series with heterogeneous methodology; findings are restricted to the head and neck region and may not generalise to limb, truncal, or abdominal LMs.

| Axis | Score |
|------|-------|
| Importance | 4/10 |
| Evidence strength | 5/10 |
| Novelty/Freshness | 7/10 |
| Decision usefulness | 3/10 |
| Claim calibration | 8/10 |

**Classification:** background/context
**Design:** review-systematic | **Event:** full-paper-published | **Endpoint:** surrogate (complication rate per session) | **Comparator:** cross-agent observational comparison | **Result:** mixed (agent-dependent)
**Skepticism flags:** surrogate_endpoint_only, narrow_population (H&N only; LM vs VM not separated)
**lymphedema_type:** both

---

## Papers Dropped This Cycle (Out of Scope or Stale)

| PMID | Reason |
|------|--------|
| pm_42244410 | Brachiocephalic vein occlusion causing breast edema in hemodialysis patient — venous occlusion, secondary |
| pm_42000232 | Sleep health composite scores scoping review — off-topic |
| pm_42241049 | EGPA-associated lymphedema case report — secondary (vasculitis complication) |
| pm_41436089 | Obesity-related vascular injury review — not about lymphedema specifically |
| pm_42000457 | Polysplenia syndrome CT features — not relevant |
| pm_42140885 | Pediatric robotic abdominal surgery series — LM was 1 of 21 unrelated cases |
| pm_41099419 | Perivascular spaces post-stroke — not relevant |
| pm_41802413 | Laparoscopic lymph node excision in dogs (veterinary) — off-scope |
| pm_41748475 | Dermatology training program evaluation — off-topic |
| pm_40986053 | SVC hypoplasia causing hydrops fetalis — venous, not primary lymphedema |
| pm_41747820 | Fish immunology/aquaculture — off-topic |
| pm_41639952 | Mastoid LM case report — **stale** (epub Feb 5, 2026; 4 months old; re-indexed in June 2026 print issue); `is_new_this_week: false` — may be absent from baseline DB if not captured by May 21 sweep; see note below |

**Note on pm_41639952:** "Extremely Rare Case of Mastoid Lymphatic Malformation Mimicking Atypical Abscess" (Otology & Neurotology, June 2026, Vol 47(5):e806–e807; doi:10.1097/MAO.0000000000004838; epub Feb 5, 2026). In scope (LM, developmental lymphatic anomaly) but stale — electronic publication date February 2026. If not already in the baseline database from the May 21 sweep, it could be added as a tracker-maintenance/background item in the next deep synthesis cycle, not as a this-week discovery.

---

## Trial Updates

Checked 7 trials. No material status changes. Two escalation items.

| Trial | NCT | Prior Status | Current Status | Last Update | Note |
|-------|-----|-------------|----------------|-------------|------|
| SurLym (KU Leuven) | NCT05064176 | RECRUITING | RECRUITING | Jul 3, 2024 | Primary completion June 2025 — now 12 months overdue; no results; no recent registry update |
| LYMPHODYS | NCT05629026 | RECRUITING | RECRUITING | Dec 31, 2025 | **Both** primary and study completion February 2026 have passed — entire study overdue; no results |
| Compression bandage non-inf | NCT06750679 | COMPLETED | COMPLETED | Apr 28, 2026 | Completed April 2026; 31 enrolled; no results posted |
| Turner syndrome LE | NCT06325618 | RECRUITING | RECRUITING | Mar 2024 | No change; completion Aug 2027 |
| KETOLYMPH | NCT03991897 | RECRUITING | RECRUITING | Dec 3, 2025 | No change; completion Feb 2028 |
| LymphEx | NCT07558317 | RECRUITING | RECRUITING | **Jun 5, 2026** | Record refreshed yesterday; still RECRUITING; primary completion Mar 2027; no results; 36 enrolled; 2-week active intervention |
| EchoGoutte | NCT05546593 | RECRUITING | RECRUITING | Mar 2025 | **Confirmed tracking error** — this is an ultrasound/gout study (Assistance Publique, Paris); not about lymphedema; should be removed from trials.json |

### Key Trial Escalations

**LYMPHODYS (NCT05629026) — both dates overdue:** The study completion date (February 2026) has now also passed without results posting (unlike SurLym, which has only primary completion overdue). The original record shows both primary completion and study completion as February 2026. This is now a 4-month overdue complete study with no results. Possible explanations: study extended by investigators without registry update, data analysis ongoing, or quiet abandonment. Monitor for registry update.

**NCT05546593 — tracking error:** Confirmed to be the EchoGoutte study (gout/joint ultrasound, Assistance Publique, Paris). This NCT ID was included in trials.json in error. Recommend removal in the next data maintenance cycle. The lymphedema MeSH tag on this record is incidental.

**LymphEx (NCT07558317):** Registry record updated June 5, 2026 (yesterday). Status still RECRUITING. The 2-week active intervention period is very short for a lymphedema chronic-disease study; follow-up duration (until March 2027 primary completion) implies monitoring beyond the intervention, but the exercise program itself is brief. Flag for caution when results eventually appear: short intervention in a chronic condition is a skepticism trigger.

---

## Skepticism Notes

1. **Sclerotherapy SR (pm_42244213):** The headline finding — doxycycline and polidocanol as safest agents — is plausible and consistent with clinical practice, but the safety comparison is observational and confounded by operator experience, patient selection, and anatomical variation. Doxycycline's LM-specific safety advantage should not be extrapolated uncritically from a mixed VM population.

2. **SS rate limiting:** Third consecutive cycle with Semantic Scholar unavailable. PubMed coverage is considered adequate for the narrow 48-hour scan window, but any preprints or non-indexed papers would be missed. The next deep synthesis cycle (W24 Sunday) should attempt SS with retry logic.

3. **Low volume this scan:** Only 1 new in-scope paper in 48 hours is expected and consistent with low-volume weekend indexing. Not a coverage gap signal.

---

## Alerts

**None generated this cycle.** The single new paper (pm_42244213) scores importance 4, evidence 5 — below the combined threshold (importance ≥ 7 AND evidence ≥ 5).

---

## Data Maintenance Items Flagged for Next Deep Cycle

1. **Remove NCT05546593 from trials.json** — confirmed gout study, not lymphedema
2. **Check LYMPHODYS (NCT05629026)** — study now fully overdue (primary + study completion both Feb 2026); consider reclassifying or flagging for manual investigator contact
3. **Check pm_41639952** (mastoid LM, epub Feb 2026) — verify if in baseline DB; if absent, add as background/context with `is_new_this_week: false`
4. **Apply staged papers:** Merge all temp_w23_scan_papers*.json into data/papers.json and update data/trials.json

---

## Data Summary

- New papers added this scan: 1
- Papers rejected this cycle: 12 (11 out-of-scope + 1 stale)
- Trials checked: 7 | Material status changes: 0
- Trials with escalation notes: 2 (LYMPHODYS overdue; NCT05546593 tracking error)
- Alerts generated: 0
- Semantic Scholar: rate-limited (HTTP 429), no results retrieved

**W23 Total (all three scans):**
- Papers added: 10 (8 + 1 + 1)
- Alerts: 0
- Trials checked: ~18 across three scans

---

*W23 Scan 3 — 2026-06-06 | Primary lymphedema scope only*
*Papers staged: `temp_w23_scan_papers_3.json` | Merge with prior W23 staged files before applying*
*Next cycle: W24 deep synthesis — 2026-06-07 (Sunday)*
