import Link from "next/link";
import { PageHeader } from "@/src/components/layout/page-header";
import {
  Card,
  EmptyState,
  FormField,
  Input,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRegion,
  TableRow,
} from "@/src/components/ui";
import { samplePlayers } from "@/src/mocks/foundation-data";

export default function PlayersPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }, { label: "Pemain" }]}
        description="Daftar pemain dan ringkasan saldo contoh."
        title="Pemain"
      />

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Daftar pemain</h2>
            <p className="mt-1 text-sm text-muted">Data ini hanya untuk pratinjau.</p>
          </div>
          <StatusBadge>3 pemain contoh</StatusBadge>
        </div>

        <div className="mb-5 max-w-sm">
          <FormField
            hint="Pencarian akan tersedia setelah data pemain terhubung."
            id="player-search"
            label="Cari pemain"
          >
            <Input disabled id="player-search" placeholder="Nama pemain" type="search" />
          </FormField>
        </div>

        {samplePlayers.length === 0 ? (
          <EmptyState>Tambahkan pemain saat fitur penyimpanan tersedia.</EmptyState>
        ) : (
          <TableRegion label="Daftar pemain contoh">
            <Table>
              <caption className="sr-only">Daftar pemain contoh</caption>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nama</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Jumlah sesi</TableHeaderCell>
                  <TableHeaderCell>Saldo</TableHeaderCell>
                  <TableHeaderCell>Aksi</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {samplePlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-semibold">{player.name}</TableCell>
                    <TableCell>
                      <StatusBadge tone={player.status === "Aktif" ? "success" : "neutral"}>
                        {player.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{player.sessions}</TableCell>
                    <TableCell>{player.balance}</TableCell>
                    <TableCell>
                      <Link
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                        href={`/players/${player.id}`}
                      >
                        Lihat profil
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableRegion>
        )}
      </Card>
    </div>
  );
}
