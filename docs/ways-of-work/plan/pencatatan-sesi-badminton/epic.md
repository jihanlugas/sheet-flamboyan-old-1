# PRD Epic: Pencatatan Sesi Bermain Badminton

## 1. Nama Epic

**Pencatatan Sesi Bermain Badminton dan Keuangan PB**

## 2. Goal

### Problem

Pencatatan sesi badminton, biaya pemain, pembayaran, dan keuangan Perkumpulan/Badan (PB) saat ini berisiko tersebar atau dilakukan secara manual sehingga sulit ditelusuri. Pengelola perlu mengetahui siapa yang ikut setiap sesi, berapa biaya yang menjadi tanggungan tiap pemain, dan apakah pembayaran mereka masih kurang atau sudah lebih. Pembayaran dapat dilakukan pada waktu yang berbeda dari sesi bermain, sehingga saldo pemain perlu dihitung secara kumulatif. Pengelola juga membutuhkan laporan sesi yang mudah dibagikan dan catatan arus kas PB yang dapat dijadikan referensi.

### Solution

Membangun aplikasi web berbasis Next.js yang menggunakan satu Google Spreadsheet sebagai sumber data utama. Pengelola dapat mengelola pemain, membuat sesi, mencatat jumlah bola dan jumlah game per pemain, merekam pembayaran kapan saja, serta melihat saldo pemain dan saldo kas PB yang diperbarui berdasarkan transaksi. Aplikasi menyediakan laporan sesi yang dapat dibagikan melalui WhatsApp.

### Impact

- Pencatatan sesi dan transaksi lebih terstruktur serta dapat ditelusuri kembali di Google Sheets.
- Waktu yang dibutuhkan untuk menghitung biaya dan membuat laporan sesi berkurang.
- Kesalahan hitung biaya, saldo pemain, dan kas PB berkurang.
- Pengelola dapat mengetahui piutang pemain, kredit lebih bayar, dan posisi kas PB dengan lebih cepat.

## 3. User Personas

### Pengelola Sesi

Pengurus atau operator PB yang membuat sesi, mendaftarkan pemain, memasukkan jumlah bola dan game, serta membagikan laporan sesi. Pengguna ini membutuhkan alur input yang cepat, terutama saat dan setelah sesi bermain.

### Bendahara PB

Pengurus yang mencatat pembayaran, memantau kekurangan atau kelebihan pembayaran pemain, mencatat pengeluaran PB, serta memeriksa saldo kas dan riwayat transaksi.

### Pemain

Pemain yang terdaftar dan mengikuti sesi. Pada MVP, pemain merupakan subjek data; mereka tidak harus memiliki akun atau mengakses aplikasi secara langsung.

## 4. High-Level User Journeys

### Membuat sesi dan mencatat pemain

1. Pengelola masuk menggunakan akun Google yang memiliki akses ke Google Spreadsheet yang digunakan aplikasi.
2. Pengelola membuat sesi baru dengan tanggal/waktu dan harga lapangan serta harga bola. Nilai harga boleh `0`.
3. Pengelola menambahkan pemain yang sudah terdaftar ke sesi. Jika pemain belum terdaftar, pengelola membuat data pemain terlebih dahulu, lalu menambahkannya ke sesi.
4. Untuk setiap pemain dalam sesi, pengelola mencatat jumlah bola yang digunakan dan jumlah game yang dimainkan.
5. Aplikasi menghitung biaya pemain dan memperbarui saldo pemain setelah perubahan tersimpan di Google Sheets.

### Mencatat pembayaran dan memeriksa saldo pemain

1. Pengelola membuka menu Transaksi dan memilih pemain.
2. Pengelola mencatat nominal pembayaran, tanggal, dan keterangan opsional. Pembayaran boleh dicatat kapan saja dan nominalnya boleh kurang dari, sama dengan, atau lebih dari tagihan.
3. Jika pembayaran ditujukan untuk sesi tertentu, pengelola dapat menghubungkannya ke sesi tersebut; pembayaran tanpa sesi tetap memengaruhi saldo pemain.
4. Aplikasi memperbarui saldo pemain dan saldo kas PB setelah transaksi tersimpan.
5. Pengelola dapat melihat riwayat pembayaran, tagihan, kekurangan bayar, atau kredit lebih bayar pemain.

