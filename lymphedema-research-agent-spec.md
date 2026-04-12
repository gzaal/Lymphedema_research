# Lymphedema Research Intelligence System — Build Specification

## Purpose

Build a personal research intelligence system that continuously tracks scientific developments in Lymphedema. The system runs locally on a Mac Mini, uses Claude Code with `--loop` for autonomous research, stores structured data locally, and syncs synthesized output to Google Drive.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     LAUNCHD SCHEDULER                   │
│         (macOS native cron — two schedules)              │
├──────────────────────┬──────────────────────────────────┤
│   SCAN MODE          │   DEEP ANALYSIS MODE             │
│   Every 2-3 days     │   Weekly (Sunday)                │
│   Light, fast        │   Comprehensive synthesis        │
└──────────┬───────────┴──────────────┬───────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────────────┐
│              CLAUDE CODE (--loop mode)                   │
│   System prompt defines research behavior               │
│   Tools: bash, file I/O, web fetch                      │
│   Uses Max account tokens                               │
├─────────────────────────────────────────────────────────┤
│   1. Fetch papers from Semantic Scholar / PubMed        │
│   2. Check ClinicalTrials.gov for trial updates         │
│   3. Assess relevance + novelty against knowledge base  │
│   4. Update structured data (local JSON/SQLite)         │
│   5. Update synthesis documents                         │
│   6. Generate alerts for significant findings           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                            │
├──────────────────────┬──────────────────────────────────┤
│   LOCAL (Mac Mini)   │   GOOGLE DRIVE (synced output)   │
│                      │                                  │
│   ~/adpkd-research/  │   Lymphedema Research/                │
│   ├── data/          │   ├── Knowledge Base/            │
│   │   ├── papers.json│   │   ├── 01-Pharmacological.gdoc│
│   │   ├── trials.json│   │   ├── 02-Dietary.gdoc       │
│   │   ├── findings.json│ │   ├── 03-Genetics.gdoc      │
│   │   └── run-log.json│  │   ├── 04-Clinical-Trials.gdoc│
│   ├── prompts/       │   │   ├── 05-Management.gdoc    │
│   │   ├── scan.md    │   │   └── 06-Community.gdoc     │
│   │   └── deep.md    │   ├── Weekly Digests/            │
│   ├── output/        │   │   └── 2026-W14-digest.gdoc  │
│   └── scripts/       │   └── Alerts/                    │
│       ├── scan.sh    │       └── (significant findings) │
│       ├── deep.sh    │                                  │
│       └── sync.py    │                                  │
└──────────────────────┴──────────────────────────────────┘
```

---

## Research Domain Taxonomy

The agent tracks Lymphedema research across six dimensions. Each dimension has subtopics and specific entities to monitor.

### 1. Pharmacological Treatments

Track drugs by: name, mechanism, phase, trial ID, latest results, side effects, relevance score.

| Subtopic | Key Entities |
|----------|-------------|
| V2 Receptor Antagonists | Tolvaptan (approved), lixivaptan |
| PKD1 Correctors | VX-407 (Vertex, AGLOW Phase 2 trial) |
| Novel Investigational | ABBV-CLS-628 (AbbVie), AL01211, RGLS4326, RGLS8429 |
| RNA-based Therapies | miR-17 inhibitors, CFTR modulators |
| Repurposed Drugs | Metformin (TAME PKD), SGLT2 inhibitors, GLP-1 RAs, bempedoic acid, pioglitazone, bosutinib |
| mTOR Pathway | Rapamycin/sirolimus, everolimus |
| Somatostatin Analogues | Pasireotide, octreotide (also liver cysts) |
| Gene Therapy | CRISPR-Cas9 targeting PKD1/PKD2 |
| Stem Cell Therapy | Mesenchymal stem cell approaches |

### 2. Dietary & Lifestyle Interventions

| Subtopic | Key Entities |
|----------|-------------|
| Ketogenic Diets | KETO-ADPKD trial, GREASE2 trial, Modified Atkins Diet |
| Caloric Restriction | Daily caloric restriction, intermittent fasting |
| BHB Supplementation | Exogenous beta-hydroxybutyrate |
| Water Intake | Optimal hydration, vasopressin suppression |
| Sodium Restriction | <2300 mg/day guideline, HALT-PKD data |
| Protein Management | Stage-dependent targets (0.6-1.0 g/kg), plant-based vs animal |
| Gut Microbiome | Fiber intake, short-chain fatty acids |
| Weight Management | BMI impact on progression |

### 3. Genetics & Biomarkers

| Subtopic | Key Entities |
|----------|-------------|
| Gene Variants | PKD1 truncating vs non-truncating, PKD2, variant-specific progression |
| Progression Biomarkers | TKV (FDA-qualified surrogate), htTKV, eGFR slope |
| Serum Biomarkers | Proteomics-based prediction models, copeptin |
| Risk Scoring | Mayo Clinic classification, PROPKD score |
| Polygenic Risk | Polygenic modifiers of penetrance |
| Imaging Advances | MRI-based cyst segmentation, AI-assisted measurement |

### 4. Clinical Trials Pipeline

Track by: NCT ID, phase, sponsor, intervention, primary endpoint, status, expected readouts.

| Status | Focus |
|--------|-------|
| Active/Recruiting | New enrollment opportunities, eligibility criteria |
| Results Reported | Efficacy data, safety signals |
| Phase Transitions | Advancement or termination decisions |
| Regulatory | FDA/EMA decisions, accelerated approval pathways |

### 5. Disease Management & Guidelines

| Subtopic | Key Entities |
|----------|-------------|
| Clinical Guidelines | KDIGO 2025 guideline, ERA position statements |
| Blood Pressure | ACE inhibitors, ARBs, target ranges |
| Liver Disease | Polycystic liver disease co-management |
| Pain Management | Cyst-related pain interventions |
| Progression Assessment | When to start treatment, monitoring intervals |
| Transplant | Timing, outcomes, living donor considerations |
| Pediatric | Early-onset ADPKD, monitoring in children |

### 6. Patient Community & Conferences

| Subtopic | Key Entities |
|----------|-------------|
| Conferences | PKDCON, ASN Kidney Week, ERA Congress |
| Foundations | PKD Foundation, PKD International |
| Patient Registries | ADPKD Registry |
| Quality of Life | PRO tools, symptom management |

---

## Data Schema

### papers.json

```json
{
  "papers": [
    {
      "id": "ss_<semantic_scholar_id>",
      "title": "Paper title",
      "authors": ["Author A", "Author B"],
      "journal": "Journal Name",
      "published_date": "2026-01-15",
      "doi": "10.xxxx/xxxxx",
      "url": "https://...",
      "abstract": "Full abstract text",
      "dimensions": ["pharmacological", "clinical_trials"],
      "subtopics": ["V2_receptor_antagonists", "tolvaptan"],
      "entities_mentioned": ["tolvaptan", "lixivaptan"],
      "relevance_score": 8,
      "novelty_assessment": "New long-term safety data for tolvaptan beyond 5 years",
      "key_findings": [
        "Finding 1 in plain language",
        "Finding 2 in plain language"
      ],
      "clinical_implications": "Brief note on what this means for patients",
      "added_date": "2026-04-04",
      "last_reviewed": "2026-04-04",
      "status": "new|reviewed|incorporated",
      "run_id": "scan_2026-04-04_001"
    }
  ]
}
```

### trials.json

```json
{
  "trials": [
    {
      "nct_id": "NCT04680780",
      "title": "KETO-ADPKD",
      "sponsor": "University of Cologne",
      "intervention": "Ketogenic diet vs water fasting vs control",
      "phase": "Exploratory RCT",
      "status": "Completed",
      "primary_endpoint": "TKV change",
      "enrollment": 66,
      "start_date": "2020-12-01",
      "expected_completion": "2023-06-01",
      "dimensions": ["dietary"],
      "latest_results_summary": "KD group showed kidney volume reduction in patients achieving ketosis thresholds",
      "last_checked": "2026-04-04",
      "change_log": [
        {
          "date": "2026-04-04",
          "change": "Initial entry — trial completed, results published"
        }
      ]
    }
  ]
}
```

### findings.json (synthesized knowledge)

```json
{
  "findings": [
    {
      "id": "finding_001",
      "dimension": "dietary",
      "subtopic": "ketogenic_diets",
      "statement": "Ketogenic dietary interventions show promising but preliminary evidence for slowing kidney volume growth in ADPKD, particularly when sufficient ketosis is achieved",
      "confidence": "moderate",
      "supporting_papers": ["ss_12345", "ss_67890"],
      "contradicting_papers": [],
      "clinical_relevance": "high",
      "last_updated": "2026-04-04",
      "evolution": [
        {
          "date": "2026-04-04",
          "note": "Initial baseline assessment"
        }
      ]
    }
  ]
}
```

### run-log.json

```json
{
  "runs": [
    {
      "run_id": "scan_2026-04-04_001",
      "mode": "scan|deep",
      "started_at": "2026-04-04T08:00:00Z",
      "completed_at": "2026-04-04T08:15:00Z",
      "papers_found": 12,
      "papers_added": 3,
      "trials_updated": 1,
      "findings_updated": 0,
      "alerts_generated": 0,
      "errors": [],
      "token_usage_estimate": "~15k tokens"
    }
  ]
}
```

---

## Agent Prompts

### Scan Mode Prompt (scan.md)

```markdown
# Lymphedema Research Scanner

