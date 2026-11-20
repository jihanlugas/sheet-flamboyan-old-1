import Link from "next/link";
import { PageHeader } from "@/src/components/layout/page-header";
import {
  Card,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRegion,
  TableRow,
} from "@/src/components/ui";
import { sampleSessions } from "@/src/mocks/foundation-data";

export default function SessionsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        actions={
          <Link
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            href="/sessions/new"
          >
            Buat sesi
          </Link>
        }
        breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }, { label: "Sesi" }]}
        description="Jadwal latihan dan catatan kehadiran klub."
        title="Sesi"
      />

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Riwayat sesi</h2>
            <p className="mt-1 text-sm text-muted">Seluruh baris berikut adalah data contoh.</p>
          </div>
          <StatusBadge>3 sesi contoh</StatusBadge>
        </div>
        <TableRegion label="Daftar sesi contoh">
          <Table>
            <caption className="sr-only">Daftar sesi contoh</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Lokasi</TableHeaderCell>
                <TableHeaderCell>Peserta</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Aksi</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.venue}</TableCell>
                  <TableCell>{session.participants}</TableCell>
                  <TableCell>
                    <StatusBadge tone={session.status === "Selesai" ? "success" : "warning"}>
                      {session.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-semibold text-primary hover:underline"
                      href={`/sessions/${session.id}`}
                    >
                      Buka detail
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
