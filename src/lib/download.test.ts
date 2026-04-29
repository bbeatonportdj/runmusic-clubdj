import { describe, expect, it } from "vitest";
import { getDownloadAction } from "./download";
import type { Session } from "./session";

describe("getDownloadAction", () => {
  const guest: Session = { isLoggedIn: false, tier: "free" };
  const free: Session = { isLoggedIn: true, tier: "free" };
  const pro: Session = { isLoggedIn: true, tier: "pro" };

  it("requires login first", () => {
    expect(getDownloadAction(guest, { songId: "s1", purchasedSongIds: [] })).toEqual({ allowed: false, reason: "login" });
  });

  it("allows pro for any song", () => {
    expect(getDownloadAction(pro, { songId: "s1", purchasedSongIds: [] })).toEqual({ allowed: true });
  });

  it("allows free only if purchased", () => {
    expect(getDownloadAction(free, { songId: "s1", purchasedSongIds: ["s1"] })).toEqual({ allowed: true });
    expect(getDownloadAction(free, { songId: "s2", purchasedSongIds: ["s1"] })).toEqual({
      allowed: false,
      reason: "purchase_or_upgrade",
    });
  });
});

