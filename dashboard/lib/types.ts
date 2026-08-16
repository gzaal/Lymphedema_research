export type Dimension =
  | "pharmacological"
  | "dietary"
  | "genetics"
  | "clinical_trials"
  | "management"
  | "community"
  | "general";

/** Multi-axis score object (each 0-10). */
export interface ScoreAxes {
  importance: number;
  evidence_strength: number;
  novelty: number;
  decision_usefulness: number;
  claim_calibration: number;
}

/** Classification of the alert/finding. */
export type AlertClassification =
  | "practice-relevant"
  | "pipeline-relevant"
  | "hypothesis-generating"
  | "background"
  | "tracker-maintenance";

/** What kind of publication event triggered this entry. */
export type PublicationEvent =
  | "full-paper-published"
  | "abstract-available"
  | "conference-listing"
  | "topline-data-released"
  | "trial-status-updated"
  | "results-posted"
  | "registry-metadata"
  | "preprint";

/** Study design classification. */
export type StudyDesign =
  | "interventional-rct"
  | "interventional-single-arm"
  | "observational-prospective"
  | "observational-retrospective"
  | "preclinical-animal"
  | "preclinical-invitro"
  | "review-systematic"
  | "review-narrative"
  | "meta-analysis"
  | "case-report"
  | "registry-analysis"
  | "guideline"
  | "other";

/** Structured claim audit produced by the scanner. */
export interface ClaimAudit {
  is_new_this_week: boolean;
  study_design: StudyDesign;
  headline_vs_evidence: "accurate" | "overstated" | "understated";
  endpoint_type: "patient-important" | "surrogate" | "exploratory";
  comparator: "active" | "placebo" | "historical" | "baseline-only" | "none";
  result_direction: "positive" | "negative" | "mixed" | "not-applicable";
  conflicts_of_interest: string;
  would_change_behavior_today: boolean;
}

/** Primary vs secondary lymphedema scope tag.
 * This project tracks primary (genetic/developmental) lymphedema only.
 * Secondary-only papers are purged at ingestion. */
export type LymphedemaType = "primary" | "secondary" | "both" | "unknown";

/** Skepticism flags that were triggered for this paper. */
export interface SkepticismFlags {
  single_arm: boolean;
  retrospective: boolean;
  propensity_matched: boolean;
  pre_post_only: boolean;
  small_n: boolean;
  short_followup: boolean;
  commercial_sponsor: boolean;
  surrogate_endpoint_only: boolean;
  bold_claim_volume_only: boolean;
  promotional_framing: boolean;
  obesity_not_controlled: boolean;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  published_date: string;
  doi: string;
  url: string;
  abstract: string;
  dimensions: Dimension[];
  subtopics: string[];
  entities_mentioned: string[];

  // Legacy single score (kept for backwards compat with old data)
  relevance_score: number;

  // New multi-axis scoring
  scores?: ScoreAxes;
  classification?: AlertClassification;
  publication_event?: PublicationEvent;
  claim_audit?: ClaimAudit;
  skepticism_flags?: SkepticismFlags;
  lymphedema_type?: LymphedemaType;

  // Structured assessment (replaces free-text fields)
  what_happened?: string;
  why_it_matters?: string;
  what_limits_confidence?: string;

  novelty_assessment: string;
  key_findings: string[];
  clinical_implications: string;
  added_date: string;
  last_reviewed: string;
  status: "new" | "reviewed" | "incorporated";
  run_id: string;
  source?: string;
}

export interface Trial {
  nct_id: string;
  title: string;
  sponsor: string;
  intervention: string;
  phase: string;
  status: string;
  primary_endpoint: string;
  enrollment: number;
  start_date: string;
  expected_completion: string;
  dimensions: Dimension[];
  conditions: string[];
  latest_results_summary: string;
  last_checked: string;
  change_log: { date: string; change: string }[];
  lymphedema_type?: LymphedemaType;
}

export interface Finding {
  id: string;
  dimension: Dimension;
  subtopic: string;
  statement: string;
  confidence: "high" | "moderate" | "low";
  supporting_papers: string[];
  contradicting_papers: string[];
  clinical_relevance: "high" | "moderate" | "low";
  last_updated: string;
  evolution: { date: string; note: string }[];
}

export interface RunLogEntry {
  run_id: string;
  mode: string;
  started_at: string;
  completed_at: string;
  papers_found: number;
  papers_added: number;
  trials_updated: number;
  findings_updated: number;
  alerts_generated: number;
  errors: string[];
  token_usage_estimate: string;
}

export interface UserPaperState {
  status: "read" | "starred" | "dismissed";
  tags: string[];
  note: string;
  read_at: string;
}

export interface UserTrialState {
  starred: boolean;
  note: string;
}

export interface UserState {
  papers: Record<string, UserPaperState>;
  trials: Record<string, UserTrialState>;
  last_visit: string;
}

export interface PaperWithUserState extends Paper {
  userStatus?: "read" | "starred" | "dismissed";
  userTags: string[];
  userNote: string;
  isNew: boolean;
}

export interface TrialWithUserState extends Trial {
  userStarred: boolean;
  userNote: string;
}
