import Link from "next/link";
import { Button, Card, FormField, Input } from "@/src/components/ui";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="mb-8">
          <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
            F
          </div>
          <p className="mb-2 text-sm font-semibold text-primary">Flamboyan Badminton</p>
          <h1 className="text-2xl">Masuk ke ruang kerja</h1>
          <p className="mt-2 leading-6 text-muted">
            Akses Google akan dihubungkan pada tahap autentikasi berikutnya.
          </p>
        </div>

        <div className="space-y-5">
          <FormField
            hint="Kolom ini hanya contoh tampilan dan belum dikirim."
            id="login-email"
            label="Email"
          >
            <Input autoComplete="email" disabled id="login-email" placeholder="nama@contoh.com" />
          </FormField>
          <Button className="w-full" disabled>
            Masuk dengan Google (belum tersedia)
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Kembali ke{" "}
          <Link className="font-semibold text-primary underline-offset-4 hover:underline" href="/dashboard">
            pratinjau aplikasi
          </Link>
        </p>
      </Card>
    </main>
  );
}
