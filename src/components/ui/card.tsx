import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div">;

export function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 ${className}`}
      {...props}
    />
  );
}
