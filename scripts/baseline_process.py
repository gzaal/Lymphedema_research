#!/usr/bin/env python3
"""
Process raw baseline data into structured papers.json and trials.json.
"""
import json
import re
from pathlib import Path
from datetime import datetime

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
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


def classify_lymphedema_type(title, abstract):
    """Classify a paper as primary, secondary, both, or unknown lymphedema.

    This project tracks PRIMARY (genetic/developmental) lymphedema only.
    Secondary lymphedema (post-cancer, post-surgical, filarial, iatrogenic)
    is explicitly out of scope and is purged at ingestion.

    Returns one of: "primary", "secondary", "both", "unknown"

    Rules:
    - If text has ONLY secondary signals → "secondary" (purge)
    - If text has ONLY primary signals → "primary" (keep)
    - If text has BOTH → "both" (keep — may apply to primary)
    - If text has NEITHER → "unknown" (keep — likely mechanistic/genetic/biomarker
      research that may apply to primary)
    """
    text = f"{title or ''} {abstract or ''}".lower()

    # Strong primary signals (genetic/developmental/hereditary)
    primary_signals = [
        "primary lymphedema", "primary lymphoedema",
        "hereditary lymphedema", "hereditary lymphoedema",
        "congenital lymphedema", "congenital lymphoedema",
        "milroy", "nonne-milroy", "meige",
        "lymphedema-distichiasis", "lymphoedema-distichiasis",
        "distichiasis",
        "hennekam", "emberger",
        "generalized lymphatic dysplasia", "generalised lymphatic dysplasia",
        "lymphatic dysplasia",
        "noonan syndrome", "turner syndrome",
        "cholestasis-lymphedema",
        # Primary-specific molecular context (gene + lymphedema)
        "flt4 mutation", "vegfr3 mutation", "vegfr-3 mutation",
        "foxc2 mutation", "foxc2 variant",
        "sox18 mutation", "gjc2 mutation", "prox1 mutation",
        "gata2 mutation", "kif11 mutation", "ptpn14 mutation",
        "ccbe1 mutation", "adamts3 mutation", "piezo1 mutation",
        # Disease-related qualifiers
        "early-onset lymphedema", "childhood lymphedema",
        "pediatric lymphedema", "paediatric lymphedema",
        "familial lymphedema", "familial lymphoedema",
        "genetic lymphedema", "genetic lymphoedema",
        "lymphatic malformation", "lymphatic anomaly",
    ]

    # Strong secondary signals — these indicate cancer/surgery/filariasis context
    # and papers in this database are about lymphedema by definition, so mentioning
    # these terms at all almost always means secondary lymphedema.
    secondary_signals = [
        # Breast cancer related
        "bcrl", "breast cancer-related lymphedema",
        "breast cancer related lymphedema",
        "breast-cancer-related lymphedema",
        "breast cancer", "breast carcinoma", "breast-cancer",
        "breast cancer survivors", "survivors of breast cancer",
        "after breast cancer", "post breast cancer",
        "mastectomy", "postmastectomy", "post-mastectomy",
        "lumpectomy", "postlumpectomy", "post-lumpectomy",
        # Axillary / lymph node surgery
        "axillary lymph node", "axillary dissection",
        "axillary lymph node dissection", "axillary surgery",
        "axillary reverse mapping",
        "sentinel lymph node", "sentinel node biopsy",
        "post-axillary", "postaxillary",
        "alnd ", "slnb",
        # Lymphadenectomy context
        "after lymphadenectomy", "following lymphadenectomy",
        "post-lymphadenectomy", "postlymphadenectomy",
        "pelvic lymphadenectomy", "inguinal lymphadenectomy",
        "radical lymphadenectomy",
        "pelvic lnd", "pelvic lymph node dissection",
        "inguinal lnd",
        "lymph node dissection",
        # Gyneco-oncology
        "gyneco-oncologic", "gyneco-oncology",
        "gynecologic oncology", "gynaecologic oncology",
        "gynecological cancer", "gynaecological cancer",
        "urogenital cancer", "urological cancer",
        "after gynecologic", "after gynaecologic",
        # Radiation / adjuvant therapy
        "radiation-induced lymphedema",
        "post-radiation lymphedema", "post radiation lymphedema",
        "adjuvant radiotherapy", "adjuvant radiation",
        "hypofractionated radiotherapy",
        "post-radiotherapy", "postradiotherapy",
        # Other cancers
        "gynecologic cancer", "gynaecologic cancer",
        "gynecologic lymphedema", "gynaecologic lymphedema",
        "cervical cancer lymphedema", "cervical cancer",
        "endometrial cancer lymphedema", "endometrial cancer",
        "vulvar cancer lymphedema", "vulvar cancer",
        "head and neck cancer lymphedema", "hnc lymphedema",
        "head-and-neck cancer", "head and neck cancer",
        "prostate cancer lymphedema", "prostate cancer",
        "melanoma-related lymphedema", "melanoma related lymphedema",
        "melanoma",
        # Filariasis
        "filarial lymphedema", "filarial lymphoedema",
        "lymphatic filariasis", "filariasis",
        "wuchereria", "brugia",
        # General secondary qualifiers
        "secondary lymphedema", "secondary lymphoedema",
        "cancer-related lymphedema", "cancer related lymphedema",
        "cancer-associated lymphedema",
        "iatrogenic lymphedema",
        "post-surgical lymphedema", "postsurgical lymphedema",
        "post-oncologic", "postoncologic",
        "post cancer treatment",
        "after cancer treatment",
        # Prevention-of-secondary context (LYMPHA / ILR)
        "immediate lymphatic reconstruction",
        "lympha procedure", "lympha ",
        "lymphovenous bypass before",
        "ilr prevention",
        "prevention of lymphedema",
        "preventing lymphedema",
        "lymphedema prevention",
    ]

    has_primary = any(sig in text for sig in primary_signals)
    has_secondary = any(sig in text for sig in secondary_signals)

    if has_primary and has_secondary:
        return "both"
    if has_primary:
        return "primary"
    if has_secondary:
        return "secondary"
    return "unknown"


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
    """Score paper relevance 0-10.

    LEGACY single-axis score kept for backwards compatibility.
    New papers should also get multi-axis scores via the LLM scan prompt.
    This function provides a rough heuristic for baseline processing.
    """
    scores = score_multi_axis(title, abstract, dimensions)
    # Composite: weighted average biased toward evidence strength and calibration
    composite = (
        scores["importance"] * 0.20
        + scores["evidence_strength"] * 0.30
        + scores["novelty"] * 0.10
        + scores["decision_usefulness"] * 0.25
        + scores["claim_calibration"] * 0.15
    )
    return min(round(composite), 10)


