import { useSyncExternalStore } from "react";

export type Entitlements = { purchasedSongIds: string[] };

const KEY = "rmcdj_entitlements_v1";

const listeners = new Set<() => void>();

const DEFAULT: Entitlements = { purchasedSongIds: [] };

let cached: Entitlements = DEFAULT;

function notify() {
  for (const l of listeners) l();
}

function parse(raw: string | null): Entitlements | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === "object" && "purchasedSongIds" in v && Array.isArray((v as any).purchasedSongIds)) {
      const ids = (v as any).purchasedSongIds.filter((x: unknown) => typeof x === "string");
      return { purchasedSongIds: Array.from(new Set(ids)) };
    }
    return null;
  } catch {
    return null;
  }
}

function refreshFromStorage() {
  const e = parse(localStorage.getItem(KEY));
  cached = e ?? DEFAULT;
}

try {
  refreshFromStorage();
} catch {}

export function getEntitlements(): Entitlements {
  return cached;
}

export function setEntitlements(next: Entitlements) {
  localStorage.setItem(KEY, JSON.stringify(next));
  cached = next;
  notify();
}

export function grantPurchasedSongs(songIds: string[]) {
  const cur = getEntitlements();
  const merged = Array.from(new Set([...cur.purchasedSongIds, ...songIds]));
  setEntitlements({ purchasedSongIds: merged });
}

export function hasPurchasedSong(songId: string): boolean {
  return getEntitlements().purchasedSongIds.includes(songId);
}

export function clearEntitlements() {
  localStorage.removeItem(KEY);
  cached = DEFAULT;
  notify();
}

export function useEntitlements(): Entitlements {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
          refreshFromStorage();
          notify();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(onStoreChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => getEntitlements(),
    () => DEFAULT,
  );
}

