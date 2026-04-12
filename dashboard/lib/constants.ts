import type { Dimension } from "./types";

export const DIMENSION_META: Record<
  Dimension,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  pharmacological: {
    label: "Pharmacological",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: "Pill",
  },
  dietary: {
    label: "Dietary & Lifestyle",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: "Apple",
  },
  genetics: {
    label: "Genetics & Biomarkers",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    icon: "Dna",
  },
  clinical_trials: {
    label: "Clinical Trials",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    icon: "FlaskConical",
  },
  management: {
    label: "Disease Management",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: "HeartPulse",
  },
  community: {
    label: "Patient Community",
    color: "text-teal-700",
    bgColor: "bg-teal-50 border-teal-200",
    icon: "Users",
  },
  general: {
    label: "General",
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
    icon: "FileText",
  },
};

export const TRIAL_STATUS_META: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  RECRUITING: {
    label: "Recruiting",
    color: "text-green-700",
    bgColor: "bg-green-100",
  },
  ACTIVE_NOT_RECRUITING: {
    label: "Active",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  COMPLETED: {
    label: "Completed",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  },
  ENROLLING_BY_INVITATION: {
    label: "By Invitation",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
};

export const CONFIDENCE_META: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  high: { label: "High", color: "text-green-700", bgColor: "bg-green-100" },
  moderate: {
    label: "Moderate",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  low: { label: "Low", color: "text-red-700", bgColor: "bg-red-100" },
};

export const PHASE_ORDER: Record<string, number> = {
  PHASE1: 1,
  "PHASE1, PHASE2": 1.5,
  PHASE2: 2,
  "PHASE2, PHASE3": 2.5,
  PHASE3: 3,
  PHASE4: 4,
  NA: 0,
  "N/A": 0,
};

export function normalizePhase(phase: string): string {
  if (!phase || phase === "N/A" || phase === "NA") return "Other";
  return phase
    .replace(/PHASE/g, "Phase ")
    .replace(/, /g, "/")
    .trim();
}
