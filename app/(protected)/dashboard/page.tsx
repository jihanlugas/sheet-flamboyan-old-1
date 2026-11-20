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

const summary = [
  { label: "Pemain aktif", value: "2", note: "dari 3 pemain contoh" },
  { label: "Sesi bulan ini", value: "3", note: "Data contoh" },
  { label: "Iuran tercatat", value: "Rp 90.000", note: "Total transaksi contoh" },
  { label: "Kas PB", value: "Rp 680.000", note: "Saldo contoh" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        actions={
          <Link
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            href="/sessions/new"
          >
            Buat sesi
          </Link>
        }
        breadcrumbs={[{ label: "Dashboard" }]}
        description="Ringkasan aktivitas klub dan catatan terbaru."
        title="Dashboard"
      />

      <section aria-label="Ringkasan klub" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card className="p-5" key={item.label}>
            <p className="text-sm font-medium text-muted">{item.label}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight">{item.value}</p>
            <p className="mt-2 text-xs text-muted">{item.note}</p>
          </Card>
        ))}
      </section>

      <Card>
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2>Sesi terbaru</h2>
            <p className="mt-1 text-sm text-muted">Aktivitas sesi sebagai contoh tampilan.</p>
          </div>
          <StatusBadge tone="success">3 sesi contoh</StatusBadge>
        </div>
        <TableRegion label="Daftar sesi terbaru">
          <Table>
            <caption className="sr-only">Sesi terbaru</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Lokasi</TableHeaderCell>
                <TableHeaderCell>Pemain</TableHeaderCell>
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
                      className="font-semibold text-primary underline-offset-4 hover:underline"
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
