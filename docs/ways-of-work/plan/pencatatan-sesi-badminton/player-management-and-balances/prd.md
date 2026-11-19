# Feature PRD: Manajemen Pemain dan Saldo Pemain

## 1. Nama Feature

**Manajemen Pemain dan Saldo Pemain**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)

## 3. Goal

### Problem

Pengelola perlu menyimpan daftar pemain yang dapat digunakan kembali pada sesi-sesi berikutnya, tanpa mencampur identitas pemain dengan data sesi atau transaksi. Pemain dapat memiliki tagihan dari beberapa sesi dan pembayaran yang dicatat pada waktu berbeda, sehingga status kurang atau lebih bayar sulit diketahui jika dihitung secara manual. Riwayat harus tetap tersedia walaupun pemain tidak lagi aktif. Pengelola juga perlu membedakan pemain yang dapat dipilih untuk sesi baru dari pemain yang hanya perlu dilihat riwayat dan saldonya.

### Solution

Menyediakan menu Pemain untuk membuat, mencari, melihat, dan memperbarui profil pemain. Profil menggunakan ID stabil dan status aktif/nonaktif, serta menampilkan riwayat sesi/tagihan, pembayaran, dan saldo kumulatif yang dihitung dari data sesi dan transaksi tersimpan di Google Sheets. Pemain nonaktif tetap dapat dilihat beserta riwayatnya, tetapi tidak dapat dipilih untuk sesi baru.

### Impact

- Pemain terdaftar dapat dipakai ulang tanpa membuat ulang identitas pada setiap sesi.
- Pengelola dapat menemukan tagihan, pembayaran, dan status saldo pemain dari satu profil.
- Duplikasi catatan dan kesalahan pengaitan pemain ke sesi atau transaksi berkurang.
- Riwayat dan saldo tetap terlacak ketika pemain berhenti aktif.

## 4. User Personas

### Pengelola Sesi

Editor spreadsheet yang membuat dan memperbarui profil pemain serta mencari pemain saat mengelola kegiatan PB. Pengelola perlu menemukan pemain aktif dengan cepat dan tetap dapat mengakses catatan pemain lama.

### Bendahara PB

Editor spreadsheet yang memeriksa total tagihan dan pembayaran pemain untuk mengetahui apakah pemain masih memiliki kekurangan atau kredit lebih bayar.

### Viewer Spreadsheet

Pengguna dengan akses baca ke spreadsheet yang dapat melihat daftar, riwayat, dan saldo pemain, tetapi tidak dapat menambah atau mengubah profil.

## 5. User Stories

1. **Sebagai pengelola,** saya ingin mendaftarkan pemain dengan nama dan status aktif, **agar pemain dapat dipilih pada sesi dan transaksi berikutnya.**
2. **Sebagai pengelola,** saya ingin mencari dan memfilter daftar pemain, **agar saya dapat menemukan profil yang tepat tanpa membuat duplikasi.**
3. **Sebagai pengelola,** saya ingin memperbarui nama pemain tanpa mengubah ID pemain, **agar perubahan profil tidak memutus kaitan ke sesi dan pembayaran lama.**
4. **Sebagai pengelola,** saya ingin menonaktifkan pemain yang sudah tidak ikut bermain, **agar pemain tidak muncul saat memilih peserta baru tetapi riwayatnya tetap tersimpan.**
5. **Sebagai bendahara,** saya ingin melihat rincian tagihan, pembayaran, dan saldo kumulatif pemain, **agar saya dapat mengetahui kekurangan atau lebih bayar tanpa menghitung manual.**
6. **Sebagai viewer,** saya ingin melihat profil dan saldo pemain tanpa dapat mengubah data, **agar akses baca mengikuti izin Google Sheets saya.**
7. **Sebagai editor,** saya ingin mendapat pesan yang jelas jika penyimpanan profil gagal, **agar saya tidak menganggap data yang belum tersimpan sebagai berhasil.**

## 6. Requirements

### Functional Requirements

#### Data pemain

