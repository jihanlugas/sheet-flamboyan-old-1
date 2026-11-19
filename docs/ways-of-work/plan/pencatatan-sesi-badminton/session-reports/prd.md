# Feature PRD: Laporan Sesi dan Berbagi melalui WhatsApp

## 1. Nama Feature

**Laporan Sesi dan Berbagi melalui WhatsApp**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)
- Related feature: [Pembuatan Sesi, Peserta, dan Perhitungan Biaya](../session-management/prd.md)
- Related feature: [Pencatatan Pembayaran dan Saldo Pemain](../player-payments/prd.md)
- Related feature: [Keuangan PB dan Saldo Kas](../pb-finance/prd.md)
- Related feature: [Login Google dan Izin Akses Google Sheets](../google-sheets-access/prd.md)

## 3. Goal

### Problem

Pengelola memerlukan ringkasan sesi yang merangkum peserta, pemakaian bola, biaya, dan pembayaran tanpa menghitung ulang dari beberapa halaman. Total tagihan sesi dan uang yang benar-benar diterima adalah angka berbeda dan harus terlihat terpisah. Saldo pemain kumulatif dapat mencakup utang atau kredit dari sesi lain, sehingga tidak selalu sesuai untuk disebarkan dalam laporan grup. Pengelola juga membutuhkan cara cepat membagikan informasi sesi ke WhatsApp tanpa pengiriman otomatis atau membagikan saldo kas PB.

### Solution

Menyediakan laporan sesi di aplikasi yang mengambil data tersimpan terbaru untuk sesi terpilih, merangkum biaya dan pembayaran yang secara eksplisit ditautkan ke sesi, serta menampilkan saldo keseluruhan pemain secara terpisah. Pengelola dapat meninjau teks yang akan dibagikan dan membukanya melalui WhatsApp atau menyalinnya. Pesan WhatsApp hanya memuat informasi finansial sesi itu; saldo pemain kumulatif dan saldo kas PB tidak disertakan.

### Impact

- Pengelola dapat menghasilkan ringkasan sesi yang konsisten tanpa kalkulasi manual.
- Total tagihan dan total pembayaran aktual sesi tidak tertukar.
- Saldo pemain tetap dapat diperiksa di aplikasi tanpa otomatis disebarkan ke grup WhatsApp.
- Laporan dapat dibagikan dengan cepat melalui alur yang dikendalikan pengguna.

## 4. User Personas

### Pengelola Sesi

Editor spreadsheet yang memeriksa rincian sesi, memastikan peserta dan biaya benar, lalu membagikan ringkasan melalui WhatsApp.

### Bendahara PB

Editor spreadsheet yang memeriksa pembayaran yang ditautkan ke sesi dan saldo kumulatif pemain sebelum membagikan laporan.

### Viewer Spreadsheet

Pengguna dengan akses baca yang dapat melihat laporan di aplikasi dan membagikan ringkasan sesi, tetapi tidak dapat mengubah data.

## 5. User Stories

1. **Sebagai pengelola sesi,** saya ingin melihat ringkasan satu sesi beserta daftar peserta, **agar saya dapat memeriksa catatan sesi secara menyeluruh.**
2. **Sebagai pengelola,** saya ingin melihat jumlah bola, jumlah game, dan rincian biaya setiap peserta, **agar perhitungan tagihan transparan.**
3. **Sebagai bendahara,** saya ingin melihat pembayaran yang ditautkan ke sesi terpisah dari total tagihan, **agar pemasukan aktual sesi tidak tertukar dengan tagihan.**
4. **Sebagai pengelola,** saya ingin melihat saldo kumulatif setiap pemain di dalam aplikasi, **agar dapat memeriksa status kurang atau lebih bayar dengan mempertimbangkan semua sesi.**
5. **Sebagai pengelola,** saya ingin meninjau dan membagikan teks laporan sesi melalui WhatsApp, **agar informasi sesi dapat dibagikan tanpa menyalin rincian manual.**
6. **Sebagai pengelola,** saya ingin pesan WhatsApp tidak menyertakan saldo kumulatif pemain atau saldo kas PB, **agar informasi keuangan lintas sesi dan internal PB tidak tersebar secara tidak sengaja.**
7. **Sebagai viewer,** saya ingin membaca dan membagikan laporan tanpa dapat mengubah sumber datanya, **agar izin Google Sheets tetap dihormati.**
8. **Sebagai pengguna,** saya ingin laporan menampilkan data terbaru yang tersimpan dan memberi tahu saya jika Google Sheets gagal dibaca, **agar saya tidak membagikan ringkasan yang kedaluwarsa.**

