import type { ReactNode } from "react";

const tones = {
  danger: "border-danger/25 bg-danger/10 text-danger",
  neutral: "border-border bg-background text-foreground",
  success: "border-primary/25 bg-accent text-primary",
  warning: "border-warning/25 bg-warning/10 text-warning",
} as const;

type StatusBadgeProps = {
  children: ReactNode;
  tone?: keyof typeof tones;
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
