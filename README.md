# Lymphedema Research Intelligence

An automated research-intelligence system that tracks the scientific literature and
clinical-trial landscape for **primary (genetic / hereditary / developmental)
lymphedema**, evaluates each new paper against a structured evidence framework, and
surfaces it through a web dashboard and weekly digests.

> **Scope — primary lymphedema only.** Secondary lymphedema (breast-cancer-related,
> post-surgical, filarial, radiation-induced) is explicitly out of scope. Papers and
> trials are classified at ingestion and secondary-only items are filtered out.

## How it works

```
        fetch                 process / score            merge & classify
  PubMed + ClinicalTrials  ─▶  multi-axis evaluation  ─▶  papers.json / trials.json
   + baseline corpus            (importance, evidence,       │
                                 novelty, usefulness,        ▼
                                 calibration + skepticism)  schema guard ──▶ dashboard
                                                                    │              +
                                                                    ▼         weekly digests
                                                              normalize_data.py      + alerts
```

- **Scan runs** (light, frequent) pull new PubMed hits and trial updates, score them,
  and append to the data files.
- **Deep runs** (weekly) re-evaluate accumulating evidence, update the findings
  knowledge base, and write a weekly digest.
- A **schema guard** (`scripts/normalize_data.py`) runs at the end of every scan/deep
  run to enforce required fields (`dimensions`, `added_date`) so the dashboard can
  never crash on an incomplete record.

## Evaluation framework

Every paper is scored on five axes (0–10) — importance, evidence strength, novelty,
decision usefulness, and claim calibration — plus a set of skepticism flags
(single-arm, retrospective, surrogate-endpoint-only, obesity-not-controlled, etc.).
See [`prompts/evaluation-framework.md`](prompts/evaluation-framework.md).

Research is organized across six **dimensions**: pharmacological treatments,
dietary & lifestyle, genetics & biomarkers, clinical trials, disease management,
and patient community.

## Repository layout

| Path | Contents |
|------|----------|
| `scripts/` | Fetch, process, merge, and normalization pipeline (Python) |
| `data/` | `papers.json`, `trials.json`, `findings.json`, `run-log.json` |
| `prompts/` | Scan / deep run instructions and the evaluation framework |
| `output/` | `knowledge-base/`, `digests/`, `alerts/` (generated) |
| `dashboard/` | Next.js dashboard that reads from `data/` and `output/` |

## Data pipeline

```
baseline_fetch.py → baseline_process.py → pubmed_fetch.py → merge_pubmed.py
                                                              ↓
                                                    normalize_data.py (schema guard)
```

Run the schema guard manually at any time (idempotent):

```bash
python3 scripts/normalize_data.py
```

## Dashboard

A Next.js app that visualizes the corpus, trials, findings, digests, and alerts.

> **Always run in production mode.** Dev mode (Turbopack) spawns runaway Node
> processes. `scripts/start-dashboard.sh` and `.claude/launch.json` are both
> configured for production.

```bash
cd dashboard
npm install
npm run build
npm run start -- --hostname 0.0.0.0 --port 3001
```

The dashboard serves on **port 3001** and reads data from `../data/` and `../output/`.

## Automation

Two scheduled agents (macOS `launchd`, source plists in `scripts/`):

| Agent | Schedule |
|-------|----------|
| `com.lymphedema.scan` | Tue / Thu / Sat at 08:00 |
| `com.lymphedema.deep` | Sun at 09:00 |

## License

No license specified — all rights reserved by the repository owner.