You are a research intelligence agent monitoring scientific developments in
Lymphedema.

## Your Task

Perform a SCAN — a lightweight check for new publications and trial updates.

## Steps

1. **Load current state**
   - Read `~/adpkd-research/data/papers.json` to know what you already have
   - Read `~/adpkd-research/data/trials.json` for current trial tracking
   - Note the date of the last successful run from `run-log.json`

2. **Search for new papers**
   Use curl to query the Semantic Scholar API for recent ADPKD papers:

   ```bash
   # Primary search — recent papers
   curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=ADPKD+polycystic+kidney&year=2025-2026&limit=20&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .

   # Targeted searches for specific subtopics
   curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=ADPKD+tolvaptan&year=2025-2026&limit=10&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .
   curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=ADPKD+ketogenic+diet&year=2025-2026&limit=10&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .
   curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=polycystic+kidney+clinical+trial&year=2025-2026&limit=10&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .
   curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=PKD1+PKD2+gene+therapy&year=2025-2026&limit=10&fields=title,authors,abstract,journal,publicationDate,externalIds,url" | jq .
   ```

3. **Deduplicate** — compare against existing paper IDs in papers.json

4. **Assess each new paper**
   For each genuinely new paper:
   - Assign dimensions and subtopics from the taxonomy
   - Score relevance (1-10) based on:
     - Direct ADPKD focus (not just CKD in general): +3
     - Clinical trial results: +3
     - Novel treatment mechanism: +2
     - Dietary/lifestyle intervention: +2
     - Human data (vs animal models): +2
     - Review/meta-analysis of existing data: +1
   - Write a brief novelty assessment
   - Extract key findings in plain language
   - Note clinical implications

