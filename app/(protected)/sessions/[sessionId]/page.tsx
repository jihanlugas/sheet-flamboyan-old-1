import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/src/components/layout/page-header";
import {
  Card,
  EmptyState,
  LoadingState,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRegion,
  TableRow,
} from "@/src/components/ui";
import { samplePlayers, sampleSessions } from "@/src/mocks/foundation-data";

export function generateStaticParams() {
  return sampleSessions.map((session) => ({ sessionId: session.id }));
}

type SessionDetailPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default function SessionDetailPage({ params }: SessionDetailPageProps) {
  return (
    <Suspense fallback={<LoadingState>Memuat detail sesi contoh...</LoadingState>}>
      <SessionDetailContent params={params} />
    </Suspense>
  );
}

async function SessionDetailContent({
  params,
}: SessionDetailPageProps) {
  const { sessionId } = await params;
  const session = sampleSessions.find((item) => item.id === sessionId);

  if (!session) {
    return (
      <div className="space-y-7">
        <PageHeader
          breadcrumbs={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/sessions", label: "Sesi" },
            { label: "Detail" },
          ]}
          description="Ringkasan sesi contoh."
          title="Detail sesi"
        />
        <EmptyState>Sesi contoh ini tidak ditemukan.</EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        actions={
          <Link
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold hover:bg-background"
            href={`/sessions/${session.id}/report`}
          >
            Pratinjau laporan
          </Link>
        }
        breadcrumbs={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/sessions", label: "Sesi" },
          { label: session.date },
        ]}
        description={`Detail latihan di ${session.venue}. Semua informasi merupakan contoh.`}
        title={`Sesi ${session.date}`}
      />

      <section aria-label="Ringkasan sesi" className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Lokasi</p>
          <p className="mt-3 font-semibold">{session.venue}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Jumlah pemain</p>
          <p className="mt-3 text-2xl font-bold">{session.participants}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Status</p>
          <div className="mt-3">
            <StatusBadge tone="success">{session.status}</StatusBadge>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2>Peserta contoh</h2>
            <p className="mt-1 text-sm text-muted">Daftar ini belum tersimpan.</p>
          </div>
          <StatusBadge>{samplePlayers.length} pemain contoh</StatusBadge>
        </div>
        <TableRegion label="Peserta sesi contoh">
          <Table>
            <caption className="sr-only">Peserta sesi contoh</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nama pemain</TableHeaderCell>
                <TableHeaderCell>Games</TableHeaderCell>
                <TableHeaderCell>Biaya contoh</TableHeaderCell>
                <TableHeaderCell>Status pembayaran</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {samplePlayers.map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="font-semibold">{player.name}</TableCell>
                  <TableCell>{index + 2}</TableCell>
                  <TableCell>Rp 35.000</TableCell>
                  <TableCell>
                    <StatusBadge tone="neutral">Belum diproses</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRegion>
      </Card>
    </div>
  );
}
