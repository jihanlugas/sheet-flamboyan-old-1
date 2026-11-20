"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/players", label: "Pemain" },
  { href: "/sessions", label: "Sesi" },
  { href: "/transactions", label: "Transaksi" },
  { href: "/pb-finance", label: "Keuangan PB" },
];

type MainNavigationProps = {
  variant?: "mobile" | "sidebar";
};

function NavigationLinks({
  currentPath,
  variant,
}: MainNavigationProps & { currentPath?: string }) {
  const activeClasses =
    variant === "mobile"
      ? "bg-primary text-primary-foreground"
      : "bg-accent text-primary";
  const itemClasses =
    variant === "mobile"
      ? "min-h-10 shrink-0 rounded-full px-4 py-2 text-sm"
      : "rounded-lg px-3 py-2.5 text-sm";

  return (
    <ul className={variant === "mobile" ? "flex min-w-max gap-2" : "space-y-1"}>
      {items.map((item) => {
        const isCurrent =
          currentPath === item.href || currentPath?.startsWith(`${item.href}/`);

        return (
          <li key={item.href}>
            <Link
              aria-current={isCurrent ? "page" : undefined}
              className={`flex items-center font-medium transition-colors ${
                isCurrent ? activeClasses : "text-muted hover:bg-accent hover:text-foreground"
              } ${itemClasses}`}
              href={item.href}
            >
              {item.label}
              {isCurrent && <span className="sr-only"> (halaman ini)</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MainNavigation({ variant = "sidebar" }: MainNavigationProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama">
      <NavigationLinks currentPath={pathname} variant={variant} />
    </nav>
  );
}

export function MainNavigationFallback({ variant = "sidebar" }: MainNavigationProps) {
  return (
    <nav aria-label="Navigasi utama">
      <NavigationLinks variant={variant} />
    </nav>
  );
}
