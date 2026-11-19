# Feature PRD: Login Google dan Izin Akses Google Sheets

## 1. Nama Feature

**Login Google dan Izin Akses Google Sheets**

## 2. Epic

- Parent Epic PRD: [epic.md](../epic.md)
- Parent Architecture: [arch.md](../arch.md)

## 3. Goal

### Problem

Aplikasi menyimpan data pemain dan keuangan dalam Google Spreadsheet yang hanya boleh diakses oleh pengguna yang memang diberi izin. Login aplikasi biasa tidak membuktikan bahwa seseorang memiliki akses ke spreadsheet tersebut. Di sisi lain, tidak semua pengguna yang berhak melihat data juga berhak mengubahnya. Tanpa pemeriksaan izin Google di sisi server, aplikasi berisiko membocorkan data atau mengizinkan perubahan dari pengguna yang hanya memiliki akses baca.

### Solution

Pengguna masuk dengan akun Google dan aplikasi memeriksa akses akun tersebut terhadap spreadsheet yang dikonfigurasi. Pengguna yang memiliki izin melihat spreadsheet dapat menggunakan aplikasi dalam mode baca-saja; pengguna dengan izin edit dapat menggunakan operasi baca dan tulis. Permintaan data dilakukan dengan otorisasi Google pengguna, sehingga izin spreadsheet tetap menjadi sumber kebenaran.

### Impact

- Data aplikasi hanya tersedia bagi akun yang dapat mengakses spreadsheet sumber.
- Hak lihat dan hak ubah mengikuti izin Google Sheets, bukan pengaturan role terpisah di aplikasi.
- Pengguna tanpa akses atau yang izinnya dicabut tidak dapat melanjutkan akses.
- Risiko kebocoran token dan akses tulis tanpa izin berkurang.

## 4. User Personas

### Editor Spreadsheet (Pengelola atau Bendahara PB)

Pengguna Google yang memiliki izin edit pada spreadsheet. Pengguna ini dapat melihat data serta membuat atau memperbarui pemain, sesi, pembayaran, dan pengeluaran sesuai fitur aplikasi.

### Viewer Spreadsheet

Pengguna Google yang memiliki izin melihat spreadsheet tetapi tidak memiliki izin edit. Pengguna ini dapat masuk dan melihat dashboard, data pemain, sesi, transaksi, serta laporan, tetapi tidak dapat mengubah data.

### Pengguna Tanpa Izin Spreadsheet

Pengguna yang dapat menyelesaikan login Google tetapi tidak diberi izin membuka spreadsheet yang digunakan aplikasi. Pengguna ini tidak boleh melihat data aplikasi.

## 5. User Stories

1. **Sebagai pengguna yang memiliki akses ke spreadsheet,** saya ingin masuk dengan akun Google saya, **agar aplikasi dapat memverifikasi identitas dan izin saya tanpa membuat akun aplikasi terpisah.**
2. **Sebagai viewer spreadsheet,** saya ingin dapat melihat data aplikasi dalam mode baca-saja, **agar saya dapat memeriksa informasi tanpa dapat mengubah catatan PB.**
3. **Sebagai editor spreadsheet,** saya ingin dapat melakukan perubahan melalui aplikasi, **agar pencatatan mengikuti izin edit yang sudah diberikan kepada akun Google saya.**
4. **Sebagai pengguna yang tidak memiliki akses spreadsheet,** saya ingin mendapat penjelasan bahwa akses ditolak, **agar saya tahu harus meminta izin kepada pemilik spreadsheet.**
5. **Sebagai editor yang kehilangan izin saat sedang menggunakan aplikasi,** saya ingin perubahan ditolak dengan pesan yang jelas, **agar aplikasi tidak mengonfirmasi data yang gagal disimpan.**
6. **Sebagai pengguna,** saya ingin dapat keluar dari aplikasi dan mengautentikasi ulang saat sesi atau token tidak lagi berlaku, **agar akses tetap terlindungi.**

## 6. Requirements

### Functional Requirements

#### Autentikasi Google

