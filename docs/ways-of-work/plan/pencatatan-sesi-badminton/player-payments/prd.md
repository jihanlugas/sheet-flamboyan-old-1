# Feature PRD: Pencatatan Pembayaran dan Saldo Pemain

## 1. Nama Feature

**Pencatatan Pembayaran dan Saldo Pemain**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)
- Related feature: [Manajemen Pemain dan Saldo Pemain](../player-management-and-balances/prd.md)
- Related feature: [Pembuatan Sesi, Peserta, dan Perhitungan Biaya](../session-management/prd.md)
- Related feature: [Login Google dan Izin Akses Google Sheets](../google-sheets-access/prd.md)

## 3. Goal

### Problem

Pembayaran pemain dapat terjadi sebelum atau sesudah sesi dan dapat berbeda dari total tagihan. Jika pembayaran hanya dicatat pada saat sesi, pengelola sulit merekam pembayaran susulan atau melihat kelebihan pembayaran yang akan digunakan untuk sesi berikutnya. Saldo perlu dihitung secara kumulatif dari semua tagihan dan pembayaran, serta harus memperbarui informasi pemain dan kas PB setelah transaksi tersimpan. Riwayat pembayaran yang keliru juga harus dapat dikoreksi tanpa menghilangkan jejak transaksi asli.

### Solution

Menyediakan alur pencatatan pembayaran untuk pemain terdaftar dengan nominal positif berapa pun, tanggal diterima, dan sesi opsional. Aplikasi mencatat pembayaran sebagai jurnal yang tidak dihapus, lalu menghitung posisi saldo pemain dari total pembayaran bersih dikurangi total tagihan. Saldo negatif menunjukkan kekurangan bayar, sedangkan saldo positif menjadi kredit pemain untuk sesi berikutnya. Kesalahan diperbaiki melalui reversal yang merujuk ke pembayaran asal dan, bila perlu, transaksi pengganti.

### Impact

- Pembayaran dapat dicatat kapan saja, terpisah dari pembuatan sesi.
- Pengelola dapat melihat saldo kurang bayar, lunas, atau lebih bayar tanpa kalkulasi manual.
- Kredit pemain otomatis mengurangi tagihan sesi berikutnya melalui perhitungan saldo kumulatif.
- Pemasukan kas PB dan riwayat finansial lebih akurat serta dapat ditelusuri.

## 4. User Personas

### Bendahara PB

Editor spreadsheet yang menerima pembayaran, mencatat tanggal/nominal, memantau kekurangan atau kelebihan pembayaran, dan memperbaiki transaksi yang salah dengan jejak yang jelas.

### Pengelola Sesi

Editor spreadsheet yang dapat menerima atau mencatat pembayaran pemain sebelum maupun sesudah sesi dan memeriksa saldo pemain.

### Viewer Spreadsheet

Pengguna dengan akses baca yang dapat melihat riwayat pembayaran dan saldo, tetapi tidak dapat mencatat atau membatalkan transaksi.

## 5. User Stories

1. **Sebagai bendahara,** saya ingin mencatat pembayaran positif untuk pemain terdaftar kapan saja, **agar penerimaan PB dan saldo pemain selalu tercatat.**
2. **Sebagai bendahara,** saya ingin menghubungkan pembayaran secara opsional ke sesi, **agar laporan sesi dapat menampilkan pembayaran yang memang dicatat untuk sesi itu.**
3. **Sebagai pemain yang membayar sebagian tagihan,** saya ingin pembayaran tersebut langsung mengurangi kekurangan saldo saya, **agar sisa yang harus dibayar terlihat jelas.**
4. **Sebagai pemain yang membayar lebih,** saya ingin kelebihan tersebut menjadi kredit saldo, **agar dapat digunakan untuk tagihan sesi berikutnya.**
5. **Sebagai bendahara,** saya ingin memperbaiki pembayaran keliru dengan reversal dan transaksi pengganti, **agar saldo dan kas terkoreksi tanpa menghapus jejak asli.**
6. **Sebagai pengelola,** saya ingin melihat riwayat pembayaran dan saldo terkini per pemain, **agar dapat menjawab pertanyaan tentang pembayaran dan kekurangan secara transparan.**
7. **Sebagai viewer,** saya ingin melihat riwayat dan saldo tanpa dapat mengubah transaksi, **agar hak akses saya mengikuti izin Google Sheets.**
8. **Sebagai editor,** saya ingin mendapat kegagalan simpan yang jelas, **agar transaksi yang belum tercatat tidak dianggap sebagai uang yang sudah diterima.**

