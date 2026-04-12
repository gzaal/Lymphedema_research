#!/usr/bin/env python3
"""
Baseline fetch: query Semantic Scholar and ClinicalTrials.gov for lymphedema papers and trials.
Handles rate limiting with delays between requests.
Outputs results to data/ directory.
"""
import json
import time
import sys
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from datetime import datetime

DATA_DIR = Path("/Users/geertzaal/Developer/Lymphedema_research/data")

SS_BASE = "https://api.semanticscholar.org/graph/v1/paper/search"
SS_FIELDS = "title,authors,abstract,journal,publicationDate,externalIds,url"

QUERIES = [
    ("lymphedema treatment clinical trial", "2023-2026", 30),
    ("lymphaticovenular anastomosis LVA outcomes", "2023-2026", 30),
    ("vascularized lymph node transfer VLNT", "2023-2026", 30),
    ("Complete Decongestive Therapy CDT lymphedema", "2023-2026", 30),
    ("lymphedema VEGF-C gene therapy Lymfactin", "2023-2026", 30),
    ("lymphedema mTOR sirolimus rapamycin", "2023-2026", 30),
    ("lymphedema fibrosis TGF-beta treatment", "2023-2026", 30),
    ("FLT4 VEGFR3 primary lymphedema genetics", "2023-2026", 30),
    ("FOXC2 GJC2 SOX18 lymphedema", "2023-2026", 30),
    ("breast cancer related lymphedema BCRL prevention", "2023-2026", 30),
    ("lymphedema bioimpedance ICG lymphography biomarker", "2023-2026", 30),
    ("immediate lymphatic reconstruction LYMPHA ILR", "2023-2026", 20),
    ("PIEZO1 lymphangiogenesis mechanosensory", "2023-2026", 20),
    ("lymphedema obesity GLP-1 weight management", "2023-2026", 20),
    ("lymphedema quality of life patient outcomes", "2023-2026", 20),
]


def load_api_keys():
    """Load API keys from config file."""
    keys_path = DATA_DIR / ".api-keys.json"
    if keys_path.exists():
        with open(keys_path) as f:
            return json.load(f)
    return {}

API_KEYS = load_api_keys()
SS_API_KEY = API_KEYS.get("semantic_scholar", "")


def fetch_url(url, retries=3):
    """Fetch URL with retry and rate-limit handling."""
    for attempt in range(retries):
        try:
            headers = {"User-Agent": "Lymphedema-Research-Agent/1.0"}
            if SS_API_KEY and "semanticscholar.org" in url:
                headers["x-api-key"] = SS_API_KEY
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 5 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...", flush=True)
                time.sleep(wait)
            else:
                print(f"  HTTP {e.code}: {e.reason}", flush=True)
                return None
        except Exception as e:
            print(f"  Error: {e}", flush=True)
            if attempt < retries - 1:
                time.sleep(3)
    return None


def search_semantic_scholar():
    """Run all SS queries and collect unique papers."""
    all_papers = {}

    for query, year, limit in QUERIES:
        params = urllib.parse.urlencode({
            "query": query,
            "year": year,
            "limit": limit,
            "fields": SS_FIELDS,
        })
        url = f"{SS_BASE}?{params}"
        print(f"Searching: {query}...", flush=True)

        result = fetch_url(url)
        if result and "data" in result:
            print(f"  Found {result.get('total', '?')} total, got {len(result['data'])} papers", flush=True)
            for paper in result["data"]:
                pid = paper.get("paperId")
                if pid and pid not in all_papers:
                    all_papers[pid] = paper
        else:
            print(f"  No results or error", flush=True)

        # Rate limit: 1 request per second to be safe
        time.sleep(1.5)

    print(f"\nTotal unique papers collected: {len(all_papers)}", flush=True)
    return list(all_papers.values())


def search_clinical_trials():
    """Fetch lymphedema trials from ClinicalTrials.gov."""
    trials = []

    # Active trials
    print("\nSearching ClinicalTrials.gov for active lymphedema trials...", flush=True)
    url = "https://clinicaltrials.gov/api/v2/studies?query.cond=lymphedema&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION&pageSize=50&fields=NCTId,BriefTitle,OverallStatus,Phase,EnrollmentCount,StartDate,PrimaryCompletionDate,Condition,InterventionName,LeadSponsorName,BriefSummary"
    result = fetch_url(url)
    if result and "studies" in result:
        print(f"  Found {len(result['studies'])} active trials", flush=True)
        trials.extend(result["studies"])

    time.sleep(2)

    # Recently completed
    print("Searching for recently completed lymphedema trials...", flush=True)
    url = "https://clinicaltrials.gov/api/v2/studies?query.cond=lymphedema&filter.overallStatus=COMPLETED&pageSize=30&sort=LastUpdatePostDate:desc&fields=NCTId,BriefTitle,OverallStatus,Phase,EnrollmentCount,StartDate,PrimaryCompletionDate,Condition,InterventionName,LeadSponsorName,BriefSummary"
    result = fetch_url(url)
    if result and "studies" in result:
        print(f"  Found {len(result['studies'])} completed trials", flush=True)
        trials.extend(result["studies"])

    time.sleep(2)
    print("Searching for breast cancer lymphedema trials...", flush=True)
    url = "https://clinicaltrials.gov/api/v2/studies?query.cond=breast+cancer+lymphedema&filter.overallStatus=RECRUITING,ACTIVE_NOT_RECRUITING&pageSize=30&fields=NCTId,BriefTitle,OverallStatus,Phase,EnrollmentCount,StartDate,PrimaryCompletionDate,Condition,InterventionName,LeadSponsorName,BriefSummary"
    result = fetch_url(url)
    if result and "studies" in result:
        print(f"  Found {len(result['studies'])} BCRL trials", flush=True)
        trials.extend(result["studies"])

    # Deduplicate by NCT ID
    seen = set()
    unique_trials = []
    for trial in trials:
        nct = trial.get("protocolSection", {}).get("identificationModule", {}).get("nctId", "")
        if nct and nct not in seen:
            seen.add(nct)
            unique_trials.append(trial)

    print(f"Total unique trials: {len(unique_trials)}", flush=True)
    return unique_trials


def save_raw_results(papers, trials):
    """Save raw API results for processing."""
    raw_dir = DATA_DIR / "raw_baseline"
    raw_dir.mkdir(exist_ok=True)

    with open(raw_dir / "ss_papers_raw.json", "w") as f:
        json.dump(papers, f, indent=2)

    with open(raw_dir / "ct_trials_raw.json", "w") as f:
        json.dump(trials, f, indent=2)

    print(f"\nRaw results saved to {raw_dir}/", flush=True)


def main():
    print("=" * 60)
    print("Lymphedema Research Baseline — Data Fetch")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 60)

    papers = search_semantic_scholar()
    trials = search_clinical_trials()
    save_raw_results(papers, trials)

    print(f"\nCompleted: {datetime.now().isoformat()}")
    print(f"Papers: {len(papers)}, Trials: {len(trials)}")


if __name__ == "__main__":
    main()