## 6. Requirements

### Functional Requirements

#### Data sumber dan pembuatan laporan

- Pengguna harus memilih sesi yang sudah tersimpan sebelum laporan dapat dibuat.
- Laporan dibuat dari data terbaru yang telah tersimpan pada tab `Sessions`, `Participants`, `Players`, dan `Payments` di Google Spreadsheet.
- Laporan dibuat saat diminta dan bukan catatan finansial baru; pembuatan laporan tidak menulis ulang sesi, peserta, pembayaran, atau saldo.
- Laporan mencatat waktu data diambil/dihasilkan agar pengguna mengetahui kapan ringkasan disusun.
- Jika data sesi, peserta, atau pembayaran tidak dapat dibaca, aplikasi menampilkan error dan tidak membuat atau membagikan laporan berdasarkan data lama yang belum diverifikasi.
- Jika sesi tidak memiliki peserta atau pembayaran, laporan tetap dapat dibuka dan menampilkan nilai total `0` beserta keadaan kosong yang jelas.

#### Isi laporan di aplikasi

- Header laporan menampilkan tanggal/waktu sesi dan harga lapangan per pemain serta harga bola per bola.
- Daftar peserta menampilkan nama pemain, jumlah bola, jumlah game, biaya lapangan, biaya bola, dan total biaya pemain.
- Total tagihan sesi adalah jumlah biaya seluruh peserta yang tercatat saat laporan dibuat.
- Pembayaran sesi berasal hanya dari pembayaran bersih yang secara eksplisit ditautkan ke ID sesi tersebut, setelah memperhitungkan reversal.
- Total pembayaran sesi ditampilkan terpisah dari total tagihan sesi dan mewakili uang yang benar-benar diterima untuk sesi tersebut.
- Pembayaran tanpa ID sesi memengaruhi saldo pemain dan kas PB, tetapi tidak dimasukkan ke total pembayaran sesi.
- Pembayaran yang tetap tertaut ke sesi setelah peserta dihapus tetap muncul pada daftar/total pembayaran sesi; aplikasi menandai bahwa pemain tersebut tidak lagi tercatat sebagai peserta.
- Laporan dalam aplikasi menampilkan status saldo kumulatif setiap pemain berdasarkan seluruh tagihan dan pembayaran bersih lintas sesi:
  - Saldo negatif menunjukkan kekurangan bayar.
  - Saldo nol menunjukkan lunas.
  - Saldo positif menunjukkan kredit/lebih bayar.
- Status saldo kumulatif ditampilkan terpisah dari pembayaran yang ditautkan ke sesi; aplikasi tidak menganggap pembayaran sesi tertentu otomatis dialokasikan ke tagihan sesi tersebut.
- Saldo kas PB dapat dilihat pada menu Keuangan PB, tetapi bukan bagian wajib dari laporan sesi.

#### Isi dan pembagian laporan WhatsApp

- Sebelum berbagi, aplikasi menampilkan preview teks yang akan dikirim dan memberi pengguna kendali untuk membatalkan.
- Teks WhatsApp memuat tanggal/waktu sesi, ringkasan harga, daftar peserta, jumlah bola/game, rincian biaya, pembayaran yang ditautkan ke sesi, total tagihan, dan total pembayaran aktual sesi.
- Pesan WhatsApp hanya memuat biaya dan pembayaran sesi yang dipilih; pembayaran tanpa sesi tidak ikut dimasukkan.
- Pesan WhatsApp tidak menyertakan saldo/status kumulatif pemain dari sesi lain atau saldo kas PB.
- Pengguna secara eksplisit memilih untuk membuka WhatsApp atau menyalin teks; aplikasi tidak mengirim pesan otomatis.
- Jika WhatsApp tidak tersedia atau tautan berbagi gagal, aplikasi menyediakan tindakan salin teks sebagai fallback.
- Format nominal menggunakan Rupiah dan format teks harus tetap terbaca di WhatsApp pada perangkat ponsel maupun desktop.
- Berbagi laporan tersedia bagi pengguna yang memiliki akses baca ke spreadsheet; berbagi tidak memberi izin untuk mengubah data.
- Setelah pengguna membagikan laporan, perubahan data di kemudian hari tidak mengubah pesan yang sudah terkirim. Pengguna harus membuat dan membagikan ulang laporan terbaru bila diperlukan.

