import fs from "fs";
import path from "path";
import type {
  Paper,
  Trial,
  Finding,
  RunLogEntry,
  UserState,
  PaperWithUserState,
  TrialWithUserState,
  Dimension,
} from "./types";

const PROJECT_ROOT = path.resolve(process.cwd(), "..");
const DATA_DIR = path.join(PROJECT_ROOT, "data");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "output");

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

export function getPapers(): Paper[] {
  const data = readJSON<{ papers: Paper[] }>(
    path.join(DATA_DIR, "papers.json"),
    { papers: [] }
  );
  return data.papers;
}

export function getTrials(): Trial[] {
  const data = readJSON<{ trials: Trial[] }>(
    path.join(DATA_DIR, "trials.json"),
    { trials: [] }
  );
  return data.trials;
}

export function getFindings(): Finding[] {
  const data = readJSON<{ findings: Finding[] }>(
    path.join(DATA_DIR, "findings.json"),
    { findings: [] }
  );
  return data.findings;
}

export function getRunLog(): RunLogEntry[] {
  const data = readJSON<{ runs: RunLogEntry[] }>(
    path.join(DATA_DIR, "run-log.json"),
    { runs: [] }
  );
  return data.runs;
}

export function getUserState(): UserState {
  return readJSON<UserState>(path.join(DATA_DIR, "user-state.json"), {
    papers: {},
    trials: {},
    last_visit: new Date().toISOString(),
  });
}

export function writeUserState(state: UserState): void {
  const filePath = path.join(DATA_DIR, "user-state.json");
  const tmpPath = filePath + ".tmp";
  fs.writeFileSync(tmpPath, JSON.stringify(state, null, 2));
  fs.renameSync(tmpPath, filePath);
}

export function getPapersWithUserState(): PaperWithUserState[] {
  const papers = getPapers();
  const userState = getUserState();
  const lastVisit = userState.last_visit;

  return papers.map((paper) => {
    const us = userState.papers[paper.id];
    return {
      ...paper,
      userStatus: us?.status,
      userTags: us?.tags || [],
      userNote: us?.note || "",
      isNew: paper.added_date > lastVisit.slice(0, 10),
    };
  });
}

export function getTrialsWithUserState(): TrialWithUserState[] {
  const trials = getTrials();
  const userState = getUserState();

  return trials.map((trial) => {
    const us = userState.trials[trial.nct_id];
    return {
      ...trial,
      userStarred: us?.starred || false,
      userNote: us?.note || "",
    };
  });
}

export function getKnowledgeBaseFiles(): {
  slug: string;
  title: string;
  content: string;
  lastModified: string;
}[] {
  const kbDir = path.join(OUTPUT_DIR, "knowledge-base");
  try {
    const files = fs.readdirSync(kbDir).filter((f) => f.endsWith(".md"));
    return files.sort().map((filename) => {
      const filePath = path.join(kbDir, filename);
      const content = fs.readFileSync(filePath, "utf-8");
      const stat = fs.statSync(filePath);
      const firstLine = content.split("\n").find((l) => l.startsWith("# "));
      const title = firstLine?.replace(/^#\s+/, "") || filename;
      return {
        slug: filename.replace(".md", ""),
        title,
        content,
        lastModified: stat.mtime.toISOString(),
      };
    });
  } catch {
    return [];
  }
}

export function getDigests(): {
  slug: string;
  title: string;
  content: string;
  lastModified: string;
}[] {
  const digestDir = path.join(OUTPUT_DIR, "digests");
  try {
    const files = fs.readdirSync(digestDir).filter((f) => f.endsWith(".md"));
    return files
      .sort()
      .reverse()
      .map((filename) => {
        const filePath = path.join(digestDir, filename);
        const content = fs.readFileSync(filePath, "utf-8");
        const stat = fs.statSync(filePath);
        const firstLine = content.split("\n").find((l) => l.startsWith("# "));
        const title = firstLine?.replace(/^#\s+/, "") || filename;
        return {
          slug: filename.replace(".md", ""),
          title,
          content,
          lastModified: stat.mtime.toISOString(),
        };
      });
  } catch {
    return [];
  }
}

export function getAlerts(): {
  filename: string;
  content: string;
  date: string;
}[] {
  const alertDir = path.join(OUTPUT_DIR, "alerts");
  try {
    const files = fs.readdirSync(alertDir).filter((f) => f.endsWith(".md"));
    return files
      .sort()
      .reverse()
      .map((filename) => {
        const filePath = path.join(alertDir, filename);
        const content = fs.readFileSync(filePath, "utf-8");
        const dateMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
        return {
          filename,
          content,
          date: dateMatch?.[1] || "",
        };
      });
  } catch {
    return [];
  }
}

export function getDimensionStats(): Record<
  Dimension,
  { papers: number; trials: number; latestFinding: Finding | null }
> {
  const papers = getPapers();
  const trials = getTrials();
  const findings = getFindings();

  const dims: Dimension[] = [
    "pharmacological",
    "dietary",
    "genetics",
    "clinical_trials",
    "management",
    "community",
  ];

  const stats = {} as Record<
    Dimension,
    { papers: number; trials: number; latestFinding: Finding | null }
  >;

  for (const dim of dims) {
    const dimFindings = findings.filter((f) => f.dimension === dim);
    dimFindings.sort(
      (a, b) =>
        new Date(b.last_updated).getTime() -
        new Date(a.last_updated).getTime()
    );
    stats[dim] = {
      papers: papers.filter((p) => p.dimensions.includes(dim)).length,
      trials: trials.filter((t) => t.dimensions.includes(dim)).length,
      latestFinding: dimFindings[0] || null,
    };
  }

  return stats;
}
