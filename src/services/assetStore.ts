import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { seedAssets } from '../data/seed';
import type { Asset } from '../types';

/**
 * Lapisan data aset. Jika Firebase dikonfigurasi, data dibaca/ditulis ke
 * koleksi Firestore `assets`; jika tidak, data contoh disimpan di browser.
 */
type Listener = (assets: Asset[]) => void;

const KEY = 'aset-jabar.assets.v1';
const listeners = new Set<Listener>();

function readLocal(): Asset[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Asset[];
  } catch {
    /* penyimpanan browser tidak tersedia: pakai data contoh di memori */
  }
  return seedAssets;
}

let localCache: Asset[] | null = null;
const local = () => (localCache ??= readLocal());

function writeLocal(next: Asset[]) {
  localCache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* abaikan: perubahan tetap berlaku selama halaman terbuka */
  }
  listeners.forEach((l) => l(next));
}

export function subscribeAssets(onData: Listener, onError: (e: Error) => void): () => void {
  if (db) {
    return onSnapshot(
      collection(db, 'assets'),
      (snap) => onData(snap.docs.map((d) => ({ ...(d.data() as Asset), id: d.id }))),
      onError,
    );
  }
  listeners.add(onData);
  onData(local());
  return () => listeners.delete(onData);
}

export async function saveAsset(asset: Asset): Promise<void> {
  if (db) {
    await setDoc(doc(db, 'assets', asset.id), asset);
    return;
  }
  const rest = local().filter((a) => a.id !== asset.id);
  writeLocal([...rest, asset]);
}

export async function removeAsset(id: string): Promise<void> {
  if (db) {
    await deleteDoc(doc(db, 'assets', id));
    return;
  }
  writeLocal(local().filter((a) => a.id !== id));
}

/** Mode demo saja: kembalikan data contoh awal. */
export function resetDemo() {
  writeLocal(seedAssets);
}

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `a-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
