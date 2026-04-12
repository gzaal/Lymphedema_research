#!/usr/bin/env python3
"""
Process raw baseline data into structured papers.json and trials.json.
"""
import json
import re
from pathlib import Path
from datetime import datetime

DATA_DIR = Path("/Users/geertzaal/Developer/Lymphedema_research/data")
RAW_DIR = DATA_DIR / "raw_baseline"
TODAY = datetime.now().strftime("%Y-%m-%d")
RUN_ID = f"baseline_{TODAY}_001"

# Taxonomy keywords for classification
DIMENSION_KEYWORDS = {
    "pharmacological": [
        "sirolimus", "rapamycin", "everolimus", "mTOR",
        "ketoprofen", "NSAID", "anti-inflammatory", "leukotriene",
        "doxycycline", "antibiotic",
        "VEGF-C", "Lymfactin", "adenoviral", "gene therapy", "gene transfer",
        "TGF-beta", "TGF-β", "anti-fibrotic", "pirfenidone",
        "dupilumab", "anti-IL-4", "anti-IL-13", "immunomodulatory",
        "ubenimex", "LTB4", "semaglutide", "GLP-1", "tirzepatide",
        "selenium", "tacrolimus", "PIEZO1 agonist", "Yoda1",
        "drug", "pharmacol", "treatment", "therapy", "inhibitor",
        "mRNA", "nanoparticle", "lipid nanoparticle", "LNP",
    ],
    "dietary": [
        "weight management", "obesity", "BMI", "overweight", "adipose",
        "exercise", "physical activity", "muscle pump",
        "skin care", "moisturizer", "emollient", "hygiene",
        "diet", "nutrition", "caloric", "protein", "fiber",
        "lifestyle", "self-management", "self-care",
    ],
    "genetics": [
        "FLT4", "VEGFR3", "VEGFR-3", "FOXC2", "SOX18", "GJC2",
        "PROX1", "GATA2", "KIF11", "PIEZO1", "PTPN14",
        "CCBE1", "ADAMTS3", "VEGFC", "VEGF-C",
        "primary lymphedema", "Milroy", "distichiasis", "lymphedema-distichiasis",
        "Hennekam", "Emberger", "hereditary lymphedema",
        "genotype", "mutation", "variant", "genetic", "gene panel",
        "whole exome", "whole genome", "OMIM", "Orphanet",
        "biomarker", "ICG", "lymphoscintigraphy", "bioimpedance",
        "L-Dex", "perometry", "limb volume", "volumetry",
        "tissue dielectric", "MRI lymphangiography", "VEGF-C serum",
        "TGF-β1", "cytokine panel", "risk prediction",
    ],
    "clinical_trials": [
        "clinical trial", "randomized", "RCT", "phase 1", "phase 2",
        "phase 3", "NCT", "enrollment", "recruiting", "placebo",
        "endpoint", "efficacy", "safety", "FDA", "EMA",
    ],
    "management": [
        "ISL staging", "ISL stage", "CDT", "complete decongestive therapy",
        "manual lymphatic drainage", "MLD",
        "compression", "bandaging", "garment", "flat-knit",
        "lymphaticovenular anastomosis", "LVA", "supermicrosurgery",
        "vascularized lymph node transfer", "VLNT",
        "immediate lymphatic reconstruction", "LYMPHA", "ILR",
        "liposuction", "suction-assisted",
        "cellulitis", "erysipelas", "infection", "antibiotic prophylaxis",
        "guideline", "ISL consensus", "ILF",
        "surveillance", "monitoring", "staging", "progression",
        "quality of life", "psychosocial",
    ],
    "community": [
        "LE&RN", "ILF", "ISL", "NLN", "LIMPRINT",
        "Lymphatic Education", "Lymphedema Research",
        "patient registry", "quality of life", "PRO", "LYMQOL", "LYMPH-Q",
        "conference", "patient-reported", "advocacy",
    ],
}

