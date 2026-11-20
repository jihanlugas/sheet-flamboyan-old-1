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
  return samplePlayers.map((player) => ({ playerId: player.id }));
}

type PlayerDetailPageProps = {
  params: Promise<{ playerId: string }>;
};

export default function PlayerDetailPage({ params }: PlayerDetailPageProps) {
  return (
    <Suspense fallback={<LoadingState>Memuat profil pemain contoh...</LoadingState>}>
      <PlayerDetailContent params={params} />
    </Suspense>
  );
}

async function PlayerDetailContent({
  params,
}: PlayerDetailPageProps) {
  const { playerId } = await params;
  const player = samplePlayers.find((item) => item.id === playerId);

  if (!player) {
    return (
      <div className="space-y-7">
        <PageHeader
          breadcrumbs={[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/players", label: "Pemain" },
            { label: "Profil" },
          ]}
          description="Ringkasan profil pemain."
          title="Profil pemain"
        />
        <EmptyState>Pemain contoh ini tidak ditemukan.</EmptyState>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/players", label: "Pemain" },
          { label: player.name },
        ]}
        description="Ringkasan profil dan aktivitas pemain contoh."
        title={player.name}
      />

      <section aria-label="Informasi pemain" className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Status</p>
          <div className="mt-3">
            <StatusBadge tone={player.status === "Aktif" ? "success" : "neutral"}>
              {player.status}
            </StatusBadge>
          </div>
        </Card>
        <Card>
          <p className="text-sm text-muted">Jumlah sesi</p>
          <p className="mt-3 text-2xl font-bold">{player.sessions}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Saldo contoh</p>
          <p className="mt-3 text-2xl font-bold">{player.balance}</p>
        </Card>
      </section>

      <Card>
        <h2 className="mb-5">Riwayat sesi contoh</h2>
        <TableRegion label={`Riwayat sesi ${player.name}`}>
          <Table>
            <caption className="sr-only">Riwayat sesi contoh</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Lokasi</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Detail</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleSessions.slice(0, 2).map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.venue}</TableCell>
                  <TableCell>
                    <StatusBadge tone="success">{session.status}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-semibold text-primary hover:underline"
                      href={`/sessions/${session.id}`}
                    >
                      Lihat sesi
                    </Link>
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
