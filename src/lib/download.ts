import type { Session } from "./session";

export type DownloadAction =
  | { allowed: true }
  | { allowed: false; reason: "login" | "upgrade" };

export function getDownloadAction(session: Session): DownloadAction {
  if (!session.isLoggedIn) return { allowed: false, reason: "login" };
  if (session.tier !== "pro") return { allowed: false, reason: "upgrade" };
  return { allowed: true };
}

