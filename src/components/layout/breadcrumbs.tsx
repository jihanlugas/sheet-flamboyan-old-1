import Link from "next/link";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isCurrent ? (
                <Link className="underline-offset-4 hover:text-foreground hover:underline" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isCurrent ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
