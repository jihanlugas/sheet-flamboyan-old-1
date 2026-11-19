# Feature PRD: Dashboard Ringkasan Sesi dan Keuangan

## 1. Nama Feature

**Dashboard Ringkasan Sesi dan Keuangan**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)
- Related feature: [Manajemen Pemain dan Saldo Pemain](../player-management-and-balances/prd.md)
- Related feature: [Pembuatan Sesi, Peserta, dan Perhitungan Biaya](../session-management/prd.md)
- Related feature: [Pencatatan Pembayaran dan Saldo Pemain](../player-payments/prd.md)
- Related feature: [Keuangan PB dan Saldo Kas](../pb-finance/prd.md)
- Related feature: [Login Google dan Izin Akses Google Sheets](../google-sheets-access/prd.md)

## 3. Goal

### Problem

Pengelola dan bendahara perlu membuka beberapa menu untuk mengetahui kondisi terkini PB. Jumlah pemain, sesi terbaru, total kekurangan bayar, kredit pemain, dan saldo kas PB memiliki sumber data dan arti yang berbeda. Jika kekurangan dan kelebihan saldo pemain dijumlahkan menjadi satu angka bersih, utang pemain dapat tertutupi oleh kredit pemain lain. Dashboard perlu menyajikan ringkasan yang mudah dibaca tanpa menggantikan detail yang tersedia pada menu Pemain, Sesi, dan Transaksi.

### Solution

Menyediakan halaman Dashboard baca-saja yang merangkum jumlah pemain aktif, total kekurangan bayar, total kredit lebih bayar, saldo kas PB terkini, dan lima sesi terbaru. Setiap ringkasan dihitung dari data Google Sheets terbaru dengan rumus yang sama seperti fitur terkait. Ringkasan keuangan diberi label yang membedakan tagihan, pembayaran, kredit pemain, dan kas PB.

### Impact

- Pengelola dapat memahami kondisi sesi dan keuangan PB dari satu halaman.
- Total utang dan total kredit pemain terlihat terpisah dan tidak saling mengimbangi.
- Bendahara dapat segera melihat defisit atau saldo kas PB yang belum dikonfigurasi.
- Pengguna dapat menuju menu detail untuk menindaklanjuti ringkasan.

## 4. User Personas

### Pengelola Sesi

Editor spreadsheet yang memeriksa pemain aktif dan sesi terbaru sebelum membuat atau mengelola sesi berikutnya.

### Bendahara PB

Editor spreadsheet yang memantau kekurangan/kelebihan saldo pemain dan posisi kas PB.

### Viewer Spreadsheet

Pengguna dengan akses baca yang membutuhkan ringkasan kondisi PB tanpa hak mengubah data.

## 5. User Stories

1. **Sebagai pengelola sesi,** saya ingin melihat jumlah pemain aktif dan sesi terbaru, **agar saya cepat mengetahui aktivitas PB saat ini.**
2. **Sebagai bendahara,** saya ingin melihat total kekurangan bayar pemain secara terpisah dari total kredit lebih bayar, **agar satu kelompok saldo tidak menutupi kelompok lainnya.**
3. **Sebagai bendahara,** saya ingin melihat saldo kas PB dan komponennya, **agar saya dapat memantau posisi kas aktual dan mengetahui apakah saldo awal sudah disiapkan.**
4. **Sebagai pengelola,** saya ingin melihat ringkasan peserta, tagihan, dan pembayaran sesi terbaru, **agar dapat memilih sesi yang perlu ditinjau lebih lanjut.**
5. **Sebagai pengguna,** saya ingin membuka detail pemain, sesi, atau transaksi dari ringkasan, **agar saya dapat menindaklanjuti informasi yang tampil.**
6. **Sebagai viewer,** saya ingin melihat dashboard tanpa dapat mengubah data, **agar akses tetap mengikuti izin Google Sheets saya.**
7. **Sebagai pengguna,** saya ingin dashboard menampilkan error saat Google Sheets tidak dapat dibaca, **agar angka lama atau nilai kosong tidak disalahartikan sebagai kondisi terkini.**

## 6. Requirements

### Functional Requirements

#### Ringkasan pemain

- Dashboard menampilkan jumlah pemain aktif yang dapat dipilih untuk sesi baru.
- Pemain nonaktif tidak dihitung dalam jumlah pemain aktif.
- Total kekurangan bayar dihitung dengan menjumlahkan nilai absolut saldo negatif setiap pemain.
- Total kredit lebih bayar dihitung dengan menjumlahkan saldo positif setiap pemain.
- Pemain dengan saldo nol tidak menambah total kekurangan atau total kredit.
- Total kekurangan dan total kredit ditampilkan terpisah; keduanya tidak boleh hanya ditampilkan sebagai satu saldo bersih.
- Total kekurangan dan kredit mencakup pemain aktif maupun nonaktif karena status nonaktif tidak menghapus kewajiban atau kredit historis.
- Setiap ringkasan keuangan pemain menampilkan label dan dapat membuka menu Pemain untuk melihat rincian.

