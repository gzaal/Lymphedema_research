# Lymphedema Research System — Critical Evaluation Upgrade

## Background

The ADPKD research system at `/Users/geertzaal/Developer/ADPKD_research` has been upgraded with a rigorous evidence evaluation framework: 5-axis scoring (importance, evidence_strength, novelty, decision_usefulness, claim_calibration), skepticism flags, claim audits, publication event classification, calibrated language rules, and a quality-control self-check. The Lymphedema system needs the same upgrade.

## Reference files (READ THESE FIRST)

These are the ADPKD files you should use as your template. Read each one before making changes:

1. **Evaluation framework** (the shared brain — copy and adapt):
   `/Users/geertzaal/Developer/ADPKD_research/prompts/evaluation-framework.md`

2. **Scan prompt** (how the scanner evaluates papers):
   `/Users/geertzaal/Developer/ADPKD_research/prompts/scan.md`

3. **Deep prompt** (how the deep analyst synthesizes and writes digests):
   `/Users/geertzaal/Developer/ADPKD_research/prompts/deep.md`

4. **TypeScript types** (the data model with multi-axis scores):
   `/Users/geertzaal/Developer/ADPKD_research/dashboard/lib/types.ts`

5. **Python scoring** (heuristic scoring with skepticism penalties):
   `/Users/geertzaal/Developer/ADPKD_research/scripts/baseline_process.py`
   Focus on: `score_multi_axis()`, `detect_skepticism_flags()`, `score_relevance()`

6. **Dashboard papers page** (multi-axis score display):
   `/Users/geertzaal/Developer/ADPKD_research/dashboard/app/papers/papers-client.tsx`
   Focus on: `ScoreBar`, `CLASSIFICATION_META`, the scores column, the expanded row Critical Assessment section

7. **Dashboard main page** (score display in recent papers):
   `/Users/geertzaal/Developer/ADPKD_research/dashboard/app/dashboard-client.tsx`
   Focus on: the recent papers table score column

## Files to modify in Lymphedema system

### 1. CREATE: `/Users/geertzaal/Developer/Lymphedema_research/prompts/evaluation-framework.md`

Copy the ADPKD evaluation-framework.md and adapt it for lymphedema:

**What to change:**
- All references to "ADPKD" → "lymphedema" (or "lymphatic disease" where appropriate)
- Replace ADPKD-specific reasoning rules with lymphedema-specific ones:
  - **Slow disease caution** → Lymphedema is also chronic and progressive, but differently. Short-term volume changes may reflect fluid shifts, not structural lymphatic improvement. Distinguish between volume reduction (may be temporary/positional) and lymphatic function improvement (harder to prove).
  - **Surrogates vs patient-important outcomes**: Rank as:
    1. Cellulitis/infection rate, limb function, QoL (LYMPH-Q, LYMQOL), disability
    2. Limb volume/circumference change (standardized measurement)
    3. Bioimpedance (L-Dex), lymphoscintigraphy flow rates
    4. ICG fluorescence patterns, tissue water content
    5. Mechanistic readouts only
  - **Generalizability matters**: Always ask:
    - Primary or secondary lymphedema?
    - Upper extremity (breast cancer related) or lower extremity?
    - ISL Stage I, II, or III?
    - How long since onset? Early vs established?
    - Post-surgical (LVA/VLNT) or conservative management?
    - With or without obesity as confounder?
  - **Surgical outcomes caution**: LVA/VLNT studies are almost universally single-arm, retrospective, with no standardized outcome measures. The field lacks RCTs. This is a major evidence gap that should be flagged every time.
  - **Obesity confounding**: Weight loss alone reduces lymphedema volume. Any intervention study without controlling for weight/BMI changes has a major confounder.
  - **Preclinical translation**: Lymphatic biology is poorly understood compared to vascular biology. Animal models (mouse tail, ear) have limited translational validity. Gene therapy (VEGF-C/Lymfactin) showed promise in animals but clinical results are mixed.

**What to keep identical:**
- Non-negotiable principles (1-5)
- Required output structure (A-E)
- Scoring rubrics (the 0-10 scales for each axis — these are study-design based, not disease-specific)
- Automatic skepticism triggers (all apply equally)
- Classification rules
- Language rules
- Quality-control pass (10 questions)
- Highlight/watchlist selection rules
- Special handling of negative results
- Special handling of commercial/conflicted studies
- Desired output style

### 2. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/prompts/scan.md`

Read the current lymphedema scan.md and the ADPKD scan.md. Update the lymphedema version to:
- Add reference to evaluation-framework.md at the top (same pattern as ADPKD)
- Replace step 4 (paper assessment) with the full critical assessment framework:
  - 4a. Classify publication event
  - 4b. Claim audit (REQUIRED)
  - 4c. Skepticism flags (expanded list matching ADPKD)
  - 4d. Score on FIVE axes (0-10 each)
  - 4e. Quality-control pass (10 questions)
  - 4f. Classify into one bucket
  - 4g. Staleness filter
  - 4h. Write structured assessment (what happened / why care / limits confidence)