- Pengguna harus menyelesaikan login Google sebelum dapat melihat data atau halaman aplikasi yang dilindungi.
- Aplikasi harus memvalidasi respons OAuth di server, termasuk parameter perlindungan terhadap pemalsuan permintaan login.
- Aplikasi harus mengidentifikasi akun menggunakan identitas Google yang stabil; email dapat ditampilkan sebagai informasi akun, tetapi tidak menjadi satu-satunya dasar untuk mencocokkan sesi.
- Pengguna yang membatalkan atau menolak persetujuan Google tidak boleh memperoleh sesi aplikasi.
- Aplikasi harus menyediakan tindakan keluar yang mengakhiri sesi aplikasi lokal.

#### Pemeriksaan akses spreadsheet

- Aplikasi menggunakan satu Spreadsheet ID yang dikonfigurasi di sisi server; pengguna tidak dapat memilih atau mengganti Spreadsheet ID melalui parameter request.
- Setelah login, aplikasi harus mencoba mengakses spreadsheet tersebut menggunakan otorisasi akun Google pengguna.
- Akun yang dapat melihat spreadsheet boleh masuk. Akun dengan izin edit boleh mengakses fitur tulis; akun viewer hanya boleh menggunakan fitur baca.
- Hak edit harus ditentukan dari izin Google yang berlaku, bukan nilai role yang dikirim browser atau pengaturan lokal yang bisa diubah pengguna.
- Bila aplikasi tidak dapat memverifikasi akses baca ke spreadsheet, aplikasi harus menolak akses ke seluruh data bisnis.
- Bila akses edit tidak tersedia, aplikasi harus menampilkan mode baca-saja dan menonaktifkan kontrol perubahan.
- Izin spreadsheet tetap menjadi sumber kebenaran, termasuk izin yang diberikan langsung, melalui grup, atau melalui pengaturan berbagi spreadsheet yang berlaku.
- Aplikasi tidak mengelola atau mengubah daftar pengguna yang diberi akses di Google Drive/Sheets.

#### Otorisasi untuk setiap operasi

- Semua operasi baca dan tulis harus dilayani oleh server menggunakan token OAuth pengguna; browser tidak boleh berkomunikasi langsung dengan Google Sheets API menggunakan token akses aplikasi.
- Semua Route Handler atau titik masuk server yang membaca atau mengubah data harus memvalidasi sesi sebelum menjalankan operasi.
- Setiap operasi tulis harus membutuhkan izin edit. Pemeriksaan dilakukan di server, meskipun UI telah menyembunyikan atau menonaktifkan tombol tulis.
- Jika Google menolak operasi karena izin tidak cukup atau telah dicabut, aplikasi tidak boleh mengembalikan data kosong sebagai sukses atau menyatakan perubahan berhasil.
- Setelah penolakan akses, aplikasi harus menghapus data terlindungi dari tampilan aktif, mengakhiri atau membatasi sesi sesuai kondisi, dan meminta pengguna login ulang atau menghubungi pemilik spreadsheet.
- Jika pengguna memiliki akses baca tetapi belum memberikan persetujuan OAuth untuk scope tulis yang diperlukan, aplikasi harus tetap menyediakan mode baca-saja dan menjelaskan cara memberikan persetujuan untuk mengaktifkan fitur edit.

#### Sesi dan token

- Cookie sesi harus memiliki atribut keamanan yang sesuai, termasuk `HttpOnly`, `Secure` pada HTTPS, dan kebijakan `SameSite` yang sesuai dengan alur OAuth.
- Token OAuth dan rahasia aplikasi tidak boleh dikirim ke JavaScript sisi klien, dimasukkan ke URL, ditulis ke Google Spreadsheet, atau dicatat dalam log.
- Token yang diperlukan untuk akses Google harus disimpan dan digunakan di sisi server dengan perlindungan yang sesuai.
- Aplikasi harus menangani masa berlaku access token dan mencoba refresh token secara aman bila tersedia.
- Jika refresh gagal atau persetujuan OAuth dicabut, akses data harus dihentikan dan pengguna diminta untuk mengautentikasi ulang.
- Sesi aplikasi harus memiliki masa berlaku dan dapat diakhiri melalui logout.

#### Pesan dan kondisi kesalahan

