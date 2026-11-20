import type { ComponentProps } from "react";

type SelectProps = ComponentProps<"select">;

export function Select({ className = "", ...props }: SelectProps) {
  return (
    <select
      className={`min-h-11 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}
