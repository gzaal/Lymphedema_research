# Lymphedema Research Project

## Scope

**Primary (genetic / developmental / hereditary) lymphedema only.** Secondary lymphedema (BCRL, post-surgical, filarial, radiation-induced) is explicitly out of scope and filtered at ingestion via `classify_lymphedema_type()` in `scripts/baseline_process.py`. Papers/trials are tagged `primary` / `both` / `unknown` / `secondary`; secondary items are purged.

## Dashboard

- **Port**: 3001 (ADPKD uses 3000)
- **IMPORTANT — always use production mode** (`npm run build && npm run start`), never `npm run dev`. Dev mode (Turbopack) causes runaway node process spawning that crashes the Mac Mini. The `.claude/launch.json` and `scripts/start-dashboard.sh` are both configured for production mode.
- After any code change to the dashboard, run `npm run build` in `dashboard/` before starting.
- Network-accessible on all interfaces via `--hostname 0.0.0.0`.

## LaunchD Agents

- `com.lymphedema.scan` — Tue/Thu/Sat at 08:00
- `com.lymphedema.deep` — Sun at 09:00
- Installed in `~/Library/LaunchAgents/`, source plists in `scripts/`.

## Data Pipeline

- `scripts/baseline_fetch.py` → `baseline_process.py` → `pubmed_fetch.py` → `merge_pubmed.py`
- Data files: `data/papers.json` (231 papers, primary-scope), `data/trials.json` (24 trials, primary-scope). Pre-purge backups at `*.bak-before-purge`.
- Dashboard reads from `../data/` and `../output/` relative to the dashboard dir.
