#!/usr/bin/env python3
"""
Self-contained pipeline runner. Runs all 4 steps and writes results to data/.
"""
import subprocess
import sys
import json
import time
import os
from pathlib import Path

DATA_DIR = Path("/Users/geertzaal/Developer/Lymphedema_research/data")
SCRIPTS_DIR = Path("/Users/geertzaal/Developer/Lymphedema_research/scripts")
LOG_PATH = DATA_DIR / "pipeline_run_log.txt"
RESULTS_PATH = DATA_DIR / "pipeline_results.json"

def log(msg, also_print=True):
    with open(LOG_PATH, "a") as f:
        f.write(msg + "\n")
    if also_print:
        print(msg, flush=True)

log("=== PIPELINE START ===")
log(f"Python: {sys.version}")
log(f"Executable: {sys.executable}")
log(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
log("")

scripts = [
    "baseline_fetch.py",
    "baseline_process.py",
    "pubmed_fetch.py",
    "merge_pubmed.py",
]

results = {}

for script_name in scripts:
    script_path = str(SCRIPTS_DIR / script_name)
    log(f"=== STEP: {script_name} ===")
    log(f"Started: {time.strftime('%H:%M:%S')}")

    try:
        r = subprocess.run(
            [sys.executable, script_path],
            capture_output=True,
            text=True,
            timeout=600
        )
        stdout = r.stdout or "(no stdout)"
        stderr = r.stderr or ""
        log(stdout)
        if stderr:
            log("STDERR: " + stderr)
        log(f"EXIT CODE: {r.returncode}")
        results[script_name] = {
            "status": "success" if r.returncode == 0 else "failed",
            "exit_code": r.returncode,
            "stdout": r.stdout,
            "stderr": r.stderr,
        }
    except subprocess.TimeoutExpired:
        log("TIMEOUT after 600s")
        results[script_name] = {"status": "timeout", "exit_code": -1}
    except Exception as e:
        log(f"EXCEPTION: {type(e).__name__}: {e}")
        results[script_name] = {"status": "exception", "error": str(e), "exit_code": -1}

    log(f"Finished: {time.strftime('%H:%M:%S')}")
    log("")

log("=== PIPELINE DONE ===")
log(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")

with open(RESULTS_PATH, "w") as f:
    json.dump(results, f, indent=2)

log(f"Results written to {RESULTS_PATH}")

# Summary
log("")
log("=== SUMMARY ===")
for name, result in results.items():
    log(f"  {name}: {result['status']} (exit={result.get('exit_code', '?')})")