- Aplikasi membedakan setidaknya: login dibatalkan/gagal, akun tidak memiliki akses spreadsheet, akun hanya memiliki izin baca, sesi/token kedaluwarsa, izin dicabut, serta Google API sedang gagal.
- Pesan untuk pengguna tidak boleh membocorkan token, informasi teknis rahasia, atau data spreadsheet.
- Error autentikasi dan otorisasi harus dicatat secara aman untuk diagnosis tanpa mencatat token atau isi sensitif spreadsheet.
- Gangguan sementara Google API tidak boleh dianggap sebagai penolakan permanen atau sukses; aplikasi harus menampilkan kondisi gagal dan menyediakan tindakan coba lagi bila aman.

### Non-Functional Requirements

- **Keamanan:** OAuth authorization-code flow harus memvalidasi state dan callback; semua operasi data menggunakan HTTPS.
- **Otorisasi server-side:** perlindungan UI tidak dianggap sebagai kontrol akses; setiap data route memverifikasi sesi dan hak operasi.
- **Least privilege:** aplikasi meminta scope Google minimum yang diperlukan untuk login, membaca spreadsheet, dan mengubahnya oleh editor. Scope tambahan untuk operasi edit harus diminta dengan jelas bila diperlukan.
- **Privasi:** aplikasi menyimpan hanya identitas minimum untuk sesi dan tidak membuat direktori pengguna aplikasi sebagai sumber izin alternatif.
- **Kerahasiaan:** token refresh dan session secret dilindungi pada infrastruktur server dan dikeluarkan dari response, log, error detail, serta spreadsheet.
- **Ketersediaan:** kegagalan Google OAuth atau Sheets API menghasilkan status error yang jelas; aplikasi tidak mengizinkan akses berdasarkan sesi usang ketika izin Google gagal diverifikasi.
- **Kinerja:** pemeriksaan dan pembuatan sesi login harus selesai dalam ≤ 5 detik pada kondisi normal, tidak termasuk waktu interaksi/persetujuan pengguna pada halaman Google.
- **Aksesibilitas:** halaman login, mode baca-saja, pesan akses ditolak, dan alur autentikasi ulang dapat dinavigasi dengan keyboard dan dipahami oleh pembaca layar dasar.

## 7. Acceptance Criteria

### User Story 1 — Login pengguna yang memiliki akses

- [ ] **Given** pengguna memilih login, **when** Google mengautentikasi akun dan akun tersebut dapat membaca spreadsheet yang dikonfigurasi, **then** aplikasi membuat sesi dan mengarahkan pengguna ke aplikasi.
- [ ] **Given** pengguna membatalkan atau menolak login/consent, **when** callback diterima, **then** aplikasi tidak membuat sesi dan tidak menampilkan data aplikasi.
- [ ] **Given** respons OAuth tidak valid atau state tidak cocok, **when** callback diproses, **then** permintaan ditolak dan tidak ada sesi yang dibuat.

### User Story 2 — Viewer dapat membaca tanpa mengubah

- [ ] **Given** akun memiliki izin lihat spreadsheet tetapi tidak memiliki izin edit, **when** pengguna masuk, **then** halaman data yang diizinkan dapat dilihat dalam mode baca-saja.
- [ ] **Given** pengguna dalam mode baca-saja, **when** UI ditampilkan, **then** kontrol tambah, ubah, dan hapus dinonaktifkan atau tidak tersedia dengan penjelasan yang sesuai.
- [ ] **Given** viewer mengirim permintaan tulis langsung ke endpoint server, **when** permintaan diproses, **then** server menolak operasi dan Google Spreadsheet tidak berubah.

### User Story 3 — Editor dapat melakukan perubahan

- [ ] **Given** akun memiliki izin edit pada spreadsheet dan persetujuan scope yang diperlukan, **when** pengguna mengirim perubahan yang valid, **then** server melakukan perubahan menggunakan token pengguna dan aplikasi menampilkan sukses hanya setelah Google mengonfirmasi penulisan.
- [ ] **Given** editor tidak memberikan persetujuan scope tulis, **when** pengguna masuk, **then** aplikasi tetap dapat memberi mode baca-saja dan menjelaskan langkah untuk mengaktifkan fitur edit.
- [ ] **Given** permintaan tulis tidak valid atau ditolak Google, **when** server memprosesnya, **then** tidak ada konfirmasi sukses palsu dan aplikasi menampilkan pesan error yang sesuai.

