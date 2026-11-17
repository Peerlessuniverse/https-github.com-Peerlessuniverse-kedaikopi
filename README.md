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

Aplikasi ini memakai ulang proyek Firebase lama `kowawa-fee8c` (lihat `.firebaserc`).

1. Di Firebase Console, pastikan **Firestore** dan **Authentication → Email/Password** aktif.
2. Salin `.env.example` menjadi `.env.local` dan isi `VITE_FIREBASE_API_KEY`; nilai lain sudah terisi.
3. Periksa daftar pengguna di Authentication: hapus akun lama yang tidak boleh mengakses data aset, lalu buat akun baru (pendaftaran mandiri sengaja tidak disediakan).
4. Pasang aturan keamanan: `firebase deploy --only firestore:rules`. Ini **menggantikan** aturan lama, sehingga koleksi peninggalan kedai kopi tidak bisa lagi diakses dari aplikasi.
5. Timpa situs lama: `npm run build` lalu `firebase deploy --only hosting`.

Data aset disimpan di koleksi `assets` dan hanya bisa diakses pengguna yang sudah masuk.
Koleksi lama kedai kopi tidak dipakai; hapus dari Firebase Console bila sudah tidak diperlukan.

## Struktur

- `src/data/reference.ts` — golongan KIB, tahap siklus, daftar perangkat daerah
- `src/services/assetStore.ts` — lapisan data (Firestore atau penyimpanan browser)
- `src/pages/` — Dasbor, Inventaris, Siklus Hidup, Login
- `firestore.rules` — aturan akses Firestore