#### Perhitungan dan konsistensi

- Perhitungan biaya peserta menggunakan aturan sesi: `biaya lapangan per pemain + (harga bola sesi × jumlah bola pemain)`. Jumlah game tidak memengaruhi biaya.
- Pembayaran bersih sesi adalah total pembayaran tertaut sesi dikurangi reversal pembayaran tertaut sesi.
- Saldo kumulatif pemain dihitung sebagai total pembayaran bersih pemain dikurangi total tagihan pemain lintas sesi.
- Rumus laporan menggunakan layanan domain yang sama dengan fitur sesi dan pembayaran; UI tidak mengimplementasikan rumus finansial terpisah.
- Perubahan sesi, peserta, pembayaran, atau reversal yang sudah tersimpan tercermin pada laporan berikutnya setelah data dimuat ulang.

#### Akses dan penyimpanan

- Seluruh pengguna yang dapat membaca spreadsheet dapat membaca laporan; hanya editor yang dapat mengubah sumber data melalui fitur terkait.
- Pembuatan atau pembagian laporan tidak mengubah Google Sheets.
- Akses data laporan diverifikasi di server sesuai feature autentikasi Google Sheets.
- Error autentikasi, akses, validasi data, kuota, atau jaringan ditampilkan dengan jelas tanpa membocorkan token atau isi spreadsheet yang tidak diperlukan.

### Non-Functional Requirements

- **Akurasi finansial:** Total tagihan, pembayaran sesi, saldo pemain, dan saldo PB tidak boleh digabungkan sebagai angka yang sama.
- **Privasi:** Saldo pemain kumulatif dan saldo kas PB tidak disertakan pada teks WhatsApp; pengiriman hanya dilakukan setelah aksi pengguna.
- **Kinerja:** Laporan sesi untuk ukuran sesi komunitas umum dimuat dalam p95 ≤ 3 detik pada kondisi normal.
- **Konsistensi:** Laporan dibangun dari data tersimpan terbaru dan menampilkan waktu pengambilan data.
- **Aksesibilitas:** Rincian biaya, status saldo, preview, dan error dapat dinavigasi dengan keyboard dan dibedakan melalui teks, bukan warna saja.
- **Keandalan:** Kegagalan Google Sheets atau WhatsApp share flow tidak boleh menghasilkan laporan yang terlihat berhasil tetapi tidak tersedia.
- **Keamanan:** Token OAuth tidak dikirim ke WhatsApp atau browser; teks laporan hanya berisi data yang secara eksplisit ditentukan untuk dibagikan.
- **Keterbacaan:** Teks WhatsApp mempertahankan label nominal dan struktur peserta agar dapat dipahami tanpa format tabel khusus.

## 7. Acceptance Criteria

### User Story 1 — Melihat laporan sesi

- [ ] **Given** pengguna memilih sesi yang tersimpan, **when** laporan diminta, **then** aplikasi menampilkan tanggal/waktu, harga sesi, data peserta, dan waktu pembuatan laporan.
- [ ] **Given** sesi tidak memiliki peserta, **when** laporan dibuka, **then** laporan menampilkan keadaan kosong dan total tagihan nol.
- [ ] **Given** Google Sheets gagal menyediakan data terbaru, **when** laporan diminta, **then** aplikasi menampilkan error dan tidak menyajikan laporan lama sebagai data terbaru.

### User Story 2 — Melihat peserta dan rincian biaya