5. **Check for trial updates**
   For each tracked trial in trials.json, check ClinicalTrials.gov:
   ```bash
   curl -s "https://clinicaltrials.gov/api/v2/studies/NCT04680780" | jq '.protocolSection.statusModule'
   ```
   Note any status changes, new results, or enrollment updates.

6. **Update data files**
   - Append new papers to papers.json
   - Update trials.json with any changes
   - Log the run in run-log.json

7. **Generate alerts**
   If any paper scores relevance >= 8, or any trial changes phase/status:
   - Write a brief alert to `~/adpkd-research/output/alerts/YYYY-MM-DD-alert.md`
   - Include: what happened, why it matters, link to source

## Rules
- Do NOT update synthesis documents (findings.json or knowledge base docs) — that's for deep analysis mode
- Be conservative with relevance scores — not everything mentioning kidneys is relevant
- If a paper is about ARPKD (autosomal recessive), note it but score lower unless findings apply to ADPKD
- If the Semantic Scholar API is rate-limited, wait and retry (max 3 retries)
- Always validate JSON before writing files
```

### Deep Analysis Mode Prompt (deep.md)

```markdown
# ADPKD Deep Research Analyst

You are a research intelligence agent performing a DEEP ANALYSIS of the
Lymphedema research landscape.

## Your Task

Synthesize recent findings, update the knowledge base, cross-reference
new data against existing understanding, and produce a weekly digest.

## Steps

1. **Load full state**
   - Read ALL files in `~/adpkd-research/data/`
   - Understand the current state of knowledge across all six dimensions
   - Identify papers with status "new" (not yet incorporated into synthesis)

2. **Cross-reference new papers**
   For each unincorporated paper:
   - Does it confirm, extend, or contradict existing findings?
   - Does it introduce a genuinely new angle?
   - Are there connections between papers across different dimensions?
     (e.g., a ketogenic diet paper that also measures biomarkers)

3. **Update findings.json**
   - Add new findings or update existing ones
   - Adjust confidence levels based on accumulating evidence
   - Track the evolution of understanding over time
   - Mark papers as "incorporated" in papers.json

