# Feature PRD: Keuangan PB dan Saldo Kas

## 1. Nama Feature

**Keuangan PB dan Saldo Kas**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)
- Related feature: [Pencatatan Pembayaran dan Saldo Pemain](../player-payments/prd.md)
- Related feature: [Login Google dan Izin Akses Google Sheets](../google-sheets-access/prd.md)

## 3. Goal

### Problem

Pengelola PB perlu mengetahui posisi kas berdasarkan uang yang benar-benar diterima dan dikeluarkan, bukan hanya total tagihan pemain. Saldo awal PB perlu dicatat saat aplikasi mulai digunakan, sedangkan pengeluaran harus dapat direkam dengan waktu dan keterangan yang dapat ditelusuri. Kesalahan pada saldo awal atau pengeluaran tidak boleh dikoreksi dengan menghapus riwayat finansial. Pengeluaran juga tetap perlu dicatat walaupun nominalnya melebihi saldo kas yang tercatat, sehingga kondisi kas negatif dapat terlihat.

### Solution

Menyediakan halaman keuangan PB untuk melihat saldo awal, pembayaran pemain bersih, pengeluaran, penyesuaian kas, dan saldo kas terkini. Bendahara menetapkan saldo awal satu kali saat setup, mencatat pengeluaran, dan menggunakan transaksi penyesuaian beralasan untuk koreksi saldo awal. Pembayaran pemain dibaca dari feature Pembayaran dan tidak dimasukkan ulang dari halaman keuangan PB.

### Impact

- Bendahara dapat melihat saldo kas aktual berdasarkan transaksi yang tercatat.
- Pengeluaran PB memiliki riwayat dan jejak koreksi yang dapat diperiksa.
- Saldo kas negatif terlihat jelas sebagai defisit, bukan dicegah dengan menghilangkan transaksi.
- Pembayaran pemain, pengeluaran, dan penyesuaian dapat direkonsiliasi tanpa perhitungan manual.

## 4. User Personas

### Bendahara PB

Editor spreadsheet yang menetapkan saldo awal, mencatat pengeluaran, memeriksa saldo kas, dan mengoreksi kesalahan melalui penyesuaian yang memiliki alasan.

### Pengelola PB

Editor spreadsheet yang melihat ringkasan pemasukan pemain, pengeluaran, saldo kas, dan riwayat transaksi.

### Viewer Spreadsheet

Pengguna dengan akses baca yang dapat melihat saldo kas dan riwayat, tetapi tidak dapat mencatat atau membatalkan transaksi.

## 5. User Stories

1. **Sebagai bendahara,** saya ingin menetapkan saldo awal PB saat setup, **agar saldo kas memiliki titik awal yang jelas.**
2. **Sebagai bendahara,** saya ingin mencatat pengeluaran PB beserta tanggal dan keterangan, **agar arus kas keluar dapat ditelusuri.**
3. **Sebagai bendahara,** saya ingin tetap dapat mencatat pengeluaran yang melebihi saldo saat ini, **agar saldo negatif menunjukkan defisit yang sebenarnya.**
4. **Sebagai bendahara,** saya ingin mengoreksi saldo awal atau pengeluaran melalui transaksi penyesuaian/reversal, **agar koreksi tidak menghapus riwayat asal.**
5. **Sebagai pengelola,** saya ingin melihat pembayaran pemain bersih, pengeluaran, penyesuaian, dan saldo PB dalam satu ringkasan, **agar kondisi kas mudah dipahami.**
6. **Sebagai viewer,** saya ingin melihat saldo serta riwayat tanpa dapat mengubah transaksi, **agar akses keuangan mengikuti izin Google Sheets.**
7. **Sebagai editor,** saya ingin mengetahui jika Google Sheets gagal menyimpan transaksi, **agar saya tidak menganggap arus kas telah tercatat padahal belum tersimpan.**

## 6. Requirements

### Functional Requirements

#### Saldo awal dan penyesuaian

