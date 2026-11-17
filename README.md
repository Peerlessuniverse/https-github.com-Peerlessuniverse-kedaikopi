# Aset Jabar

Aplikasi web untuk mengelola siklus hidup Barang Milik Daerah (BMD) lintas perangkat daerah:
dari perencanaan dan pengadaan sampai pemindahtanganan, pemusnahan, dan penghapusan.
Tahapannya mengacu pada Permendagri 19/2016 dan golongan asetnya mengikuti KIB A–F.

> Versi awal. Data bawaan adalah **data contoh fiktif**, bukan data resmi pemerintah.

## Modul

| Modul | Status |
|---|---|
| Dasbor (nilai, kondisi, sebaran per KIB dan perangkat daerah) | Berfungsi |
| Inventaris Aset (cari, saring, tambah, ubah, hapus, unduh CSV) | Berfungsi |
| Siklus Hidup (pindah tahap dengan dokumen dasar dan riwayat) | Berfungsi |
| Pemanfaatan & Kontrak, Pemeliharaan Terjadwal, Laporan & KIB, Pengguna & Hak Akses | Menyusul |

## Menjalankan

```bash
npm install
npm run dev
```

Tanpa konfigurasi, aplikasi berjalan dalam **mode demo**: data contoh disimpan di browser dan tidak perlu login.

## Menghubungkan Firebase

1. Buat proyek Firebase baru, aktifkan **Firestore** dan **Authentication → Email/Password**.
2. Salin `.env.example` menjadi `.env.local` dan isi nilainya dari Firebase Console.
3. Buat akun pengguna di Authentication (pendaftaran mandiri sengaja tidak disediakan).
4. Pasang aturan keamanan: `firebase deploy --only firestore:rules --project <id-proyek>`.

Setelah itu data disimpan di koleksi `assets` dan hanya bisa diakses pengguna yang sudah masuk.

## Struktur

- `src/data/reference.ts` — golongan KIB, tahap siklus, daftar perangkat daerah
- `src/services/assetStore.ts` — lapisan data (Firestore atau penyimpanan browser)
- `src/pages/` — Dasbor, Inventaris, Siklus Hidup, Login
- `firestore.rules` — aturan akses Firestore