SUBTOPIC_KEYWORDS = {
    "gene_therapy": ["Lymfactin", "adenoviral VEGF-C", "gene therapy", "gene transfer", "mRNA VEGF-C"],
    "mTOR_inhibitors": ["sirolimus", "rapamycin", "everolimus", "mTOR"],
    "anti_inflammatory": ["ketoprofen", "LTB4", "leukotriene B4", "ubenimex", "NSAID"],
    "anti_fibrotic": ["TGF-beta", "TGF-β", "pirfenidone", "anti-fibrotic"],
    "immunomodulatory": ["dupilumab", "tacrolimus", "IL-4", "IL-13", "Th2"],
    "GLP1_obesity": ["semaglutide", "GLP-1", "tirzepatide", "obesity", "weight loss"],
    "PIEZO1_pathway": ["PIEZO1", "Yoda1", "mechanosensory", "mechanotransduction"],
    "weight_exercise": ["weight management", "BMI", "exercise", "physical activity", "muscle pump"],
    "skin_care": ["skin care", "moisturizer", "emollient", "hygiene", "tinea"],
    "nutrition": ["diet", "nutrition", "protein", "caloric"],
    "FLT4_VEGFR3": ["FLT4", "VEGFR3", "VEGFR-3", "VEGF-C receptor"],
    "FOXC2_variants": ["FOXC2", "lymphedema-distichiasis", "distichiasis"],
    "other_genes": ["GJC2", "SOX18", "PROX1", "GATA2", "KIF11", "PTPN14", "CCBE1", "ADAMTS3", "PIEZO1"],
    "genetic_diagnosis": ["gene panel", "whole exome", "whole genome", "genetic testing"],
    "volume_biomarkers": ["limb volume", "perometry", "water displacement", "volumetry"],
    "bioimpedance": ["bioimpedance", "L-Dex", "BIS", "extracellular fluid"],
    "ICG_imaging": ["ICG", "indocyanine green", "near-infrared", "lymphography pattern"],
    "LSG": ["lymphoscintigraphy", "LSG", "technetium"],
    "plasma_biomarkers": ["cytokine panel", "VEGF-C serum", "TGF-β1", "IL-6", "G-CSF"],
    "CDT": ["CDT", "complete decongestive therapy", "manual lymphatic drainage", "MLD", "compression bandaging"],
    "compression_garments": ["compression garment", "flat-knit", "circular-knit", "compression class"],
    "LVA_surgery": ["LVA", "lymphaticovenular anastomosis", "supermicrosurgery", "LVA surgery"],
    "VLNT_surgery": ["VLNT", "vascularized lymph node transfer", "lymph node transplant"],
    "LYMPHA_prevention": ["LYMPHA", "ILR", "immediate lymphatic reconstruction", "axillary reverse mapping"],
    "liposuction": ["liposuction", "suction-assisted protein lipectomy", "SAL"],
    "infection_prevention": ["cellulitis", "erysipelas", "infection", "antibiotic prophylaxis", "tinea"],
    "staging": ["ISL stage", "ISL staging", "elephantiasis", "pitting edema", "Stemmer"],
    "guidelines": ["ISL consensus", "ILF guideline", "clinical practice", "recommendation"],
}


def classify_text(text):
    """Classify text into dimensions and subtopics."""
    if not text:
        return [], []
    text_lower = text.lower()

    dimensions = []
    for dim, keywords in DIMENSION_KEYWORDS.items():
        if any(kw.lower() in text_lower for kw in keywords):
            dimensions.append(dim)

    subtopics = []
    for sub, keywords in SUBTOPIC_KEYWORDS.items():
        if any(kw.lower() in text_lower for kw in keywords):
            subtopics.append(sub)

    return dimensions or ["general"], subtopics


def score_relevance(title, abstract, dimensions):
    """Score paper relevance 1-10."""
    text = f"{title or ''} {abstract or ''}".lower()
    score = 0

    # Direct lymphedema focus
    if "lymphedema" in text or "lymphoedema" in text:
        score += 3
    elif "lymphatic" in text:
        score += 2
    elif "lymph" in text:
        score += 1

    # Clinical trial results
    if any(w in text for w in ["clinical trial", "randomized", "phase 2", "phase 3", "rct", "efficacy"]):
        score += 3

    # Novel mechanism or intervention
    if any(w in text for w in ["novel", "new mechanism", "first-in-class", "breakthrough"]):
        score += 2

    # Surgical intervention (high clinical relevance)
    if any(w in text for w in ["lva", "vlnt", "lympha", "supermicrosurgery", "anastomosis"]):
        score += 2

    # Human data
    if any(w in text for w in ["patient", "human", "cohort", "subjects", "participants"]):
        score += 2
    elif any(w in text for w in ["mouse", "mice", "rat", "animal model", "in vitro"]):
        score += 0  # no bonus for animal data

    # Review/meta-analysis
    if any(w in text for w in ["review", "meta-analysis", "systematic review"]):
        score += 1

    return min(score, 10)


def extract_entities(title, abstract):
    """Extract known entity mentions from text."""
    text = f"{title or ''} {abstract or ''}".lower()
    entities = []
    known = [
        "FLT4", "VEGFR3", "VEGFR-3", "FOXC2", "SOX18", "GJC2",
        "PROX1", "GATA2", "KIF11", "PIEZO1", "PTPN14", "CCBE1", "ADAMTS3",
        "Lymfactin", "VEGF-C", "sirolimus", "rapamycin", "everolimus",
        "ketoprofen", "doxycycline", "ubenimex", "semaglutide",
        "LVA", "VLNT", "LYMPHA", "ILR",
        "CDT", "MLD", "L-Dex", "ICG",
        "ISL", "LE&RN", "ILF", "LIMPRINT",
        "Milroy", "lymphedema-distichiasis", "Hennekam",
        "BCRL", "breast cancer",
    ]
    for entity in known:
        if entity.lower() in text:
            entities.append(entity)
    return entities


