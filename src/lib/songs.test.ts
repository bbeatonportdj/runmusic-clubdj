import { describe, expect, it } from "vitest";
import { getSongs } from "./songs";

describe("getSongs", () => {
  it("returns songs with required fields", () => {
    const songs = getSongs();
    expect(songs.length).toBeGreaterThanOrEqual(10);
    expect(songs[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        bpm: expect.any(Number),
        key: expect.any(String),
        previewUrl: expect.any(String),
        downloadUrl320: expect.any(String),
      }),
    );
  });
});