#### Saldo kas PB

- Dashboard menampilkan saldo kas PB saat ini berdasarkan rumus yang ditetapkan pada feature Keuangan PB:
  `saldo awal + pembayaran bersih − pengeluaran bersih + penyesuaian kas bersih`.
- Pembayaran bersih memperhitungkan reversal pembayaran; pengeluaran bersih memperhitungkan reversal pengeluaran.
- Saldo kas negatif ditampilkan sebagai defisit dan tidak dibulatkan atau diubah menjadi nol.
- Jika saldo awal PB belum ditetapkan, dashboard menampilkan status setup belum selesai, bukan nilai `0` sebagai saldo final.
- Ringkasan kas memberi akses ke menu Keuangan PB untuk melihat komponen dan riwayat; dashboard tidak membuat transaksi keuangan.

#### Sesi terbaru

- Dashboard menampilkan hingga lima sesi terbaru yang tersimpan.
- Urutan sesi menggunakan tanggal/waktu sesi terbaru lebih dahulu; ID sesi menjadi pemutus seri bila tanggal/waktu sama.
- Untuk setiap sesi, dashboard menampilkan tanggal/waktu, jumlah peserta, total tagihan sesi, dan total pembayaran bersih yang ditautkan ke sesi tersebut.
- Total tagihan adalah jumlah biaya semua peserta; total pembayaran sesi adalah pembayaran bersih yang secara eksplisit tertaut ke sesi setelah reversal.
- Pembayaran tanpa sesi tidak dimasukkan ke ringkasan pembayaran sesi.
- Pembayaran tertaut ke sesi tetap dihitung walaupun pemainnya tidak lagi ada pada daftar peserta saat ini; dashboard mengikuti data pembayaran dan menandai pembayaran tanpa peserta aktif bila ditampilkan per pemain.
- Pengguna dapat membuka sesi yang dipilih untuk melihat detail.
- Jika belum ada sesi, dashboard menampilkan keadaan kosong yang jelas dan tautan ke menu Sesi.

#### Data, freshness, dan navigasi

- Ringkasan dihitung dari data Google Sheets terbaru saat dashboard dimuat; aplikasi tidak mengandalkan nilai cache lama sebagai kondisi saat ini.
- Dashboard menampilkan waktu terakhir data berhasil dimuat.
- Semua perhitungan memakai fungsi domain server-side yang sama seperti feature Pemain, Sesi, Pembayaran, dan Keuangan PB.
- Pengguna dapat membuka menu Pemain, Sesi, atau Transaksi dari dashboard melalui tautan yang jelas.
- Dashboard adalah halaman baca-saja; pencatatan/pengubahan pemain, sesi, pembayaran, atau pengeluaran dilakukan di menu masing-masing.
- Seluruh pengguna yang dapat membaca spreadsheet dapat membaca dashboard. Hanya editor dapat melakukan perubahan pada menu yang sesuai dengan hak Google.
- Jika satu atau lebih sumber data gagal dibaca, dashboard menandai bagian yang gagal dan tidak mengganti error dengan angka nol atau data lama tanpa label.
- Jika data dapat dimuat sebagian, bagian yang berhasil boleh ditampilkan dengan status error yang jelas pada bagian yang gagal; dashboard tidak boleh menampilkan total finansial yang dihitung dari sumber yang tidak lengkap sebagai total final.

#### Cakupan waktu

- Ringkasan saldo pemain dan saldo kas PB menunjukkan kondisi kumulatif terkini, bukan nilai untuk periode tertentu.
- Lima sesi terbaru ditentukan berdasarkan waktu sesi, bukan hanya waktu terakhir diedit.
- Filter periode, tren historis, dan perbandingan antarperiode tidak termasuk kebutuhan MVP.

### Non-Functional Requirements

- **Akurasi finansial:** Total utang dan total kredit pemain dipisahkan dan mengikuti rumus saldo pemain yang berlaku.
- **Kinerja:** Dashboard selesai dimuat dalam p95 ≤ 3 detik pada kondisi normal untuk satu PB dengan volume MVP.
- **Konsistensi:** Dashboard menggunakan sumber data yang sama dengan fitur transaksi dan sesi; hasil tidak dihitung ulang dengan aturan UI yang berbeda.
- **Keandalan:** Kegagalan Google Sheets API, kuota, atau jaringan ditampilkan dengan jelas dan tidak menghasilkan saldo sukses berbentuk fallback.
- **Keamanan:** Semua data dibaca di server dengan sesi dan izin Google yang valid; viewer tidak dapat melakukan mutasi melalui endpoint dashboard.
- **Aksesibilitas:** Label kekurangan, kredit, defisit, setup belum selesai, dan status error disampaikan dengan teks, bukan warna saja.
- **Responsif:** Ringkasan dan daftar sesi dapat digunakan di layar ponsel maupun desktop.

