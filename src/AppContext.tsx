import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, firebaseEnabled } from './firebase';
import { newId, removeAsset, saveAsset, subscribeAssets } from './services/assetStore';
import { hariIni } from './data/reference';
import type { Asset, AssetInput, Tahap } from './types';

interface Ctx {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  demo: boolean;
  userName: string;
  create: (input: AssetInput) => Promise<void>;
  update: (id: string, input: AssetInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  moveStage: (id: string, tahap: Tahap, catatan: string, dokumen: string, tanggal: string) => Promise<void>;
  logout: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp harus dipakai di dalam AppProvider');
  return c;
}

/** Status login: `undefined` = masih memeriksa, `null` = belum masuk. */
export function useAuthUser(): User | null | undefined {
  const [user, setUser] = useState<User | null | undefined>(auth ? undefined : null);
  useEffect(() => (auth ? onAuthStateChanged(auth, setUser) : undefined), []);
  return user;
}

export function AppProvider({ user, children }: { user: User | null; children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userName = user?.email ?? 'Pengguna Demo';

  useEffect(
    () =>
      subscribeAssets(
        (a) => {
          setAssets(a);
          setLoading(false);
          setError(null);
        },
        (e) => {
          setError(e.message);
          setLoading(false);
        },
      ),
    [],
  );

  const value = useMemo<Ctx>(() => {
    const byId = (id: string) => {
      const a = assets.find((x) => x.id === id);
      if (!a) throw new Error('Aset tidak ditemukan');
      return a;
    };
    return {
      assets,
      loading,
      error,
      demo: !firebaseEnabled,
      userName,
      create: (input) =>
        saveAsset({
          ...input,
          id: newId(),
          riwayat: [{ tahap: input.tahap, tanggal: hariIni(), catatan: 'Pencatatan awal', oleh: userName }],
        }),
      update: (id, input) => {
        const old = byId(id);
        const riwayat =
          old.tahap === input.tahap
            ? old.riwayat
            : [...old.riwayat, { tahap: input.tahap, tanggal: hariIni(), catatan: 'Tahap diubah lewat formulir', oleh: userName }];
        return saveAsset({ ...input, id, riwayat });
      },
      remove: removeAsset,
      moveStage: (id, tahap, catatan, dokumen, tanggal) => {
        const old = byId(id);
        return saveAsset({
          ...old,
          tahap,
          riwayat: [...old.riwayat, { tahap, tanggal, catatan, oleh: userName, ...(dokumen ? { dokumen } : {}) }],
        });
      },
      logout: () => {
        if (auth) void signOut(auth);
      },
    };
  }, [assets, loading, error, userName]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
