import { useSyncExternalStore } from "react";

export type Tier = "free" | "pro";

export type Session = {
  isLoggedIn: boolean;
  tier: Tier;
};

const KEY = "rmcdj_session_v1";

const listeners = new Set<() => void>();

const DEFAULT_SESSION: Session = { isLoggedIn: false, tier: "free" };

let cachedSession: Session = DEFAULT_SESSION;

function notify() {
  for (const l of listeners) l();
}

function parse(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (
      v &&
      typeof v === "object" &&
      "isLoggedIn" in v &&
      "tier" in v &&
      typeof (v as any).isLoggedIn === "boolean" &&
      ((v as any).tier === "free" || (v as any).tier === "pro")
    ) {
      return v as Session;
    }
    return null;
  } catch {
    return null;
  }
}

function refreshFromStorage() {
  const s = parse(localStorage.getItem(KEY));
  cachedSession = s ?? DEFAULT_SESSION;
}

try {
  refreshFromStorage();
} catch {}

export function getSession(): Session {
  return cachedSession;
}

export function setSession(next: Session) {
  localStorage.setItem(KEY, JSON.stringify(next));
  cachedSession = next;
  notify();
}

export function signIn(tier: Tier = "free") {
  setSession({ isLoggedIn: true, tier });
}

export function signOut() {
  localStorage.removeItem(KEY);
  cachedSession = DEFAULT_SESSION;
  notify();
}

export function setTier(tier: Tier) {
  const s = getSession();
  setSession({ ...s, isLoggedIn: true, tier });
}

export function useSession(): Session {
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
    () => getSession(),
    () => DEFAULT_SESSION,
  );
}
