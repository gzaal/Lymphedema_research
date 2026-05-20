"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import type { TrialWithUserState } from "@/lib/types";
import {
  TRIAL_STATUS_META,
  DIMENSION_META,
  normalizePhase,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// Material Icon helper
// ---------------------------------------------------------------------------

function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{ fontSize: size }}
    >
      {name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  if (!dateStr) return "--";
  try {
    // Handle "YYYY-MM" format
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      return format(parseISO(dateStr + "-01"), "MMM yyyy");
    }
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

function getPhaseGroup(phase: string): string {
  if (!phase || phase === "N/A" || phase === "NA") return "Other";
  if (phase.includes("PHASE3")) return "Phase 3";
  if (phase.includes("PHASE2")) return "Phase 2";
  if (phase.includes("PHASE1")) return "Phase 1";
  if (phase.includes("PHASE4")) return "Phase 4";
  return "Other";
}

const PHASE_GROUP_ORDER = ["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Other"];

const STATUS_SORT_ORDER: Record<string, number> = {
  RECRUITING: 0,
  ENROLLING_BY_INVITATION: 1,
  ACTIVE_NOT_RECRUITING: 2,
  COMPLETED: 3,
};

// ---------------------------------------------------------------------------
// Design-system status badge colors
// ---------------------------------------------------------------------------

const STATUS_BADGE_STYLES: Record<string, string> = {
  RECRUITING: "bg-green-100 text-green-800",
  ACTIVE_NOT_RECRUITING: "bg-[#c8e6c9] text-[#2e6b4f]",
  COMPLETED: "bg-[#f4f3f1] text-[#44474e]",
  ENROLLING_BY_INVITATION: "bg-[#c8e6c9] text-[#2e6b4f]",
};

function StatusBadge({ status }: { status: string }) {
  const meta = TRIAL_STATUS_META[status] || {
    label: status,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_BADGE_STYLES[status] || "bg-[#f4f3f1] text-[#44474e]"
      )}
    >
      {meta.label}
    </span>
  );
}

