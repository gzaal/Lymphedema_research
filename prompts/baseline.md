# Lymphedema Research Baseline Builder

You are building the initial knowledge base for a lymphedema research tracking
system. This is a comprehensive one-time sweep.

## Your Task

Establish the current state of lymphedema research across all six dimensions
of the taxonomy. This will serve as the foundation for ongoing monitoring.

## Steps

1. **Comprehensive paper search**
   Search Semantic Scholar for the most important recent lymphedema papers.
   Cast a wide net — you're building the baseline.

   Search queries to run (with year filter 2023-2026 for recency,
   but also grab landmark papers regardless of date):

   - "lymphedema treatment clinical trial"
   - "lymphaticovenular anastomosis LVA outcomes"
   - "vascularized lymph node transfer VLNT"
   - "Complete Decongestive Therapy CDT lymphedema"
   - "lymphedema VEGF-C gene therapy Lymfactin"
   - "lymphedema mTOR sirolimus rapamycin"
   - "lymphedema fibrosis TGF-beta treatment"
   - "FLT4 VEGFR3 primary lymphedema genetics"
   - "FOXC2 GJC2 SOX18 lymphedema mutation"
   - "breast cancer lymphedema BCRL prevention"
   - "lymphedema bioimpedance ICG lymphography biomarker"
   - "immediate lymphatic reconstruction LYMPHA ILR"
   - "PIEZO1 lymphangiogenesis mechanosensory"
   - "lymphedema obesity GLP-1 weight management"
   - "lymphedema quality of life patient outcomes"

   For each search, use limit=30 to get comprehensive coverage.

   First load the Semantic Scholar API key:
   ```bash
   SS_KEY=$(cat /Users/geertzaal/Developer/Lymphedema_research/data/.api-keys.json | jq -r '.semantic_scholar')
   ```
   Then use curl to query (include the API key header):
   ```bash
   curl -s -H "x-api-key: $SS_KEY" "https://api.semanticscholar.org/graph/v1/paper/search?query=<QUERY>&year=2023-2026&limit=30&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .
   ```

2. **Build the initial trials.json**
   Search ClinicalTrials.gov for active lymphedema trials:
   ```bash
   curl -s "https://clinicaltrials.gov/api/v2/studies?query.cond=lymphedema&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION&pageSize=50" | jq .
   ```
   Also search for breast cancer lymphedema:
   ```bash
   curl -s "https://clinicaltrials.gov/api/v2/studies?query.cond=breast+cancer+lymphedema&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING&pageSize=30" | jq .
   ```
   And recently completed trials with results:
   ```bash
   curl -s "https://clinicaltrials.gov/api/v2/studies?query.cond=lymphedema&filter.overallStatus=COMPLETED&pageSize=30&sort=LastUpdatePostDate:desc" | jq .
   ```

3. **Build initial findings.json**
   Based on the papers found, establish the current consensus and
   open questions for each dimension. Be thorough — this is the
   foundation everything builds on.

4. **Write initial knowledge base documents**
   Create all six knowledge base documents in `/Users/geertzaal/Developer/Lymphedema_research/output/knowledge-base/` with comprehensive current-state summaries:
   - `01-pharmacological-treatments.md`
   - `02-dietary-lifestyle.md`
   - `03-genetics-biomarkers.md`
   - `04-clinical-trials-pipeline.md`
   - `05-disease-management.md`
   - `06-patient-community.md`

5. **Initialize run-log.json** with this baseline run in `/Users/geertzaal/Developer/Lymphedema_research/data/`.

6. **Generate the first digest** summarizing the baseline state.

7. **Sync to Google Drive**
   ```bash
   python3 /Users/geertzaal/Developer/Lymphedema_research/scripts/sync.py
   ```

## Data file locations
- Papers: `/Users/geertzaal/Developer/Lymphedema_research/data/papers.json`
- Trials: `/Users/geertzaal/Developer/Lymphedema_research/data/trials.json`
- Findings: `/Users/geertzaal/Developer/Lymphedema_research/data/findings.json`
- Run log: `/Users/geertzaal/Developer/Lymphedema_research/data/run-log.json`

## Research Domain Taxonomy

1. **Pharmacological Treatments** — gene therapy (Lymfactin/VEGF-C), mTOR inhibitors (sirolimus/rapamycin), anti-inflammatory (ketoprofen, ubenimex/LTB4 inhibitor), anti-fibrotic (TGF-β1 inhibitors, pirfenidone), immunomodulatory (dupilumab), GLP-1 agonists (semaglutide), PIEZO1 agonists (Yoda1 preclinical), doxycycline (filarial)
2. **Dietary & Lifestyle** — weight management, obesity, BMI, exercise/muscle pump, skin care, nutrition, self-management
3. **Genetics & Biomarkers** — FLT4/VEGFR3, FOXC2, SOX18, GJC2, PROX1, GATA2, KIF11, PIEZO1, PTPN14, CCBE1, ADAMTS3; limb volumetry, bioimpedance (L-Dex), ICG lymphography patterns, lymphoscintigraphy, plasma cytokine panels
4. **Clinical Trials Pipeline** — active/recruiting trials, results, phase transitions, LVA, VLNT, LYMPHA, Lymfactin, sirolimus
5. **Disease Management** — ISL staging (0–III), CDT phases, MLD, compression garments/bandaging, surgical pathway (LVA/VLNT/LYMPHA/liposuction), infection prevention, ISL/ILF guidelines
6. **Patient Community** — conferences (ISL World Congress, LE&RN Symposium), foundations (LE&RN, ILF, NLN, ISL), registries (LIMPRINT, LE&RN/Stanford Registry), QoL tools (LYMPH-Q, LYMQOL)

## Important Notes
- This will be a long run — take your time, be thorough
- Prioritize quality over speed
- For landmark papers (e.g., Lymfactin Phase II, ILR/LYMPHA 13-year meta-analysis,
  PIEZO1 JCI paper), include them even if slightly older — they're foundational
- Note the ISL 2020/2021 Consensus Document as a key reference for staging/management
- Identify the most active research groups (Koshima, Becker, Cheng for surgery;
  Alitalo, Bhatt for lymphangiogenesis; Tervala for gene therapy)
- Flag any papers from Dutch institutions (AMC/UvA, Erasmus MC, Maastricht UMC+,
  LUMC, Radboud) — these may be locally relevant
- Distinguish carefully between primary lymphedema (genetic, rare) and secondary
  lymphedema (acquired, ~99% of adult cases, especially BCRL)
- The VEGF-C / VEGFR-3 / FOXC2 axis is the central molecular story in this field
