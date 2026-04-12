export type Dimension =
  | "pharmacological"
  | "dietary"
  | "genetics"
  | "clinical_trials"
  | "management"
  | "community"
  | "general";

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
  relevance_score: number;
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
