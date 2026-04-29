import { describe, expect, it } from "vitest";
import { extractDriveFileId, toDriveDirectDownloadUrl } from "./drive";

describe("drive link handling", () => {
  it("accepts a file id", () => {
    expect(extractDriveFileId("1AbCdefGhijk_lmnOP")).toBe("1AbCdefGhijk_lmnOP");
  });

  it("extracts id from /file/d/<id>/view", () => {
    expect(extractDriveFileId("https://drive.google.com/file/d/1AAA/view?usp=sharing")).toBe("1AAA");
  });

  it("extracts id from open?id=", () => {
    expect(extractDriveFileId("https://drive.google.com/open?id=1BBB")).toBe("1BBB");
  });

  it("extracts id from uc?id=", () => {
    expect(extractDriveFileId("https://drive.google.com/uc?id=1CCC&export=download")).toBe("1CCC");
  });

  it("builds direct download url", () => {
    expect(toDriveDirectDownloadUrl("1ZZZ")).toBe("https://drive.google.com/uc?export=download&id=1ZZZ");
  });
});

