import type { ReactNode } from "react";
import { Breadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

type PageHeaderProps = {
  actions?: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  description: string;
  title: string;
};

export function PageHeader({
  actions,
  breadcrumbs,
  description,
  title,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Breadcrumbs items={breadcrumbs} />
        <h1>{title}</h1>
        <p className="mt-2 max-w-2xl leading-6 text-muted">{description}</p>
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
