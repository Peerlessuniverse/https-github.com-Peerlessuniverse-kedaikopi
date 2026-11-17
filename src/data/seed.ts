import type { Asset, Kib, Kondisi, Tahap } from '../types';

// Data contoh FIKTIF untuk mode demo. Bukan data resmi pemerintah.
type Row = [string, Kib, string, string, number, number, Kondisi, Tahap];

const rows: Row[] = [
  ['Tanah Kantor Dinas Pendidikan', 'A', 'Dinas Pendidikan', 'Kota Bandung', 1998, 18_500_000_000, 'Baik', 'penggunaan'],
  ['Tanah Eks Gudang Arsip', 'A', 'Sekretariat Daerah', 'Kab. Bandung Barat', 1987, 6_200_000_000, 'Baik', 'pemanfaatan'],
  ['Tanah Rencana Puskesmas Pembantu', 'A', 'Dinas Kesehatan', 'Kab. Garut', 2026, 2_750_000_000, 'Baik', 'pengadaan'],
  ['Mobil Operasional Minibus', 'B', 'Sekretariat Daerah', 'Kota Bandung', 2019, 385_000_000, 'Baik', 'penggunaan'],
  ['Ambulans Gawat Darurat', 'B', 'Dinas Kesehatan', 'Kab. Cianjur', 2021, 890_000_000, 'Rusak Ringan', 'pemeliharaan'],
  ['Server Pusat Data', 'B', 'Dinas Komunikasi dan Informatika', 'Kota Bandung', 2022, 1_450_000_000, 'Baik', 'penggunaan'],
  ['Laptop Kerja (40 unit)', 'B', 'Dinas Komunikasi dan Informatika', 'Kota Bandung', 2023, 620_000_000, 'Baik', 'penggunaan'],
  ['Alat Berat Ekskavator', 'B', 'Dinas Bina Marga dan Penataan Ruang', 'Kab. Sukabumi', 2014, 2_100_000_000, 'Rusak Berat', 'penilaian'],
  ['Bus Sekolah', 'B', 'Dinas Perhubungan', 'Kab. Tasikmalaya', 2011, 740_000_000, 'Rusak Berat', 'pemindahtanganan'],
  ['Komputer Lab Sekolah (30 unit)', 'B', 'Dinas Pendidikan', 'Kab. Cirebon', 2012, 255_000_000, 'Rusak Berat', 'pemusnahan'],
  ['Mesin Fotokopi', 'B', 'Badan Pengelolaan Keuangan dan Aset Daerah', 'Kota Bandung', 2010, 95_000_000, 'Rusak Berat', 'penghapusan'],
  ['Alat Uji Kendaraan', 'B', 'Dinas Perhubungan', 'Kota Bekasi', 2027, 1_150_000_000, 'Baik', 'perencanaan'],
  ['Pompa Air Pengendali Banjir', 'B', 'Dinas Sumber Daya Air', 'Kab. Karawang', 2020, 480_000_000, 'Rusak Ringan', 'pemeliharaan'],
  ['Gedung Kantor BPKAD', 'C', 'Badan Pengelolaan Keuangan dan Aset Daerah', 'Kota Bandung', 2005, 24_000_000_000, 'Baik', 'penggunaan'],
  ['Gedung SMA Negeri (Contoh)', 'C', 'Dinas Pendidikan', 'Kab. Bogor', 2009, 9_800_000_000, 'Rusak Ringan', 'pemeliharaan'],
  ['Rumah Dinas Eks Pejabat', 'C', 'Sekretariat Daerah', 'Kota Bandung', 1992, 3_400_000_000, 'Rusak Ringan', 'pemanfaatan'],
  ['Gedung Laboratorium Kesehatan', 'C', 'Dinas Kesehatan', 'Kota Depok', 2016, 12_600_000_000, 'Baik', 'penggunaan'],
  ['Ruas Jalan Provinsi (Contoh) 12 km', 'D', 'Dinas Bina Marga dan Penataan Ruang', 'Kab. Sumedang', 2018, 46_000_000_000, 'Baik', 'penggunaan'],
  ['Jembatan Penghubung', 'D', 'Dinas Bina Marga dan Penataan Ruang', 'Kab. Indramayu', 2007, 15_300_000_000, 'Rusak Ringan', 'pemeliharaan'],
  ['Saluran Irigasi Sekunder', 'D', 'Dinas Sumber Daya Air', 'Kab. Subang', 2013, 8_900_000_000, 'Baik', 'penggunaan'],
  ['Jaringan Serat Optik Antar-OPD', 'D', 'Dinas Komunikasi dan Informatika', 'Kota Bandung', 2021, 5_200_000_000, 'Baik', 'penggunaan'],
  ['Koleksi Buku Perpustakaan', 'E', 'Dinas Pendidikan', 'Kota Bandung', 2017, 310_000_000, 'Baik', 'penggunaan'],
  ['Lisensi Aplikasi Perkantoran', 'E', 'Dinas Komunikasi dan Informatika', 'Kota Bandung', 2025, 540_000_000, 'Baik', 'penggunaan'],
  ['Pembangunan Gedung Arsip Daerah', 'F', 'Sekretariat Daerah', 'Kota Cimahi', 2026, 7_500_000_000, 'Baik', 'pengadaan'],
  ['Rehabilitasi Bendung', 'F', 'Dinas Sumber Daya Air', 'Kab. Majalengka', 2026, 11_200_000_000, 'Baik', 'pengadaan'],
];

export const seedAssets: Asset[] = rows.map(([nama, kib, opd, lokasi, tahun, nilai, kondisi, tahap], i) => {
  const no = String(i + 1).padStart(4, '0');
  return {
    id: `demo-${no}`,
    kodeBarang: `1.3.${'ABCDEF'.indexOf(kib) + 1}.${String((i % 9) + 1).padStart(2, '0')}.${String(i + 1).padStart(3, '0')}`,
    nomorRegister: no,
    nama,
    kib,
    opd,
    lokasi,
    tahunPerolehan: tahun,
    nilaiPerolehan: nilai,
    kondisi,
    tahap,
    penanggungJawab: 'Pengurus Barang',
    keterangan: 'Data contoh',
    riwayat: [
      { tahap, tanggal: '2026-10-01', catatan: 'Pencatatan awal (data contoh)', oleh: 'Sistem' },
    ],
  };
});
