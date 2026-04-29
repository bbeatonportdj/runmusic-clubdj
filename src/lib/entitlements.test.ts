import { beforeEach, describe, expect, it } from "vitest";
import { clearEntitlements, getEntitlements, grantPurchasedSongs, hasPurchasedSong } from "./entitlements";

describe("entitlements", () => {
  beforeEach(() => {
    clearEntitlements();
  });

  it("defaults to empty", () => {
    expect(getEntitlements()).toEqual({ purchasedSongIds: [] });
  });

  it("grant and query works", () => {
    grantPurchasedSongs(["a", "b"]);
    grantPurchasedSongs(["b", "c"]);
    expect(getEntitlements().purchasedSongIds).toEqual(["a", "b", "c"]);
    expect(hasPurchasedSong("a")).toBe(true);
    expect(hasPurchasedSong("z")).toBe(false);
  });
});

