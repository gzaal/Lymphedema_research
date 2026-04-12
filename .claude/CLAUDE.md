# Lymphedema Research Project

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
- Data files: `data/papers.json` (461 papers), `data/trials.json` (83 trials)
- Dashboard reads from `../data/` and `../output/` relative to the dashboard dir.
