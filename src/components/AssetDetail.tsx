import { KondisiBadge } from './ui';
import { KIB, formatRupiah, tahapLabel } from '../data/reference';
import type { Asset } from '../types';

export function AssetDetail({ asset }: { asset: Asset }) {
  const rows: [string, string][] = [
    ['Kode barang', asset.kodeBarang],
    ['Nomor register', asset.nomorRegister],
    ['Golongan', `KIB ${asset.kib} · ${KIB[asset.kib]}`],
    ['Perangkat daerah', asset.opd],
    ['Lokasi', asset.lokasi],
    ['Penanggung jawab', asset.penanggungJawab || '–'],
    ['Tahun perolehan', String(asset.tahunPerolehan)],
    ['Nilai perolehan', formatRupiah(asset.nilaiPerolehan)],
    ['Tahap saat ini', tahapLabel(asset.tahap)],
    ['Keterangan', asset.keterangan || '–'],
  ];
  return (
    <div>
      <div className="mb-3">
        <KondisiBadge kondisi={asset.kondisi} />
      </div>
      <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-semibold text-slate-500">{k}</dt>
            <dd className="break-words">{v}</dd>
          </div>
        ))}
      </dl>
      <h3 className="mb-2 mt-6 text-sm font-bold">Riwayat siklus</h3>
      <ol className="space-y-3 border-l-2 border-brand-100 pl-4">
        {[...asset.riwayat].reverse().map((r, i) => (
          <li key={i} className="text-sm">
            <div className="font-semibold">
              {tahapLabel(r.tahap)} <span className="font-normal text-slate-500">· {r.tanggal}</span>
            </div>
            <div className="text-slate-700">{r.catatan}</div>
            <div className="text-xs text-slate-500">
              {r.dokumen ? `Dokumen: ${r.dokumen} · ` : ''}oleh {r.oleh}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
