#!/usr/bin/env python3
"""
Fetch lymphedema papers from PubMed via NCBI E-utilities API.
Can be used standalone or imported by other scripts.

E-utilities docs: https://www.ncbi.nlm.nih.gov/books/NBK25500/
Rate limits: 3 requests/sec without API key, 10/sec with key.
"""
import json
import time
import sys
import xml.etree.ElementTree as ET
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path
from datetime import datetime

DATA_DIR = Path("/Users/geertzaal/Developer/Lymphedema_research/data")
EUTILS_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

# Optional: set NCBI API key for higher rate limits
# Get one free at https://www.ncbi.nlm.nih.gov/account/settings/
NCBI_API_KEY = ""  # Add key here if you have one

QUERIES = [
    "lymphedema treatment clinical trial",
    "lymphaticovenular anastomosis LVA outcomes",
    "vascularized lymph node transfer VLNT",
    "Complete Decongestive Therapy CDT lymphedema",
    "lymphedema VEGF-C gene therapy Lymfactin",
    "lymphedema mTOR sirolimus rapamycin lymphatic",
    "FLT4 VEGFR3 primary lymphedema mutation",
    "FOXC2 lymphedema-distichiasis genetics",
    "breast cancer lymphedema BCRL prevention",
    "lymphedema bioimpedance ICG lymphography",
    "immediate lymphatic reconstruction LYMPHA prevention",
    "PIEZO1 lymphangiogenesis lymphatic",
    "lymphedema TGF-beta fibrosis treatment",
    "lymphedema obesity GLP-1 weight",
    "lymphedema quality life PRO outcomes 2025",
]


