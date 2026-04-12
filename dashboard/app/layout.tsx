import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lymphedema Research Intelligence",
  description: "Clinical intelligence dashboard for lymphedema research",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#faf9f6] text-[#1a1c1a] antialiased">
        <Sidebar newPaperCount={0} />
        <main className="ml-[220px] min-h-screen pt-6 px-10 pb-12">
          {children}
        </main>
      </body>
    </html>
  );
}