- Pada setup awal, editor harus menetapkan saldo awal PB sebagai bilangan bulat Rupiah nol atau lebih.
- Saldo awal `0` valid dan tetap harus dicatat sebagai konfigurasi awal yang telah ditetapkan.
- Saldo awal hanya dapat ditetapkan satu kali melalui alur setup; editor tidak dapat menimpa nilai awal yang sudah tersimpan.
- Jika nilai saldo awal keliru setelah setup, editor mencatat penyesuaian kas baru dengan nominal bertanda positif atau negatif dan alasan wajib.
- Penyesuaian kas memiliki ID stabil, tanggal/waktu, nominal bertanda, alasan, waktu pencatatan, dan referensi bila merupakan koreksi atas transaksi tertentu.
- Penyesuaian positif menambah saldo kas; penyesuaian negatif mengurangi saldo kas.
- Penyesuaian yang sudah tersimpan tidak dapat diedit atau dihapus permanen melalui alur normal; koreksi lanjutan dilakukan dengan penyesuaian tambahan yang berjejak.
- Jika saldo awal belum ditetapkan, aplikasi menampilkan status setup belum selesai dan tidak menyajikan saldo kas turunan sebagai saldo final.

#### Pencatatan pengeluaran

- Editor dapat mencatat pengeluaran PB kapan saja tanpa harus membuat sesi.
- Setiap pengeluaran mencatat ID transaksi stabil, nominal, tanggal/waktu pengeluaran, kategori atau keterangan, waktu pencatatan, dan keterangan opsional.
- Nominal pengeluaran harus berupa bilangan bulat Rupiah nol atau lebih; nilai negatif tidak diperbolehkan.
- Nilai pengeluaran `0` tidak mengubah saldo kas tetapi boleh tersimpan sebagai catatan.
- Kategori atau keterangan utama wajib diisi agar pengeluaran dapat dikenali pada riwayat.
- Aplikasi menerima dan menyimpan pengeluaran meskipun nominalnya lebih besar daripada saldo kas saat ini.
- Jika saldo menjadi negatif setelah pengeluaran, aplikasi menampilkan nilai negatif dan label defisit; transaksi tidak boleh ditolak atau dipotong agar saldo tetap positif.
- Pengeluaran disimpan pada tab `Expenses` di Google Spreadsheet yang sama.

#### Koreksi pengeluaran

- Pengeluaran yang sudah tersimpan tidak dapat diedit atau dihapus permanen melalui alur normal.
- Editor dapat membuat satu reversal penuh yang merujuk ke transaksi pengeluaran asal dan memiliki alasan/tanggal.
- Reversal pengeluaran mengimbangi dampak pengeluaran asal pada saldo kas, tetapi mempertahankan transaksi asal dan reversal di riwayat.
- Satu pengeluaran hanya dapat dibalik satu kali; permintaan reversal ganda ditolak.
- Jika nominal/keterangan perlu dikoreksi, editor membalik transaksi asal lalu mencatat transaksi pengeluaran pengganti.
- Setiap penulisan pengeluaran/reversal memiliki ID operasi idempotensi agar retry tidak membuat baris atau dampak saldo ganda.

#### Pemasukan dan perhitungan saldo kas

- Pemasukan pemain bersumber dari transaksi pembayaran bersih pada feature Pembayaran; pembayaran tidak boleh dimasukkan ulang melalui halaman Keuangan PB.
- Reversal pembayaran mengurangi pemasukan bersih sesuai nominal yang dibalik.
- Saldo kas dihitung sebagai:
  - `saldo awal PB`
  - `+ total pembayaran pemain bersih`
  - `− total pengeluaran PB bersih`
  - `+ total penyesuaian kas bersih`.
- Pengeluaran bersih adalah total pengeluaran dikurangi reversal pengeluaran.
- Pembayaran bersih adalah total pembayaran dikurangi reversal pembayaran.
- Saldo kas dapat bernilai negatif dan harus ditampilkan sebagai defisit; saldo nol dan positif juga harus diberi label yang jelas.
- Ringkasan menampilkan setidaknya saldo awal, total pembayaran bersih, total pengeluaran bersih, total penyesuaian kas bersih, dan saldo kas akhir.
- Perubahan pembayaran, reversal, pengeluaran, atau penyesuaian yang sudah tersimpan harus tercermin pada saldo kas saat data dimuat ulang.
- Pengeluaran dan penyesuaian tidak mengubah saldo pemain. Pembayaran pemain mengubah saldo pemain sesuai feature Pembayaran.

#### Riwayat dan filter

