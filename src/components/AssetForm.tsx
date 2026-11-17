import { useState, type FormEvent } from 'react';
import { KIB, KIB_KEYS, KONDISI, OPD, TAHAP } from '../data/reference';
import type { Asset, AssetInput } from '../types';

const kosong: AssetInput = {
  kodeBarang: '',
  nomorRegister: '',
  nama: '',
  kib: 'B',
  opd: OPD[0],
  lokasi: '',
  tahunPerolehan: new Date().getFullYear(),
  nilaiPerolehan: 0,
  kondisi: 'Baik',
  tahap: 'perencanaan',
  penanggungJawab: '',
  keterangan: '',
};

export function AssetForm({ initial, onSubmit, onCancel }: { initial?: Asset; onSubmit: (v: AssetInput) => Promise<void>; onCancel: () => void }) {
  const [v, setV] = useState<AssetInput>(() => {
    if (!initial) return kosong;
    const { id: _id, riwayat: _riwayat, ...rest } = initial;
    return rest;
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const set = <K extends keyof AssetInput>(k: K, val: AssetInput[K]) => setV((p) => ({ ...p, [k]: val }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await onSubmit(v);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Gagal menyimpan');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className="label">Nama barang</span>
        <input className="field" required value={v.nama} onChange={(e) => set('nama', e.target.value)} />
      </label>
      <label>
        <span className="label">Kode barang</span>
        <input className="field" required value={v.kodeBarang} onChange={(e) => set('kodeBarang', e.target.value)} />
      </label>
      <label>
        <span className="label">Nomor register</span>
        <input className="field" required value={v.nomorRegister} onChange={(e) => set('nomorRegister', e.target.value)} />
      </label>
      <label>
        <span className="label">Golongan (KIB)</span>
        <select className="field" value={v.kib} onChange={(e) => set('kib', e.target.value as AssetInput['kib'])}>
          {KIB_KEYS.map((k) => (
            <option key={k} value={k}>
              KIB {k} · {KIB[k]}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Perangkat daerah</span>
        <input className="field" required list="opd-list" value={v.opd} onChange={(e) => set('opd', e.target.value)} />
        <datalist id="opd-list">
          {OPD.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </label>
      <label>
        <span className="label">Lokasi</span>
        <input className="field" required value={v.lokasi} onChange={(e) => set('lokasi', e.target.value)} />
      </label>
      <label>
        <span className="label">Penanggung jawab</span>
        <input className="field" value={v.penanggungJawab} onChange={(e) => set('penanggungJawab', e.target.value)} />
      </label>
      <label>
        <span className="label">Tahun perolehan</span>
        <input className="field" type="number" required min={1900} max={2100} value={v.tahunPerolehan} onChange={(e) => set('tahunPerolehan', Number(e.target.value))} />
      </label>
      <label>
        <span className="label">Nilai perolehan (Rp)</span>
        <input className="field" type="number" required min={0} value={v.nilaiPerolehan} onChange={(e) => set('nilaiPerolehan', Number(e.target.value))} />
      </label>
      <label>
        <span className="label">Kondisi</span>
        <select className="field" value={v.kondisi} onChange={(e) => set('kondisi', e.target.value as AssetInput['kondisi'])}>
          {KONDISI.map((k) => (
            <option key={k}>{k}</option>
          ))}
        </select>
      </label>
      <label>
        <span className="label">Tahap siklus</span>
        <select className="field" value={v.tahap} onChange={(e) => set('tahap', e.target.value as AssetInput['tahap'])}>
          {TAHAP.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <label className="sm:col-span-2">
        <span className="label">Keterangan</span>
        <textarea className="field" rows={2} value={v.keterangan} onChange={(e) => set('keterangan', e.target.value)} />
      </label>
      {err && <p className="text-sm text-red-700 sm:col-span-2">{err}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Batal
        </button>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? 'Menyimpan…' : 'Simpan'}
        </button>
      </div>
    </form>
  );
}
