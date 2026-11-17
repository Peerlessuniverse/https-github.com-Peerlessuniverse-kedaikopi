import { useMemo, useState } from 'react';
import { useApp } from '../AppContext';
import { AssetDetail } from '../components/AssetDetail';
import { AssetForm } from '../components/AssetForm';
import { KondisiBadge, Modal, PageHeader } from '../components/ui';
import { KIB, KIB_KEYS, KONDISI, formatRupiah, tahapLabel } from '../data/reference';
import type { Asset } from '../types';

type Dialog = { mode: 'new' } | { mode: 'edit' | 'view'; id: string } | null;

function unduhCsv(rows: Asset[]) {
  const esc = (s: string | number) => `"${String(s).replace(/"/g, '""')}"`;
  const head = ['Kode Barang', 'Register', 'Nama', 'KIB', 'Perangkat Daerah', 'Lokasi', 'Tahun', 'Nilai Perolehan', 'Kondisi', 'Tahap'];
  const body = rows.map((a) =>
    [a.kodeBarang, a.nomorRegister, a.nama, a.kib, a.opd, a.lokasi, a.tahunPerolehan, a.nilaiPerolehan, a.kondisi, tahapLabel(a.tahap)].map(esc).join(','),
  );
  const url = URL.createObjectURL(new Blob(['﻿' + [head.map(esc).join(','), ...body].join('\n')], { type: 'text/csv' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventaris-aset.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function Inventory() {
  const { assets, loading, create, update, remove } = useApp();
  const [q, setQ] = useState('');
  const [kib, setKib] = useState('');
  const [opd, setOpd] = useState('');
  const [kondisi, setKondisi] = useState('');
  const [dialog, setDialog] = useState<Dialog>(null);

  const opds = useMemo(() => [...new Set(assets.map((a) => a.opd))].sort(), [assets]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return assets
      .filter(
        (a) =>
          (!kib || a.kib === kib) &&
          (!opd || a.opd === opd) &&
          (!kondisi || a.kondisi === kondisi) &&
          (!s || `${a.nama} ${a.kodeBarang} ${a.nomorRegister} ${a.lokasi}`.toLowerCase().includes(s)),
      )
      .sort((a, b) => a.kodeBarang.localeCompare(b.kodeBarang));
  }, [assets, q, kib, opd, kondisi]);

  const current = dialog && dialog.mode !== 'new' ? assets.find((a) => a.id === dialog.id) : undefined;

  async function hapus(a: Asset) {
    if (confirm(`Hapus data "${a.nama}" secara permanen? Untuk penghapusan resmi, gunakan tahap Penghapusan di Siklus Hidup.`)) await remove(a.id);
  }

  return (
    <>
      <PageHeader
        title="Inventaris Aset"
        subtitle="Daftar seluruh barang milik daerah beserta golongan, lokasi, nilai, dan kondisinya."
        action={
          <div className="flex gap-2">
            <button className="btn btn-ghost" onClick={() => unduhCsv(rows)} disabled={rows.length === 0}>
              Unduh CSV
            </button>
            <button className="btn btn-primary" onClick={() => setDialog({ mode: 'new' })}>
              + Tambah aset
            </button>
          </div>
        }
      />

      <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input className="field" placeholder="Cari nama, kode, lokasi…" aria-label="Cari aset" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field" aria-label="Golongan" value={kib} onChange={(e) => setKib(e.target.value)}>
          <option value="">Semua golongan</option>
          {KIB_KEYS.map((k) => (
            <option key={k} value={k}>
              KIB {k} · {KIB[k]}
            </option>
          ))}
        </select>
        <select className="field" aria-label="Perangkat daerah" value={opd} onChange={(e) => setOpd(e.target.value)}>
          <option value="">Semua perangkat daerah</option>
          {opds.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <select className="field" aria-label="Kondisi" value={kondisi} onChange={(e) => setKondisi(e.target.value)}>
          <option value="">Semua kondisi</option>
          {KONDISI.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Barang</th>
              <th className="px-4 py-3 font-semibold">KIB</th>
              <th className="px-4 py-3 font-semibold">Perangkat daerah</th>
              <th className="px-4 py-3 text-right font-semibold">Nilai perolehan</th>
              <th className="px-4 py-3 font-semibold">Kondisi</th>
              <th className="px-4 py-3 font-semibold">Tahap</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <button className="text-left font-semibold text-brand-700 hover:underline" onClick={() => setDialog({ mode: 'view', id: a.id })}>
                    {a.nama}
                  </button>
                  <div className="text-xs text-slate-500">
                    {a.kodeBarang} · Reg. {a.nomorRegister} · {a.lokasi}
                  </div>
                </td>
                <td className="px-4 py-3">{a.kib}</td>
                <td className="px-4 py-3">{a.opd}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatRupiah(a.nilaiPerolehan)}</td>
                <td className="px-4 py-3">
                  <KondisiBadge kondisi={a.kondisi} />
                </td>
                <td className="px-4 py-3">{tahapLabel(a.tahap)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <button className="mr-3 text-xs font-semibold text-slate-600 hover:underline" onClick={() => setDialog({ mode: 'edit', id: a.id })}>
                    Ubah
                  </button>
                  <button className="text-xs font-semibold text-red-700 hover:underline" onClick={() => hapus(a)}>
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && rows.length === 0 && <p className="p-6 text-center text-sm text-slate-500">Tidak ada aset yang cocok dengan pencarian.</p>}
        {loading && <p className="p-6 text-center text-sm text-slate-500">Memuat data…</p>}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Menampilkan {rows.length} dari {assets.length} aset.
      </p>

      {dialog?.mode === 'new' && (
        <Modal title="Tambah aset" onClose={() => setDialog(null)}>
          <AssetForm onCancel={() => setDialog(null)} onSubmit={async (v) => (await create(v), setDialog(null))} />
        </Modal>
      )}
      {dialog?.mode === 'edit' && current && (
        <Modal title="Ubah aset" onClose={() => setDialog(null)}>
          <AssetForm initial={current} onCancel={() => setDialog(null)} onSubmit={async (v) => (await update(current.id, v), setDialog(null))} />
        </Modal>
      )}
      {dialog?.mode === 'view' && current && (
        <Modal title={current.nama} onClose={() => setDialog(null)}>
          <AssetDetail asset={current} />
        </Modal>
      )}
    </>
  );
}
