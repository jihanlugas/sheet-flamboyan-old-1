import Link from "next/link";
import { PageHeader } from "@/src/components/layout/page-header";
import { Button, Card, FormField, Input, Select, Textarea } from "@/src/components/ui";
import { samplePlayers } from "@/src/mocks/foundation-data";

export default function NewSessionPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumbs={[
          { href: "/dashboard", label: "Dashboard" },
          { href: "/sessions", label: "Sesi" },
          { label: "Sesi baru" },
        ]}
        description="Formulir ini belum menyimpan atau mengirim data."
        title="Buat sesi"
      />

      <Card className="max-w-3xl">
        <fieldset className="space-y-6" disabled>
          <legend className="mb-5 text-lg font-semibold">Informasi sesi contoh</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              hint="Pilih tanggal latihan."
              id="session-date"
              label="Tanggal sesi"
              required
            >
              <Input id="session-date" required type="date" />
            </FormField>
            <FormField id="session-venue" label="Lokasi" required>
              <Input id="session-venue" placeholder="Nama gedung atau lapangan" required />
            </FormField>
            <FormField
              hint="Nilai dalam Rupiah."
              id="session-court-fee"
              label="Biaya lapangan"
              required
            >
              <Input id="session-court-fee" min="0" placeholder="0" required type="number" />
            </FormField>
            <FormField id="session-player" label="Pemain" required>
              <Select defaultValue="" id="session-player" required>
                <option disabled value="">
                  Pilih pemain
                </option>
                {samplePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField id="session-notes" label="Catatan">
            <Textarea id="session-notes" placeholder="Catatan tambahan untuk sesi" />
          </FormField>
        </fieldset>
        <p className="mt-5 text-sm text-muted">
          Simpan akan diaktifkan setelah integrasi data tersedia.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button disabled>Simpan sesi (belum tersedia)</Button>
          <Link
            className="inline-flex min-h-11 items-center rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-background"
            href="/sessions"
          >
            Batal
          </Link>
        </div>
      </Card>
    </div>
  );
}