- Update alert template to include 5 scores and structured format
- Add language rules
- Add paper JSON schema additions (scores, classification, claim_audit, skepticism_flags, structured fields)
- Keep all lymphedema-specific search queries, API calls, taxonomy, and dimension keywords

### 3. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/prompts/deep.md`

Same pattern as scan.md:
- Add reference to evaluation-framework.md at the top
- Add evidence evaluation checklist to step 2
- Add negative-result policy
- Update confidence adjustment rules (weight by study quality)
- Update digest template to include:
  - 5-axis scores on highlights
  - "Negative / Null Results This Week" section
  - "Skepticism Notes" section
  - Claim calibration scores
- Add critical evaluation rules to the Rules section
- Add language discipline, quality-control pass, preclinical translation warning

### 4. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/dashboard/lib/types.ts`

Copy the ADPKD types.ts wholesale EXCEPT:
- Keep the Lymphedema-specific `Dimension` type if it differs
- Everything else (ScoreAxes, AlertClassification, PublicationEvent, StudyDesign, ClaimAudit, SkepticismFlags, Paper interface with all new optional fields) should match ADPKD exactly

### 5. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/scripts/baseline_process.py`

Keep the existing lymphedema-specific DIMENSION_KEYWORDS, SUBTOPIC_KEYWORDS, and entity lists.
Replace the scoring functions with the ADPKD versions:
- Copy `score_relevance()` (the composite wrapper)
- Copy `score_multi_axis()` (5-axis scoring with skepticism penalties)
- Copy `detect_skepticism_flags()` (expanded to 14 flags)
- Update `process_papers()` to include `scores` and `skepticism_flags` in paper output

**Lymphedema-specific scoring adjustments:**
- The importance signals should include lymphedema terms: LVA, VLNT, LYMPHA, CDT, MLD, Lymfactin, VEGF-C, cellulitis, ISL staging
- The evidence scoring is design-based and needs NO disease-specific changes
- The skepticism flags are design-based and need NO disease-specific changes
- Add one lymphedema-specific flag: `obesity_not_controlled` — if a volume-reduction study doesn't control for weight/BMI changes

### 6. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/dashboard/app/papers/papers-client.tsx`

Copy from ADPKD:
- `CLASSIFICATION_META` constant
- `scoreBarColor()` function
- `ScoreBar` component
- Replace the relevance column with the multi-axis scores column
- Add the Classification column after Dimensions
- Add the Critical Assessment section to the expanded row (classification badges, score bars, claim audit details, skepticism flags)

### 7. MODIFY: `/Users/geertzaal/Developer/Lymphedema_research/dashboard/app/dashboard-client.tsx`

Copy the recent papers score column update from ADPKD — replace the simple HIGH/MEDIUM/LOW badge with compact 3-axis score bars (Imp/Evi/Dec) with fallback to legacy badge.

### 8. BACKFILL existing papers

After updating baseline_process.py, run this to re-score all existing papers:
```python
import json
from scripts.baseline_process import score_multi_axis, detect_skepticism_flags

with open('data/papers.json') as f:
    data = json.load(f)

for paper in data['papers']:
    text = f"{paper.get('title', '')} {paper.get('abstract', '')}"
    paper['scores'] = score_multi_axis(paper.get('title',''), paper.get('abstract',''), paper.get('dimensions',[]))
    paper['skepticism_flags'] = detect_skepticism_flags(text)
    s = paper['scores']
    paper['relevance_score'] = min(round(
        s['importance']*0.20 + s['evidence_strength']*0.30 + s['novelty']*0.10
        + s['decision_usefulness']*0.25 + s['claim_calibration']*0.15
    ), 10)

with open('data/papers.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
```

### 9. REBUILD dashboard

```bash
cd /Users/geertzaal/Developer/Lymphedema_research/dashboard
rm -rf .next
npm run build
```

Fix any TypeScript errors (likely the same `Record<string, number>` cast issue — use `as unknown as Record<string, number>`).

### 10. DELETE old digests/alerts and regenerate

```bash
rm -f output/digests/*.md output/alerts/*.md
```

Then run the deep analysis to generate a fresh digest with the new framework:
```bash
cd /Users/geertzaal/Developer/Lymphedema_research
claude --print --permission-mode bypassPermissions --add-dir "$PWD" -p "$(cat prompts/deep.md)"
```

## Key principle

The evaluation framework, scoring rubrics, skepticism triggers, language rules, and quality-control checks are **disease-agnostic** — they are about study design quality and epistemic discipline, not about any specific disease. The only disease-specific parts are:
- The taxonomy/keywords
- The "slow disease" caution (adapted for lymphedema)
- The surrogate endpoint hierarchy (lymphedema-specific)
- The generalizability checklist (lymphedema-specific)
- The preclinical translation context (lymphedema-specific)

Everything else copies directly.
