"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function KBRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-zinc prose-sm max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 prose-table:text-sm">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
