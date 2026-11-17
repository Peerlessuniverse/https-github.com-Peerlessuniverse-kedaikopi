import { NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../AppContext';
import { resetDemo } from '../services/assetStore';

const nav = [
  { to: '/', label: 'Dasbor', end: true },
  { to: '/inventaris', label: 'Inventaris Aset' },
  { to: '/siklus', label: 'Siklus Hidup' },
];
const soon = ['Pemanfaatan & Kontrak', 'Pemeliharaan Terjadwal', 'Laporan & KIB', 'Pengguna & Hak Akses'];

export function Layout() {
  const { demo, userName, logout, error } = useApp();
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-brand-900 text-white md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="px-5 py-5">
          <div className="text-lg font-bold tracking-tight">Aset Jabar</div>
          <div className="text-xs text-brand-100">Pengelolaan Barang Milik Daerah</div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15 text-white' : 'text-brand-100 hover:bg-white/10'}`
              }
            >
              {n.label}
            </NavLink>
          ))}
          <div className="hidden md:block">
            <div className="mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/50">Menyusul</div>
            {soon.map((s) => (
              <div key={s} className="px-3 py-2 text-sm text-white/40">
                {s}
              </div>
            ))}
          </div>
        </nav>
        <div className="mt-auto hidden border-t border-white/10 px-5 py-4 text-xs md:block">
          <div className="truncate font-semibold">{userName}</div>
          {demo ? (
            <button className="mt-1 text-brand-100 underline" onClick={() => confirm('Kembalikan data contoh awal?') && resetDemo()}>
              Atur ulang data contoh
            </button>
          ) : (
            <button className="mt-1 text-brand-100 underline" onClick={logout}>
              Keluar
            </button>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 md:ml-60">
        {demo && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900 md:px-8">
            Mode demo: data contoh fiktif, tersimpan hanya di browser ini. Isi konfigurasi Firebase untuk data bersama.
          </div>
        )}
        {error && (
          <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 md:px-8">Gagal memuat data: {error}</div>
        )}
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