### Meninjau dan membagikan laporan sesi

1. Pengelola memilih sesi yang sudah dibuat.
2. Aplikasi menampilkan daftar peserta, jumlah bola dan game, rincian biaya, pembayaran yang tercatat untuk sesi, dan saldo pemain.
3. Pengelola membagikan ringkasan sesi melalui WhatsApp menggunakan teks laporan yang disiapkan aplikasi.

### Mencatat arus kas PB

1. Bendahara melihat saldo kas PB saat ini dan riwayat pemasukan/pengeluaran.
2. Bendahara mencatat pengeluaran PB dengan nominal, tanggal, dan keterangan.
3. Aplikasi menghitung saldo kas dari saldo awal, pembayaran yang diterima, dan pengeluaran PB yang dicatat.

## 5. Business Requirements

### Functional Requirements

#### A. Akses dan autentikasi

- Pengguna harus masuk dengan akun Google sebelum mengakses dashboard atau data aplikasi.
- Akses aplikasi dibatasi kepada akun Google yang memiliki izin untuk membuka Google Spreadsheet sumber data.
- Aplikasi harus memverifikasi akses spreadsheet di sisi server; menyembunyikan UI saja tidak cukup untuk mengamankan data.
- Jika akun tidak memiliki akses atau izin sudah dicabut, aplikasi harus menolak akses dan memberi tahu pengguna dengan jelas.

#### B. Penyimpanan data

- Seluruh data bisnis MVP disimpan dalam satu Google Spreadsheet, menggunakan tab terpisah untuk data pemain, sesi, peserta sesi, pembayaran, pengeluaran, penyesuaian kas, dan konfigurasi bila diperlukan.
- Google Sheets menjadi sumber data utama; aplikasi tidak boleh menganggap perubahan yang belum berhasil ditulis ke spreadsheet sebagai data tersimpan.
- Setiap perubahan data harus dikirim ke Google Sheets secara langsung setelah pengguna menyimpannya.
- Aplikasi hanya menampilkan konfirmasi berhasil setelah Google Sheets mengonfirmasi penulisan. Jika gagal, aplikasi menampilkan pesan kegagalan dan mempertahankan input agar dapat dicoba kembali.
- Riwayat transaksi dan pengeluaran tidak boleh hilang ketika saldo pemain atau saldo PB dihitung ulang.

#### C. Pengelolaan pemain

- Pengelola dapat membuat, melihat, dan memperbarui data pemain.
- Pemain harus sudah terdaftar sebelum dapat ditambahkan sebagai peserta sesi atau menjadi pihak pada transaksi pembayaran.
- Profil pemain menampilkan riwayat sesi/tagihan, riwayat pembayaran, saldo terkini, serta status kurang atau lebih bayar.
- Pemain yang telah memiliki riwayat transaksi tidak boleh dihapus secara permanen melalui alur biasa; pengelola dapat menandainya tidak aktif agar riwayat tetap utuh.

#### D. Pengelolaan sesi dan peserta

- Pengelola dapat membuat sesi baru sebelum mencatat peserta atau pembayaran yang terkait dengan sesi tersebut.
- Setiap sesi mencatat sekurang-kurangnya tanggal/waktu, harga lapangan per pemain, harga bola per bola, dan status sesi.
- Harga lapangan dan harga bola dapat bernilai `0`, tetapi tidak boleh bernilai negatif.
- Pengelola dapat memasukkan pemain yang sudah terdaftar sebagai peserta sesi.
- Untuk setiap peserta, pengelola dapat mencatat jumlah bola yang digunakan dan jumlah game yang dimainkan. Keduanya harus bernilai nol atau lebih.
- Jumlah game dicatat sebagai statistik dan tidak memengaruhi perhitungan biaya.
- Aplikasi mencegah pemain yang sama ditambahkan lebih dari sekali pada sesi yang sama.
- Perubahan sesi atau peserta memperbarui rincian biaya dan saldo pemain yang terdampak.

#### E. Perhitungan biaya dan saldo pemain

