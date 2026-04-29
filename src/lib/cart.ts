import { useSyncExternalStore } from "react";

export type Cart = { songIds: string[] };

const KEY = "rmcdj_cart_v1";

const listeners = new Set<() => void>();

const DEFAULT_CART: Cart = { songIds: [] };

let cachedCart: Cart = DEFAULT_CART;

function notify() {
  for (const l of listeners) l();
}

function parse(raw: string | null): Cart | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === "object" && "songIds" in v && Array.isArray((v as any).songIds)) {
      const ids = (v as any).songIds.filter((x: unknown) => typeof x === "string");
      return { songIds: Array.from(new Set(ids)) };
    }
    return null;
  } catch {
    return null;
  }
}

function refreshFromStorage() {
  const c = parse(localStorage.getItem(KEY));
  cachedCart = c ?? DEFAULT_CART;
}

try {
  refreshFromStorage();
} catch {}

export function getCart(): Cart {
  return cachedCart;
}

export function setCart(next: Cart) {
  localStorage.setItem(KEY, JSON.stringify(next));
  cachedCart = next;
  notify();
}

export function addToCart(songId: string) {
  const c = getCart();
  if (c.songIds.includes(songId)) return;
  setCart({ songIds: [...c.songIds, songId] });
}

export function removeFromCart(songId: string) {
  const c = getCart();
  setCart({ songIds: c.songIds.filter((id) => id !== songId) });
}

export function clearCart() {
  localStorage.removeItem(KEY);
  cachedCart = DEFAULT_CART;
  notify();
}

export function useCart(): Cart {
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
    () => getCart(),
    () => DEFAULT_CART,
  );
}

