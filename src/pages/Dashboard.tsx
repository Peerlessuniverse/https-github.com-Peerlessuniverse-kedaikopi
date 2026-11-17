import { Link } from 'react-router-dom';
import { useApp } from '../AppContext';
import { BarList, KondisiBadge, PageHeader } from '../components/ui';
import { KIB, KIB_KEYS, KONDISI, TAHAP, ringkasRupiah, tahapLabel } from '../data/reference';

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function Dashboard() {
  const { assets, loading } = useApp();
  if (loading) return <p className="text-sm text-slate-500">Memuat data…</p>;

  // Aset yang sudah dihapus tidak lagi dihitung sebagai aset aktif.
  const aktif = assets.filter((a) => a.tahap !== 'penghapusan');
  const total = sum(aktif.map((a) => a.nilaiPerolehan));
  const rusakBerat = aktif.filter((a) => a.kondisi === 'Rusak Berat');
  const prosesAkhir = aktif.filter((a) => ['penilaian', 'pemindahtanganan', 'pemusnahan'].includes(a.tahap));

  const stats = [
    { label: 'Aset aktif', value: aktif.length.toLocaleString('id-ID'), note: `${assets.length - aktif.length} sudah dihapus` },
    { label: 'Total nilai perolehan', value: ringkasRupiah(total), note: 'Aset aktif' },
    { label: 'Rusak berat', value: String(rusakBerat.length), note: ringkasRupiah(sum(rusakBerat.map((a) => a.nilaiPerolehan))) },
    { label: 'Menuju penghapusan', value: String(prosesAkhir.length), note: 'Penilaian s.d. pemusnahan' },
  ];

  const perKib = KIB_KEYS.map((k) => {
    const xs = aktif.filter((a) => a.kib === k);
    return { label: `KIB ${k} · ${KIB[k]}`, value: sum(xs.map((a) => a.nilaiPerolehan)), hint: `${xs.length} aset` };
  });
  const perOpd = Object.entries(
    aktif.reduce<Record<string, number>>((m, a) => ({ ...m, [a.opd]: (m[a.opd] ?? 0) + a.nilaiPerolehan }), {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const perluTindak = [...rusakBerat].sort((a, b) => b.nilaiPerolehan - a.nilaiPerolehan).slice(0, 5);

  return (
    <>
      <PageHeader title="Dasbor" subtitle="Ringkasan seluruh Barang Milik Daerah lintas perangkat daerah." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="text-xs font-semibold text-slate-500">{s.label}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{s.value}</div>
            <div className="mt-1 text-xs text-slate-500">{s.note}</div>
          </div>
        ))}
      </div>

      <section className="card mt-4 p-5">
        <h2 className="font-bold">Jumlah aset per tahap siklus</h2>
        <div className="mt-4 grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-2">
          {TAHAP.map((t, i) => (
            <Link key={t.key} to={`/siklus?tahap=${t.key}`} title={t.deskripsi} className="rounded-lg border border-slate-200 p-3 hover:border-brand-500 hover:bg-brand-50">
              <div className="text-[11px] font-semibold text-slate-400">{i + 1}</div>
              <div className="text-xl font-bold tabular-nums">{assets.filter((a) => a.tahap === t.key).length}</div>
              <div className="text-xs text-slate-600">{t.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Nilai perolehan per golongan (KIB)</h2>
          <BarList rows={perKib} format={ringkasRupiah} />
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Nilai perolehan per perangkat daerah</h2>
          <BarList rows={perOpd} format={ringkasRupiah} />
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Kondisi aset aktif</h2>
          <ul className="divide-y divide-slate-100">
            {KONDISI.map((k) => {
              const n = aktif.filter((a) => a.kondisi === k).length;
              return (
                <li key={k} className="flex items-center justify-between py-2.5 text-sm">
                  <KondisiBadge kondisi={k} />
                  <span className="tabular-nums">
                    <b>{n}</b> aset · {aktif.length ? Math.round((n / aktif.length) * 100) : 0}%
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="card p-5">
          <h2 className="mb-4 font-bold">Perlu tindak lanjut (rusak berat)</h2>
          {perluTindak.length === 0 ? (
            <p className="text-sm text-slate-500">Tidak ada aset rusak berat.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {perluTindak.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{a.nama}</div>
                    <div className="truncate text-xs text-slate-500">
                      {a.opd} · {tahapLabel(a.tahap)}
                    </div>
                  </div>
                  <span className="shrink-0 tabular-nums">{ringkasRupiah(a.nilaiPerolehan)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
