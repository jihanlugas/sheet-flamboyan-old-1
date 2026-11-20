import type { ComponentProps } from "react";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-surface text-foreground hover:bg-accent",
  quiet: "text-muted hover:bg-accent hover:text-foreground",
} as const;

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
};

export function Button({
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${className}`}
      type={type}
      {...props}
    />
  );
}