- Setiap pemain memiliki ID stabil yang dibuat aplikasi dan tidak bergantung pada nomor baris Google Sheets.
- Data minimum pemain terdiri dari ID, nama tampilan, status aktif/nonaktif, serta waktu dibuat dan diperbarui.
- Nama pemain wajib diisi setelah spasi awal/akhir dibuang dan tidak boleh hanya terdiri dari spasi.
- Nomor telepon, alamat email, tanggal lahir, atau data pribadi lain tidak wajib dikumpulkan dalam MVP.
- Nama pemain dapat diperbarui tanpa mengubah ID atau referensi pemain pada sesi dan transaksi sebelumnya.
- Aplikasi tidak menyediakan penghapusan permanen melalui alur normal. Pemain yang tidak lagi dipakai dapat ditandai nonaktif agar seluruh riwayat tetap terhubung.
- Jika terdapat pemain aktif dengan nama yang sama, aplikasi memberi peringatan sebelum pembuatan pemain baru; editor tetap dapat melanjutkan bila memang orang yang berbeda.

#### Daftar dan pencarian

- Menu Pemain menampilkan daftar pemain dengan status dan saldo terkini.
- Daftar secara default menampilkan pemain aktif dan menyediakan filter untuk melihat pemain nonaktif atau semua pemain.
- Pengelola dapat mencari berdasarkan nama pemain tanpa membedakan kapitalisasi.
- Pemilihan atau tampilan pemain harus menggunakan ID stabil; nama yang sama tidak boleh menyebabkan sesi atau pembayaran berpindah ke pemain lain.
- Viewer dapat mencari dan melihat daftar sesuai izin baca, tetapi tidak memperoleh kontrol untuk membuat, mengubah, atau menonaktifkan pemain.

#### Status aktif dan nonaktif

- Editor dapat menonaktifkan pemain tanpa menghapus profil, sesi, tagihan, atau pembayaran.
- Pemain nonaktif tidak tersedia untuk dipilih sebagai peserta pada sesi baru.
- Pemain nonaktif tetap dapat dicari dan dibuka untuk melihat riwayat serta saldo.
- Editor dapat mengaktifkan kembali pemain; setelah diaktifkan, pemain kembali tersedia untuk sesi baru.
- Status nonaktif tidak mengubah tagihan, pembayaran, saldo, atau laporan historis.

#### Riwayat dan saldo pemain

- Profil pemain menampilkan daftar sesi/tagihan dan pembayaran yang terkait dengan ID pemain tersebut.
- Tagihan pemain berasal dari peserta sesi yang tersimpan dan dihitung berdasarkan harga sesi serta jumlah bola pemain: `biaya lapangan per pemain + (harga bola sesi × jumlah bola pemain)`.
- Pembayaran berasal dari seluruh transaksi pembayaran pemain, baik yang tertaut ke sesi maupun yang tidak tertaut ke sesi.
- Saldo kumulatif diturunkan dari data tersimpan dengan rumus `total pembayaran − total tagihan`.
- Saldo negatif menunjukkan kekurangan bayar; saldo positif menunjukkan kredit/lebih bayar; saldo nol berarti tidak ada kekurangan atau kredit.
- Kredit lebih bayar tetap diperhitungkan pada saldo kumulatif untuk tagihan sesi berikutnya.
- Saldo dan status ditampilkan konsisten pada daftar dan profil pemain, dengan label teks selain indikator warna.
- Saldo dihitung dari sumber data Google Sheets saat data diminta; saldo turunan tidak boleh menjadi satu-satunya sumber kebenaran atau mengubah riwayat transaksi.
- Perubahan data sesi, peserta, atau pembayaran yang tersimpan harus tercermin pada tampilan saldo pemain berikutnya setelah data dimuat ulang.
- Riwayat menampilkan jumlah dan tanggal/nilai yang relevan, tetapi fitur ini tidak membuat atau mengubah sesi dan pembayaran.

#### Penyimpanan dan izin

