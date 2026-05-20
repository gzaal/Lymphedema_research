import { getDigests, getAlerts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KBRenderer } from "../../knowledge-base/[slug]/kb-renderer";

export const dynamic = "force-dynamic";

export default async function DigestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check if this is an alert (slug like "alert-2026-04-11")
  const alertMatch = slug.match(/^alert-(\d{4}-\d{2}-\d{2})$/);
  if (alertMatch) {
    const alerts = getAlerts();
    const alert = alerts.find((a) => a.date === alertMatch[1]);
    if (!alert) notFound();

    return (
      <div className="max-w-[900px] space-y-6">
        <Link
          href="/digests"
          className="flex items-center gap-1.5 text-sm text-[#2d6b50] hover:text-[#003d1f] font-headline font-semibold transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_back
          </span>
          All Digests & Alerts
        </Link>

        <div className="bg-white ghost-border rounded-lg p-8 md:p-10">
          <KBRenderer content={alert.content} />
        </div>
      </div>
    );
  }

  const digests = getDigests();
  const digest = digests.find((d) => d.slug === slug);

  if (!digest) notFound();

  return (
    <div className="max-w-[900px] space-y-6">
      <Link
        href="/digests"
        className="flex items-center gap-1.5 text-sm text-[#2d6b50] hover:text-[#003d1f] font-headline font-semibold transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          arrow_back
        </span>
        All Digests & Alerts
      </Link>

      <div className="bg-white ghost-border rounded-lg p-8 md:p-10">
        <KBRenderer content={digest.content} />
      </div>
    </div>
  );
}
