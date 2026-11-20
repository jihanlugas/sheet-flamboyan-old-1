import type { ReactNode } from "react";

type FeedbackPanelProps = {
  children: ReactNode;
  title: string;
  role?: "alert" | "status";
};

function FeedbackPanel({ children, role = "status", title }: FeedbackPanelProps) {
  return (
    <div
      className="rounded-xl border border-border bg-surface px-5 py-6 text-center"
      role={role}
    >
      <h2 className="text-base">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{children}</p>
    </div>
  );
}

export function LoadingState({ children = "Memuat data contoh..." }: { children?: ReactNode }) {
  return (
    <div aria-busy="true">
      <FeedbackPanel title="Sedang memuat">{children}</FeedbackPanel>
    </div>
  );
}

export function ErrorState({ children = "Silakan coba lagi nanti." }: { children?: ReactNode }) {
  return <FeedbackPanel role="alert" title="Data tidak dapat ditampilkan">{children}</FeedbackPanel>;
}

export function EmptyState({ children = "Belum ada data untuk ditampilkan." }: { children?: ReactNode }) {
  return <FeedbackPanel title="Belum ada data">{children}</FeedbackPanel>;
}
