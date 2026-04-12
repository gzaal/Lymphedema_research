import { getDigests } from "@/lib/data";
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
  const digests = getDigests();
  const digest = digests.find((d) => d.slug === slug);

  if (!digest) notFound();

  return (
    <div className="max-w-[900px] space-y-6">
      <Link
        href="/digests"
        className="flex items-center gap-1.5 text-sm text-[#465f88] hover:text-[#002046] font-headline font-semibold transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
          arrow_back
        </span>
        All Digests
      </Link>

      <div className="bg-white ghost-border rounded-lg p-8 md:p-10">
        <KBRenderer content={digest.content} />
      </div>
    </div>
  );
}
