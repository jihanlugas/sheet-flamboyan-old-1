# Feature PRD: Pembuatan Sesi, Peserta, dan Perhitungan Biaya

## 1. Nama Feature

**Pembuatan Sesi, Peserta, dan Perhitungan Biaya**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)
- Related feature: [Manajemen Pemain dan Saldo Pemain](../player-management-and-balances/prd.md)
- Related feature: [Login Google dan Izin Akses Google Sheets](../google-sheets-access/prd.md)

## 3. Goal

### Problem

Pengelola perlu membuat satu catatan untuk setiap kali bermain dan mencatat pemain yang ikut tanpa mencampur data antar sesi. Perhitungan biaya harus mengikuti harga lapangan dan harga bola yang berlaku pada sesi tersebut, serta pemakaian bola yang berbeda untuk setiap pemain. Jumlah game perlu dicatat sebagai statistik, tetapi tidak boleh memengaruhi tagihan. Jika sesi atau peserta dikoreksi, biaya dan saldo pemain harus mengikuti data terbaru tanpa menghapus pembayaran yang sudah tercatat.

### Solution

Menyediakan alur untuk membuat sesi dengan tanggal/waktu serta harga lapangan per pemain dan harga per bola, lalu menambahkan pemain yang sudah terdaftar dan mencatat jumlah bola serta jumlah game masing-masing. Aplikasi menghitung biaya lapangan satu kali per peserta dan biaya bola berdasarkan jumlah bola peserta. Perubahan data sesi atau peserta disimpan ke Google Sheets dan memperbarui rincian biaya serta saldo pemain yang terdampak.

### Impact

- Setiap sesi dan peserta tercatat secara terstruktur dan dapat ditelusuri di Google Sheets.
- Biaya per pemain dihitung konsisten tanpa kalkulasi manual.
- Jumlah game tetap tersedia sebagai statistik yang tidak mengubah biaya.
- Koreksi data sesi atau peserta tercermin pada saldo pemain tanpa menghapus riwayat pembayaran.

## 4. User Personas

### Pengelola Sesi

Editor spreadsheet yang membuat sesi baru, menambahkan pemain, memasukkan harga dan statistik, serta memeriksa biaya peserta. Pengelola membutuhkan alur yang cepat dan dapat digunakan saat kegiatan berlangsung.

### Bendahara PB

Editor spreadsheet yang memeriksa rincian biaya pemain dan memastikan perubahan sesi tercermin pada saldo pemain.

### Viewer Spreadsheet

Pengguna dengan akses baca yang dapat melihat sesi, peserta, jumlah bola/game, dan rincian biaya, tetapi tidak dapat mengubah data.

## 5. User Stories

1. **Sebagai pengelola sesi,** saya ingin membuat sesi terlebih dahulu dengan tanggal/waktu dan harga yang berlaku, **agar pencatatan peserta dan biaya terhubung ke sesi yang benar.**
2. **Sebagai pengelola sesi,** saya ingin memilih pemain terdaftar atau mendaftarkan pemain baru sebelum menambahkannya, **agar semua peserta memiliki identitas pemain yang konsisten.**
3. **Sebagai pengelola sesi,** saya ingin memasukkan jumlah bola dan jumlah game untuk setiap peserta, **agar pemakaian dan aktivitas pemain dapat dicatat terpisah.**
4. **Sebagai pengelola sesi,** saya ingin melihat biaya lapangan, biaya bola, dan total biaya per peserta, **agar tagihan setiap pemain dihitung otomatis dan transparan.**
5. **Sebagai pengelola sesi,** saya ingin mengoreksi harga atau data peserta setelah sesi dibuat, **agar kesalahan input dapat diperbaiki dan saldo pemain diperbarui.**
6. **Sebagai pengelola sesi,** saya ingin menghapus peserta yang keliru ditambahkan tanpa menghapus pembayaran yang sudah diterima, **agar koreksi keikutsertaan tetap menjaga catatan keuangan.**
7. **Sebagai viewer,** saya ingin melihat rincian sesi tanpa dapat mengubahnya, **agar akses baca mengikuti izin Google Sheets saya.**
8. **Sebagai editor,** saya ingin mendapat pesan yang jelas jika penyimpanan sesi gagal, **agar perubahan yang belum tersimpan tidak dianggap berhasil.**

## 6. Requirements

### Functional Requirements

#### Pembuatan dan penyimpanan sesi

