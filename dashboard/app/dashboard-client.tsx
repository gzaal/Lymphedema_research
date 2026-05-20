"use client";

import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { DIMENSION_META, CONFIDENCE_META } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import type { Paper, Finding, Dimension, RunLogEntry } from "@/lib/types";

const DIM_COLORS: Record<string, string> = {
  pharmacological: "#003d1f",
  dietary: "#2d6b50",
  genetics: "#2d6a50",
  clinical_trials: "#1a3d28",
  management: "#2e6b4f",
  community: "#74777f",
};

const DIM_ACCENT: Record<string, string> = {
  pharmacological: "#003d1f",
  dietary: "#2d6b50",
  genetics: "#2d6a50",
  clinical_trials: "#1a3d28",
  management: "#2e6b4f",
  community: "#74777f",
};

interface DashboardProps {
  totalPapers: number;
  totalTrials: number;
  totalFindings: number;
  newPapers: number;
  lastRun: RunLogEntry | null;
  trialsByStatus: { recruiting: number; active: number; completed: number };
  papersByDimension: {
    dimension: Dimension;
    count: number;
    trials: number;
    latestFinding: Finding | null;
  }[];
  recentPapers: Paper[];
  alerts: { filename: string; content: string; date: string }[];
}

export function DashboardClient({
  totalPapers,
  totalTrials,
  totalFindings,
  newPapers,
  lastRun,
  trialsByStatus,
  papersByDimension,
  recentPapers,
}: DashboardProps) {
  const chartData = papersByDimension.map((d) => ({
    name: DIMENSION_META[d.dimension]?.label || d.dimension,
    papers: d.count,
    dimension: d.dimension,
  }));

  const totalTrialsAll =
    trialsByStatus.recruiting + trialsByStatus.active + trialsByStatus.completed;

  return (
    <div className="space-y-10 max-w-[1200px]">
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-headline font-bold text-[#003d1f] mb-1">
            Research Overview
          </h2>
          <div className="flex items-center gap-3">
            {lastRun && (
              <span className="px-2 py-0.5 bg-[#c8e6c9] text-[#2e6b4f] text-[10px] font-bold label-caps rounded">
                Updated{" "}
                {formatDistanceToNow(new Date(lastRun.completed_at), {
                  addSuffix: true,
                })}
              </span>
            )}
            <span className="text-[#44474e] text-xs font-medium">
              Domain: Primary Lymphedema (genetic / hereditary)
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          label="Total Papers"
          value={totalPapers}
          detail="+12% vs last mo."
          detailColor="text-green-600"
        />
        <MetricCard
          label="Clinical Trials"
          value={totalTrials}
          detail={`Active Phase II/III`}
          detailColor="text-[#2d6a50]"
        />
        <MetricCard
          label="Key Findings"
          value={totalFindings}
          detail="Validated results"
          detailColor="text-[#44474e]"
        />
        <MetricCard
          label="New Updates"
          value={newPapers}
          detail={newPapers > 0 ? "Requires review" : "All reviewed"}
          detailColor={newPapers > 0 ? "text-[#ba1a1a]" : "text-green-600"}
        />
      </div>

      {/* Dimensions + Pipeline */}
      <div className="grid grid-cols-12 gap-8">
        {/* Dimension Cards */}
        <div className="col-span-8 grid grid-cols-2 gap-4">
          {papersByDimension.map((d) => {
            const meta = DIMENSION_META[d.dimension];
            const accent = DIM_ACCENT[d.dimension] || "#74777f";
            return (
              <Link
                key={d.dimension}
                href={`/papers?dimension=${d.dimension}`}
                className="card-hover group"
              >
                <div
                  className="relative p-5 bg-white ghost-border rounded-lg overflow-hidden transition-all hover:bg-[#f4f3f1]"
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-headline font-bold text-[#003d1f] text-sm">
                      {meta?.label}
                    </h3>
                    <span className="text-[10px] font-bold text-[#44474e]">
                      {d.count} PAPERS
                    </span>
                  </div>
                  {d.latestFinding && (
                    <p className="text-xs text-[#44474e] leading-relaxed mb-4 line-clamp-2">
                      {d.latestFinding.statement}
                    </p>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#c8e6c9] text-[#2e6b4f] font-semibold">
                    {d.trials} TRIALS
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pipeline */}
        <div className="col-span-4">
          <div className="p-6 bg-white ghost-border rounded-lg h-full">
            <h3 className="text-sm font-headline font-bold text-[#003d1f] mb-6 label-caps">
              Trial Pipeline Status
            </h3>
            {/* Donut */}
            <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
              <svg className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="80" cy="80" r="70" fill="transparent" stroke="#f4f3f1" strokeWidth="12" />
                <circle
                  cx="80" cy="80" r="70" fill="transparent"
                  stroke="#003d1f" strokeWidth="12"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * trialsByStatus.recruiting) / totalTrialsAll}
                />
                <circle
                  cx="80" cy="80" r="70" fill="transparent"
                  stroke="#2d6b50" strokeWidth="12"
                  strokeDasharray="440"
                  strokeDashoffset={440 - (440 * trialsByStatus.active) / totalTrialsAll}
                />
              </svg>
              <div className="absolute text-center">
                <span className="block text-2xl font-headline font-bold text-[#003d1f] leading-none">
                  {totalTrialsAll}
                </span>
                <span className="label-caps text-[9px] text-[#44474e]">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="space-y-4">
              <PipelineRow
                label="Recruiting"
                count={trialsByStatus.recruiting}
                total={totalTrialsAll}
                color="#003d1f"
              />
              <PipelineRow
                label="Active (not recruiting)"
                count={trialsByStatus.active}
                total={totalTrialsAll}
                color="#2d6b50"
              />
              <PipelineRow
                label="Completed"
                count={trialsByStatus.completed}
                total={totalTrialsAll}
                color="#2d6a50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Papers */}
      <div className="bg-white ghost-border rounded-lg overflow-hidden">
        <div
          className="px-6 py-4 flex justify-between items-center"
          style={{ borderBottom: "1px solid rgba(196,198,207,0.1)" }}
        >
          <h3 className="font-headline text-xl text-[#003d1f] font-bold">
            Recent Papers
          </h3>
          <Link
            href="/papers"
            className="label-caps text-xs font-bold text-[#2d6b50] hover:underline"
          >
            View All Research
          </Link>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f4f3f1]">
              <th className="px-6 py-3 label-caps text-[10px] font-bold text-[#44474e]">
                Relevance
              </th>
              <th className="px-6 py-3 label-caps text-[10px] font-bold text-[#44474e]">
                Title & Abstract
              </th>
              <th className="px-6 py-3 label-caps text-[10px] font-bold text-[#44474e]">
                Journal
              </th>
              <th className="px-6 py-3 label-caps text-[10px] font-bold text-[#44474e]">
                Date
              </th>
              <th className="px-6 py-3 label-caps text-[10px] font-bold text-[#44474e]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recentPapers.map((paper) => (
              <tr
                key={paper.id}
                className="hover:bg-[#f4f3f1]/50 transition-colors"
                style={{ borderBottom: "1px solid rgba(196,198,207,0.1)" }}
              >
                <td className="px-6 py-5">
                  {paper.scores ? (
                    <div className="flex flex-col gap-0.5">
                      {(["importance", "evidence_strength", "decision_usefulness"] as const).map((axis) => {
                        const val = (paper.scores as unknown as Record<string, number>)[axis];
                        const label = axis === "importance" ? "Imp" : axis === "evidence_strength" ? "Evi" : "Dec";
                        const color = val >= 7 ? "bg-green-500" : val >= 4 ? "bg-amber-500" : "bg-red-400";
                        return (
                          <div key={axis} className="flex items-center gap-1 text-[9px]">
                            <span className="w-[12px] text-right tabular-nums text-[#44474e]">{val}</span>
                            <div className="w-[28px] h-[3px] bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${color}`} style={{ width: `${val * 10}%` }} />
                            </div>
                            <span className="text-[#44474e] uppercase tracking-wider">{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                        paper.relevance_score >= 8
                          ? "bg-green-100 text-green-800"
                          : paper.relevance_score >= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {paper.relevance_score >= 8
                        ? "High"
                        : paper.relevance_score >= 5
                          ? "Medium"
                          : "Low"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-headline font-bold text-[#003d1f] mb-0.5 line-clamp-1">
                    {paper.title}
                  </p>
                  <p className="text-[11px] text-[#44474e] line-clamp-1">
                    {paper.abstract?.slice(0, 120)}...
                  </p>
                </td>
                <td className="px-6 py-5 text-xs text-[#44474e] font-headline font-semibold">
                  {paper.journal}
                </td>
                <td className="px-6 py-5 text-xs text-[#44474e]">
                  {paper.published_date}
                </td>
                <td className="px-6 py-5">
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 hover:bg-[#e9e8e5] rounded text-[#44474e] inline-block"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20 }}
                      >
                        bookmark
                      </span>
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  detailColor,
}: {
  label: string;
  value: number;
  detail: string;
  detailColor: string;
}) {
  return (
    <div className="p-6 bg-white ghost-border rounded-lg">
      <p className="label-caps text-[10px] font-bold text-[#44474e] mb-4">
        {label}
      </p>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-headline font-bold text-[#003d1f]">
          {value}
        </span>
        <span className={`text-xs font-medium ${detailColor}`}>{detail}</span>
      </div>
    </div>
  );
}

function PipelineRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-[#44474e]">{label}</span>
        <span className="font-headline font-bold text-[#003d1f]">{pct}%</span>
      </div>
      <div className="h-1.5 w-full bg-[#f4f3f1] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