def score_multi_axis(title, abstract, dimensions):
    """Score paper on five axes (0-10 each) with skepticism penalties.

    Axes (per evaluation-framework.md):
      importance          — How important for the field if true?
      evidence_strength   — How believable given design & data quality?
      novelty             — How genuinely new and timely?
      decision_usefulness — Would this change clinical/research/pipeline decisions now?
      claim_calibration   — How well does the takeaway match what evidence supports?
    """
    text = f"{title or ''} {abstract or ''}".lower()
    flags = detect_skepticism_flags(text)

    # --- Importance (field significance, not optimism) ---
    # 8-10: large RCT, pivotal, regulatory, patient-important endpoint, strong negative
    # 5-7: meaningful observational, translational, early pipeline, guideline review
    # 0-4: preclinical, case reports, mechanistic, corrections, stale
    importance = 1
    if "lymphedema" in text or "lymphoedema" in text:
        importance += 2
    elif "lymphatic" in text:
        importance += 1
    if any(w in text for w in ["phase 3", "pivotal", "primary endpoint"]):
        importance += 3
    elif any(w in text for w in ["phase 2", "phase 1", "first-in-human", "first-in-class"]):
        importance += 2
    if any(w in text for w in ["guideline", "isl consensus", "standard of care"]):
        importance += 2
    if any(w in text for w in ["cellulitis", "infection rate", "quality of life",
                                "limb function", "disability"]):
        importance += 1
    if any(w in text for w in ["lva", "vlnt", "lympha", "supermicrosurgery",
                                "lymfactin", "vegf-c"]):
        importance += 1
    # Strong negative results are important — they close questions
    if any(w in text for w in ["no significant", "did not improve", "failed to",
                                "no benefit", "not superior"]):
        if any(w in text for w in ["randomized", "rct", "double-blind"]):
            importance += 2
    # Demote case reports, corrections
    if any(w in text for w in ["case report", "case series"]):
        importance = max(importance - 2, 0)
    if any(w in text for w in ["correction", "erratum", "corrigendum"]):
        importance = max(importance - 3, 0)
    importance = min(importance, 10)

    # --- Evidence strength (study design & data quality, NOT journal prestige) ---
    # 8-10: well-designed RCT, adequately powered, clinically relevant endpoints
    # 5-7: prospective cohort, solid observational, target trial emulation
    # 2-4: uncontrolled, abstract-only, small exploratory, preclinical, narrative review
    # 0-1: case report, correction, promotional statement, conceptual abstract
    evidence = 2  # base: skeptical default
    if any(w in text for w in ["randomized", "rct", "double-blind", "placebo-controlled"]):
        evidence += 4
    elif any(w in text for w in ["meta-analysis", "systematic review"]):
        evidence += 3
    elif any(w in text for w in ["prospective", "target trial emulation"]):
        evidence += 2
    elif any(w in text for w in ["cohort", "observational"]):
        evidence += 1
    # Clear methodology and adequate power signals
    if any(w in text for w in ["adequately powered", "primary endpoint met"]):
        evidence += 1
    if any(w in text for w in ["patient", "participants", "subjects", "enrollment"]):
        evidence += 1
    # Abstract-only = evidence ceiling of 4
    is_abstract_only = any(w in text for w in [
        "conference abstract", "poster", "supplement abstract",
    ])
    # Case report / correction = evidence ceiling of 1
    is_case_or_correction = any(w in text for w in [
        "case report", "case series", "correction", "erratum",
    ])

    # === SKEPTICISM PENALTIES ===
    penalty = 0
    if flags["single_arm"]:
        penalty += 2
    if flags["retrospective"]:
        penalty += 1
    if flags["propensity_matched"]:
        penalty += 1
    if flags["pre_post_only"]:
        penalty += 2
    if flags["small_n"]:
        penalty += 1
    if flags["short_followup"]:
        penalty += 1
    if flags["commercial_sponsor"]:
        penalty += 1
    if flags["surrogate_endpoint_only"]:
        penalty += 1
    if flags["bold_claim_volume_only"]:
        penalty += 2
    if flags["promotional_framing"]:
        penalty += 1
    if flags["abstract_only"]:
        penalty += 1
    if flags["no_full_methods"]:
        penalty += 1
    if flags["case_series"]:
        penalty += 2
    if flags["narrow_population"]:
        penalty += 1
    if flags["obesity_not_controlled"]:
        penalty += 1
    evidence = max(evidence - penalty, 0)
    # Apply evidence ceilings
    if is_case_or_correction:
        evidence = min(evidence, 1)
    elif is_abstract_only:
        evidence = min(evidence, 4)
    evidence = min(evidence, 10)

    # --- Novelty/Freshness (how genuinely new and timely?) ---
    # 8-10: truly new event, first publication/disclosure
    # 5-7: recent but not same-week, newly disclosed conference item
    # 2-4: older item newly indexed, registry metadata refresh
    # 0-1: clearly stale, correction, resurfaced old item
    novelty = 4  # default: moderate (we can't assess dates heuristically)
    if any(w in text for w in ["first", "novel", "first-in-class",
                                "first-in-human"]):
        novelty += 2
    if any(w in text for w in ["phase 1", "first-in-human"]):
        novelty += 2
    # Penalize recycled/review content
    if any(w in text for w in ["review", "narrative review", "overview", "update on"]):
        novelty -= 2
    if any(w in text for w in ["correction", "erratum", "corrigendum"]):
        novelty = 0
    novelty = max(min(novelty, 10), 0)

    # --- Decision usefulness (would this change behavior NOW?) ---
    # High if it changes what clinicians/researchers/investors should do
    # Internally: clinical usefulness + research usefulness, rolled into one
    usefulness = 1  # most papers don't change behavior
    if any(w in text for w in ["guideline", "recommendation", "standard of care"]):
        usefulness += 3
    if any(w in text for w in ["phase 3", "pivotal", "primary endpoint met"]):
        usefulness += 3
    elif any(w in text for w in ["randomized", "rct"]):
        usefulness += 2
    # Negative results have HIGH decision value for pruning
    if any(w in text for w in ["no significant", "did not improve", "failed to",
                                "no benefit", "not superior"]):
        usefulness += 2
    # Preclinical = low clinical usefulness, modest research usefulness
    if any(w in text for w in ["mouse", "mice", "rat", "in vitro", "cell line",
                                "organoid"]):
        usefulness = max(usefulness - 1, 0)
        # But bump modestly for mechanistically important early work
        if any(w in text for w in ["novel", "first", "new mechanism", "new target"]):
            usefulness += 1
    # Case reports/corrections = very low
    if is_case_or_correction:
        usefulness = min(usefulness, 1)
    usefulness = max(min(usefulness, 10), 0)

    # --- Claim calibration (start at 8, subtract for overclaiming signals) ---
    # This is a heuristic proxy — the LLM agent does the real calibration check
    calibration = 8
    if flags["promotional_framing"]:
        calibration -= 3
    if flags["bold_claim_volume_only"]:
        calibration -= 2
    if flags["surrogate_endpoint_only"]:
        calibration -= 1
    if flags["commercial_sponsor"]:
        calibration -= 1
    if flags["pre_post_only"]:
        calibration -= 1
    if flags["obesity_not_controlled"]:
        calibration -= 1
    # Preclinical claims about clinical relevance
    if (any(w in text for w in ["mouse", "mice", "in vitro", "organoid"])
            and any(w in text for w in ["treatment", "therapy", "efficacy"])):
        calibration -= 1
    calibration = max(min(calibration, 10), 0)

    return {
        "importance": importance,
        "evidence_strength": evidence,
        "novelty": novelty,
        "decision_usefulness": usefulness,
        "claim_calibration": calibration,
    }


