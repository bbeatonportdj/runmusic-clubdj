import { describe, expect, it } from "vitest";
import { toPrettyJson } from "./jsonExport";

describe("toPrettyJson", () => {
  it("serializes with 2-space indent and trailing newline", () => {
    const s = toPrettyJson([{ a: 1 }]);
    expect(s).toBe('[\n  {\n    "a": 1\n  }\n]\n');
  });
});