- Editor harus membuat dan menyimpan sesi sebelum menambahkan peserta.
- Setiap sesi memiliki ID stabil yang dibuat aplikasi, tanggal/waktu sesi, harga lapangan per pemain, dan harga bola per bola.
- Harga lapangan dan harga bola wajib diisi; nilai `0` valid dan nilai negatif tidak valid.
- Harga dicatat sebagai bilangan bulat Rupiah. Harga lapangan adalah jumlah yang dibebankan sekali kepada setiap peserta, bukan total yang dibagi rata.
- Dua sesi dapat terjadi pada tanggal/waktu yang sama; ID sesi tetap membedakan keduanya.
- Sesi dapat disimpan tanpa peserta. Total biaya sesi untuk keadaan tersebut adalah nol.
- Aplikasi tidak boleh menambahkan peserta atau pembayaran terkait sesi sebelum sesi tersimpan. Pembayaran dicatat melalui feature Transaksi, bukan melalui feature ini.
- Sesi dan peserta disimpan pada tab `Sessions` dan `Participants` dalam Google Spreadsheet yang sama.

#### Menambahkan dan mengelola peserta

- Peserta harus merujuk ke pemain yang sudah terdaftar dan berstatus aktif.
- Dari alur pemilihan peserta, editor dapat memulai pendaftaran pemain baru melalui feature Manajemen Pemain; pemain harus tersimpan terlebih dahulu sebelum dapat ditambahkan ke sesi.
- Pemain nonaktif tidak dapat ditambahkan ke sesi baru.
- ID pemain dan ID sesi digunakan sebagai referensi; nama pemain tidak boleh digunakan sebagai kunci relasi.
- Pemain yang sama tidak dapat ditambahkan lebih dari sekali pada sesi yang sama.
- Untuk setiap peserta, editor mencatat jumlah bola yang digunakan dan jumlah game yang dimainkan.
- Jumlah bola dan jumlah game harus berupa bilangan bulat nol atau lebih. Nilai awal boleh `0` dan nilai `0` tidak boleh diperlakukan sebagai data negatif atau kosong.
- Editor dapat memperbarui jumlah bola dan jumlah game peserta setelah ditambahkan.
- Editor dapat menghapus peserta yang keliru ditambahkan. Penghapusan peserta menghapus tagihan peserta dari sesi dan memicu perhitungan ulang saldo pemain.
- Penghapusan peserta tidak menghapus profil pemain atau pembayaran yang sudah dicatat. Pembayaran yang sebelumnya tertaut ke sesi tetap tersimpan dan diperhitungkan sebagai pembayaran/kredit pada saldo pemain.

#### Perhitungan biaya

- Biaya lapangan per peserta dihitung satu kali: `harga lapangan sesi`.
- Biaya bola per peserta dihitung sebagai `harga bola sesi × jumlah bola yang digunakan peserta`.
- Total biaya peserta dihitung sebagai `biaya lapangan per peserta + biaya bola per peserta`.
- Jumlah game tidak memengaruhi biaya peserta.
- Jika harga lapangan atau harga bola adalah `0`, komponen biaya terkait bernilai `0`.
- Total biaya sesi yang ditampilkan adalah jumlah total biaya seluruh peserta. Nilai tersebut adalah total tagihan, bukan total pembayaran yang diterima atau pemasukan kas.
- Rincian biaya per peserta dan jumlah total peserta harus ditampilkan pada detail sesi.
- Semua perhitungan dijalankan di server menggunakan satu aturan domain; nilai biaya yang dikirim dari browser tidak dipercaya sebagai sumber perhitungan.
- Perubahan harga lapangan atau harga bola pada sesi yang sudah tersimpan menghitung ulang biaya semua peserta dan saldo pemain yang terdampak.
- Perubahan jumlah bola atau penghapusan peserta menghitung ulang biaya serta saldo pemain terkait; jumlah game tetap hanya statistik.
- Pembayaran yang sudah dicatat tidak diubah atau dihapus ketika tagihan dihitung ulang.

#### Daftar dan detail sesi

- Menu Sesi menampilkan sesi tersimpan dengan tanggal/waktu dan ringkasan jumlah peserta serta total biaya.
- Editor dapat membuka detail sesi untuk melihat harga sesi, daftar peserta, jumlah bola, jumlah game, biaya per peserta, dan total tagihan sesi.
- Viewer dapat melihat daftar dan detail sesi sesuai izin baca, tetapi tidak mendapat kontrol tambah, ubah, atau hapus.
- Feature ini tidak mengatur status sesi buka/tutup atau mengunci perubahan setelah sesi selesai; perubahan harga dan peserta mengikuti persyaratan koreksi di atas.
- Laporan akhir yang siap dibagikan dan pengiriman WhatsApp ditangani oleh feature laporan sesi terpisah.