### User Story 4 — Pengguna tanpa akses ditolak

- [ ] **Given** akun Google berhasil login tetapi tidak dapat membaca spreadsheet yang dikonfigurasi, **when** pemeriksaan akses dilakukan, **then** aplikasi menolak akses dan tidak mengembalikan data pemain, sesi, maupun keuangan.
- [ ] **Given** pengguna tidak memiliki akses, **when** ia mencoba membuka URL halaman atau endpoint data secara langsung, **then** server menolak permintaan tanpa membocorkan data.
- [ ] **Given** akses spreadsheet ditolak, **when** pesan ditampilkan, **then** pengguna diberi instruksi untuk meminta akses kepada pemilik/pengelola spreadsheet.

### User Story 5 — Izin dicabut saat sesi aktif

- [ ] **Given** pengguna sebelumnya memiliki akses lalu izin dicabut, **when** operasi baca berikutnya ditolak Google, **then** server tidak mengembalikan data baru, menghapus data terlindungi dari tampilan, dan meminta pengguna login ulang atau meminta akses kembali.
- [ ] **Given** izin edit dicabut setelah halaman dimuat, **when** pengguna mencoba menyimpan perubahan, **then** perubahan tidak ditandai berhasil dan UI menampilkan kegagalan izin.
- [ ] **Given** panggilan Google mengalami timeout atau gangguan sementara, **when** operasi data gagal, **then** aplikasi menampilkan kegagalan sementara dan tidak mengubahnya menjadi kondisi akses berhasil.

### User Story 6 — Logout dan kedaluwarsa sesi

- [ ] **Given** pengguna memilih logout, **when** logout selesai, **then** sesi aplikasi dihapus dan halaman terlindungi memerlukan login baru.
- [ ] **Given** access token kedaluwarsa tetapi dapat diperbarui, **when** aplikasi perlu mengakses spreadsheet, **then** token diperbarui di server tanpa mengekspos token ke browser.
- [ ] **Given** token tidak dapat diperbarui atau persetujuan Google dicabut, **when** akses dibutuhkan, **then** operasi dihentikan dan pengguna diminta mengautentikasi ulang.
- [ ] **Given** logout telah dilakukan, **when** browser mengakses halaman terlindungi tanpa cookie sesi yang valid atau dengan cookie yang kedaluwarsa, **then** server menolak akses data dan meminta login kembali.

### Persyaratan keamanan lintas alur

- [ ] Tidak ada token OAuth atau session secret di bundle browser, URL, log, Google Spreadsheet, atau response API.
- [ ] Mengubah nilai role atau status izin dari browser tidak pernah memberikan hak tulis.
- [ ] Semua halaman dan endpoint data terlindungi; tidak ada jalur akses data tanpa sesi Google yang valid.
- [ ] Jika Google API tidak dapat mengonfirmasi operasi tulis, aplikasi tidak menampilkan status tersimpan.

## 8. Out of Scope

- Mengelola undangan, ACL, grup Google, atau izin berbagi spreadsheet dari dalam aplikasi.
- Membuat akun lokal, password aplikasi, role admin aplikasi, atau sistem manajemen pengguna terpisah.
- Mengizinkan login tanpa akun Google atau memberikan akses publik tanpa pemeriksaan izin spreadsheet.
- Mendukung beberapa spreadsheet, beberapa PB, atau beberapa tenant.
- Menerapkan role khusus selain hak baca dan hak edit yang berasal dari izin Google Sheets.
- Mengelola OAuth consent screen, verifikasi aplikasi Google, domain Workspace, atau kebijakan administrator organisasi; hal tersebut menjadi prasyarat konfigurasi deployment.
- Mengizinkan service account bersama untuk melewati izin Google pengguna.
- Menjamin akses tetap tersedia saat Google OAuth/Sheets API tidak dapat dihubungi.