- Semua profil pemain disimpan pada tab `Players` di Google Spreadsheet yang sama dengan data epic lainnya.
- Perubahan profil dikirim ke Google Sheets secara langsung setelah editor menyimpan.
- UI hanya menampilkan konfirmasi berhasil setelah Google Sheets mengonfirmasi penulisan.
- Jika penulisan gagal, aplikasi menampilkan pesan error, mempertahankan input yang belum tersimpan, dan tidak menampilkan nilai baru sebagai data tersimpan.
- Seluruh operasi baca/tulis mengikuti akses Google pada [feature autentikasi](../google-sheets-access/prd.md): viewer dapat membaca, editor dapat membuat atau memperbarui profil.
- Hak edit diverifikasi di server; menonaktifkan tombol pada UI bukan satu-satunya kontrol akses.

### Non-Functional Requirements

- **Integritas referensi:** ID pemain tidak berubah saat nama atau status diedit; setiap peserta dan transaksi tetap terhubung ke pemain yang sama.
- **Konsistensi finansial:** Perhitungan saldo menggunakan satu fungsi domain server-side dan nominal integer Rupiah, bukan perhitungan UI yang berbeda-beda.
- **Kinerja:** Daftar atau profil pemain yang umum digunakan harus dimuat dalam p95 ≤ 3 detik pada kondisi normal untuk satu PB dengan volume data MVP.
- **Keandalan:** Kegagalan Google Sheets API, kuota, atau jaringan harus ditampilkan sebagai kegagalan; tidak ada fallback diam-diam ke penyimpanan lain.
- **Keamanan:** Operasi data hanya dilakukan melalui server dengan sesi dan izin Google yang valid; token OAuth tidak dikirim ke browser.
- **Privasi:** Hanya data minimum pemain yang diperlukan untuk administrasi PB dikumpulkan; data kontak dan data sensitif tidak diminta dalam MVP.
- **Aksesibilitas:** Status aktif, nonaktif, kurang bayar, lunas, dan lebih bayar harus dapat dibedakan melalui teks dan dapat dinavigasi menggunakan keyboard.
- **Keterlacakan:** Waktu pembuatan/perubahan profil disimpan; pengubahan nama tidak menghilangkan jejak keterkaitan historis.

## 7. Acceptance Criteria

### User Story 1 — Mendaftarkan pemain

- [ ] **Given** editor memiliki izin edit, **when** ia menyimpan nama pemain yang valid, **then** pemain dibuat dengan ID stabil, status aktif, dan perubahan tersimpan di Google Sheets sebelum UI menampilkan sukses.
- [ ] **Given** nama kosong atau hanya spasi, **when** editor mencoba menyimpan, **then** validasi menolak data dan tidak ada baris pemain yang dibuat.
- [ ] **Given** nama cocok dengan pemain aktif yang sudah ada, **when** editor membuat profil, **then** aplikasi memperingatkan kemungkinan duplikasi dan hanya membuat profil baru setelah editor mengonfirmasi.
- [ ] **Given** Google Sheets gagal menyimpan profil, **when** editor menerima respons gagal, **then** aplikasi menampilkan error dan tidak menganggap pemain baru telah tersimpan.

### User Story 2 — Mencari dan memfilter pemain

- [ ] **Given** terdapat pemain aktif dan nonaktif, **when** menu Pemain dibuka tanpa filter, **then** daftar hanya menampilkan pemain aktif.
- [ ] **Given** pengguna memilih filter nonaktif atau semua, **when** filter diterapkan, **then** daftar menampilkan pemain sesuai status pilihan.
- [ ] **Given** pengguna mengetik nama pemain, **when** pencarian dijalankan, **then** hasil mencocokkan nama tanpa membedakan kapitalisasi.
- [ ] **Given** terdapat dua pemain dengan nama sama, **when** hasil ditampilkan atau profil dibuka, **then** setiap pemain tetap dibedakan berdasarkan ID dan riwayatnya tidak tercampur.

### User Story 3 — Memperbarui profil