## 6. Requirements

### Functional Requirements

#### Pencatatan pembayaran

- Pembayaran hanya dapat dicatat untuk pemain yang sudah terdaftar.
- Pembayaran dapat dicatat kapan saja, termasuk tanpa sesi dan sebelum atau setelah sesi terkait.
- Setiap pembayaran mencatat ID transaksi stabil, ID pemain, nominal, tanggal/waktu diterima, waktu pencatatan oleh sistem, dan keterangan opsional.
- Satu pembayaran dapat memiliki ID sesi opsional untuk menunjukkan sesi yang menjadi konteks laporan.
- Jika ID sesi diisi, sesi tersebut harus sudah tersimpan. Pembayaran tanpa ID sesi tetap diperbolehkan dan tetap memengaruhi saldo pemain serta kas PB.
- Nominal pembayaran harus berupa bilangan bulat Rupiah yang lebih besar dari `0`. Nominal tidak dibatasi oleh total tagihan.
- Pembayaran boleh kurang dari, sama dengan, atau lebih besar dari saldo yang harus dibayar.
- Pembayaran untuk pemain nonaktif tetap dapat dicatat karena pemain dapat melunasi kewajiban lama setelah tidak aktif.
- Aplikasi tidak mewajibkan metode pembayaran; metode atau rekening tidak termasuk data wajib MVP.
- Pembayaran disimpan pada tab `Payments` di Google Spreadsheet yang sama.

#### Hubungan pembayaran dan saldo pemain

- Saldo pemain dihitung secara kumulatif sebagai `total pembayaran bersih − total tagihan`.
- Pembayaran bersih adalah jumlah pembayaran yang valid dikurangi jumlah reversal yang sudah tercatat.
- Saldo negatif menunjukkan kekurangan bayar, saldo nol menunjukkan lunas, dan saldo positif menunjukkan lebih bayar/kredit.
- Pembayaran yang ditautkan ke sesi maupun pembayaran tanpa sesi sama-sama mengubah saldo kumulatif pemain.
- Pembayaran yang ditautkan ke sesi ditampilkan sebagai pembayaran yang tercatat untuk sesi tersebut; hubungan ini merupakan atribusi untuk riwayat/laporan, bukan alokasi pembayaran ke tagihan tertentu.
- Pembayaran tanpa sesi memengaruhi saldo pemain secara keseluruhan, tetapi tidak dihitung sebagai pembayaran untuk sesi tertentu.
- Kredit lebih bayar otomatis menjadi bagian saldo kumulatif dan mengurangi biaya sesi berikutnya saat saldo dihitung; aplikasi tidak membuat transaksi penggunaan kredit terpisah.
- Pengelola dapat melihat riwayat pembayaran dan status saldo pada menu Transaksi serta profil pemain.
- Setelah pembayaran tersimpan, saldo pemain harus diperbarui dan dapat dilihat kembali dari data Google Sheets terbaru.

#### Dampak pada kas PB

- Pembayaran yang berhasil dicatat menambah pemasukan kas PB sebesar nominal pembayaran.
- Reversal mengurangi pemasukan bersih pembayaran dan saldo kas PB sebesar nominal yang dibalik.
- Saldo kas keseluruhan tetap mengikuti rumus epic: `saldo awal PB + total pembayaran bersih − total pengeluaran PB`.
- Pengeluaran PB dicatat melalui feature keuangan PB terpisah dan tidak dibuat melalui form pembayaran pemain.
- Aplikasi hanya memperbarui saldo kas setelah transaksi pembayaran/reversal berhasil tersimpan.

