/** Golongan Kartu Inventaris Barang (KIB A–F). */
export type Kib = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export type Kondisi = 'Baik' | 'Rusak Ringan' | 'Rusak Berat';

/** Tahap siklus pengelolaan BMD (mengacu Permendagri 19/2016). */
export type Tahap =
  | 'perencanaan'
  | 'pengadaan'
  | 'penggunaan'
  | 'pemanfaatan'
  | 'pemeliharaan'
  | 'penilaian'
  | 'pemindahtanganan'
  | 'pemusnahan'
  | 'penghapusan';

export interface Riwayat {
  tahap: Tahap;
  tanggal: string; // YYYY-MM-DD
  catatan: string;
  dokumen?: string; // nomor BAST / SK / dokumen dasar
  oleh: string;
}

export interface Asset {
  id: string;
  kodeBarang: string;
  nomorRegister: string;
  nama: string;
  kib: Kib;
  opd: string;
  lokasi: string;
  tahunPerolehan: number;
  nilaiPerolehan: number; // rupiah
  kondisi: Kondisi;
  tahap: Tahap;
  penanggungJawab: string;
  keterangan: string;
  riwayat: Riwayat[];
}

export type AssetInput = Omit<Asset, 'id' | 'riwayat'>;