def process_papers():
    """Transform raw SS papers into papers.json schema."""
    with open(RAW_DIR / "ss_papers_raw.json") as f:
        raw = json.load(f)

    papers = []
    for p in raw:
        title = p.get("title", "")
        abstract = p.get("abstract", "")
        search_text = f"{title} {abstract or ''}"

        dims, subs = classify_text(search_text)
        relevance = score_relevance(title, abstract, dims)
        entities = extract_entities(title, abstract)

        ext_ids = p.get("externalIds", {})
        doi = ext_ids.get("DOI", "")
        ss_id = p.get("paperId", "")

        authors = [a.get("name", "") for a in p.get("authors", [])]
        journal = (p.get("journal") or {}).get("name", "")
        pub_date = p.get("publicationDate", "")

        paper = {
            "id": f"ss_{ss_id}",
            "title": title,
            "authors": authors[:10],  # Cap at 10 authors
            "journal": journal,
            "published_date": pub_date or "",
            "doi": doi,
            "url": p.get("url", ""),
            "abstract": (abstract or "")[:2000],  # Cap abstract length
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
        }
        papers.append(paper)

    # Sort by relevance (highest first)
    papers.sort(key=lambda x: x["relevance_score"], reverse=True)

    result = {"papers": papers}
    with open(DATA_DIR / "papers.json", "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"Processed {len(papers)} papers")
    print(f"  Relevance >= 8: {sum(1 for p in papers if p['relevance_score'] >= 8)}")
    print(f"  Relevance >= 5: {sum(1 for p in papers if p['relevance_score'] >= 5)}")

    # Print top papers
    print("\nTop 10 papers by relevance:")
    for p in papers[:10]:
        print(f"  [{p['relevance_score']}] {p['title'][:90]}")

    return papers


def process_trials():
    """Transform raw CT trials into trials.json schema."""
    with open(RAW_DIR / "ct_trials_raw.json") as f:
        raw = json.load(f)

    trials = []
    for t in raw:
        proto = t.get("protocolSection", {})
        ident = proto.get("identificationModule", {})
        status_mod = proto.get("statusModule", {})
        sponsor_mod = proto.get("sponsorCollaboratorsModule", {})
        desc_mod = proto.get("descriptionModule", {})
        cond_mod = proto.get("conditionsModule", {})
        design_mod = proto.get("designModule", {})
        arms_mod = proto.get("armsInterventionsModule", {})

        nct_id = ident.get("nctId", "")
        title = ident.get("briefTitle", "")
        sponsor = (sponsor_mod.get("leadSponsor") or {}).get("name", "")
        status = status_mod.get("overallStatus", "")
        phases = (design_mod.get("phases") or [])
        phase = ", ".join(phases) if phases else "N/A"
        enrollment = (design_mod.get("enrollmentInfo") or {}).get("count", 0)

        start_date = (status_mod.get("startDateStruct") or {}).get("date", "")
        completion = (status_mod.get("primaryCompletionDateStruct") or {}).get("date", "")

        interventions = arms_mod.get("interventions", [])
        intervention_names = ", ".join(i.get("name", "") for i in interventions) if interventions else ""

        summary = desc_mod.get("briefSummary", "")
        conditions = cond_mod.get("conditions", [])

        search_text = f"{title} {intervention_names} {summary}"
        dims, _ = classify_text(search_text)

        trial = {
            "nct_id": nct_id,
            "title": title,
            "sponsor": sponsor,
            "intervention": intervention_names,
            "phase": phase,
            "status": status,
            "primary_endpoint": "",
            "enrollment": enrollment or 0,
            "start_date": start_date,
            "expected_completion": completion,
            "dimensions": dims,
            "conditions": conditions,
            "latest_results_summary": "",
            "last_checked": TODAY,
            "change_log": [
                {"date": TODAY, "change": "Initial entry from baseline sweep"}
            ],
        }
        trials.append(trial)

    # Sort by status (recruiting first), then by start date
    status_order = {"RECRUITING": 0, "ACTIVE_NOT_RECRUITING": 1, "ENROLLING_BY_INVITATION": 2, "COMPLETED": 3}
    trials.sort(key=lambda x: (status_order.get(x["status"], 9), x.get("start_date", "")))

    result = {"trials": trials}
    with open(DATA_DIR / "trials.json", "w") as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

    print(f"\nProcessed {len(trials)} trials")
    by_status = {}
    for t in trials:
        by_status[t["status"]] = by_status.get(t["status"], 0) + 1
    for status, count in sorted(by_status.items()):
        print(f"  {status}: {count}")

    return trials


def main():
    papers = process_papers()
    trials = process_trials()

    # Update run log
    run_log = {
        "runs": [{
            "run_id": RUN_ID,
            "mode": "baseline",
            "started_at": f"{TODAY}T08:00:00Z",
            "completed_at": datetime.now().isoformat() + "Z",
            "papers_found": len(papers),
            "papers_added": len(papers),
            "trials_updated": len(trials),
            "findings_updated": 0,
            "alerts_generated": 0,
            "errors": [],
            "token_usage_estimate": "baseline run",
        }]
    }
    with open(DATA_DIR / "run-log.json", "w") as f:
        json.dump(run_log, f, indent=2)

    print(f"\nBaseline processing complete!")


if __name__ == "__main__":
    main()