4. **Deeper investigation**
   If a new paper is particularly significant (relevance >= 8):
   - Search for related papers by the same authors
   - Search for papers citing the same key references
   - Look for pre-prints or conference presentations with newer data
   - Check if any trials are based on this work

5. **Generate weekly digest**
   Write `~/adpkd-research/output/digests/YYYY-WXX-digest.md`:

   ```markdown
   # Lymphedema Research Digest — Week XX, YYYY

   ## Highlights
   [Most significant new findings this week — max 3 items]

   ## New Papers
   [Brief summary of each new paper added, grouped by dimension]

   ## Trial Updates
   [Any changes in tracked clinical trials]

   ## Evolving Understanding
   [How this week's findings shift or reinforce the overall picture]

   ## Watchlist
   [Upcoming trial readouts, conferences, or expected publications]

   ## Data Summary
   - Papers tracked: N total (X new this week)
   - Trials monitored: N (X with updates)
   - Findings updated: X
   ```

6. **Sync to Google Drive**
   Run the sync script to push updated content:
   ```bash
   python3 ~/adpkd-research/scripts/sync.py
   ```

7. **Update knowledge base documents**
   For each dimension where findings changed, update the corresponding
   markdown file in `~/adpkd-research/output/knowledge-base/`:
   - `01-pharmacological-treatments.md`
   - `02-dietary-lifestyle.md`
   - `03-genetics-biomarkers.md`
   - `04-clinical-trials-pipeline.md`
   - `05-disease-management.md`
   - `06-patient-community.md`

   Each document should be a living synthesis — not a list of papers,
   but a coherent narrative of what is currently known, what's uncertain,
   and what's emerging. Include dates so the reader knows how current
   the information is.

## Rules
- Always preserve the evolution history in findings — never overwrite, always append
- When confidence changes, explain why in the evolution log
- Be honest about uncertainty — "promising but preliminary" is better than overstating
- Note when findings are from animal models vs human data
- Flag potential conflicts of interest if obvious (e.g., pharma-sponsored trials)
- The knowledge base documents should be readable by a motivated patient,
  not just researchers — use plain language where possible, with technical
  terms explained
```

---

## Initial Baseline Prompt (baseline.md)

This runs ONCE to establish the current state of knowledge.

```markdown
# Lymphedema Research Baseline Builder

You are building the initial knowledge base for an Lymphedema research tracking
system. This is a comprehensive one-time sweep.

## Your Task

Establish the current state of Lymphedema research across all six dimensions
of the taxonomy. This will serve as the foundation for ongoing monitoring.

## Steps

1. **Create directory structure**
   ```bash
   mkdir -p ~/adpkd-research/{data,prompts,output/{digests,alerts,knowledge-base},scripts}
   ```

2. **Comprehensive paper search**
   Search Semantic Scholar for the most important recent ADPKD papers.
   Cast a wide net — you're building the baseline.

   Search queries to run (with year filter 2023-2026 for recency,
   but also grab landmark papers regardless of date):

   - "ADPKD treatment clinical trial"
   - "ADPKD tolvaptan long term"
   - "ADPKD ketogenic diet"
   - "ADPKD metformin"
   - "ADPKD SGLT2 inhibitor"
   - "ADPKD GLP-1"
   - "PKD1 PKD2 gene therapy CRISPR"
   - "ADPKD total kidney volume biomarker"
   - "ADPKD progression prediction"
   - "polycystic kidney disease dietary intervention"
   - "ADPKD clinical practice guideline"
   - "VX-407 ADPKD" (Vertex PKD1 corrector)
   - "ADPKD miR-17 microRNA"
   - "ADPKD caloric restriction intermittent fasting"
   - "ADPKD proteomics biomarker"

   For each search, use limit=30 to get comprehensive coverage.

3. **Build the initial trials.json**
   Search ClinicalTrials.gov for active ADPKD trials:
   ```bash
   curl -s "https://clinicaltrials.gov/api/v2/studies?query.cond=lymphedema&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION&pageSize=50" | jq .
   ```

4. **Build initial findings.json**
   Based on the papers found, establish the current consensus and
   open questions for each dimension. Be thorough — this is the
   foundation everything builds on.

5. **Write initial knowledge base documents**
   Create all six knowledge base documents with comprehensive
   current-state summaries.

6. **Initialize run-log.json** with this baseline run.

7. **Generate the first digest** summarizing the baseline state.

