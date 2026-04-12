# Stitch Prompt — Lymphedema Research Intelligence Dashboard

## What to build

A clinical research intelligence dashboard for tracking lymphedema research. This is a personal tool used by a patient to monitor scientific papers, clinical trials, and synthesized findings.

## Screens needed

### Screen 1: Dashboard Overview
- Left sidebar navigation (5 items: Dashboard, Papers, Clinical Trials, Knowledge Base, Digests)
- Top: page title "Research Overview" + last updated timestamp
- 4 metric cards in a row: 298 Papers, 87 Clinical Trials, 14 Findings, New This Visit
- 6 research dimension cards in a 2x3 grid (Pharmacological, Dietary & Lifestyle, Genetics & Biomarkers, Clinical Trials, Disease Management, Patient Community) — each with paper count, trial count, and a short finding summary
- Horizontal bar chart showing papers per dimension
- Donut chart showing trial pipeline (38 recruiting, 17 active, 30 completed)
- Recent papers list (8 items) with relevance score badge (1-10), title, journal, date

### Screen 2: Papers Triage Inbox
- Same sidebar
- Search bar + filter row (dimension pills, relevance range, status dropdown)
- Data table with columns: checkbox, star, title, journal, relevance score, dimension badges, date, status
- Expandable row showing abstract text, entity tags, notes field
- Floating bulk action bar at bottom when rows selected

### Screen 3: Knowledge Base Article
- Same sidebar
- Rendered long-form article with proper heading hierarchy (H1, H2, H3)
- Table of contents in right margin
- Clean reading experience like a medical journal

## Design direction

Clinical & refined. Think high-end medical research platform or pharma analytics dashboard.

- Clean, precise, unhurried
- Strong typographic hierarchy with a distinctive serif or slab-serif for headings paired with a clean sans for body
- Muted, professional color palette — no bright gradients
- Subtle data visualization colors (not neon)
- White/light background with purposeful use of whitespace
- Thin borders, minimal shadows, rounded corners (8px)
- Small caps or tracked uppercase for section labels
- Relevance scores: green for high (8-10), amber for medium (5-7), neutral for low (1-4)

## Do NOT use
- Inter, Roboto, Arial as primary fonts
- Purple gradients
- Heavy drop shadows
- Neon colors
- Generic SaaS dashboard aesthetics
