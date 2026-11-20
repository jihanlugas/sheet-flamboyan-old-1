import Link from "next/link";
import { StatusBadge } from "@/src/components/ui";

export function Header() {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-border bg-surface px-4 sm:px-8">
      <Link
        aria-label="Flamboyan Badminton, ke dashboard"
        className="font-bold tracking-tight lg:hidden"
        href="/dashboard"
      >
        Flamboyan
      </Link>
      <p className="hidden text-sm font-medium text-muted lg:block">
        Administrasi klub badminton
      </p>
      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-muted sm:inline">Akun demo</span>
        <StatusBadge>Belum terhubung</StatusBadge>
      </div>
    </header>
  );
}
