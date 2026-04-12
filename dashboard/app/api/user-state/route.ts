import { NextResponse } from "next/server";
import { getUserState, writeUserState } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = getUserState();
  return NextResponse.json(state);
}

export async function POST(request: Request) {
  const body = await request.json();
  const state = getUserState();

  if (body.type === "update_paper") {
    const { paperId, ...update } = body;
    state.papers[paperId] = {
      ...state.papers[paperId],
      ...update,
      read_at: update.status ? new Date().toISOString() : state.papers[paperId]?.read_at,
    };
  } else if (body.type === "update_trial") {
    const { trialId, ...update } = body;
    state.trials[trialId] = {
      ...state.trials[trialId],
      ...update,
    };
  } else if (body.type === "update_visit") {
    state.last_visit = new Date().toISOString();
  } else if (body.type === "bulk_papers") {
    for (const paperId of body.paperIds) {
      state.papers[paperId] = {
        ...state.papers[paperId],
        ...body.update,
        read_at: new Date().toISOString(),
      };
    }
  }

  writeUserState(state);
  return NextResponse.json({ ok: true });
}
