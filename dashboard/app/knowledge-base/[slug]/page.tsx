import { getKnowledgeBaseFiles } from "@/lib/data";
import { notFound } from "next/navigation";
import { KBRenderer } from "./kb-renderer";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function KBDocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const files = getKnowledgeBaseFiles();
  const file = files.find((f) => f.slug === slug);

  if (!file) notFound();

  const currentIndex = files.findIndex((f) => f.slug === slug);
  const prevFile = currentIndex > 0 ? files[currentIndex - 1] : null;
  const nextFile =
    currentIndex < files.length - 1 ? files[currentIndex + 1] : null;

  return (
    <div className="max-w-[900px] space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/knowledge-base"
          className="flex items-center gap-1.5 text-sm text-[#465f88] hover:text-[#002046] font-headline font-semibold transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            arrow_back
          </span>
          Knowledge Base
        </Link>
        <span className="px-2 py-0.5 bg-[#c0d9fe] text-[#475f7f] text-[10px] font-bold label-caps rounded">
          Updated{" "}
          {formatDistanceToNow(new Date(file.lastModified), {
            addSuffix: true,
          })}
        </span>
      </div>

      {/* Article */}
      <div className="bg-white ghost-border rounded-lg p-8 md:p-10">
        <KBRenderer content={file.content} />
      </div>

      {/* Navigation between docs */}
      <div className="flex justify-between pt-4" style={{ borderTop: "1px solid rgba(196,198,207,0.1)" }}>
        {prevFile ? (
          <Link
            href={`/knowledge-base/${prevFile.slug}`}
            className="text-sm text-[#465f88] hover:text-[#002046] font-headline font-semibold transition-colors"
          >
            ← {prevFile.title}
          </Link>
        ) : (
          <span />
        )}
        {nextFile && (
          <Link
            href={`/knowledge-base/${nextFile.slug}`}
            className="text-sm text-[#465f88] hover:text-[#002046] font-headline font-semibold transition-colors"
          >
            {nextFile.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
