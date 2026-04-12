import Link from "next/link";
import { getDigests } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default function DigestsPage() {
  const digests = getDigests();

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-4xl font-headline font-bold text-[#002046] mb-1">
          Weekly Digests
        </h1>
        <p className="text-sm text-[#44474e]">
          Weekly research summaries and highlights
        </p>
      </div>

      {digests.length === 0 ? (
        <p className="text-sm text-[#44474e]">No digests yet.</p>
      ) : (
        <div className="space-y-3">
          {digests.map((digest) => {
            const lines = digest.content.split("\n").filter((l) => l.trim());
            const highlights = lines
              .filter(
                (l) =>
                  l.startsWith("1.") ||
                  l.startsWith("2.") ||
                  l.startsWith("3.")
              )
              .slice(0, 3);

            return (
              <Link key={digest.slug} href={`/digests/${digest.slug}`}>
                <div className="card-hover p-5 bg-white ghost-border rounded-lg transition-all hover:bg-[#f4f3f1] mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="material-symbols-outlined text-[#465f88]"
                        style={{ fontSize: 20 }}
                      >
                        article
                      </span>
                      <h3 className="font-headline font-bold text-[#002046] text-sm">
                        {digest.title}
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 bg-[#c0d9fe] text-[#475f7f] text-[10px] font-bold label-caps rounded">
                      {formatDistanceToNow(new Date(digest.lastModified), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {highlights.length > 0 && (
                    <ul className="text-xs text-[#44474e] space-y-1 ml-8">
                      {highlights.map((h, i) => (
                        <li key={i} className="line-clamp-1 leading-relaxed">
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
