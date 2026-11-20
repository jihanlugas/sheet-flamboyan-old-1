import { PageHeader } from "@/src/components/layout/page-header";
import {
  Button,
  Card,
  FormField,
  Input,
  Select,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRegion,
  TableRow,
} from "@/src/components/ui";
import { sampleTransactions } from "@/src/mocks/foundation-data";

export default function TransactionsPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }, { label: "Transaksi" }]}
        description="Pratinjau pencatatan pembayaran pemain."
        title="Transaksi"
      />

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Transaksi terbaru</h2>
            <p className="mt-1 text-sm text-muted">
              Catatan pembayaran contoh, bukan data tersimpan.
            </p>
          </div>
          <StatusBadge>{sampleTransactions.length} transaksi contoh</StatusBadge>
        </div>
        <TableRegion label="Daftar transaksi contoh">
          <Table>
            <caption className="sr-only">Daftar transaksi contoh</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Pemain</TableHeaderCell>
                <TableHeaderCell>Jenis</TableHeaderCell>
                <TableHeaderCell>Jumlah</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-semibold">{transaction.player}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <StatusBadge tone="neutral">{transaction.status}</StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRegion>
      </Card>

      <Card className="max-w-3xl">
        <h2>Catat pembayaran</h2>
        <p className="mt-1 text-sm text-muted">Formulir nonaktif sampai penyimpanan tersedia.</p>
        <fieldset className="mt-5 grid gap-5 sm:grid-cols-2" disabled>
          <legend className="sr-only">Form pembayaran contoh</legend>
          <FormField id="payment-player" label="Pemain" required>
            <Select defaultValue="" id="payment-player" required>
              <option disabled value="">
                Pilih pemain
              </option>
              <option value="player-001">Andi Pratama</option>
            </Select>
          </FormField>
          <FormField id="payment-amount" label="Jumlah" required>
            <Input id="payment-amount" min="0" placeholder="0" required type="number" />
          </FormField>
          <FormField id="payment-date" label="Tanggal pembayaran">
            <Input id="payment-date" type="date" />
          </FormField>
          <FormField id="payment-method" label="Metode">
            <Select defaultValue="cash" id="payment-method">
              <option value="cash">Tunai</option>
              <option value="transfer">Transfer</option>
            </Select>
          </FormField>
        </fieldset>
        <Button className="mt-5" disabled>
          Simpan pembayaran (belum tersedia)
        </Button>
      </Card>
    </div>
  );
}
