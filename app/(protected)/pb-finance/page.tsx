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
  Textarea,
} from "@/src/components/ui";
import { sampleExpenses } from "@/src/mocks/foundation-data";

export default function PbFinancePage() {
  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[{ href: "/dashboard", label: "Dashboard" }, { label: "Keuangan PB" }]}
        description="Pratinjau saldo dan pengeluaran klub."
        title="Keuangan PB"
      />

      <section aria-label="Ringkasan kas" className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Saldo awal contoh</p>
          <p className="mt-3 text-2xl font-bold">Rp 500.000</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pemasukan contoh</p>
          <p className="mt-3 text-2xl font-bold">Rp 435.000</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pengeluaran contoh</p>
          <p className="mt-3 text-2xl font-bold">Rp 255.000</p>
          <div className="mt-3">
            <StatusBadge tone="warning">Angka pratinjau</StatusBadge>
          </div>
        </Card>
      </section>

      <Card>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2>Pengeluaran terbaru</h2>
            <p className="mt-1 text-sm text-muted">Baris di bawah tidak disimpan.</p>
          </div>
          <StatusBadge>{sampleExpenses.length} pengeluaran contoh</StatusBadge>
        </div>
        <TableRegion label="Daftar pengeluaran contoh">
          <Table>
            <caption className="sr-only">Daftar pengeluaran contoh</caption>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Kategori</TableHeaderCell>
                <TableHeaderCell>Jumlah</TableHeaderCell>
                <TableHeaderCell>Referensi</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.amount}</TableCell>
                  <TableCell>{expense.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableRegion>
      </Card>

      <Card className="max-w-3xl">
        <h2>Catat pengeluaran</h2>
        <p className="mt-1 text-sm text-muted">Formulir contoh, nonaktif dan belum terhubung.</p>
        <fieldset className="mt-5 grid gap-5 sm:grid-cols-2" disabled>
          <legend className="sr-only">Form pengeluaran contoh</legend>
          <FormField id="expense-date" label="Tanggal">
            <Input id="expense-date" type="date" />
          </FormField>
          <FormField id="expense-category" label="Kategori" required>
            <Select defaultValue="" id="expense-category" required>
              <option disabled value="">
                Pilih kategori
              </option>
              <option value="shuttlecock">Kok</option>
              <option value="water">Air minum</option>
            </Select>
          </FormField>
          <FormField id="expense-amount" label="Jumlah" required>
            <Input id="expense-amount" min="0" placeholder="0" required type="number" />
          </FormField>
          <FormField id="expense-notes" label="Catatan">
            <Textarea className="min-h-11" id="expense-notes" placeholder="Catatan pengeluaran" />
          </FormField>
        </fieldset>
        <Button className="mt-5" disabled>
          Simpan pengeluaran (belum tersedia)
        </Button>
      </Card>
    </div>
  );
}