- [ ] **Given** editor mengubah nama pemain, **when** perubahan tersimpan, **then** ID pemain tidak berubah dan seluruh riwayat sesi/pembayaran tetap terhubung.
- [ ] **Given** editor mengirim nama yang tidak valid, **when** penyimpanan diproses, **then** perubahan ditolak dengan pesan validasi dan nama tersimpan tidak berubah.
- [ ] **Given** Google Sheets gagal menerima perubahan, **when** penyimpanan gagal, **then** UI menampilkan kegagalan dan tidak menampilkan nilai baru sebagai nilai persisten.

### User Story 4 — Menonaktifkan dan mengaktifkan pemain

- [ ] **Given** editor menonaktifkan pemain, **when** perubahan tersimpan, **then** profil serta riwayat tetap ada dan pemain tidak tersedia pada pilihan peserta sesi baru.
- [ ] **Given** pemain nonaktif memiliki tagihan atau pembayaran sebelumnya, **when** profilnya dibuka, **then** riwayat dan saldo tetap ditampilkan tanpa perubahan akibat status nonaktif.
- [ ] **Given** editor mengaktifkan kembali pemain, **when** perubahan tersimpan, **then** pemain muncul kembali pada daftar aktif dan dapat dipilih untuk sesi baru.
- [ ] **Given** pengguna mencoba menghapus permanen pemain melalui UI normal, **when** pemain memiliki referensi riwayat, **then** penghapusan ditolak dan aplikasi mengarahkan pengguna untuk menonaktifkannya.

### User Story 5 — Melihat riwayat dan saldo

- [ ] **Given** pemain memiliki beberapa tagihan dan pembayaran, **when** profil dibuka, **then** aplikasi menampilkan riwayat yang terhubung berdasarkan ID pemain dan menghitung saldo sebagai total pembayaran dikurangi total tagihan.
- [ ] **Given** total pembayaran lebih kecil daripada total tagihan, **when** saldo ditampilkan, **then** aplikasi menunjukkan kekurangan bayar sebesar selisihnya.
- [ ] **Given** total pembayaran sama dengan total tagihan, **when** saldo ditampilkan, **then** aplikasi menunjukkan status lunas dan saldo nol.
- [ ] **Given** total pembayaran lebih besar daripada total tagihan, **when** saldo ditampilkan, **then** aplikasi menunjukkan lebih bayar/kredit sebesar selisihnya.
- [ ] **Given** sesi atau pembayaran terkait berubah dan berhasil tersimpan, **when** profil pemain dimuat ulang, **then** rincian dan saldo mencerminkan data Google Sheets terbaru.
- [ ] **Given** Google Sheets gagal dibaca, **when** daftar atau profil dimuat, **then** aplikasi menampilkan error dan tidak menampilkan saldo lama sebagai saldo terkini.

### User Story 6 — Viewer melihat tanpa mengubah

- [ ] **Given** pengguna hanya memiliki izin lihat spreadsheet, **when** ia membuka menu Pemain, **then** ia dapat melihat daftar, profil, riwayat, dan saldo.
- [ ] **Given** viewer mencoba mengirim permintaan tambah, ubah, atau nonaktif melalui endpoint, **when** server memvalidasi permintaan, **then** server menolak operasi dan data Google Sheets tidak berubah.

## 8. Out of Scope

- Mencatat pembayaran, pengeluaran PB, peserta sesi, atau detail biaya sesi; fitur ini hanya membaca data terkait untuk menghitung saldo.
- Mengelola pendaftaran akun atau login pemain; pemain adalah data yang dikelola editor.
- Mengumpulkan nomor telepon, email, tanggal lahir, alamat, foto, kontak darurat, atau informasi pribadi lain.
- Menghapus permanen riwayat pemain atau mengubah transaksi lama.
- Mengelola sesi, memilih pemain pada sesi, atau menambahkan pemain yang belum terdaftar dari dalam formulir sesi.
- Menentukan aturan pembagian pembayaran ke tagihan sesi tertentu; fitur ini menampilkan saldo kumulatif dari semua tagihan dan pembayaran.
- Mengirim notifikasi pengingat pembayaran kepada pemain.
