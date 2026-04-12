import Link from "next/link";
import { getKnowledgeBaseFiles } from "@/lib/data";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

const KB_ICONS: Record<string, string> = {
  "01": "medication",
  "02": "restaurant",
  "03": "genetics",
  "04": "science",
  "05": "monitor_heart",
  "06": "groups",
};

export default function KnowledgeBasePage() {
  const files = getKnowledgeBaseFiles();

  return (
    <div className="space-y-8 max-w-[1200px]">
      <div>
        <h1 className="text-4xl font-headline font-bold text-[#002046] mb-1">
          Knowledge Base
        </h1>
        <p className="text-sm text-[#44474e]">
          Living synthesis documents across 6 research dimensions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {files.map((file) => {
          const preview = file.content
            .split("\n")
            .filter((l) => l && !l.startsWith("#") && !l.startsWith("*Last") && !l.startsWith("---"))
            .slice(0, 3)
            .join(" ")
            .slice(0, 200);

          const prefix = file.slug.slice(0, 2);
          const icon = KB_ICONS[prefix] || "menu_book";

          return (
            <Link key={file.slug} href={`/knowledge-base/${file.slug}`}>
              <div className="card-hover h-full p-5 bg-white ghost-border rounded-lg relative overflow-hidden transition-all hover:bg-[#f4f3f1]">
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="material-symbols-outlined text-[#465f88] mt-0.5"
                    style={{ fontSize: 22 }}
                  >
                    {icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-headline font-bold text-[#002046] text-sm">
                      {file.title}
                    </h3>
                    <p className="text-[10px] text-[#44474e] mt-0.5">
                      Updated{" "}
                      {formatDistanceToNow(new Date(file.lastModified), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#44474e] leading-relaxed line-clamp-3">
                  {preview}...
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