- Menu Keuangan PB menampilkan riwayat pengeluaran dan penyesuaian; pembayaran pemain ditampilkan dari sumber data pembayaran yang sama tanpa duplikasi.
- Pengguna dapat memfilter riwayat berdasarkan rentang tanggal dan jenis transaksi.
- Setiap baris menampilkan tanggal transaksi, jenis, nominal, keterangan, status reversal, dan tautan ke transaksi asal bila relevan.
- Ringkasan periode membedakan arus kas aktual dari saldo awal dan saldo akhir.
- Viewer dapat membaca ringkasan dan riwayat, tetapi tidak mendapat kontrol tambah, koreksi, atau reversal.

#### Penyimpanan dan izin

- Semua pengeluaran dan penyesuaian kas disimpan dalam Google Spreadsheet yang sama dengan data epic lainnya.
- Data pengeluaran disimpan pada tab `Expenses`; koreksi saldo awal disimpan sebagai transaksi append-only pada tab `CashAdjustments`.
- Penulisan dilakukan ke Google Sheets secara langsung setelah editor menyimpan.
- UI hanya menampilkan sukses setelah Google Sheets mengonfirmasi penulisan.
- Jika penulisan gagal atau hasilnya belum pasti, aplikasi tidak boleh mengonfirmasi transaksi sebagai berhasil atau menghitungnya sebagai tersimpan.
- Semua operasi mengikuti akses Google pada feature autentikasi: viewer dapat membaca, editor dapat menulis.
- Hak edit, validitas transaksi, dan relasi reversal diperiksa di server; UI bukan batas keamanan.
- Error Google API, izin, validasi, atau koneksi ditampilkan dengan jelas tanpa membocorkan token atau isi sensitif spreadsheet.

### Non-Functional Requirements

- **Integritas finansial:** Nilai uang disimpan sebagai bilangan bulat Rupiah; satu fungsi domain server-side menjadi sumber rumus saldo kas.
- **Keterlacakan:** Saldo awal, transaksi pengeluaran, reversal, penyesuaian, waktu, nominal, dan alasan dapat ditelusuri.
- **Anti-duplikasi:** Retry untuk operasi yang sama tidak boleh menggandakan pengeluaran, reversal, atau penyesuaian.
- **Konsistensi:** Saldo kas dihitung dari transaksi yang telah dikonfirmasi tersimpan, bukan dari state UI sementara.
- **Keamanan:** Operasi data dilakukan melalui server dengan sesi dan izin Google yang valid; token OAuth tidak dikirim ke browser.
- **Keandalan:** Gangguan Google Sheets API, kuota, atau jaringan menghasilkan error yang terlihat dan tidak menjadi sukses palsu.
- **Kinerja:** Ringkasan saldo kas dan riwayat umum dimuat dalam p95 ≤ 3 detik pada kondisi normal untuk satu PB dengan volume MVP.
- **Aksesibilitas:** Defisit, transaksi reversal, dan status setup harus dijelaskan dengan teks, bukan warna saja.
- **Privasi:** Keterangan transaksi tidak meminta data rekening atau informasi pribadi yang tidak diperlukan.

## 7. Acceptance Criteria

### User Story 1 — Menetapkan saldo awal

- [ ] **Given** saldo awal belum pernah ditetapkan, **when** editor menyimpan nominal Rupiah nol atau lebih, **then** saldo awal tersimpan di Google Sheets dan status setup berubah menjadi selesai.
- [ ] **Given** saldo awal sudah ditetapkan, **when** editor mencoba menimpa nilai melalui form setup, **then** aplikasi menolak perubahan langsung dan mengarahkan ke transaksi penyesuaian.
- [ ] **Given** saldo awal belum ditetapkan, **when** halaman keuangan dibuka, **then** aplikasi menampilkan setup belum selesai dan tidak menyajikan angka saldo akhir seolah-olah telah dikonfigurasi.
- [ ] **Given** editor mencatat penyesuaian saldo awal positif atau negatif dengan alasan, **when** perubahan tersimpan, **then** saldo kas berubah sesuai tanda penyesuaian dan transaksi awal tetap tersimpan.

### User Story 2 — Mencatat pengeluaran