#### Penyimpanan langsung dan akses

- Setiap pembuatan atau perubahan sesi/peserta dikirim ke Google Sheets setelah editor menyimpan.
- UI hanya mengonfirmasi sukses setelah Google Sheets mengonfirmasi penulisan.
- Jika penulisan gagal, aplikasi menampilkan error, mempertahankan input yang belum tersimpan, dan tidak menampilkan perubahan sebagai data persisten.
- Setelah perubahan sesi atau peserta tersimpan, nilai biaya dan saldo yang terdampak harus ditampilkan dari data terbaru.
- Semua operasi mengikuti hak Google pada feature autentikasi: viewer dapat membaca; hanya editor yang dapat menulis.
- Hak edit diperiksa di server untuk setiap operasi tulis, bukan hanya melalui kontrol UI.

### Non-Functional Requirements

- **Integritas relasi:** ID sesi dan pemain stabil, unik, dan tidak bergantung pada nomor baris Google Sheets.
- **Akurasi finansial:** Nilai uang disimpan sebagai bilangan bulat Rupiah dan perhitungan biaya menggunakan fungsi domain server-side yang sama.
- **Kinerja:** Daftar/detail sesi dan perhitungan biaya untuk ukuran sesi komunitas umum harus selesai dalam p95 ≤ 3 detik pada kondisi normal.
- **Keandalan:** Kegagalan Google Sheets API, kuota, atau koneksi harus dilaporkan; aplikasi tidak boleh menganggap penulisan yang belum dikonfirmasi berhasil.
- **Konsistensi:** Google Sheets menjadi sumber data utama; perubahan yang berhasil tersimpan tercermin pada tampilan setelah data dimuat ulang.
- **Keamanan:** Operasi data dilakukan di server dengan sesi dan izin Google yang valid; token OAuth tidak dikirim ke browser.
- **Aksesibilitas:** Formulir harga dan jumlah mudah digunakan dengan keyboard; error validasi dikaitkan dengan field dan status biaya disampaikan dengan teks.

## 7. Acceptance Criteria

### User Story 1 — Membuat sesi sebelum peserta

- [ ] **Given** editor memasukkan tanggal/waktu dan harga lapangan serta bola yang valid, **when** ia menyimpan sesi, **then** sesi dibuat dengan ID stabil dan tersimpan di Google Sheets sebelum dapat ditambahkan peserta.
- [ ] **Given** harga lapangan atau bola bernilai `0`, **when** sesi disimpan, **then** nilai tersebut diterima sebagai harga valid.
- [ ] **Given** salah satu harga kosong atau negatif, **when** sesi disimpan, **then** validasi menolak sesi dan tidak membuat data tersimpan.
- [ ] **Given** sesi dibuat tanpa peserta, **when** detail sesi dibuka, **then** sesi tetap tersedia dan total tagihannya nol.
- [ ] **Given** editor mencoba menambahkan peserta sebelum sesi berhasil tersimpan, **when** permintaan diproses, **then** server menolak penambahan tersebut.

### User Story 2 — Memilih atau membuat pemain untuk sesi

- [ ] **Given** editor membuka pemilih peserta, **when** daftar pemain ditampilkan, **then** hanya pemain aktif yang dapat dipilih.
- [ ] **Given** pemain belum terdaftar, **when** editor memulai pendaftaran dari alur sesi, **then** pemain harus tersimpan melalui alur Manajemen Pemain sebelum dapat ditambahkan sebagai peserta.
- [ ] **Given** pemain sudah menjadi peserta sesi, **when** editor mencoba menambahkannya kembali, **then** aplikasi menolak duplikasi dan daftar sesi tidak berubah.
- [ ] **Given** pemain berstatus nonaktif, **when** editor mencoba menambahkannya, **then** aplikasi menolak penambahan tersebut.

### User Story 3 — Mencatat jumlah bola dan game

- [ ] **Given** peserta sesi dipilih, **when** editor menyimpan jumlah bola dan jumlah game berupa bilangan bulat nol atau lebih, **then** nilai tersimpan pada peserta yang benar.
- [ ] **Given** jumlah bola atau jumlah game negatif, pecahan, atau bukan angka, **when** editor menyimpan, **then** aplikasi menolak input dan menampilkan error pada field terkait.
- [ ] **Given** jumlah game berubah tetapi jumlah bola dan harga tetap, **when** perubahan tersimpan, **then** statistik game berubah tetapi biaya peserta tidak berubah.

