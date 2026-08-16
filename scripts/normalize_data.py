#!/usr/bin/env python3
"""
Schema-normalization guard for papers.json / trials.json.

Scan and deep runs are agent-driven: the agent writes paper objects by hand
(or via one-off apply scripts) following prompts/scan.md. That path is
unreliable — papers have shipped with `dimensions: null` or a missing
`added_date`, which crashes the dashboard (.includes()/.localeCompare()).

This script enforces the invariants that every consumer relies on:
  - `dimensions` is a non-empty list (classified from title+abstract,
    falling back to ["general"])
  - `added_date` is present (derived from the run date, else published_date,
    else today)

It is idempotent: running it on already-clean data changes nothing. Run it as
the final step of every scan/deep run:

    python3 scripts/normalize_data.py
"""
import json
import re
import sys
from pathlib import Path

# Reuse the taxonomy classifier from the pipeline (import-safe: __main__ guard).
sys.path.insert(0, str(Path(__file__).resolve().parent))
from baseline_process import classify_text, DATA_DIR, TODAY  # noqa: E402

DATE_RE = re.compile(r"\d{4}-\d{2}-\d{2}")


def build_run_date_map(data_dir: Path) -> dict:
    """run_id -> YYYY-MM-DD, from run-log started_at or the id itself."""
    run_log = data_dir / "run-log.json"
    if not run_log.exists():
        return {}
    data = json.loads(run_log.read_text())
    runs = data.get("runs", data if isinstance(data, list) else [])
    mapping = {}
    for r in runs:
        rid = r.get("run_id")
        if not rid:
            continue
        m = DATE_RE.search(r.get("started_at") or "") or DATE_RE.search(rid)
        if m:
            mapping[rid] = m.group(0)
    return mapping


def infer_added_date(paper: dict, run_dates: dict) -> str:
    rid = paper.get("run_id")
    if rid and rid in run_dates:
        return run_dates[rid]
    if rid:
        m = DATE_RE.search(rid)
        if m:
            return m.group(0)
    if paper.get("published_date"):
        m = DATE_RE.search(str(paper["published_date"]))
        if m:
            return m.group(0)
    return TODAY


def normalize_dimensions(item: dict) -> bool:
    """Ensure `dimensions` is a non-empty list. Returns True if changed."""
    dims = item.get("dimensions")
    if isinstance(dims, list) and dims:
        return False
    text = f"{item.get('title', '')} {item.get('abstract', '')}"
    item["dimensions"] = classify_text(text)[0]  # already falls back to ["general"]
    return True


# The only status values the data model (dashboard/lib/types.ts) recognizes.
# Agent-driven scans have historically invented others (`active`, `scan_added`)
# or left it unset — those papers are then invisible to the deep run, which
# selects everything not yet `incorporated`. Fold any non-canonical value back
# to `new` so no unincorporated paper can hide behind an unrecognized status.
CANONICAL_STATUSES = {"new", "reviewed", "incorporated"}


def normalize_status(item: dict) -> bool:
    """Ensure `status` is one of the canonical values. Returns True if changed."""
    if item.get("status") in CANONICAL_STATUSES:
        return False
    item["status"] = "new"
    return True


# Older fetch generations wrote the same concept under different field names.
# Current code (and dashboard/lib/types.ts) reads only the canonical name on the
# left; the aliases on the right are vestigial. Fold each alias into the
# canonical field when the canonical is empty, then drop the alias so the schema
# stops drifting. (`year` is deliberately not folded — it is a coarser partial
# date and every record carrying it already has a full `published_date`.)
FIELD_ALIASES = {
    "abstract": ["abstract_snippet"],
    "published_date": ["publication_date"],
    "pmid": ["pubmed_id"],
    "ss_id": ["semantic_scholar_id"],
}


def _is_empty(value) -> bool:
    return not value or not str(value).strip()


def canonicalize_fields(item: dict) -> bool:
    """Fold legacy field-name aliases into their canonical field. True if changed."""
    changed = False
    for canonical, aliases in FIELD_ALIASES.items():
        for alias in aliases:
            if alias not in item:
                continue
            if _is_empty(item.get(canonical)) and not _is_empty(item[alias]):
                item[canonical] = item[alias]
            del item[alias]
            changed = True
    return changed


def normalize_file(path: Path, key: str, run_dates: dict, fix_added_date: bool, fix_status: bool):
    if not path.exists():
        print(f"  skip (missing): {path.name}")
        return 0
    data = json.loads(path.read_text())
    items = data.get(key, [])
    fixed_dims = fixed_dates = fixed_status = fixed_fields = 0
    for item in items:
        if normalize_dimensions(item):
            fixed_dims += 1
        if fix_added_date and not item.get("added_date"):
            item["added_date"] = infer_added_date(item, run_dates)
            fixed_dates += 1
        if fix_status and normalize_status(item):
            fixed_status += 1
        if canonicalize_fields(item):
            fixed_fields += 1
    total = fixed_dims + fixed_dates + fixed_status + fixed_fields
    if total:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(
        f"  {path.name}: {len(items)} {key} | dimensions backfilled={fixed_dims}, "
        f"added_date backfilled={fixed_dates}, status normalized={fixed_status}, "
        f"fields canonicalized={fixed_fields}"
    )
    return total


def main():
    data_dir = Path(DATA_DIR)
    run_dates = build_run_date_map(data_dir)
    print("Normalizing data files (schema guard)...")
    changed = 0
    changed += normalize_file(data_dir / "papers.json", "papers", run_dates, fix_added_date=True, fix_status=True)
    changed += normalize_file(data_dir / "trials.json", "trials", run_dates, fix_added_date=False, fix_status=False)
    print(f"Done. {changed} field(s) backfilled." if changed else "Done. Nothing to fix.")


if __name__ == "__main__":
    main()