- [ ] **Given** peserta memiliki jumlah bola dan game, **when** laporan dibuat, **then** nilai keduanya tampil untuk pemain yang tepat.
- [ ] **Given** harga lapangan `L`, harga bola `B`, dan jumlah bola peserta `N`, **when** biaya dihitung, **then** laporan menampilkan biaya lapangan `L`, biaya bola `B × N`, serta total `L + (B × N)`.
- [ ] **Given** jumlah game berubah tetapi jumlah bola dan harga tidak berubah, **when** laporan dibuat ulang, **then** statistik berubah dan biaya tetap sama.
- [ ] **Given** terdapat beberapa peserta, **when** total tagihan sesi ditampilkan, **then** nilainya sama dengan jumlah total biaya semua peserta yang tercatat.

### User Story 3 — Membedakan pembayaran dan tagihan sesi

- [ ] **Given** sesi memiliki pembayaran tertaut dan pembayaran pemain tanpa sesi, **when** laporan sesi dibuat, **then** total pembayaran sesi hanya menghitung pembayaran bersih yang ditautkan ke sesi.
- [ ] **Given** sesi tidak memiliki pembayaran tertaut, **when** laporan dibuat, **then** total pembayaran aktual sesi adalah nol, bukan total tagihan.
- [ ] **Given** pembayaran tertaut ke sesi dibalik, **when** laporan dibuat ulang, **then** total pembayaran sesi dikurangi reversal dan riwayat reversal tetap dapat ditelusuri.
- [ ] **Given** pemain memiliki tagihan dari beberapa sesi, **when** laporan dalam aplikasi menampilkan saldo pemain, **then** status mencerminkan saldo kumulatif lintas sesi dan diberi label terpisah dari pembayaran sesi.

### User Story 4 — Berbagi melalui WhatsApp dengan aman

- [ ] **Given** pengguna memilih berbagi, **when** preview ditampilkan, **then** pesan memuat rincian sesi, peserta, biaya, dan pembayaran sesi serta tidak memuat saldo pemain kumulatif atau saldo kas PB.
- [ ] **Given** pengguna membatalkan preview, **when** ia memilih batal, **then** WhatsApp tidak dibuka dan tidak ada pesan yang dikirim.
- [ ] **Given** pengguna mengonfirmasi berbagi, **when** WhatsApp tersedia, **then** aplikasi membuka alur WhatsApp dengan teks yang dienkode dan tetap memerlukan pengguna menekan kirim di WhatsApp.
- [ ] **Given** WhatsApp tidak tersedia atau tautan gagal, **when** pengguna memilih berbagi, **then** aplikasi menawarkan penyalinan teks laporan.
- [ ] **Given** data berubah setelah pesan dibagikan, **when** sesi dibuka kembali, **then** pesan lama tidak diubah; laporan baru menggunakan data terbaru setelah dibuat ulang.
- [ ] **Given** laporan menyertakan pembayaran tertaut ke pemain yang sudah dihapus dari daftar peserta, **when** teks dibentuk, **then** pembayaran tetap tercantum dan pemain ditandai sebagai bukan peserta saat ini.

### User Story 5 — Viewer membaca dan membagikan tanpa mengubah data

- [ ] **Given** pengguna hanya memiliki izin baca Google Sheets, **when** ia melihat atau membagikan laporan, **then** laporan tersedia tanpa kontrol mutasi data.
- [ ] **Given** pengguna mencoba menggunakan endpoint laporan untuk mengubah data sesi atau pembayaran, **when** server memvalidasi request, **then** operasi perubahan ditolak.

## 8. Out of Scope

- Mengubah atau menambah peserta, sesi, harga, pembayaran, pengeluaran, atau saldo dari halaman laporan.
- Mengalokasikan pembayaran pemain ke tagihan sesi secara FIFO atau prioritas tertentu.
- Mengirim saldo kumulatif pemain, saldo kas PB, atau ringkasan keuangan seluruh PB dalam teks WhatsApp.
- Mengirim pesan WhatsApp otomatis, memakai WhatsApp Business API, mengirim ke grup tertentu tanpa konfirmasi, atau menjadwalkan pesan.
- Menyimpan snapshot laporan sebagai catatan finansial baru atau menjaga pesan WhatsApp yang telah terkirim tetap tersinkron dengan perubahan data.
- Membuat laporan akuntansi lengkap, laporan bulanan PB, pajak, atau ekspor spreadsheet tambahan.
- Mengirim laporan kepada pemain melalui email/SMS atau menyediakan portal pemain.