def fetch_url(url, retries=3):
    """Fetch URL with retry."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Lymphedema-Research-Agent/1.0"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                return resp.read().decode()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 2 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...", flush=True)
                time.sleep(wait)
            else:
                print(f"  HTTP {e.code}: {e.reason}", flush=True)
                if attempt < retries - 1:
                    time.sleep(1)
                return None
        except Exception as e:
            print(f"  Error: {e}", flush=True)
            if attempt < retries - 1:
                time.sleep(1)
    return None


def search_pubmed(query, max_results=30, min_date="2023/01/01"):
    """Search PubMed and return list of PMIDs."""
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "sort": "relevance",
        "mindate": min_date,
        "maxdate": "3000",
        "datetype": "pdat",
        "retmode": "json",
    }
    if NCBI_API_KEY:
        params["api_key"] = NCBI_API_KEY

    url = f"{EUTILS_BASE}/esearch.fcgi?{urllib.parse.urlencode(params)}"
    result = fetch_url(url)
    if not result:
        return []

    data = json.loads(result)
    esearch = data.get("esearchresult", {})
    pmids = esearch.get("idlist", [])
    total = esearch.get("count", "0")
    print(f"  Found {total} total, got {len(pmids)} PMIDs", flush=True)
    return pmids


def fetch_details(pmids):
    """Fetch article details for a list of PMIDs using efetch."""
    if not pmids:
        return []

    params = {
        "db": "pubmed",
        "id": ",".join(pmids),
        "retmode": "xml",
        "rettype": "abstract",
    }
    if NCBI_API_KEY:
        params["api_key"] = NCBI_API_KEY

    url = f"{EUTILS_BASE}/efetch.fcgi?{urllib.parse.urlencode(params)}"
    result = fetch_url(url)
    if not result:
        return []

    articles = []
    try:
        root = ET.fromstring(result)
        for article_el in root.findall(".//PubmedArticle"):
            article = parse_article(article_el)
            if article:
                articles.append(article)
    except ET.ParseError as e:
        print(f"  XML parse error: {e}", flush=True)

    return articles


def parse_article(article_el):
    """Parse a PubmedArticle XML element into a dict."""
    try:
        medline = article_el.find("MedlineCitation")
        if medline is None:
            return None

        pmid_el = medline.find("PMID")
        pmid = pmid_el.text if pmid_el is not None else ""

        article = medline.find("Article")
        if article is None:
            return None

        # Title
        title_el = article.find("ArticleTitle")
        title = "".join(title_el.itertext()) if title_el is not None else ""

        # Abstract
        abstract_el = article.find("Abstract")
        abstract = ""
        if abstract_el is not None:
            parts = []
            for text_el in abstract_el.findall("AbstractText"):
                label = text_el.get("Label", "")
                text = "".join(text_el.itertext())
                if label:
                    parts.append(f"{label}: {text}")
                else:
                    parts.append(text)
            abstract = " ".join(parts)

        # Authors
        authors = []
        author_list = article.find("AuthorList")
        if author_list is not None:
            for author_el in author_list.findall("Author"):
                last = author_el.findtext("LastName", "")
                first = author_el.findtext("ForeName", "")
                initials = author_el.findtext("Initials", "")
                if last:
                    name = f"{first} {last}" if first else f"{initials} {last}"
                    authors.append(name.strip())

        # Journal
        journal_el = article.find("Journal")
        journal = ""
        if journal_el is not None:
            journal = journal_el.findtext("Title", "")
            if not journal:
                journal = journal_el.findtext("ISOAbbreviation", "")

        # Publication date
        pub_date = ""
        date_el = article.find(".//PubDate")
        if date_el is not None:
            year = date_el.findtext("Year", "")
            month = date_el.findtext("Month", "01")
            day = date_el.findtext("Day", "01")
            # Convert month name to number if needed
            month_map = {
                "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
                "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
                "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12",
            }
            if month in month_map:
                month = month_map[month]
            elif not month.isdigit():
                month = "01"
            if year:
                pub_date = f"{year}-{month.zfill(2)}-{day.zfill(2)}"

        # DOI
        doi = ""
        article_ids = article_el.find("PubmedData/ArticleIdList")
        if article_ids is not None:
            for aid in article_ids.findall("ArticleId"):
                if aid.get("IdType") == "doi":
                    doi = aid.text or ""
                    break

        return {
            "pmid": pmid,
            "title": title,
            "authors": authors,
            "journal": journal,
            "published_date": pub_date,
            "doi": doi,
            "abstract": abstract[:3000],
            "source": "pubmed",
        }
    except Exception as e:
        print(f"  Parse error: {e}", flush=True)
        return None


def run_all_searches(min_date="2023/01/01", max_results=30):
    """Run all queries and return deduplicated articles."""
    all_pmids = set()
    pmid_list = []

    for query in QUERIES:
        print(f"Searching PubMed: {query}...", flush=True)
        pmids = search_pubmed(query, max_results=max_results, min_date=min_date)
        new_pmids = [p for p in pmids if p not in all_pmids]
        all_pmids.update(new_pmids)
        pmid_list.extend(new_pmids)

        # Respect rate limits
        delay = 0.15 if NCBI_API_KEY else 0.4
        time.sleep(delay)

    print(f"\nTotal unique PMIDs: {len(pmid_list)}", flush=True)

    # Fetch details in batches of 50
    all_articles = []
    for i in range(0, len(pmid_list), 50):
        batch = pmid_list[i:i + 50]
        print(f"Fetching details for PMIDs {i + 1}-{i + len(batch)}...", flush=True)
        articles = fetch_details(batch)
        all_articles.extend(articles)
        time.sleep(0.5)

    print(f"Total articles with details: {len(all_articles)}", flush=True)
    return all_articles


def save_raw(articles, filename="pubmed_papers_raw.json"):
    """Save raw results."""
    raw_dir = DATA_DIR / "raw_baseline"
    raw_dir.mkdir(exist_ok=True)
    with open(raw_dir / filename, "w") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    print(f"Saved to {raw_dir / filename}", flush=True)


def main():
    print("=" * 60)
    print("Lymphedema Research — PubMed Fetch")
    print(f"Started: {datetime.now().isoformat()}")
    print("=" * 60)

    articles = run_all_searches()
    save_raw(articles)

    print(f"\nCompleted: {datetime.now().isoformat()}")
    print(f"Articles fetched: {len(articles)}")


if __name__ == "__main__":
    main()