## 7. Acceptance Criteria

### User Story 1 — Melihat pemain aktif dan sesi terbaru

- [ ] **Given** terdapat pemain aktif dan nonaktif, **when** dashboard dimuat, **then** jumlah pemain aktif hanya menghitung pemain berstatus aktif.
- [ ] **Given** terdapat lebih dari lima sesi, **when** dashboard dimuat, **then** dashboard menampilkan lima sesi dengan tanggal/waktu terbaru lebih dahulu.
- [ ] **Given** sesi memiliki jumlah peserta dan tagihan, **when** ringkasan sesi ditampilkan, **then** angka peserta dan total tagihan sesuai dengan data sesi yang tersimpan.
- [ ] **Given** belum ada sesi, **when** dashboard dimuat, **then** daftar sesi terbaru menampilkan keadaan kosong dan tautan ke menu Sesi.

### User Story 2 — Melihat utang dan kredit secara terpisah

- [ ] **Given** saldo pemain negatif, **when** dashboard menghitung total kekurangan, **then** nilai absolut saldo tersebut menambah total kekurangan.
- [ ] **Given** saldo pemain positif, **when** dashboard menghitung total kredit, **then** saldo tersebut menambah total kredit lebih bayar.
- [ ] **Given** seorang pemain memiliki kekurangan dan pemain lain memiliki kredit dengan nominal sama, **when** dashboard menampilkan ringkasan, **then** kedua total tetap ditampilkan terpisah dan tidak menjadi nol.
- [ ] **Given** pemain nonaktif masih memiliki kekurangan atau kredit, **when** ringkasan total dihitung, **then** saldo tersebut tetap disertakan walaupun jumlah pemain aktif tidak menghitung pemain nonaktif.
- [ ] **Given** pemain memiliki saldo nol, **when** ringkasan dihitung, **then** pemain tersebut tidak menambah total kekurangan atau kredit.

### User Story 3 — Melihat saldo kas PB

- [ ] **Given** saldo awal telah disiapkan dan transaksi tersedia, **when** dashboard dimuat, **then** saldo kas sesuai dengan saldo awal + pembayaran bersih − pengeluaran bersih + penyesuaian kas bersih.
- [ ] **Given** saldo kas hasil perhitungan negatif, **when** dashboard menampilkan nilai, **then** nilai ditampilkan sebagai defisit tanpa diubah menjadi nol.
- [ ] **Given** saldo awal belum ditetapkan, **when** dashboard dimuat, **then** kartu kas menunjukkan setup belum selesai dan tidak menampilkan angka saldo final.
- [ ] **Given** pengguna memilih kartu saldo kas, **when** tautan digunakan, **then** pengguna dibawa ke menu Keuangan PB untuk melihat rincian.

### User Story 4 — Melihat pembayaran pada sesi terbaru

- [ ] **Given** sesi memiliki pembayaran tertaut, **when** ringkasan sesi ditampilkan, **then** pembayaran bersih dihitung setelah reversal dan ditampilkan terpisah dari total tagihan.
- [ ] **Given** terdapat pembayaran tanpa sesi, **when** ringkasan pembayaran sesi dihitung, **then** pembayaran itu tidak dimasukkan ke sesi terbaru.
- [ ] **Given** pengguna memilih salah satu sesi terbaru, **when** tautan dibuka, **then** detail sesi yang sama ditampilkan.

### User Story 5 — Data gagal dimuat atau viewer mengakses

- [ ] **Given** Google Sheets gagal dibaca, **when** dashboard dimuat, **then** bagian terkait menampilkan error dan tidak menggunakan angka nol atau data lama tanpa penanda.
- [ ] **Given** sumber finansial tidak lengkap, **when** total finansial dihitung, **then** aplikasi tidak menyajikan total parsial sebagai saldo final.
- [ ] **Given** viewer hanya memiliki izin baca, **when** dashboard dibuka, **then** ringkasan dapat dilihat dan tidak ada kontrol mutasi.
- [ ] **Given** viewer mencoba memanggil endpoint mutasi melalui dashboard, **when** server memvalidasi permintaan, **then** permintaan ditolak.

## 8. Out of Scope

- Mencatat atau mengubah pemain, sesi, pembayaran, pengeluaran, saldo awal, atau penyesuaian kas dari Dashboard.
- Menampilkan tren, grafik, perbandingan antarperiode, atau filter tanggal khusus.
- Menampilkan laporan sesi lengkap atau membagikan laporan melalui WhatsApp.
- Menampilkan saldo individu di kartu ringkasan; rincian individual tersedia pada menu Pemain dan Transaksi.
- Menghitung pemasukan dari tagihan pemain yang belum dibayar.
- Mengelola banyak PB atau banyak Google Spreadsheet.
- Mengirim notifikasi otomatis tentang kekurangan saldo atau defisit kas.
