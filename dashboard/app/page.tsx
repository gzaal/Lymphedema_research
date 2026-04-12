import {
  getPapers,
  getTrials,
  getFindings,
  getRunLog,
  getUserState,
  getDimensionStats,
  getAlerts,
} from "@/lib/data";
import { DashboardClient } from "./dashboard-client";
import type { Dimension } from "@/lib/types";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const papers = getPapers();
  const trials = getTrials();
  const findings = getFindings();
  const runLog = getRunLog();
  const userState = getUserState();
  const dimStats = getDimensionStats();
  const alerts = getAlerts();

  const lastVisit = userState.last_visit.slice(0, 10);
  const newPapers = papers.filter((p) => p.added_date > lastVisit).length;

  const lastRun = runLog.length > 0 ? runLog[runLog.length - 1] : null;

  const trialsByStatus = {
    recruiting: trials.filter((t) => t.status === "RECRUITING").length,
    active: trials.filter((t) => t.status === "ACTIVE_NOT_RECRUITING").length,
    completed: trials.filter((t) => t.status === "COMPLETED").length,
  };

  const papersByDimension = (
    [
      "pharmacological",
      "dietary",
      "genetics",
      "clinical_trials",
      "management",
      "community",
    ] as Dimension[]
  ).map((dim) => ({
    dimension: dim,
    count: dimStats[dim]?.papers || 0,
    trials: dimStats[dim]?.trials || 0,
    latestFinding: dimStats[dim]?.latestFinding,
  }));

  const recentPapers = [...papers]
    .sort((a, b) => b.added_date.localeCompare(a.added_date))
    .slice(0, 8);

  return (
    <DashboardClient
      totalPapers={papers.length}
      totalTrials={trials.length}
      totalFindings={findings.length}
      newPapers={newPapers}
      lastRun={lastRun}
      trialsByStatus={trialsByStatus}
      papersByDimension={papersByDimension}
      recentPapers={recentPapers}
      alerts={alerts}
    />
  );
}