#### Koreksi dan jejak transaksi

- Pembayaran yang sudah tersimpan tidak dapat diedit atau dihapus permanen melalui alur biasa.
- Editor dapat membuat satu reversal penuh yang merujuk pada ID pembayaran asal dan memiliki tanggal/waktu serta keterangan/alasan.
- Reversal harus berkaitan dengan pemain dan sesi asal (jika ada) agar riwayat dan saldo tetap dapat ditelusuri.
- Satu pembayaran hanya dapat dibalik satu kali; reversal ganda harus ditolak.
- Setelah reversal, aplikasi menghitung ulang saldo pemain dan kas PB, tetapi mempertahankan baris pembayaran asal dan baris reversal.
- Jika nominal atau detail pembayaran perlu diperbaiki, editor mencatat pembayaran baru sebagai pengganti setelah reversal berhasil.
- Reversal mengubah nilai bersih finansial, bukan menghapus fakta bahwa pembayaran awal pernah dicatat.
- Setiap penulisan memiliki ID operasi/idempotensi agar retry permintaan tidak membuat pembayaran atau reversal ganda.

#### Riwayat dan tampilan

- Menu Transaksi menampilkan riwayat pembayaran dan reversal dengan tanggal, pemain, nominal, sesi opsional, status transaksi, dan keterangan.
- Pengelola dapat menelusuri transaksi berdasarkan pemain, rentang tanggal, atau sesi bila tersedia.
- Riwayat menampilkan pembayaran asal dan reversal secara terpisah agar nilai bersih dapat direkonsiliasi.
- Ringkasan pemain menampilkan total tagihan, total pembayaran bersih, saldo, dan status kurang/lunas/lebih bayar.
- Total pembayaran suatu sesi hanya mencakup transaksi pembayaran bersih yang ditautkan ke sesi tersebut; tidak termasuk pembayaran tanpa sesi.
- Viewer dapat membaca daftar, riwayat, dan saldo; hanya editor yang dapat mencatat pembayaran atau reversal.

#### Penyimpanan dan izin

- Pembayaran dan reversal ditulis ke Google Sheets secara langsung setelah editor menyimpan.
- UI hanya menampilkan sukses setelah Google Sheets mengonfirmasi penulisan.
- Jika penulisan gagal atau hasilnya belum pasti, aplikasi tidak boleh mengonfirmasi pembayaran sebagai berhasil dan tidak boleh memperbarui saldo lokal sebagai nilai tersimpan.
- Input yang belum tersimpan dipertahankan agar editor dapat mencoba lagi dengan aman; ID idempotensi yang sama digunakan untuk retry dari operasi yang sama.
- Semua operasi baca/tulis mengikuti akses Google pada feature autentikasi: viewer dapat membaca, editor dapat menulis.
- Hak edit, kepemilikan sesi, dan validitas pembayaran diperiksa di server; UI bukan batas keamanan.
- Kesalahan autentikasi, akses, validasi, kuota, atau jaringan ditampilkan dengan pesan yang jelas tanpa mengungkap token atau data sensitif.

### Non-Functional Requirements

