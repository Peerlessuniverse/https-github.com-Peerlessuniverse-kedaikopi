import type { Kib, Kondisi, Tahap } from '../types';

export const KIB: Record<Kib, string> = {
  A: 'Tanah',
  B: 'Peralatan dan Mesin',
  C: 'Gedung dan Bangunan',
  D: 'Jalan, Irigasi, dan Jaringan',
  E: 'Aset Tetap Lainnya',
  F: 'Konstruksi Dalam Pengerjaan',
};
export const KIB_KEYS = Object.keys(KIB) as Kib[];

export const KONDISI: Kondisi[] = ['Baik', 'Rusak Ringan', 'Rusak Berat'];

export const TAHAP: { key: Tahap; label: string; deskripsi: string }[] = [
  { key: 'perencanaan', label: 'Perencanaan', deskripsi: 'Perencanaan kebutuhan dan penganggaran' },
  { key: 'pengadaan', label: 'Pengadaan', deskripsi: 'Proses pengadaan sampai serah terima' },
  { key: 'penggunaan', label: 'Penggunaan', deskripsi: 'Dipakai OPD sesuai tugas dan fungsi' },
  { key: 'pemanfaatan', label: 'Pemanfaatan', deskripsi: 'Sewa, pinjam pakai, atau kerja sama' },
  { key: 'pemeliharaan', label: 'Pemeliharaan', deskripsi: 'Pengamanan dan pemeliharaan' },
  { key: 'penilaian', label: 'Penilaian', deskripsi: 'Penilaian nilai wajar aset' },
  { key: 'pemindahtanganan', label: 'Pemindahtanganan', deskripsi: 'Penjualan, tukar menukar, hibah, penyertaan modal' },
  { key: 'pemusnahan', label: 'Pemusnahan', deskripsi: 'Pemusnahan fisik barang' },
  { key: 'penghapusan', label: 'Penghapusan', deskripsi: 'Dihapus dari daftar barang' },
];
export const tahapLabel = (t: Tahap) => TAHAP.find((x) => x.key === t)?.label ?? t;

export const OPD = [
  'Sekretariat Daerah',
  'Badan Pengelolaan Keuangan dan Aset Daerah',
  'Dinas Pendidikan',
  'Dinas Kesehatan',
  'Dinas Bina Marga dan Penataan Ruang',
  'Dinas Komunikasi dan Informatika',
  'Dinas Perhubungan',
  'Dinas Sumber Daya Air',
];

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
export const formatRupiah = (n: number) => rupiah.format(n);

/** Bentuk ringkas untuk kartu ringkasan, mis. "Rp 12,4 M". */
export function ringkasRupiah(n: number): string {
  const f = (v: number) => v.toLocaleString('id-ID', { maximumFractionDigits: 1 });
  if (n >= 1e12) return `Rp ${f(n / 1e12)} T`;
  if (n >= 1e9) return `Rp ${f(n / 1e9)} M`;
  if (n >= 1e6) return `Rp ${f(n / 1e6)} jt`;
  return formatRupiah(n);
}

export const hariIni = () => new Date().toISOString().slice(0, 10);