function DimensionBadge({ dimension }: { dimension: string }) {
  const meta =
    DIMENSION_META[dimension as keyof typeof DIMENSION_META] || null;
  if (!meta) return null;
  return (
    <span className="inline-flex items-center bg-[#c8e6c9] text-[#2e6b4f] rounded-full px-2.5 py-0.5 text-[9px] font-semibold">
      {meta.label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Pipeline card accent bar colors per status
// ---------------------------------------------------------------------------

const PIPELINE_ACCENT: Record<string, string> = {
  RECRUITING: "#003d1f",
  ACTIVE_NOT_RECRUITING: "#2d6b50",
  COMPLETED: "#74777f",
  ENROLLING_BY_INVITATION: "#2d6a50",
};

// ---------------------------------------------------------------------------
// Trial Detail Dialog
// ---------------------------------------------------------------------------

function TrialDetailDialog({
  trial,
  open,
  onOpenChange,
}: {
  trial: TrialWithUserState | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!trial) return null;

  return (
    <Dialog open={open} onOpenChange={(value) => onOpenChange(value)}>
      <DialogPopup
        className="max-h-[85vh] max-w-2xl overflow-y-auto bg-white"
        style={{
          boxShadow: "0px 20px 40px rgba(26,28,26,0.06)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="pr-8 text-base font-headline font-bold text-[#003d1f] leading-snug">
            {trial.title}
          </DialogTitle>
          <DialogDescription>
            <span className="inline-flex items-center gap-2">
              <a
                href={`https://clinicaltrials.gov/study/${trial.nct_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#2d6b50] hover:underline"
              >
                {trial.nct_id}
                <Icon name="open_in_new" size={14} />
              </a>
              <StatusBadge status={trial.status} />
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <Icon name="close" size={16} />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="grid gap-4 py-2">
          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Icon
                name="science"
                size={16}
                className="mt-0.5 shrink-0 text-[#44474e]"
              />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e]">
                  Phase
                </p>
                <p className="font-headline font-bold text-[#003d1f]">
                  {normalizePhase(trial.phase)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon
                name="groups"
                size={16}
                className="mt-0.5 shrink-0 text-[#44474e]"
              />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e]">
                  Enrollment
                </p>
                <p className="font-headline font-bold text-[#003d1f]">
                  {trial.enrollment.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon
                name="schedule"
                size={16}
                className="mt-0.5 shrink-0 text-[#44474e]"
              />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e]">
                  Start Date
                </p>
                <p className="font-medium text-[#1a1c1a]">
                  {formatDate(trial.start_date)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Icon
                name="schedule"
                size={16}
                className="mt-0.5 shrink-0 text-[#44474e]"
              />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e]">
                  Expected Completion
                </p>
                <p className="font-medium text-[#1a1c1a]">
                  {formatDate(trial.expected_completion)}
                </p>
              </div>
            </div>
            <div className="col-span-2 flex items-start gap-2">
              <Icon
                name="medical_services"
                size={16}
                className="mt-0.5 shrink-0 text-[#44474e]"
              />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e]">
                  Sponsor
                </p>
                <p className="font-medium text-[#1a1c1a]">{trial.sponsor}</p>
              </div>
            </div>
            {trial.intervention && (
              <div className="col-span-2 flex items-start gap-2">
                <Icon
                  name="medical_services"
                  size={16}
                  className="mt-0.5 shrink-0 text-[#44474e]"
                />
                <div>
                  <p className="label-caps text-[10px] font-bold text-[#44474e]">
                    Intervention
                  </p>
                  <p className="font-medium text-[#1a1c1a]">
                    {trial.intervention}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Dimensions */}
          {trial.dimensions.length > 0 && (
            <>
              <Separator className="bg-[rgba(196,198,207,0.15)]" />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e] mb-2">
                  Dimensions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trial.dimensions.map((d) => (
                    <DimensionBadge key={d} dimension={d} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Change Log Timeline */}
          {trial.change_log.length > 0 && (
            <>
              <Separator className="bg-[rgba(196,198,207,0.15)]" />
              <div>
                <p className="label-caps text-[10px] font-bold text-[#44474e] mb-3">
                  Change Log
                </p>
                <div className="relative space-y-0">
                  {trial.change_log.map((entry, i) => (
                    <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                      {/* Timeline line */}
                      {i < trial.change_log.length - 1 && (
                        <div
                          className="absolute left-[5px] top-3 h-full w-px"
                          style={{ backgroundColor: "#c8e6c9" }}
                        />
                      )}
                      {/* Timeline dot */}
                      <div
                        className="relative mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-2 bg-white"
                        style={{ borderColor: "#003d1f" }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="label-caps text-[10px] font-bold text-[#44474e]">
                          {formatDate(entry.date)}
                        </p>
                        <p className="text-sm text-[#1a1c1a]">
                          {entry.change}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogPopup>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Pipeline View
// ---------------------------------------------------------------------------

function PipelineView({
  trials,
  onSelect,
}: {
  trials: TrialWithUserState[];
  onSelect: (trial: TrialWithUserState) => void;
}) {
  const grouped = useMemo(() => {
    const groups: Record<string, TrialWithUserState[]> = {};
    for (const group of PHASE_GROUP_ORDER) {
      groups[group] = [];
    }
    for (const trial of trials) {
      const group = getPhaseGroup(trial.phase);
      if (!groups[group]) groups[group] = [];
      groups[group].push(trial);
    }
    // Sort within each group: recruiting first, then by enrollment desc
    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => {
        const sa = STATUS_SORT_ORDER[a.status] ?? 99;
        const sb = STATUS_SORT_ORDER[b.status] ?? 99;
        if (sa !== sb) return sa - sb;
        return b.enrollment - a.enrollment;
      });
    }
    return groups;
  }, [trials]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
      {PHASE_GROUP_ORDER.filter((g) => (grouped[g]?.length ?? 0) > 0).map(
        (group) => (
          <div key={group}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-[#003d1f]">
                {group}
              </h3>
              <span className="bg-[#c8e6c9] text-[#2e6b4f] rounded-full px-2 py-0.5 text-[9px] font-semibold">
                {grouped[group].length}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[group].map((trial) => (
                <button
                  key={trial.nct_id}
                  onClick={() => onSelect(trial)}
                  className="w-full cursor-pointer bg-white ghost-border rounded-lg p-5 text-left transition-colors hover:bg-[#f4f3f1]/50"
                  style={{
                    border: "1px solid rgba(196,198,207,0.15)",
                    borderLeft: `3px solid ${PIPELINE_ACCENT[trial.status] || "#74777f"}`,
                  }}
                >
                  <p className="font-headline font-bold text-[#003d1f] text-sm mb-1.5 leading-snug line-clamp-2">
                    {trial.title}
                  </p>
                  <div className="mb-2 flex items-center gap-2">
                    <StatusBadge status={trial.status} />
                    {trial.phase !== "N/A" && trial.phase !== "NA" && (
                      <span className="label-caps text-[10px]">
                        {normalizePhase(trial.phase)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#44474e]">
                    <span className="truncate max-w-[60%]">
                      {trial.sponsor}
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Icon name="groups" size={14} className="text-[#44474e]" />
                      <span className="font-headline font-bold text-[#003d1f]">
                        {trial.enrollment.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Table View
// ---------------------------------------------------------------------------

type SortField =
  | "title"
  | "phase"
  | "status"
  | "enrollment"
  | "expected_completion"
  | "sponsor";
type SortDir = "asc" | "desc";

function TableView({
  trials,
  onSelect,
}: {
  trials: TrialWithUserState[];
  onSelect: (trial: TrialWithUserState) => void;
}) {
  const [sortField, setSortField] = useState<SortField>("enrollment");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "enrollment" ? "desc" : "asc");
    }
  }

  const sorted = useMemo(() => {
    return [...trials].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "phase":
          cmp = a.phase.localeCompare(b.phase);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "enrollment":
          cmp = a.enrollment - b.enrollment;
          break;
        case "expected_completion":
          cmp = (a.expected_completion || "").localeCompare(
            b.expected_completion || ""
          );
          break;
        case "sponsor":
          cmp = a.sponsor.localeCompare(b.sponsor);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [trials, sortField, sortDir]);

  function SortableHeader({
    field,
    children,
    className,
  }: {
    field: SortField;
    children: React.ReactNode;
    className?: string;
  }) {
    const active = sortField === field;
    return (
      <TableHead
        className={cn(
          "label-caps text-[10px] font-bold text-[#44474e]",
          className
        )}
      >
        <button
          onClick={() => handleSort(field)}
          className="inline-flex items-center gap-1 hover:text-[#003d1f] transition-colors"
        >
          {children}
          {active ? (
            sortDir === "asc" ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      </TableHead>
    );
  }

  return (
    <Card
      className="py-0 overflow-hidden bg-white"
      style={{ border: "1px solid rgba(196,198,207,0.15)" }}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-[#f4f3f1]">
            <TableHead className="label-caps text-[10px] font-bold text-[#44474e] w-[110px]">
              NCT ID
            </TableHead>
            <SortableHeader field="title">Title</SortableHeader>
            <SortableHeader field="phase" className="w-[100px]">
              Phase
            </SortableHeader>
            <SortableHeader field="status" className="w-[120px]">
              Status
            </SortableHeader>
            <SortableHeader field="sponsor">Sponsor</SortableHeader>
            <SortableHeader field="enrollment" className="w-[100px] text-right">
              Enrollment
            </SortableHeader>
            <SortableHeader
              field="expected_completion"
              className="w-[120px]"
            >
              Completion
            </SortableHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((trial) => (
            <TableRow
              key={trial.nct_id}
              className="cursor-pointer hover:bg-[#f4f3f1]/50 transition-colors"
              onClick={() => onSelect(trial)}
            >
              <TableCell className="font-mono text-xs">
                <a
                  href={`https://clinicaltrials.gov/study/${trial.nct_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2d6b50] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {trial.nct_id}
                </a>
              </TableCell>
              <TableCell>
                <span className="line-clamp-2 text-sm font-headline font-bold text-[#003d1f]">
                  {trial.title}
                </span>
              </TableCell>
              <TableCell className="label-caps text-[10px]">
                {normalizePhase(trial.phase)}
              </TableCell>
              <TableCell>
                <StatusBadge status={trial.status} />
              </TableCell>
              <TableCell className="max-w-[180px] truncate text-sm text-[#44474e]">
                {trial.sponsor}
              </TableCell>
              <TableCell className="text-right tabular-nums font-headline font-bold text-[#003d1f] text-sm">
                {trial.enrollment.toLocaleString()}
              </TableCell>
              <TableCell className="text-sm text-[#44474e]">
                {formatDate(trial.expected_completion)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function TrialsClient({
  trials,
}: {
  trials: TrialWithUserState[];
}) {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTrial, setSelectedTrial] =
    useState<TrialWithUserState | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pipeline");

  // Unique values for filters
  const phases = useMemo(() => {
    const set = new Set(trials.map((t) => getPhaseGroup(t.phase)));
    return PHASE_GROUP_ORDER.filter((p) => set.has(p));
  }, [trials]);

  const statuses = useMemo(() => {
    const set = new Set(trials.map((t) => t.status));
    return Array.from(set).sort();
  }, [trials]);

  // Filter trials
  const filtered = useMemo(() => {
    return trials.filter((t) => {
      if (phaseFilter !== "all" && getPhaseGroup(t.phase) !== phaseFilter) {
        return false;
      }
      if (statusFilter !== "all" && t.status !== statusFilter) {
        return false;
      }
      if (search) {
        const q = search.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.sponsor.toLowerCase().includes(q) ||
          t.nct_id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [trials, phaseFilter, statusFilter, search]);

  function handleSelect(trial: TrialWithUserState) {
    setSelectedTrial(trial);
    setDialogOpen(true);
  }

  // Summary stats
  const recruiting = trials.filter((t) => t.status === "RECRUITING").length;
  const active = trials.filter(
    (t) => t.status === "ACTIVE_NOT_RECRUITING"
  ).length;
  const completed = trials.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-4xl font-headline font-bold text-[#003d1f]">
          Clinical Trials
        </h1>
        <p className="mt-1 text-sm text-[#44474e]">
          <span className="font-headline font-bold text-[#003d1f]">
            {trials.length}
          </span>{" "}
          trials tracked &mdash;{" "}
          <span className="font-headline font-bold text-[#003d1f]">
            {recruiting}
          </span>{" "}
          recruiting,{" "}
          <span className="font-headline font-bold text-[#003d1f]">
            {active}
          </span>{" "}
          active,{" "}
          <span className="font-headline font-bold text-[#003d1f]">
            {completed}
          </span>{" "}
          completed
        </p>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 bg-[#f4f3f1] rounded-lg p-4"
      >
        <div className="relative max-w-sm flex-1">
          <Icon
            name="search"
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#44474e]"
          />
          <Input
            placeholder="Search by title, sponsor, or NCT ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
            style={{ border: "1px solid rgba(196,198,207,0.15)" }}
          />
        </div>
        <div>
          <Select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="w-[150px] bg-white"
            style={{ border: "1px solid rgba(196,198,207,0.15)" }}
          >
            <option value="all">All Phases</option>
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[170px] bg-white"
            style={{ border: "1px solid rgba(196,198,207,0.15)" }}
          >
            <option value="all">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {TRIAL_STATUS_META[s]?.label || s}
              </option>
            ))}
          </Select>
        </div>
        {(search || phaseFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="text-[#44474e] hover:text-[#003d1f]"
            onClick={() => {
              setSearch("");
              setPhaseFilter("all");
              setStatusFilter("all");
            }}
          >
            <Icon name="close" size={14} className="mr-1" />
            Clear
          </Button>
        )}
        {filtered.length !== trials.length && (
          <span className="text-sm text-[#44474e]">
            <span className="font-headline font-bold text-[#003d1f]">
              {filtered.length}
            </span>{" "}
            of {trials.length} trials
          </span>
        )}
      </div>

      {/* Tabs: Pipeline / Table */}
      <Tabs defaultValue="pipeline" onValueChange={setActiveTab}>
        <TabsList className="bg-transparent border-b border-[rgba(196,198,207,0.15)] rounded-none w-full justify-start gap-6 px-0">
          <TabsTrigger
            value="pipeline"
            className={cn(
              "rounded-none border-b-2 px-1 pb-2 font-headline font-semibold transition-colors data-[state=active]:shadow-none",
              activeTab === "pipeline"
                ? "text-[#003d1f] font-bold border-[#003d1f]"
                : "text-[#44474e] border-transparent hover:text-[#003d1f]"
            )}
          >
            Pipeline
          </TabsTrigger>
          <TabsTrigger
            value="table"
            className={cn(
              "rounded-none border-b-2 px-1 pb-2 font-headline font-semibold transition-colors data-[state=active]:shadow-none",
              activeTab === "table"
                ? "text-[#003d1f] font-bold border-[#003d1f]"
                : "text-[#44474e] border-transparent hover:text-[#003d1f]"
            )}
          >
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon
                name="science"
                size={40}
                className="mb-3 text-[#44474e] opacity-40"
              />
              <p className="text-sm text-[#44474e]">
                No trials match the current filters.
              </p>
            </div>
          ) : (
            <PipelineView trials={filtered} onSelect={handleSelect} />
          )}
        </TabsContent>

        <TabsContent value="table">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Icon
                name="science"
                size={40}
                className="mb-3 text-[#44474e] opacity-40"
              />
              <p className="text-sm text-[#44474e]">
                No trials match the current filters.
              </p>
            </div>
          ) : (
            <TableView trials={filtered} onSelect={handleSelect} />
          )}
        </TabsContent>
      </Tabs>

      {/* Trial detail dialog */}
      <TrialDetailDialog
        trial={selectedTrial}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