- **Integritas finansial:** Nilai nominal disimpan sebagai bilangan bulat Rupiah; hitungan saldo menggunakan satu fungsi domain server-side.
- **Keterlacakan:** Pembayaran, reversal, ID pemain, ID sesi opsional, waktu, dan relasi transaksi harus dapat ditelusuri.
- **Anti-duplikasi:** Retry untuk operasi yang sama tidak boleh menghasilkan pembayaran/reversal ganda.
- **Konsistensi:** UI membaca saldo dari jurnal yang telah tersimpan; tidak menggunakan status sukses lokal sebagai pengganti konfirmasi Google Sheets.
- **Keamanan:** Token OAuth hanya digunakan di server; semua operasi tulis memvalidasi sesi dan izin edit.
- **Keandalan:** Kegagalan Google Sheets API, kuota, atau koneksi harus ditampilkan sebagai error dan tidak menghasilkan sukses palsu.
- **Kinerja:** Pencatatan pembayaran dan pemuatan ringkasan pemain harus selesai dalam p95 ≤ 3 detik pada kondisi normal untuk volume MVP satu PB.
- **Aksesibilitas:** Status kurang bayar, lunas, lebih bayar, reversal, dan error harus dibedakan melalui teks, bukan warna saja.
- **Privasi:** Keterangan pembayaran bersifat opsional dan tidak meminta data rekening atau informasi pribadi yang tidak diperlukan.

## 7. Acceptance Criteria

### User Story 1 — Mencatat pembayaran kapan saja

- [ ] **Given** editor memilih pemain terdaftar dan memasukkan nominal Rupiah positif serta tanggal pembayaran, **when** ia menyimpan, **then** transaksi tersimpan ke Google Sheets sebelum UI menampilkan sukses.
- [ ] **Given** pemain tidak aktif tetapi terdaftar, **when** editor mencatat pelunasan kewajiban lama, **then** pembayaran tetap dapat disimpan dan saldo pemain dihitung ulang.
- [ ] **Given** nominal kosong, nol, negatif, pecahan, atau bukan angka, **when** editor menyimpan, **then** validasi menolak transaksi dan data Google Sheets tidak berubah.
- [ ] **Given** pembayaran lebih besar daripada tagihan pemain, **when** transaksi tersimpan, **then** seluruh nominal diterima dan kelebihannya tercermin sebagai kredit.
- [ ] **Given** pembayaran kurang dari tagihan, **when** transaksi tersimpan, **then** saldo kekurangan pemain berkurang sebesar nominal pembayaran.
- [ ] **Given** pembayaran dicatat tanpa sesi, **when** transaksi tersimpan, **then** saldo pemain dan kas PB diperbarui walaupun tidak ada sesi yang ditautkan.

### User Story 2 — Menautkan pembayaran ke sesi secara opsional

- [ ] **Given** editor menautkan pembayaran ke sesi yang sudah tersimpan, **when** transaksi berhasil dicatat, **then** transaksi tampil dalam riwayat pembayaran sesi dan tetap memengaruhi saldo kumulatif pemain.
- [ ] **Given** editor memilih sesi yang belum tersimpan atau ID sesi yang tidak valid, **when** transaksi diproses, **then** server menolak pembayaran dan tidak menulis data.
- [ ] **Given** pembayaran tidak memiliki ID sesi, **when** laporan pembayaran sesi dihitung, **then** pembayaran tersebut tidak ditampilkan sebagai pembayaran untuk sesi tertentu.
- [ ] **Given** pembayaran tertaut ke sesi, **when** aplikasi menghitung saldo pemain, **then** pembayaran tidak dialokasikan secara terpisah ke tagihan sesi; saldo tetap dihitung secara kumulatif.

### User Story 3 — Saldo kurang, lunas, dan lebih bayar

- [ ] **Given** total pembayaran bersih lebih kecil dari total tagihan, **when** saldo dimuat, **then** aplikasi menunjukkan status kurang bayar dan selisih yang masih harus dibayar.
- [ ] **Given** total pembayaran bersih sama dengan total tagihan, **when** saldo dimuat, **then** aplikasi menunjukkan status lunas dan saldo nol.
- [ ] **Given** total pembayaran bersih lebih besar dari total tagihan, **when** saldo dimuat, **then** aplikasi menunjukkan status lebih bayar dan jumlah kredit.
- [ ] **Given** pemain memiliki kredit sebelum sesi baru, **when** tagihan sesi baru tersimpan, **then** kredit otomatis mengurangi saldo bersih pemain tanpa transaksi pembayaran tambahan.
- [ ] **Given** pembayaran atau tagihan terkait berubah dan berhasil tersimpan, **when** saldo pemain dimuat ulang, **then** status dan jumlah saldo mencerminkan data terbaru.

