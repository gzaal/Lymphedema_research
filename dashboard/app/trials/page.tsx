import { getTrialsWithUserState } from "@/lib/data";
import { TrialsClient } from "./trials-client";

export const dynamic = "force-dynamic";

export default function TrialsPage() {
  const trials = getTrialsWithUserState();

  return <TrialsClient trials={trials} />;
}