def detect_skepticism_flags(text):
    """Detect conditions that warrant extra skepticism.

    These flags are used both for scoring penalties and for display
    in the dashboard. See evaluation-framework.md for the full list.
    """
    text = text.lower() if isinstance(text, str) else ""
    return {
        "single_arm": (
            "single-arm" in text or "single arm" in text
            or ("open-label" in text and "randomized" not in text)
        ),
        "retrospective": "retrospective" in text,
        "propensity_matched": (
            "propensity" in text or "propensity-matched" in text
        ),
        "pre_post_only": (
            ("pre-post" in text or "before and after" in text
             or "within-subject" in text)
            and "control" not in text
        ),
        "small_n": any(
            f"n={n}" in text or f"n = {n}" in text
            for n in range(1, 31)
        ),
        "short_followup": any(
            w in text for w in [
                "3-month", "3 month", "12-week", "12 week",
                "8-week", "8 week", "6-week", "6 week",
                "4-week", "4 week", "short-term",
            ]
        ),
        "commercial_sponsor": any(
            w in text for w in [
                "sponsored by", "funded by", "commercial",
                "industry-sponsored",
            ]
        ),
        "surrogate_endpoint_only": (
            any(w in text for w in ["volume", "circumference", "surrogate", "l-dex"])
            and not any(w in text for w in [
                "cellulitis", "infection", "quality of life",
                "function", "disability", "hard endpoint",
            ])
        ),
        "bold_claim_volume_only": (
            any(w in text for w in ["improvement", "improved", "reversal", "reversed",
                                     "reduction", "reduced"])
            and any(w in text for w in ["volume", "circumference"])
            and not any(w in text for w in ["function", "cellulitis", "quality of life"])
        ),
        "promotional_framing": any(
            w in text for w in [
                "breakthrough", "game-changing", "revolutionary",
                "miracle", "cure", "remarkable",
            ]
        ),
        "abstract_only": any(
            w in text for w in [
                "conference abstract", "poster presentation",
                "supplement abstract",
            ]
        ),
        "no_full_methods": any(
            w in text for w in [
                "abstract only", "methods not available",
                "preliminary", "interim",
            ]
        ),
        "case_series": any(
            w in text for w in ["case report", "case series"]
        ),
        "narrow_population": any(
            w in text for w in [
                "rare variant", "syndromic", "milroy only",
                "single center", "single institution",
            ]
        ),
        "obesity_not_controlled": (
            any(w in text for w in ["volume reduction", "circumference reduction",
                                     "limb volume"])
            and not any(w in text for w in ["bmi", "weight", "obesity",
                                             "body mass", "controlled for weight"])
        ),
    }


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
    skipped_secondary = 0
    for p in raw:
        title = p.get("title", "")
        abstract = p.get("abstract", "")
        search_text = f"{title} {abstract or ''}"

        # Scope filter: skip secondary-only lymphedema papers
        # (project tracks primary/genetic lymphedema only)
        lymph_type = classify_lymphedema_type(title, abstract)
        if lymph_type == "secondary":
            skipped_secondary += 1
            continue

        dims, subs = classify_text(search_text)
        relevance = score_relevance(title, abstract, dims)
        entities = extract_entities(title, abstract)

        ext_ids = p.get("externalIds", {})
        doi = ext_ids.get("DOI", "")
        ss_id = p.get("paperId", "")

        authors = [a.get("name", "") for a in p.get("authors", [])]
        journal = (p.get("journal") or {}).get("name", "")
        pub_date = p.get("publicationDate", "")

        scores = score_multi_axis(title, abstract, dims)
        flags = detect_skepticism_flags(f"{title} {abstract or ''}")

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
            "scores": scores,
            "skepticism_flags": flags,
            "lymphedema_type": lymph_type,
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

    print(f"Processed {len(papers)} papers (skipped {skipped_secondary} secondary-only)")
    print(f"  Relevance >= 8: {sum(1 for p in papers if p['relevance_score'] >= 8)}")
    print(f"  Relevance >= 5: {sum(1 for p in papers if p['relevance_score'] >= 5)}")
    type_counts = {}
    for p in papers:
        t = p.get("lymphedema_type", "unknown")
        type_counts[t] = type_counts.get(t, 0) + 1
    print(f"  By lymphedema type: {type_counts}")

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

        # Scope filter: tag (and later skip) secondary-only trials
        cond_text = " ".join(conditions).lower() if conditions else ""
        lymph_type = classify_lymphedema_type(
            f"{title} {cond_text}", f"{intervention_names} {summary}"
        )
        if lymph_type == "secondary":
            continue

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
            "lymphedema_type": lymph_type,
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
