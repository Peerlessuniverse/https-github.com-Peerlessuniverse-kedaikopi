import { useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../AppContext';
import { AssetDetail } from '../components/AssetDetail';
import { KondisiBadge, Modal, PageHeader } from '../components/ui';
import { TAHAP, formatRupiah, hariIni, tahapLabel } from '../data/reference';
import type { Asset, Tahap } from '../types';

function MoveForm({ asset, onDone }: { asset: Asset; onDone: () => void }) {
  const { moveStage } = useApp();
  const idx = TAHAP.findIndex((t) => t.key === asset.tahap);
  const [tahap, setTahap] = useState<Tahap>(TAHAP[Math.min(idx + 1, TAHAP.length - 1)].key);
  const [tanggal, setTanggal] = useState(hariIni());
  const [dokumen, setDokumen] = useState('');
  const [catatan, setCatatan] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await moveStage(asset.id, tahap, catatan, dokumen, tanggal);
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Gagal menyimpan');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <p className="text-sm text-slate-600 sm:col-span-2">
        Tahap saat ini: <b>{tahapLabel(asset.tahap)}</b>
      </p>
      <label>
        <span className="label">Pindahkan ke tahap</span>
        <select className="field" value={tahap} onChange={(e) => setTahap(e.target.value as Tahap)}>
          {TAHAP.filter((t) => t.key !== asset.tahap).map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Tanggal</span>
        <input className="field" type="date" required value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      </label>
      <label className="sm:col-span-2">
        <span className="label">Nomor dokumen dasar (BAST, SK, berita acara)</span>
        <input className="field" value={dokumen} onChange={(e) => setDokumen(e.target.value)} />
      </label>
      <label className="sm:col-span-2">
        <span className="label">Catatan</span>
        <textarea className="field" rows={3} required value={catatan} onChange={(e) => setCatatan(e.target.value)} />
      </label>
      {err && <p className="text-sm text-red-700 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-ghost" onClick={onDone}>
          Batal
        </button>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Menyimpan…' : 'Pindahkan'}
        </button>
      </div>
    </form>
  );
}

export function Lifecycle() {
  const { assets, loading } = useApp();
  const [params, setParams] = useSearchParams();
  const selected = (TAHAP.find((t) => t.key === params.get('tahap')) ?? TAHAP[2]).key;
  const [moveId, setMoveId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const info = TAHAP.find((t) => t.key === selected)!;
  const rows = assets.filter((a) => a.tahap === selected).sort((a, b) => b.nilaiPerolehan - a.nilaiPerolehan);
  const moving = assets.find((a) => a.id === moveId);
  const viewing = assets.find((a) => a.id === viewId);

  const aktivitas = assets
    .flatMap((a) => a.riwayat.map((r, i) => ({ ...r, nama: a.nama, key: `${a.id}-${i}`, urut: i })))
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.urut - a.urut)
    .slice(0, 8);

  return (
    <>
      <PageHeader title="Siklus Hidup" subtitle="Lacak dan pindahkan aset dari perencanaan sampai penghapusan, lengkap dengan riwayatnya." />

      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Tahap siklus">
        {TAHAP.map((t, i) => {
          const active = t.key === selected;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              onClick={() => setParams({ tahap: t.key })}
              className={`min-w-[116px] shrink-0 rounded-lg border p-3 text-left ${active ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-500'}`}
            >
              <div className={`text-[11px] font-semibold ${active ? 'text-white/70' : 'text-slate-400'}`}>Tahap {i + 1}</div>
              <div className="text-xl font-bold tabular-nums">{assets.filter((a) => a.tahap === t.key).length}</div>
              <div className="truncate text-xs">{t.label}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-bold">{info.label}</h2>
            <p className="text-sm text-slate-500">{info.deskripsi}</p>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-slate-500">Memuat data…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">Belum ada aset di tahap ini.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {rows.map((a) => (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <button className="text-left font-semibold text-brand-700 hover:underline" onClick={() => setViewId(a.id)}>
                      {a.nama}
                    </button>
                    <div className="text-xs text-slate-500">
                      {a.opd} · {a.lokasi} · {formatRupiah(a.nilaiPerolehan)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <KondisiBadge kondisi={a.kondisi} />
                    <button className="btn btn-ghost" onClick={() => setMoveId(a.id)}>
                      Pindahkan tahap
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4">
          <h2 className="mb-3 font-bold">Aktivitas terbaru</h2>
          <ul className="space-y-3">
            {aktivitas.map((r) => (
              <li key={r.key} className="text-sm">
                <div className="font-semibold">{r.nama}</div>
                <div className="text-xs text-slate-500">
                  → {tahapLabel(r.tahap)} · {r.tanggal} · {r.oleh}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {moving && (
        <Modal title={`Pindahkan tahap: ${moving.nama}`} onClose={() => setMoveId(null)}>
          <MoveForm asset={moving} onDone={() => setMoveId(null)} />
        </Modal>
      )}
      {viewing && (
        <Modal title={viewing.nama} onClose={() => setViewId(null)}>
          <AssetDetail asset={viewing} />
        </Modal>
      )}
    </>
  );
}
