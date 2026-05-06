import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar, TopNav } from "@/components/nav";

export const metadata: Metadata = {
  title: "Тренажер знаний Юмейхо",
  description: "Личная библиотека практики Юмейхо и тренажер повторения",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-stone-50 text-stone-950">
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <TopNav />
            <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