- [ ] **Given** editor mengisi nominal pengeluaran nol atau lebih, tanggal, dan kategori/keterangan, **when** ia menyimpan, **then** pengeluaran dicatat di Google Sheets sebelum UI menampilkan sukses.
- [ ] **Given** nominal pengeluaran negatif atau bukan bilangan Rupiah yang valid, **when** editor menyimpan, **then** validasi menolak transaksi dan data tidak berubah.
- [ ] **Given** pengeluaran lebih besar daripada saldo kas, **when** editor menyimpan, **then** transaksi tetap diterima dan saldo kas dapat menjadi negatif.
- [ ] **Given** pengeluaran bernilai `0`, **when** transaksi tersimpan, **then** riwayat mencatatnya tetapi saldo kas tidak berubah.

### User Story 3 — Melihat saldo dan arus kas

- [ ] **Given** saldo awal, pembayaran, pengeluaran, dan penyesuaian telah tercatat, **when** ringkasan keuangan dimuat, **then** saldo akhir sama dengan saldo awal + pembayaran bersih − pengeluaran bersih + penyesuaian bersih.
- [ ] **Given** terdapat pembayaran pemain yang dibalik, **when** pemasukan bersih dihitung, **then** nominal reversal mengurangi total pembayaran yang menambah kas.
- [ ] **Given** saldo akhir kurang dari nol, **when** ringkasan ditampilkan, **then** saldo negatif tampil dengan label defisit dan tidak disembunyikan atau diubah menjadi nol.
- [ ] **Given** pengguna memilih rentang tanggal, **when** riwayat difilter, **then** daftar hanya menampilkan transaksi dalam rentang tersebut dan saldo akhir keseluruhan tetap dibedakan dari ringkasan periode.

### User Story 4 — Mengoreksi pengeluaran

- [ ] **Given** pengeluaran asal belum pernah dibalik, **when** editor membuat reversal dengan alasan, **then** reversal tersimpan dan menambah kembali saldo sebesar nilai pengeluaran asal.
- [ ] **Given** pengeluaran asal sudah dibalik, **when** editor mencoba membaliknya lagi, **then** permintaan ditolak dan saldo tidak berubah.
- [ ] **Given** editor perlu mengoreksi pengeluaran, **when** reversal berhasil, **then** transaksi asal dan reversal tetap terlihat dan pengeluaran pengganti dapat dicatat terpisah.
- [ ] **Given** reversal gagal disimpan, **when** aplikasi menerima kegagalan, **then** transaksi asal tetap aktif dalam perhitungan saldo dan tidak ada status sukses palsu.

### User Story 5 — Viewer melihat tanpa mengubah

- [ ] **Given** pengguna hanya memiliki izin baca Google Sheets, **when** ia membuka halaman Keuangan PB, **then** ia dapat melihat ringkasan dan riwayat.
- [ ] **Given** viewer mencoba mengirim permintaan langsung untuk membuat pengeluaran, reversal, atau penyesuaian, **when** server memvalidasi permintaan, **then** server menolak operasi dan spreadsheet tidak berubah.

### User Story 6 — Menangani kegagalan penyimpanan

- [ ] **Given** Google Sheets gagal atau belum mengonfirmasi penulisan, **when** editor menyimpan pengeluaran/penyesuaian, **then** UI tidak mengonfirmasi transaksi sebagai berhasil.
- [ ] **Given** permintaan operasi yang sama dicoba ulang dengan ID idempotensi yang sama, **when** server memproses retry, **then** tidak ada transaksi atau dampak saldo yang terduplikasi.
- [ ] **Given** transaksi berhasil disimpan dan halaman dimuat ulang, **when** saldo kas dihitung kembali, **then** hasil dan riwayat tetap sama dengan data spreadsheet.

## 8. Out of Scope

- Mencatat pembayaran pemain secara langsung; fitur Keuangan PB membaca transaksi dari feature Pembayaran.
- Mencatat tagihan pemain sebagai pemasukan sebelum uang benar-benar diterima.
- Pencatatan pemasukan lain selain pembayaran pemain dan penyesuaian saldo.
- Pembukuan lengkap, jurnal akuntansi, laporan pajak, anggaran, aset, atau rekonsiliasi rekening.
- Pembayaran digital, impor mutasi bank, transfer antar rekening, atau integrasi payment gateway.
- Reversal sebagian, refund otomatis, atau pengelolaan utang/pinjaman formal PB.
- Mengubah atau menghapus transaksi keuangan yang sudah tersimpan tanpa reversal/penyesuaian berjejak.
- Mengelola saldo banyak PB atau banyak Google Spreadsheet.
