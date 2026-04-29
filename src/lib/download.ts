import type { Session } from "./session";

export type DownloadAction =
  | { allowed: true }
  | { allowed: false; reason: "login" | "purchase_or_upgrade" };

export function getDownloadAction(
  session: Session,
  input: { songId: string; purchasedSongIds: string[] },
): DownloadAction {
  if (!session.isLoggedIn) return { allowed: false, reason: "login" };
  if (session.tier === "pro") return { allowed: true };
  if (input.purchasedSongIds.includes(input.songId)) return { allowed: true };
  return { allowed: false, reason: "purchase_or_upgrade" };
}