- Biaya lapangan dibebankan satu kali kepada setiap pemain yang terdaftar sebagai peserta sesi.
- Biaya bola per pemain dihitung sebagai `harga bola sesi × jumlah bola yang digunakan pemain`.
- Total biaya pemain pada sesi dihitung sebagai `biaya lapangan per pemain + biaya bola per pemain`.
- Pembayaran pemain dapat dicatat kapan saja, termasuk setelah sesi selesai, dan nominal pembayaran tidak dibatasi oleh total tagihan.
- Saldo pemain dihitung secara kumulatif dari seluruh tagihan dan pembayaran pemain:
  - Saldo negatif menunjukkan jumlah yang masih harus dibayar.
  - Saldo positif menunjukkan kredit/lebih bayar yang dapat digunakan untuk tagihan berikutnya.
  - Saldo nol menunjukkan tidak ada kekurangan maupun kredit.
- Pembayaran dapat dihubungkan ke sesi terkait atau dicatat tanpa sesi; keduanya tetap memengaruhi saldo pemain.
- Aplikasi harus menampilkan status kurang bayar, lunas, atau lebih bayar secara konsisten pada menu Pemain, Sesi, dan Transaksi.
- Perubahan biaya sesi harus tercermin pada saldo seluruh peserta yang terdampak tanpa menghapus riwayat pembayaran.

#### F. Transaksi dan keuangan PB

- Pengelola dapat mencatat pembayaran pemain kapan saja, dengan nominal, tanggal, pemain, dan keterangan opsional.
- Pengelola dapat mencatat pengeluaran PB dengan nominal, tanggal, kategori/keterangan, dan nilai yang tidak negatif.
- Pembayaran yang diterima dan pengeluaran PB harus dicatat sebagai transaksi sehingga dapat ditelusuri.
- Saldo kas PB dihitung sebagai `saldo awal PB + total pembayaran bersih − total pengeluaran bersih + total penyesuaian kas bersih`.
- Tagihan pemain yang belum dibayar bukan pemasukan kas; hanya pembayaran yang benar-benar dicatat sebagai diterima yang menambah saldo kas PB.
- Saldo awal PB ditetapkan satu kali pada konfigurasi awal dan dicatat agar perhitungan saldo memiliki dasar yang jelas. Koreksi berikutnya dicatat sebagai transaksi penyesuaian kas berjejak, bukan dengan menimpa nilai awal.
- Menu Transaksi menampilkan riwayat pembayaran dan pengeluaran, serta ringkasan saldo pemain dan saldo PB.

#### G. Dashboard dan laporan sesi

- Dashboard menampilkan ringkasan yang berguna bagi pengelola, sekurang-kurangnya sesi terbaru, jumlah pemain, total kekurangan/kelebihan saldo pemain, dan saldo PB.
- Laporan sesi menampilkan:
  - Daftar pemain yang ikut.
  - Jumlah bola dan jumlah game per pemain.
  - Biaya lapangan dan biaya bola per pemain.
  - Total biaya per pemain.
  - Pembayaran yang dicatat untuk sesi, jika ada.
  - Total tagihan sesi dan total pembayaran sesi.
  - Status saldo pemain setelah memperhitungkan seluruh tagihan dan pembayaran.
- Laporan sesi dapat disalin atau dibagikan sebagai teks melalui WhatsApp. Pengiriman otomatis melalui WhatsApp Business API tidak termasuk kebutuhan MVP.

#### H. Navigasi aplikasi

- Aplikasi menyediakan menu Dashboard, Pemain, Sesi, dan Transaksi.
- Menu Pemain mendukung akses ke saldo dan riwayat setiap pemain.
- Menu Sesi mendukung pembuatan sesi, pengelolaan peserta, dan laporan sesi.
- Menu Transaksi mendukung pencatatan pembayaran pemain dan pengeluaran PB.

### Non-Functional Requirements

