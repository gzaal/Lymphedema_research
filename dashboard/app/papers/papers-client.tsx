"use client";

import { useState, useCallback, useEffect, useRef, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";

import type { PaperWithUserState, Dimension } from "@/lib/types";
import { DIMENSION_META } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

// ---------------------------------------------------------------------------
// Design tokens (Clinical Curator / Stitch)
// ---------------------------------------------------------------------------

const T = {
  primary: "#003d1f",
  primaryContainer: "#1a3d28",
  surface: "#faf9f6",
  surfaceLow: "#f4f3f1",
  surfaceHigh: "#e9e8e5",
  surfaceTint: "#2d6b50",
  secondary: "#2d6a50",
  secondaryContainer: "#c8e6c9",
  onSecondaryContainer: "#2e6b4f",
  onSurface: "#1a1c1a",
  onSurfaceVariant: "#44474e",
  outlineVariant: "rgba(196,198,207,0.15)",
  outlineVariantSolid: "#c4c6cf",
  error: "#ba1a1a",
} as const;

const ghostBorder = `1px solid ${T.outlineVariant}`;
const ghostBorderBottom = `1px solid rgba(196,198,207,0.1)`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type StatusFilter = "all" | "new" | "read" | "starred" | "dismissed";
type SourceFilter = "all" | "pubmed" | "semantic_scholar";

function relevanceLabel(score: number): { text: string; className: string } {
  if (score >= 8)
    return {
      text: "HIGH",
      className: "bg-green-100 text-green-800 text-[10px] font-bold rounded uppercase tracking-wider",
    };
  if (score >= 5)
    return {
      text: "MEDIUM",
      className: "bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase tracking-wider",
    };
  return {
    text: "LOW",
    className: "bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider",
  };
}

const CLASSIFICATION_META: Record<string, { label: string; className: string }> = {
  "practice-relevant": { label: "Practice", className: "bg-green-100 text-green-800" },
  "pipeline-relevant": { label: "Pipeline", className: "bg-green-100 text-green-800" },
  "hypothesis-generating": { label: "Hypothesis", className: "bg-purple-100 text-purple-800" },
  "background": { label: "Background", className: "bg-gray-100 text-gray-600" },
  "tracker-maintenance": { label: "Maintenance", className: "bg-gray-50 text-gray-500" },
};

function scoreBarColor(value: number): string {
  if (value >= 8) return "bg-green-500";
  if (value >= 5) return "bg-amber-500";
  return "bg-red-400";
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px]">
      <span className="w-[14px] text-right tabular-nums text-[#44474e]">{value}</span>
      <div className="w-[40px] h-[4px] bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full", scoreBarColor(value))}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-[#44474e] uppercase tracking-wider">{label}</span>
    </div>
  );
}

function statusBadge(paper: PaperWithUserState) {
  if (paper.isNew && !paper.userStatus)
    return {
      label: "New",
      className: `bg-[${T.secondaryContainer}] text-[${T.onSecondaryContainer}] label-caps text-[10px]`,
    };
  if (paper.userStatus === "starred")
    return {
      label: "Starred",
      className: "bg-amber-100 text-amber-800 label-caps text-[10px]",
    };
  if (paper.userStatus === "read")
    return {
      label: "Read",
      className: `bg-[${T.surfaceLow}] text-[${T.onSurfaceVariant}] label-caps text-[10px]`,
    };
  if (paper.userStatus === "dismissed")
    return {
      label: "Dismissed",
      className: `bg-red-50 text-[${T.error}] label-caps text-[10px]`,
    };
  return null;
}

function truncate(str: string, len: number) {
  if (str.length <= len) return str;
  return str.slice(0, len) + "\u2026";
}

/** Material icon helper */
function MIcon({
  name,
  size = 18,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------

async function updatePaper(
  paperId: string,
  status: "read" | "starred" | "dismissed"
) {
  await fetch("/api/user-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "update_paper", paperId, status }),
  });
}

async function updatePaperNote(paperId: string, note: string) {
  await fetch("/api/user-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "update_paper", paperId, note }),
  });
}

async function bulkUpdatePapers(
  paperIds: string[],
  update: Record<string, unknown>
) {
  await fetch("/api/user-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "bulk_papers", paperIds, update }),
  });
}