## Important Notes
- This will be a long run — take your time, be thorough
- Prioritize quality over speed
- For landmark papers (e.g., TEMPO 3:4 tolvaptan trial, HALT-PKD),
  include them even if older — they're foundational
- Note the KDIGO 2025 guideline as a key reference
- Identify the most active research groups and institutions
- Flag any papers from Dutch institutions (University of Amsterdam,
  Radboud, Erasmus MC, etc.) — these may be locally relevant
```

---

## Scripts to Build

### scan.sh
```bash
#!/bin/bash
# Lymphedema Research Scan — runs every 2-3 days via launchd
cd ~/adpkd-research
claude --loop \
  --allowedTools "Bash(read:*),Bash(write:~/adpkd-research/*),Bash(net:api.semanticscholar.org),Bash(net:clinicaltrials.gov)" \
  -p "$(cat prompts/scan.md)" \
  2>&1 | tee -a output/logs/scan-$(date +%Y%m%d).log
```

### deep.sh
```bash
#!/bin/bash
# ADPKD Deep Analysis — runs weekly (Sunday) via launchd
cd ~/adpkd-research
claude --loop \
  --allowedTools "Bash(read:*),Bash(write:~/adpkd-research/*),Bash(net:api.semanticscholar.org),Bash(net:clinicaltrials.gov)" \
  -p "$(cat prompts/deep.md)" \
  2>&1 | tee -a output/logs/deep-$(date +%Y%m%d).log
```

### sync.py
```python
#!/usr/bin/env python3
"""
Sync Lymphedema research output to Google Drive.

Options:
1. Use `gdrive` CLI tool (https://github.com/glotlabs/gdrive)
2. Use rclone with Google Drive backend
3. Use Google Drive desktop app (if installed) — just write to the synced folder

Simplest approach: if Google Drive for Desktop is installed,
the sync folder is at ~/Library/CloudStorage/GoogleDrive-<email>/My Drive/
Just copy files there.
"""
import shutil
import os
from pathlib import Path
from datetime import datetime

# Configure these paths
GDRIVE_BASE = Path.home() / "Library/CloudStorage"  # Find exact path
LOCAL_OUTPUT = Path.home() / "adpkd-research/output"
REMOTE_FOLDER = "Lymphedema Research"

def find_gdrive_path():
    """Find Google Drive mount point."""
    gdrive_base = Path.home() / "Library/CloudStorage"
    if gdrive_base.exists():
        for d in gdrive_base.iterdir():
            if d.name.startswith("GoogleDrive"):
                return d / "My Drive" / REMOTE_FOLDER
    return None

def sync():
    gdrive_path = find_gdrive_path()
    if not gdrive_path:
        print("ERROR: Google Drive for Desktop not found.")
        print("Install it or configure rclone as alternative.")
        return

    # Create remote structure
    for subdir in ["Knowledge Base", "Weekly Digests", "Alerts"]:
        (gdrive_path / subdir).mkdir(parents=True, exist_ok=True)

    # Sync knowledge base
    kb_src = LOCAL_OUTPUT / "knowledge-base"
    if kb_src.exists():
        for f in kb_src.glob("*.md"):
            shutil.copy2(f, gdrive_path / "Knowledge Base" / f.name)

    # Sync digests
    digest_src = LOCAL_OUTPUT / "digests"
    if digest_src.exists():
        for f in digest_src.glob("*.md"):
            shutil.copy2(f, gdrive_path / "Weekly Digests" / f.name)

    # Sync alerts
    alerts_src = LOCAL_OUTPUT / "alerts"
    if alerts_src.exists():
        for f in alerts_src.glob("*.md"):
            shutil.copy2(f, gdrive_path / "Alerts" / f.name)

    print(f"Synced to {gdrive_path} at {datetime.now().isoformat()}")

if __name__ == "__main__":
    sync()
```

### LaunchD Plists

#### com.lymphedema.scan.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.lymphedema.scan</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-l</string>
        <string>/Users/YOUR_USERNAME/adpkd-research/scripts/scan.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <array>
        <!-- Run Tuesday, Thursday, Saturday at 08:00 -->
        <dict>
            <key>Weekday</key><integer>2</integer>
            <key>Hour</key><integer>8</integer>
            <key>Minute</key><integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key><integer>4</integer>
            <key>Hour</key><integer>8</integer>
            <key>Minute</key><integer>0</integer>
        </dict>
        <dict>
            <key>Weekday</key><integer>6</integer>
            <key>Hour</key><integer>8</integer>
            <key>Minute</key><integer>0</integer>
        </dict>
    </array>
    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/adpkd-research/output/logs/launchd-scan.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/adpkd-research/output/logs/launchd-scan-err.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
```

