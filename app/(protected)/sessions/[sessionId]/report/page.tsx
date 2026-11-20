import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/src/components/layout/page-header";
import { Card, EmptyState, LoadingState, StatusBadge } from "@/src/components/ui";
import { sampleSessions } from "@/src/mocks/foundation-data";

export function generateStaticParams() {
  return sampleSessions.map((session) => ({ sessionId: session.id }));
}

type SessionReportPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default function SessionReportPage({ params }: SessionReportPageProps) {
  return (
    <Suspense fallback={<LoadingState>Memuat laporan sesi contoh...</LoadingState>}>
      <SessionReportContent params={params} />
    </Suspense>
  );
}

async function SessionReportContent({
  params,
}: SessionReportPageProps) {
  const { sessionId } = await params;
  const session = sampleSessions.find((item) => item.id === sessionId);

  if (!session) {
    return (
      <div className="space-y-7">
        <PageHeader
          breadcrumbs={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/sessions", label: "Sesi" },
            { label: "Laporan" },
          ]}
          description="Pratinjau laporan sesi."
          title="Laporan sesi"
        />
        <EmptyState>Laporan sesi contoh ini tidak ditemukan.</EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/sessions", label: "Sesi" },
          { href: `/sessions/${session.id}`, label: session.date },
          { label: "Laporan" },
        ]}
        description="Pratinjau lokal. Tidak ada pesan yang dikirim."
        title="Laporan sesi"
      />

      <Card className="max-w-3xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">Flamboyan Badminton</p>
            <h2 className="mt-2">Ringkasan latihan</h2>
          </div>
          <StatusBadge>Pratinjau saja</StatusBadge>
        </div>
        <dl className="mt-7 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted">Tanggal</dt>
            <dd className="mt-1 font-semibold">{session.date}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Lokasi</dt>
            <dd className="mt-1 font-semibold">{session.venue}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Pemain hadir</dt>
            <dd className="mt-1 font-semibold">{session.participants} pemain contoh</dd>
          </div>
          <div>
            <dt className="text-sm text-muted">Status</dt>
            <dd className="mt-1 font-semibold">{session.status}</dd>
          </div>
        </dl>
        <p className="mt-5 leading-6 text-muted">
          Teks laporan dan fitur berbagi akan disiapkan pada tahap berikutnya.
        </p>
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-background"
          href={`/sessions/${session.id}`}
        >
          Kembali ke detail sesi
        </Link>
      </Card>
    </div>
  );
}
