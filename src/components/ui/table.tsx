import type { ComponentProps } from "react";

type TableRegionProps = Omit<ComponentProps<"div">, "aria-label" | "role" | "tabIndex"> & {
  label: string;
};

export function TableRegion({
  children,
  className = "",
  label,
  ...props
}: TableRegionProps) {
  return (
    <div
      aria-label={label}
      className={`overflow-x-auto rounded-lg border border-border ${className}`}
      role="region"
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
}

type TableProps = ComponentProps<"table">;

export function Table({ className = "", ...props }: TableProps) {
  return (
    <table
      className={`w-full min-w-[42rem] border-collapse text-left text-sm ${className}`}
      {...props}
    />
  );
}

type TableSectionProps = ComponentProps<"thead">;

export function TableHead({ className = "", ...props }: TableSectionProps) {
  return <thead className={`bg-background text-muted ${className}`} {...props} />;
}

type TableBodyProps = ComponentProps<"tbody">;

export function TableBody({ className = "", ...props }: TableBodyProps) {
  return <tbody className={`divide-y divide-border ${className}`} {...props} />;
}

type TableRowProps = ComponentProps<"tr">;

export function TableRow({ className = "", ...props }: TableRowProps) {
  return <tr className={`align-top ${className}`} {...props} />;
}

type TableHeaderCellProps = ComponentProps<"th">;

export function TableHeaderCell({ className = "", ...props }: TableHeaderCellProps) {
  return (
    <th
      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${className}`}
      scope="col"
      {...props}
    />
  );
}

type TableCellProps = ComponentProps<"td">;

export function TableCell({ className = "", ...props }: TableCellProps) {
  return <td className={`px-4 py-3 text-foreground ${className}`} {...props} />;
}