### User Story 4 — Melihat rincian dan total biaya

- [ ] **Given** harga lapangan `L`, harga bola `B`, jumlah bola peserta `N`, dan jumlah game `G`, **when** rincian biaya dihitung, **then** biaya lapangan peserta adalah `L`, biaya bola peserta `B × N`, dan totalnya `L + (B × N)`, terlepas dari nilai `G`.
- [ ] **Given** terdapat beberapa peserta, **when** total biaya sesi ditampilkan, **then** total tersebut sama dengan jumlah total biaya masing-masing peserta.
- [ ] **Given** biaya lapangan atau harga bola bernilai nol, **when** biaya dihitung, **then** komponen tersebut dan total terkait dihitung dengan benar.
- [ ] **Given** jumlah bola peserta nol, **when** biaya dihitung, **then** biaya bola peserta adalah nol dan biaya lapangan tetap dibebankan satu kali.
- [ ] **Given** rincian sesi ditampilkan, **when** editor atau viewer melihat detail, **then** rincian biaya lapangan, biaya bola, total per peserta, dan total tagihan sesi tersedia.

### User Story 5 — Mengoreksi sesi atau peserta

- [ ] **Given** editor mengubah harga sesi yang sudah tersimpan, **when** perubahan berhasil disimpan, **then** biaya semua peserta dan saldo pemain terdampak dihitung ulang, sementara pembayaran tetap tidak berubah.
- [ ] **Given** editor mengubah jumlah bola peserta, **when** perubahan berhasil disimpan, **then** biaya bola, total biaya peserta, total sesi, dan saldo pemain terkait diperbarui.
- [ ] **Given** editor menghapus peserta, **when** penghapusan berhasil disimpan, **then** tagihan peserta dihapus dari total sesi dan saldo kumulatif pemain dihitung ulang.
- [ ] **Given** peserta yang dihapus memiliki pembayaran yang tertaut ke sesi, **when** peserta dihapus, **then** pembayaran tetap tercatat dan menjadi kredit pada saldo pemain, bukan dihapus atau dibatalkan.
- [ ] **Given** Google Sheets gagal menyimpan koreksi, **when** permintaan gagal, **then** UI menampilkan error dan tidak melaporkan biaya atau saldo sebagai telah diperbarui.

### User Story 6 — Viewer melihat tanpa mengubah

- [ ] **Given** pengguna hanya memiliki izin lihat spreadsheet, **when** ia membuka menu atau detail sesi, **then** ia dapat melihat data sesi dan rincian biaya.
- [ ] **Given** viewer mengirim permintaan langsung untuk membuat, mengubah, menambah peserta, atau menghapus peserta, **when** server memvalidasi permintaan, **then** server menolak operasi dan Google Sheets tidak berubah.

### User Story 7 — Menangani kegagalan simpan

- [ ] **Given** koneksi atau Google Sheets API gagal saat simpan, **when** aplikasi menerima kegagalan, **then** pengguna melihat pesan yang jelas dan input belum tersimpan tetap tersedia untuk dicoba ulang.
- [ ] **Given** respons Google Sheets belum mengonfirmasi penulisan, **when** UI menampilkan status operasi, **then** UI tidak menunjukkan sukses atau nilai baru sebagai persisten.
- [ ] **Given** operasi berhasil dan data dimuat ulang, **when** sesi dibuka kembali, **then** harga, peserta, jumlah bola/game, dan biaya sesuai dengan nilai yang telah tersimpan.

## 8. Out of Scope

- Mencatat pembayaran pemain atau pengeluaran PB; pembayaran dikelola melalui feature Transaksi.
- Menghitung saldo kas PB atau melakukan rekonsiliasi pemasukan.
- Menampilkan atau membagikan laporan akhir sesi melalui WhatsApp; disediakan oleh feature Laporan Sesi.
- Mengelola profil pemain secara penuh; pendaftaran dan perubahan profil mengikuti feature Manajemen Pemain dan Saldo Pemain.
- Penjadwalan, pemesanan lapangan, pengelompokan pasangan, rotasi, skor, turnamen, atau hasil pertandingan.
- Pembagian biaya lapangan total secara rata atau per jam; biaya lapangan pada epic ini adalah biaya tetap satu kali per peserta.
- Diskon, pajak, tarif berbeda per pemain, atau pembulatan/konversi mata uang.
- Penguncian sesi atau aturan status buka/tutup.