### User Story 4 — Reversal dan penggantian transaksi

- [ ] **Given** pembayaran asal valid belum pernah dibalik, **when** editor membuat reversal dengan alasan, **then** reversal tersimpan dengan referensi ke transaksi asal dan mengurangi pembayaran bersih, saldo pemain, serta kas PB.
- [ ] **Given** pembayaran asal sudah dibalik, **when** editor mencoba membaliknya lagi, **then** aplikasi menolak reversal kedua dan nilai finansial tidak berubah.
- [ ] **Given** editor perlu mengoreksi nominal, **when** reversal penuh berhasil, **then** transaksi asal dan reversal tetap terlihat dan editor dapat mencatat transaksi pengganti secara terpisah.
- [ ] **Given** reversal menyimpan gagal, **when** aplikasi menerima kegagalan, **then** pembayaran asal tidak berubah dan reversal tidak ditampilkan sebagai tersimpan.
- [ ] **Given** pembayaran atau reversal dikirim ulang dengan ID operasi yang sama, **when** server memproses retry, **then** tidak ada baris duplikat yang menambah atau mengurangi saldo dua kali.

### User Story 5 — Melihat riwayat dan saldo

- [ ] **Given** pemain mempunyai pembayaran, reversal, dan tagihan, **when** profil atau menu Transaksi dibuka, **then** transaksi ditampilkan terpisah dan total pembayaran bersih serta saldo dapat ditelusuri.
- [ ] **Given** terdapat pembayaran yang terkait sesi dan pembayaran tanpa sesi, **when** total pembayaran sesi ditampilkan, **then** hanya transaksi bersih yang terkait sesi tersebut yang dihitung.
- [ ] **Given** viewer hanya memiliki izin baca, **when** ia membuka menu Transaksi atau profil pemain, **then** ia dapat melihat riwayat dan saldo tetapi tidak dapat mencatat atau membalik transaksi.
- [ ] **Given** Google Sheets gagal dibaca, **when** riwayat atau saldo diminta, **then** aplikasi menampilkan error dan tidak menyajikan saldo lama sebagai data terbaru.

### User Story 6 — Pembayaran memperbarui kas PB dan penanganan gagal

- [ ] **Given** pembayaran tersimpan, **when** ringkasan kas PB dimuat ulang, **then** pemasukan bersih meningkat sebesar nominal pembayaran.
- [ ] **Given** pembayaran dibalik, **when** ringkasan kas PB dimuat ulang, **then** pemasukan bersih berkurang sebesar nominal reversal.
- [ ] **Given** Google Sheets tidak mengonfirmasi penulisan, **when** editor menyimpan pembayaran atau reversal, **then** UI tidak menunjukkan sukses atau memperbarui saldo sebagai nilai persisten.
- [ ] **Given** Google API menolak operasi karena izin tidak cukup, **when** server menerima penolakan, **then** transaksi tidak ditulis dan editor menerima pesan izin yang sesuai.

## 8. Out of Scope

- Memproses transfer bank, QRIS, kartu, dompet digital, atau pembayaran otomatis.
- Mencatat pengeluaran PB; alur tersebut disediakan oleh feature Keuangan PB.
- Meminta pembayaran, mengirim pengingat, atau berkomunikasi langsung dengan pemain.
- Menentukan metode pembayaran, sumber rekening, atau mengimpor mutasi bank.
- Mengalokasikan pembayaran ke tagihan satu per satu dengan FIFO atau prioritas sesi tertentu; saldo dihitung secara kumulatif.
- Mengubah atau menghapus transaksi finansial yang sudah tersimpan tanpa reversal.
- Reversal sebagian, refund otomatis, dan rekonsiliasi bank.
- Membagikan laporan sesi melalui WhatsApp; disediakan oleh feature Laporan Sesi.
