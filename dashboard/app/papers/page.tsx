import { getPapersWithUserState } from "@/lib/data";
import { PapersClient } from "./papers-client";

export const dynamic = "force-dynamic";

export default function PapersPage() {
  const papers = getPapersWithUserState();

  return <PapersClient papers={papers} />;
}
