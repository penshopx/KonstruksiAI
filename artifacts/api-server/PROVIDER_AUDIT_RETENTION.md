# Retensi audit pemeriksaan provider AI

Pemilik produk menyetujui retensi **180 hari** pada 8 November 2026.

- Hanya tabel `tender_provider_audit` yang dibersihkan. Riwayat eksekusi AI,
  hasil analisis Tender, dan data pengguna tidak termasuk kebijakan ini.
- Hari berarti 24 jam berlalu, dihitung dari waktu pemeriksaan dalam UTC.
  Catatan dihapus permanen hanya jika waktunya **lebih tua** dari
  `waktu pembersihan − 180 × 24 jam`. Catatan tepat di batas tetap disimpan.
- Server menjalankan pembersihan setelah startup dan setiap 24 jam setelah
  pembersihan selesai. Saat server tidak aktif, pembersihan tertunda sampai
  startup berikutnya. Ini bukan jadwal pada jam kalender tertentu.
- Penghapusan dibatasi 500 catatan per transaksi otomatis SQLite, dengan jeda
  antarbatas agar permintaan lain dapat diproses. Waktu batas tidak bergeser
  selama satu rangkaian pembersihan. Pengulangan aman jika proses terputus.
- Kesalahan dicatat di log dan dicoba lagi pada jadwal harian berikutnya.
  Log hanya berisi jumlah penghapusan/kesalahan operasional, bukan isi audit.
- Timestamp lama yang tidak berbentuk ISO UTC standar dengan milidetik
  dibiarkan utuh agar data yang ambigu tidak salah dihapus.
- Daftar audit tetap menampilkan maksimal 50 catatan terbaru yang tersimpan.
  Batas tampilan ini bukan batas retensi.
- Migrasi hanya menambah indeks waktu, tanpa menghapus catatan.
- Penghapusan logis memungkinkan SQLite menggunakan kembali halaman yang
  kosong; kebijakan ini tidak menjalankan VACUUM atau menjanjikan ukuran file
  langsung menyusut. Salinan cadangan berada di luar cakupan pembersihan ini.

Perubahan durasi/cakupan kebijakan memerlukan persetujuan pemilik produk lagi.
