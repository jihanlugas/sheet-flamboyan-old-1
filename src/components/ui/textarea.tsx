import type { ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`min-h-28 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/80 aria-invalid:border-danger aria-invalid:ring-2 aria-invalid:ring-danger/20 disabled:cursor-not-allowed disabled:bg-background disabled:opacity-70 ${className}`}
      {...props}
    />
  );
}
