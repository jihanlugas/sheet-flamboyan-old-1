import Link from "next/link";
import { Suspense } from "react";
import { MainNavigation, MainNavigationFallback } from "./main-navigation";

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface px-5 py-6 lg:flex">
      <Link aria-label="Flamboyan Badminton, ke dashboard" className="flex items-center gap-3" href="/dashboard">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
          F
        </span>
        <span>
          <span className="block font-bold tracking-tight">Flamboyan</span>
          <span className="block text-xs text-muted">Administrasi badminton</span>
        </span>
      </Link>

      <div className="mt-10">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
          Menu utama
        </p>
        <Suspense fallback={<MainNavigationFallback />}>
          <MainNavigation />
        </Suspense>
      </div>

      <div className="mt-auto rounded-xl bg-background p-4">
        <p className="text-sm font-semibold">Ruang kerja klub</p>
        <p className="mt-1 text-xs leading-5 text-muted">
          Tampilan awal untuk pencatatan sesi dan keuangan.
        </p>
      </div>
    </aside>
  );
}
