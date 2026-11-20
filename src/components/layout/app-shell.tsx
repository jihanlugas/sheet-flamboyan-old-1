import type { ReactNode } from "react";
import { Suspense } from "react";
import { Header } from "./header";
import { MainNavigation, MainNavigationFallback } from "./main-navigation";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-64">
        <Header />
        <div className="border-b border-border bg-surface px-4 py-3 lg:hidden">
          <div className="overflow-x-auto">
            <Suspense fallback={<MainNavigationFallback variant="mobile" />}>
              <MainNavigation variant="mobile" />
            </Suspense>
          </div>
        </div>
        <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-8 sm:py-9">
          <div
            aria-label="Mode pratinjau. Data contoh, belum tersimpan."
            className="mb-7 flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-accent px-4 py-3 text-sm text-foreground"
            role="status"
          >
            <span className="font-semibold">Mode pratinjau</span>
            <span aria-hidden="true">·</span>
            <span>Data contoh, belum tersimpan.</span>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