- **Keamanan:** Token OAuth dan kredensial Google disimpan serta digunakan hanya di sisi server dan tidak diekspos ke browser atau spreadsheet.
- **Otorisasi:** Semua endpoint dan operasi data memeriksa autentikasi serta akses spreadsheet, bukan hanya perlindungan pada tampilan halaman.
- **Integritas data:** Perubahan finansial harus mencegah pencatatan ganda saat permintaan diulang dan menghindari saldo yang tidak konsisten ketika beberapa pengguna melakukan perubahan bersamaan.
- **Keterlacakan:** Setiap baris transaksi menyimpan identitas/rujukan yang cukup untuk mengetahui pemain, sesi (jika ada), tanggal, nominal, dan jenis transaksi.
- **Keandalan:** Kegagalan Google Sheets API, kuota, atau koneksi harus dilaporkan dengan jelas; aplikasi tidak boleh menampilkan keberhasilan palsu atau berpindah diam-diam ke penyimpanan lain.
- **Kinerja:** Operasi baca/tulis umum harus memberi respons yang layak untuk penggunaan satu PB skala komunitas; sasaran awal waktu respons p95 adalah ≤ 3 detik pada kondisi layanan Google Sheets normal.
- **Deployment:** Aplikasi ditargetkan untuk di-deploy ke Vercel. Integrasi OAuth dan penulisan Google Sheets harus tetap aman dan benar pada runtime Vercel yang dapat menjalankan permintaan pada instance berbeda; aplikasi tidak boleh mengandalkan state atau lock di memori satu proses.
- **Kemudahan penggunaan:** Alur input harus nyaman digunakan di perangkat desktop maupun ponsel, terutama untuk mencatat peserta dan pembayaran.
- **Aksesibilitas:** Formulir, status pembayaran, pesan kesalahan, dan navigasi dapat digunakan dengan keyboard dan pembaca layar dasar; status tidak dibedakan hanya dengan warna.
- **Privasi:** Aplikasi hanya meminta izin Google yang diperlukan untuk identitas pengguna dan akses spreadsheet yang dipilih. Data pemain tidak dibagikan melalui WhatsApp kecuali sebagai bagian dari laporan yang secara sengaja dibagikan pengelola.
- **Konsistensi:** Nilai uang menggunakan satu mata uang untuk satu spreadsheet. Asumsi awal adalah Rupiah (IDR), dan format nominal harus konsisten pada UI maupun laporan.

## 6. Success Metrics

Target berikut merupakan target awal MVP dan dapat disesuaikan setelah baseline penggunaan tersedia.

- **Kelengkapan pencatatan:** 100% sesi yang dikelola melalui aplikasi memiliki data harga sesi dan daftar peserta yang tersimpan di Google Sheets.
- **Akurasi perhitungan:** 100% sampel perhitungan biaya dan saldo pada pengujian penerimaan sesuai dengan rumus yang disepakati.
- **Ketepatan persistensi:** ≥ 99% operasi penyimpanan yang berhasil di sisi aplikasi tercermin pada Google Sheets tanpa duplikasi transaksi.
- **Efisiensi laporan:** Pengelola dapat menghasilkan dan membagikan laporan sesi dalam ≤ 2 menit setelah data sesi lengkap.
- **Adopsi alur:** ≥ 90% sesi dalam periode uji coba dicatat melalui aplikasi, bukan pencatatan terpisah.
- **Keterlihatan saldo:** Pengelola dapat melihat status kurang/lunas/lebih bayar dan saldo kas PB tanpa menghitung ulang secara manual.

## 7. Out of Scope

- Pemrosesan pembayaran digital, transfer bank, QRIS, atau rekonsiliasi otomatis dengan rekening.
- Pengiriman pesan otomatis melalui WhatsApp Business API; MVP hanya menyiapkan teks laporan untuk dibagikan pengguna.
- Pengelolaan banyak PB atau banyak Google Spreadsheet dalam satu akun aplikasi.
- Pendaftaran akun pemain mandiri, portal pemain, atau akses aplikasi untuk pemain tanpa izin spreadsheet.
- Penjadwalan lapangan, pemesanan venue, pembentukan pasangan/rotasi, turnamen, dan pencatatan skor pertandingan.
- Akuntansi penuh, laporan pajak, anggaran, jurnal umum, dan integrasi dengan sistem pembukuan lain.
- Sinkronisasi luring dan antrean perubahan saat Google Sheets tidak dapat diakses.
- Penghapusan otomatis atau pengubahan riwayat transaksi yang telah tercatat.

## 8. Business Value

**Tinggi.** Epic ini mengurangi pekerjaan administratif dan kesalahan hitung yang terjadi berulang pada setiap sesi, sekaligus membuat kewajiban pemain, pembayaran, serta arus kas PB lebih transparan. Penggunaan Google Sheets mempertahankan akses langsung ke data referensi yang sudah familier bagi pengelola, sementara aplikasi menyediakan alur pencatatan dan perhitungan yang lebih konsisten.
