#!/usr/bin/env python3
"""
Merge PubMed articles into papers.json, deduplicating against existing entries by DOI.
Uses the same classification logic as baseline_process.py.
"""
import json
from pathlib import Path
from datetime import datetime

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
TODAY = datetime.now().strftime("%Y-%m-%d")
RUN_ID = f"baseline_pubmed_{TODAY}_001"

# Import classification from baseline_process
import sys
sys.path.insert(0, str(Path(__file__).parent))
from baseline_process import classify_text, score_relevance, extract_entities


def main():
    # Load existing papers
    with open(DATA_DIR / "papers.json") as f:
        existing = json.load(f)

    # Build DOI index of existing papers
    existing_dois = set()
    existing_titles_lower = set()
    for p in existing["papers"]:
        if p.get("doi"):
            existing_dois.add(p["doi"].lower())
        existing_titles_lower.add(p["title"].lower().strip())

    # Load PubMed raw
    with open(DATA_DIR / "raw_baseline" / "pubmed_papers_raw.json") as f:
        pubmed_raw = json.load(f)

    new_count = 0
    duplicate_count = 0

    for pm in pubmed_raw:
        doi = pm.get("doi", "").strip()
        title = pm.get("title", "").strip()

        # Deduplicate by DOI
        if doi and doi.lower() in existing_dois:
            duplicate_count += 1
            continue

        # Deduplicate by exact title match
        if title.lower() in existing_titles_lower:
            duplicate_count += 1
            continue

        # Process new paper
        abstract = pm.get("abstract", "")
        search_text = f"{title} {abstract}"
        dims, subs = classify_text(search_text)
        relevance = score_relevance(title, abstract, dims)
        entities = extract_entities(title, abstract)

        paper = {
            "id": f"pm_{pm['pmid']}",
            "title": title,
            "authors": pm.get("authors", [])[:10],
            "journal": pm.get("journal", ""),
            "published_date": pm.get("published_date", ""),
            "doi": doi,
            "url": f"https://pubmed.ncbi.nlm.nih.gov/{pm['pmid']}/",
            "abstract": abstract[:2000],
            "dimensions": dims,
            "subtopics": subs,
            "entities_mentioned": entities,
            "relevance_score": relevance,
            "novelty_assessment": "",
            "key_findings": [],
            "clinical_implications": "",
            "added_date": TODAY,
            "last_reviewed": TODAY,
            "status": "new",
            "run_id": RUN_ID,
            "source": "pubmed",
        }
        existing["papers"].append(paper)
        existing_dois.add(doi.lower()) if doi else None
        existing_titles_lower.add(title.lower())
        new_count += 1

    # Re-sort by relevance
    existing["papers"].sort(key=lambda x: x["relevance_score"], reverse=True)

    # Save
    with open(DATA_DIR / "papers.json", "w") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)

    print(f"PubMed merge complete:")
    print(f"  PubMed articles processed: {len(pubmed_raw)}")
    print(f"  New papers added: {new_count}")
    print(f"  Duplicates skipped: {duplicate_count}")
    print(f"  Total papers now: {len(existing['papers'])}")

    # Show top new papers
    new_papers = [p for p in existing["papers"] if p["run_id"] == RUN_ID]
    new_papers.sort(key=lambda x: x["relevance_score"], reverse=True)
    print(f"\nTop new papers from PubMed (relevance >= 8):")
    for p in new_papers:
        if p["relevance_score"] >= 8:
            print(f"  [{p['relevance_score']}] {p['title'][:100]}")

    # Update run log
    with open(DATA_DIR / "run-log.json") as f:
        run_log = json.load(f)
    run_log["runs"].append({
        "run_id": RUN_ID,
        "mode": "baseline_pubmed",
        "started_at": f"{TODAY}T00:00:00Z",
        "completed_at": datetime.now().isoformat() + "Z",
        "papers_found": len(pubmed_raw),
        "papers_added": new_count,
        "trials_updated": 0,
        "findings_updated": 0,
        "alerts_generated": 0,
        "errors": [],
        "token_usage_estimate": "pubmed fetch",
    })
    with open(DATA_DIR / "run-log.json", "w") as f:
        json.dump(run_log, f, indent=2)


if __name__ == "__main__":
    main()
