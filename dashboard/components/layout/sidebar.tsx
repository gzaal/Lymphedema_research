"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    items: [
      { href: "/", label: "Overview", icon: "dashboard" },
    ],
  },
  {
    label: "Research",
    items: [
      { href: "/papers", label: "Papers", icon: "description" },
      { href: "/trials", label: "Clinical Trials", icon: "science" },
    ],
  },
  {
    label: "Knowledge",
    items: [
      { href: "/knowledge-base", label: "Knowledge Base", icon: "menu_book" },
      { href: "/digests", label: "Digests", icon: "article" },
    ],
  },
];

export function Sidebar({ newPaperCount }: { newPaperCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 h-screen w-[220px] flex flex-col bg-[#f4f3f1] z-50"
      style={{ borderRight: "1px solid rgba(196,198,207,0.15)" }}
    >
      {/* Brand */}
      <div className="p-6">
        <h1 className="text-xl font-headline font-bold text-[#002046] tracking-tight">
          Lymphedema Research
        </h1>
        <p className="label-caps text-[10px] font-bold text-[#44474e] mt-1">
          Clinical Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-7 mt-2">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="px-4 mb-2.5 label-caps text-[10px] font-bold text-[#44474e]">
                {section.label}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map(({ href, label, icon }) => {
                const isActive =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 rounded-full text-sm font-headline font-semibold transition-all duration-150",
                        isActive
                          ? "bg-[#002046] text-white"
                          : "text-[#486080] hover:bg-[#e9e8e5]"
                      )}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20 }}
                      >
                        {icon}
                      </span>
                      <span>{label}</span>
                      {label === "Papers" && newPaperCount > 0 && (
                        <span
                          className={cn(
                            "ml-auto min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold leading-none",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-[#c0d9fe] text-[#475f7f]"
                          )}
                        >
                          {newPaperCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: "1px solid rgba(196,198,207,0.1)" }}>
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-3 px-4 py-1 text-[#74777f] text-xs font-headline font-medium">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>settings</span>
            Settings
          </span>
        </div>
      </div>
    </aside>
  );
}