// ---------------------------------------------------------------------------
// Expanded row panel
// ---------------------------------------------------------------------------

function ExpandedRow({
  paper,
  onRefresh,
}: {
  paper: PaperWithUserState;
  onRefresh: () => void;
}) {
  const [note, setNote] = useState(paper.userNote);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleNote = (value: string) => {
    setNote(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      await updatePaperNote(paper.id, value);
      setSaving(false);
    }, 600);
  };

  return (
    <div
      className="px-6 py-5 space-y-4"
      style={{
        backgroundColor: T.surfaceLow,
        borderBottom: ghostBorderBottom,
      }}
    >
      {/* Abstract */}
      <div>
        <h4 className="label-caps text-[10px] font-bold text-[#44474e] mb-1">
          Abstract
        </h4>
        <p className="text-[11px] text-[#44474e] leading-relaxed">
          {paper.abstract || "No abstract available."}
        </p>
      </div>

      {/* Critical Assessment (new multi-axis scoring) */}
      {(paper.what_happened || paper.classification || paper.scores) && (
        <div className="rounded-lg border border-[rgba(196,198,207,0.15)] bg-white p-4 space-y-3">
          <h4 className="label-caps text-[10px] font-bold text-[#003d1f] mb-1">
            Critical Assessment
          </h4>

          {/* Structured assessment */}
          <div className="space-y-1 text-[11px] text-[#44474e]">
            {paper.what_happened && (
              <p><span className="font-semibold text-[#003d1f]">What happened:</span> {paper.what_happened}</p>
            )}
            {paper.why_it_matters && (
              <p><span className="font-semibold text-[#003d1f]">Why it matters:</span> {paper.why_it_matters}</p>
            )}
            {paper.what_limits_confidence && (
              <p><span className="font-semibold text-red-700">Limits confidence:</span> {paper.what_limits_confidence}</p>
            )}
          </div>

          {/* Classification + publication event badges */}
          <div className="flex flex-wrap gap-1.5">
            {paper.lymphedema_type && (
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                paper.lymphedema_type === "primary" && "bg-emerald-100 text-emerald-800",
                paper.lymphedema_type === "both" && "bg-teal-100 text-teal-800",
                paper.lymphedema_type === "unknown" && "bg-slate-100 text-slate-600",
                paper.lymphedema_type === "secondary" && "bg-red-100 text-red-800",
              )}>
                {paper.lymphedema_type}
              </span>
            )}
            {paper.classification && (
              <span className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                CLASSIFICATION_META[paper.classification]?.className ?? "bg-gray-100 text-gray-600"
              )}>
                {CLASSIFICATION_META[paper.classification]?.label ?? paper.classification}
              </span>
            )}
            {paper.publication_event && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-semibold">
                {paper.publication_event.replace(/-/g, " ")}
              </span>
            )}
            {paper.claim_audit && !paper.claim_audit.is_new_this_week && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold uppercase">
                Stale
              </span>
            )}
            {paper.claim_audit?.headline_vs_evidence === "overstated" && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold uppercase">
                Overstated
              </span>
            )}
          </div>

          {/* Multi-axis scores */}
          {paper.scores && (
            <div className="flex gap-4">
              <ScoreBar label="Importance" value={paper.scores.importance} />
              <ScoreBar label="Evidence" value={paper.scores.evidence_strength} />
              <ScoreBar label="Novelty" value={paper.scores.novelty} />
              <ScoreBar label="Decision" value={paper.scores.decision_usefulness} />
              <ScoreBar label="Calibration" value={paper.scores.claim_calibration} />
            </div>
          )}

          {/* Claim audit details */}
          {paper.claim_audit && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-[#44474e]">
              <div><span className="font-semibold">Design:</span> {paper.claim_audit.study_design?.replace(/-/g, " ")}</div>
              <div><span className="font-semibold">Endpoint:</span> {paper.claim_audit.endpoint_type?.replace(/-/g, " ")}</div>
              <div><span className="font-semibold">Comparator:</span> {paper.claim_audit.comparator?.replace(/-/g, " ")}</div>
              <div><span className="font-semibold">Result:</span> {paper.claim_audit.result_direction?.replace(/-/g, " ")}</div>
              {paper.claim_audit.conflicts_of_interest && paper.claim_audit.conflicts_of_interest !== "none apparent" && (
                <div className="col-span-2 md:col-span-4 text-red-600">
                  <span className="font-semibold">COI:</span> {paper.claim_audit.conflicts_of_interest}
                </div>
              )}
            </div>
          )}

          {/* Skepticism flags */}
          {paper.skepticism_flags && Object.values(paper.skepticism_flags).some(Boolean) && (
            <div>
              <h5 className="text-[9px] font-bold text-red-700 uppercase tracking-wider mb-1">Skepticism Flags</h5>
              <div className="flex flex-wrap gap-1">
                {paper.skepticism_flags.single_arm && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Single-arm</span>}
                {paper.skepticism_flags.retrospective && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Retrospective</span>}
                {paper.skepticism_flags.propensity_matched && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] rounded">Propensity-matched</span>}
                {paper.skepticism_flags.pre_post_only && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Pre/post only</span>}
                {paper.skepticism_flags.small_n && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Small n</span>}
                {paper.skepticism_flags.short_followup && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] rounded">Short follow-up</span>}
                {paper.skepticism_flags.commercial_sponsor && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] rounded">Commercial sponsor</span>}
                {paper.skepticism_flags.surrogate_endpoint_only && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] rounded">Surrogate endpoint only</span>}
                {paper.skepticism_flags.bold_claim_volume_only && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Volume claim only</span>}
                {paper.skepticism_flags.promotional_framing && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Promotional</span>}
                {paper.skepticism_flags.obesity_not_controlled && <span className="px-1.5 py-0.5 bg-red-50 text-red-700 text-[9px] rounded">Obesity not controlled</span>}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entities */}
        {paper.entities_mentioned.length > 0 && (
          <div>
            <h4 className="label-caps text-[10px] font-bold text-[#44474e] mb-1">
              Entities
            </h4>
            <div className="flex flex-wrap gap-1">
              {paper.entities_mentioned.map((e) => (
                <span
                  key={e}
                  className="inline-flex items-center rounded-full px-2 py-0.5 bg-[#c8e6c9] text-[#2e6b4f] text-[9px] font-semibold"
                >
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Subtopics */}
        {paper.subtopics.length > 0 && (
          <div>
            <h4 className="label-caps text-[10px] font-bold text-[#44474e] mb-1">
              Subtopics
            </h4>
            <div className="flex flex-wrap gap-1">
              {paper.subtopics.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center rounded-full px-2 py-0.5 bg-[#c8e6c9] text-[#2e6b4f] text-[9px] font-semibold"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Findings */}
      {paper.key_findings.length > 0 && (
        <div>
          <h4 className="label-caps text-[10px] font-bold text-[#44474e] mb-1">
            Key Findings
          </h4>
          <ul className="list-disc list-inside text-[11px] text-[#44474e] space-y-0.5">
            {paper.key_findings.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* DOI + Tags row */}
      <div className="flex flex-wrap items-center gap-3">
        {paper.doi && (
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[#2d6a50] hover:underline"
          >
            <MIcon name="open_in_new" size={14} />
            DOI: {paper.doi}
          </a>
        )}
        {paper.userTags.length > 0 && (
          <div className="flex gap-1">
            {paper.userTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center rounded-full px-2 py-0.5 bg-[#c8e6c9] text-[#2e6b4f] text-[9px] font-semibold"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Note */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h4 className="label-caps text-[10px] font-bold text-[#44474e]">
            Your Note
          </h4>
          {saving && (
            <span className="text-[10px] text-[#44474e]">Saving...</span>
          )}
        </div>
        <Textarea
          value={note}
          onChange={(e) => handleNote(e.target.value)}
          placeholder="Add a personal note about this paper..."
          className="min-h-[60px] text-sm bg-white/80"
          style={{ border: ghostBorder }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PapersClient({
  papers,
}: {
  papers: PaperWithUserState[];
}) {
  const router = useRouter();

  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: "relevance_score", desc: true },
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [dimensionFilter, setDimensionFilter] = useState<Set<Dimension>>(
    new Set()
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [relevanceMin, setRelevanceMin] = useState<number>(1);
  const [relevanceMax, setRelevanceMax] = useState<number>(10);
  const [whatsNewOnly, setWhatsNewOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Derived: filtered data
  const filteredData = useMemo(() => {
    let result = papers;

    // Search filter (title + abstract)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.abstract.toLowerCase().includes(q)
      );
    }

    // Dimension filter
    if (dimensionFilter.size > 0) {
      result = result.filter((p) =>
        p.dimensions.some((d) => dimensionFilter.has(d))
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((p) => {
        if (statusFilter === "new") return p.isNew && !p.userStatus;
        return p.userStatus === statusFilter;
      });
    }

    // Source filter
    if (sourceFilter !== "all") {
      result = result.filter((p) => p.source === sourceFilter);
    }

    // Relevance range
    result = result.filter(
      (p) =>
        p.relevance_score >= relevanceMin && p.relevance_score <= relevanceMax
    );

    // What's new
    if (whatsNewOnly) {
      result = result.filter((p) => p.isNew);
    }

    return result;
  }, [
    papers,
    searchQuery,
    dimensionFilter,
    statusFilter,
    sourceFilter,
    relevanceMin,
    relevanceMax,
    whatsNewOnly,
  ]);

  // Toggle a dimension in the filter set
  const toggleDimension = (dim: Dimension) => {
    setDimensionFilter((prev) => {
      const next = new Set(prev);
      if (next.has(dim)) next.delete(dim);
      else next.add(dim);
      return next;
    });
  };

  // Toggle expanded row
  const toggleExpanded = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Refresh after API call
  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  // Action handlers
  const handleStar = async (paperId: string) => {
    await updatePaper(paperId, "starred");
    refresh();
  };

  const handleDismiss = async (paperId: string) => {
    await updatePaper(paperId, "dismissed");
    refresh();
  };

  const handleMarkRead = async (paperId: string) => {
    await updatePaper(paperId, "read");
    refresh();
  };

  // Bulk actions
  const selectedPaperIds = Object.keys(rowSelection).filter(
    (k) => rowSelection[k]
  );
  const selectedPapers = filteredData.filter((p) =>
    selectedPaperIds.includes(p.id)
  );

  const handleBulkRead = async () => {
    await bulkUpdatePapers(selectedPaperIds, { status: "read" });
    setRowSelection({});
    refresh();
  };

  const handleBulkDismiss = async () => {
    await bulkUpdatePapers(selectedPaperIds, { status: "dismissed" });
    setRowSelection({});
    refresh();
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(selectedPapers, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `papers-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Columns
  const columns = useMemo<ColumnDef<PaperWithUserState>[]>(
    () => [
      // Selection checkbox
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(val) =>
              table.toggleAllPageRowsSelected(!!val)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(val) => row.toggleSelected(!!val)}
            onClick={(e) => e.stopPropagation()}
          />
        ),
        size: 32,
        enableSorting: false,
      },
      // Star
      {
        id: "star",
        header: () => (
          <MIcon name="star_border" size={16} className="text-[#44474e]" />
        ),
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStar(row.original.id);
            }}
            className="p-0.5 rounded hover:bg-[#e9e8e5] transition-colors text-[#44474e]"
          >
            {row.original.userStatus === "starred" ? (
              <MIcon name="star" size={18} className="text-amber-400" />
            ) : (
              <MIcon name="star_border" size={18} className="text-[#44474e]/40" />
            )}
          </button>
        ),
        size: 36,
        enableSorting: false,
      },
      // Title
      {
        accessorKey: "title",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-[#003d1f] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <MIcon name="swap_vert" size={14} />
          </button>
        ),
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="text-sm font-headline font-bold text-[#003d1f] leading-tight line-clamp-2">
              {truncate(row.original.title, 100)}
            </span>
          </div>
        ),
        size: 380,
      },
      // Journal
      {
        accessorKey: "journal",
        header: "Journal",
        cell: ({ row }) => (
          <span className="text-xs text-[#44474e] truncate block max-w-[140px]">
            {row.original.journal || "\u2014"}
          </span>
        ),
        size: 140,
        enableSorting: false,
      },
      // Scores (multi-axis or legacy relevance)
      {
        accessorKey: "relevance_score",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-[#003d1f] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Scores
            <MIcon name="swap_vert" size={14} />
          </button>
        ),
        cell: ({ row }) => {
          const paper = row.original;
          if (paper.scores) {
            return (
              <div className="flex flex-col gap-0.5">
                {(["importance", "evidence_strength", "decision_usefulness"] as const).map((axis) => {
                  const val = (paper.scores as unknown as Record<string, number>)[axis];
                  const label = axis === "importance" ? "Imp" : axis === "evidence_strength" ? "Evi" : "Dec";
                  const color = scoreBarColor(val);
                  return (
                    <div key={axis} className="flex items-center gap-1 text-[9px]">
                      <span className="w-[12px] text-right tabular-nums text-[#44474e]">{val}</span>
                      <div className="w-[28px] h-[3px] bg-gray-200 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", color)} style={{ width: `${val * 10}%` }} />
                      </div>
                      <span className="text-[#44474e] uppercase tracking-wider">{label}</span>
                    </div>
                  );
                })}
              </div>
            );
          }
          const rl = relevanceLabel(paper.relevance_score);
          return (
            <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5", rl.className)}>
              <span className="font-bold tabular-nums">{paper.relevance_score}</span>
              <span className="hidden sm:inline">{rl.text}</span>
            </span>
          );
        },
        size: 120,
      },
      // Dimensions
      {
        id: "dimensions",
        header: "Dims",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-0.5">
            {row.original.dimensions.map((dim) => {
              const meta = DIMENSION_META[dim];
              return (
                <span
                  key={dim}
                  className="inline-flex items-center rounded-full px-1.5 py-0 leading-4 bg-[#c8e6c9] text-[#2e6b4f] text-[9px] font-semibold"
                  title={meta?.label ?? dim}
                >
                  {meta?.label?.slice(0, 4) ?? dim.slice(0, 4)}
                </span>
              );
            })}
          </div>
        ),
        size: 120,
        enableSorting: false,
      },
      // Classification
      {
        id: "classification",
        header: "Class.",
        cell: ({ row }) => {
          const cls = row.original.classification;
          if (!cls) return null;
          const meta = CLASSIFICATION_META[cls];
          return (
            <span className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0 leading-4 text-[9px] font-bold uppercase tracking-wider",
              meta?.className ?? "bg-gray-100 text-gray-600"
            )}>
              {meta?.label ?? cls}
            </span>
          );
        },
        size: 90,
        enableSorting: false,
      },
      // Published Date
      {
        accessorKey: "published_date",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 hover:text-[#003d1f] transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <MIcon name="swap_vert" size={14} />
          </button>
        ),
        cell: ({ row }) => {
          const d = row.original.published_date;
          if (!d) return <span className="text-xs text-[#44474e]">{"\u2014"}</span>;
          try {
            const date = new Date(d);
            return (
              <span
                className="text-xs text-[#44474e] whitespace-nowrap"
                title={formatDistanceToNow(date, { addSuffix: true })}
              >
                {format(date, "MMM d, yyyy")}
              </span>
            );
          } catch {
            return <span className="text-xs text-[#44474e]">{d}</span>;
          }
        },
        size: 110,
      },
      // Status
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const sb = statusBadge(row.original);
          if (!sb) return null;
          return (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5",
                sb.className
              )}
            >
              {sb.label}
            </span>
          );
        },
        size: 80,
        enableSorting: false,
      },
      // Actions
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => handleMarkRead(row.original.id)}
              title="Mark as read"
              className="p-1 rounded hover:bg-[#e9e8e5] transition-colors text-[#44474e]"
            >
              <MIcon name="visibility" size={16} />
            </button>
            <button
              onClick={() => handleDismiss(row.original.id)}
              title="Dismiss"
              className="p-1 rounded hover:bg-[#e9e8e5] transition-colors text-[#44474e]"
            >
              <MIcon name="visibility_off" size={16} />
            </button>
          </div>
        ),
        size: 70,
        enableSorting: false,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  const rows = table.getRowModel().rows;

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "j") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, rows.length - 1));
      } else if (e.key === "k") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "s" && focusedIndex >= 0 && focusedIndex < rows.length) {
        e.preventDefault();
        handleStar(rows[focusedIndex].original.id);
      } else if (e.key === "d" && focusedIndex >= 0 && focusedIndex < rows.length) {
        e.preventDefault();
        handleDismiss(rows[focusedIndex].original.id);
      } else if (e.key === "Enter" && focusedIndex >= 0 && focusedIndex < rows.length) {
        e.preventDefault();
        toggleExpanded(rows[focusedIndex].original.id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIndex, rows]);

  // Scroll focused row into view
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  useEffect(() => {
    if (focusedIndex < 0 || !tableBodyRef.current) return;
    const allDataRows = tableBodyRef.current.querySelectorAll("[data-paper-row]");
    const target = allDataRows[focusedIndex] as HTMLElement | undefined;
    target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIndex]);

  // Stats
  const newCount = papers.filter((p) => p.isNew && !p.userStatus).length;
  const totalCount = papers.length;

  return (
    <div className="space-y-4" style={{ backgroundColor: T.surface, minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#003d1f]">
            Papers Triage
          </h1>
          <p className="text-sm text-[#44474e] mt-1">
            <span className="font-headline font-bold text-[#003d1f]">{totalCount}</span> papers total{" "}
            {newCount > 0 && (
              <span className="inline-flex items-center gap-1">
                {" \u00b7 "}
                <span className="inline-flex items-center rounded-full px-2 py-0.5 bg-[#c8e6c9] text-[#2e6b4f] label-caps text-[10px] font-semibold">
                  {newCount} new
                </span>
              </span>
            )}
            {filteredData.length !== totalCount && (
              <span className="text-[#44474e]">
                {" \u00b7 "}{filteredData.length} shown
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              showFilters
                ? "bg-[#003d1f] text-white"
                : "bg-[#f4f3f1] text-[#44474e] hover:bg-[#e9e8e5]"
            )}
            style={{ border: ghostBorder }}
          >
            <MIcon name="filter_list" size={16} />
            Filters
          </button>
          <div
            className="text-[10px] text-[#44474e] rounded-lg px-3 py-1.5 bg-[#f4f3f1]"
            style={{ border: ghostBorder }}
          >
            <kbd className="font-mono font-bold">j</kbd>/<kbd className="font-mono font-bold">k</kbd> navigate{" "}
            <kbd className="font-mono font-bold">s</kbd> star{" "}
            <kbd className="font-mono font-bold">d</kbd> dismiss{" "}
            <kbd className="font-mono font-bold">Enter</kbd> expand
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedPaperIds.length > 0 && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-2.5 bg-[#003d1f] text-white shadow-lg"
        >
          <span className="text-sm font-headline font-bold">
            {selectedPaperIds.length} selected
          </span>
          <Separator orientation="vertical" className="h-5 bg-white/20" />
          <button
            onClick={handleBulkRead}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-white/10 transition-colors"
          >
            <MIcon name="visibility" size={16} />
            Mark as Read
          </button>
          <button
            onClick={handleBulkDismiss}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-white/10 transition-colors"
          >
            <MIcon name="visibility_off" size={16} />
            Dismiss
          </button>
          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm hover:bg-white/10 transition-colors"
          >
            <MIcon name="download" size={16} />
            Export JSON
          </button>
          <button
            onClick={() => setRowSelection({})}
            className="ml-auto p-1 rounded hover:bg-white/10 transition-colors"
          >
            <MIcon name="close" size={16} />
          </button>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div
          className="rounded-lg p-4 space-y-3 bg-[#f4f3f1]"
          style={{ border: ghostBorder }}
        >
          <div className="flex flex-wrap items-end gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[240px]">
              <label className="label-caps text-[10px] font-bold text-[#44474e] mb-1 block">
                Search
              </label>
              <div className="relative">
                <MIcon
                  name="search"
                  size={16}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#44474e]"
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title or abstract..."
                  className="pl-8 h-8 text-sm bg-white/80"
                  style={{ border: ghostBorder }}
                />
              </div>
            </div>

            {/* Status filter */}
            <div>
              <label className="label-caps text-[10px] font-bold text-[#44474e] mb-1 block">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as StatusFilter)
                }
                className="flex h-8 rounded-md bg-white/80 px-2 py-1 text-sm text-[#1a1c1a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2d6b50]"
                style={{ border: ghostBorder }}
              >
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="starred">Starred</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            {/* Source filter */}
            <div>
              <label className="label-caps text-[10px] font-bold text-[#44474e] mb-1 block">
                Source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value as SourceFilter)
                }
                className="flex h-8 rounded-md bg-white/80 px-2 py-1 text-sm text-[#1a1c1a] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2d6b50]"
                style={{ border: ghostBorder }}
              >
                <option value="all">All Sources</option>
                <option value="pubmed">PubMed</option>
                <option value="semantic_scholar">Semantic Scholar</option>
              </select>
            </div>

            {/* Relevance range */}
            <div>
              <label className="label-caps text-[10px] font-bold text-[#44474e] mb-1 block">
                Relevance
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={relevanceMin}
                  onChange={(e) =>
                    setRelevanceMin(
                      Math.max(1, Math.min(10, Number(e.target.value)))
                    )
                  }
                  className="w-14 h-8 text-sm text-center bg-white/80"
                  style={{ border: ghostBorder }}
                />
                <span className="text-xs text-[#44474e]">to</span>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={relevanceMax}
                  onChange={(e) =>
                    setRelevanceMax(
                      Math.max(1, Math.min(10, Number(e.target.value)))
                    )
                  }
                  className="w-14 h-8 text-sm text-center bg-white/80"
                  style={{ border: ghostBorder }}
                />
              </div>
            </div>

            {/* What's New toggle */}
            <div className="flex items-center gap-2">
              <Checkbox
                checked={whatsNewOnly}
                onCheckedChange={(val) => setWhatsNewOnly(!!val)}
              />
              <label className="text-sm font-medium text-[#1a1c1a] flex items-center gap-1 cursor-pointer">
                <MIcon name="fiber_new" size={16} className="text-[#2d6a50]" />
                New only
              </label>
            </div>
          </div>

          {/* Dimension filters */}
          <div>
            <label className="label-caps text-[10px] font-bold text-[#44474e] mb-1.5 block">
              Dimensions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(
                Object.entries(DIMENSION_META) as [
                  Dimension,
                  (typeof DIMENSION_META)[Dimension],
                ][]
              ).map(([dim, meta]) => {
                const active = dimensionFilter.has(dim);
                return (
                  <button
                    key={dim}
                    onClick={() => toggleDimension(dim)}
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
                      active
                        ? "bg-[#003d1f] text-white"
                        : "bg-white/60 text-[#44474e] hover:bg-[#e9e8e5]"
                    )}
                    style={{ border: ghostBorder }}
                  >
                    {meta.label}
                  </button>
                );
              })}
              {dimensionFilter.size > 0 && (
                <button
                  onClick={() => setDimensionFilter(new Set())}
                  className="text-[10px] text-[#44474e] hover:text-[#003d1f] underline ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg overflow-hidden" style={{ border: ghostBorder }}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent bg-[#f4f3f1]"
                style={{ borderBottom: ghostBorderBottom }}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="label-caps text-[10px] font-bold text-[#44474e]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-[#44474e]"
                >
                  No papers match your filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => {
                const isExpanded = expandedRows.has(row.original.id);
                const isFocused = idx === focusedIndex;
                return (
                  <Fragment key={row.id}>
                    <TableRow
                      data-paper-row
                      data-state={row.getIsSelected() ? "selected" : undefined}
                      onClick={() => toggleExpanded(row.original.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        "hover:bg-[#f4f3f1]/50",
                        isFocused && "ring-2 ring-inset ring-[#2d6b50]/40 bg-[#f4f3f1]/60",
                        row.original.userStatus === "dismissed" && "opacity-50"
                      )}
                      style={{ borderBottom: ghostBorderBottom }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={columns.length} className="p-0">
                          <ExpandedRow
                            paper={row.original}
                            onRefresh={refresh}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer stats */}
      <div className="text-[10px] label-caps font-bold text-[#44474e] text-center py-2">
        Showing {filteredData.length} of {totalCount} papers
      </div>
    </div>
  );
}