#### com.lymphedema.deep.plist
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.lymphedema.deep</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/bash</string>
        <string>-l</string>
        <string>/Users/YOUR_USERNAME/adpkd-research/scripts/deep.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <!-- Run Sunday at 09:00 -->
        <key>Weekday</key><integer>0</integer>
        <key>Hour</key><integer>9</integer>
        <key>Minute</key><integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/Users/YOUR_USERNAME/adpkd-research/output/logs/launchd-deep.log</string>
    <key>StandardErrorPath</key>
    <string>/Users/YOUR_USERNAME/adpkd-research/output/logs/launchd-deep-err.log</string>
    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin</string>
    </dict>
</dict>
</plist>
```

---

## Setup Instructions (for Claude Code)

Run these steps in order:

### 1. Create directory structure
```bash
mkdir -p ~/adpkd-research/{data,prompts,output/{digests,alerts,knowledge-base,logs},scripts}
```

### 2. Copy prompt files
Place `scan.md`, `deep.md`, and `baseline.md` into `~/adpkd-research/prompts/`

### 3. Copy and configure scripts
Place `scan.sh`, `deep.sh`, and `sync.py` into `~/adpkd-research/scripts/`
Make scripts executable: `chmod +x ~/adpkd-research/scripts/*.sh`
Update YOUR_USERNAME in all files.

### 4. Configure Google Drive sync
- If Google Drive for Desktop is installed: verify the mount path in `sync.py`
- If not: install `rclone` and configure a Google Drive remote, then update `sync.py`

### 5. Install launchd plists
```bash
cp com.lymphedema.scan.plist ~/Library/LaunchAgents/
cp com.lymphedema.deep.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.lymphedema.scan.plist
launchctl load ~/Library/LaunchAgents/com.lymphedema.deep.plist
```

### 6. Run the baseline
```bash
cd ~/adpkd-research
claude --loop \
  --allowedTools "Bash(read:*),Bash(write:~/adpkd-research/*),Bash(net:api.semanticscholar.org),Bash(net:clinicaltrials.gov)" \
  -p "$(cat prompts/baseline.md)"
```
This will take a while — it builds the complete initial knowledge base.

### 7. Verify
- Check that `data/*.json` files are populated
- Check that `output/knowledge-base/*.md` files exist
- Check that Google Drive sync works
- Verify launchd schedules: `launchctl list | grep adpkd`

---

## Frontend Dashboard (Phase 2)

Once the data pipeline is running, build a simple dashboard. Options:

### Option A: React Artifact (quick prototype)
Build in Claude.ai as a React artifact that reads from a JSON file.
Good for prototyping the layout and interactions.

### Option B: Local HTML + Google Sheets API
A single HTML page that reads from a Google Sheet (published as CSV).
Can be served locally or hosted on GitHub Pages.

### Option C: Simple Markdown Site
Use a static site generator (Astro, 11ty) to render the knowledge base
markdown files as a browsable website. Lowest maintenance.

### Dashboard Should Show:
- Research landscape overview (6 dimensions with status indicators)
- Timeline of recent findings
- Clinical trials pipeline visualization
- Paper count and trend by dimension
- Alerts and significant findings
- Link to full knowledge base documents

---

## Notes & Considerations

### Token Usage
- Scan mode: estimated ~10-20k tokens per run (3x/week = ~45-60k/week)
- Deep analysis: estimated ~30-60k tokens per run (1x/week)
- Baseline: estimated ~100-200k tokens (one-time)
- Total weekly: roughly ~75-120k tokens — well within Max limits

### API Rate Limits
- Semantic Scholar: 100 requests per 5 minutes (unauthenticated)
  - Request an API key (free) for higher limits if needed
  - https://www.semanticscholar.org/product/api
- ClinicalTrials.gov: No strict rate limit but be respectful

### Data Freshness
- Semantic Scholar indexes papers within days of publication
- ClinicalTrials.gov is updated by sponsors (can lag)
- PubMed could be added as a secondary source if coverage gaps appear

### Future Enhancements
- Add PubMed/MEDLINE search via E-utilities API
- Email digest delivery (Gmail integration)
- Slack notifications for high-relevance alerts
- Citation graph analysis (which papers cite which)
- Author tracking (follow specific researchers)
- Integration with Zotero or Paperpile for paper management
- Conference calendar integration
```
