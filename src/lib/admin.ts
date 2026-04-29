import { useSyncExternalStore } from "react";

const KEY = "rmcdj_admin_mode_v1";

const listeners = new Set<() => void>();

let cachedIsAdmin = false;

function notify() {
  for (const l of listeners) l();
}

function refreshFromStorage() {
  cachedIsAdmin = localStorage.getItem(KEY) === "true";
}

try {
  refreshFromStorage();
} catch {}

export function getIsAdmin(): boolean {
  return cachedIsAdmin;
}

export function enableAdminMode() {
  localStorage.setItem(KEY, "true");
  cachedIsAdmin = true;
  notify();
}

export function disableAdminMode() {
  localStorage.removeItem(KEY);
  cachedIsAdmin = false;
  notify();
}

export function useIsAdmin(): boolean {
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
    () => getIsAdmin(),
    () => false,
  );
}

