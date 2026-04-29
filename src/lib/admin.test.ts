import { beforeEach, describe, expect, it } from "vitest";
import { disableAdminMode, enableAdminMode, getIsAdmin } from "./admin";

describe("admin mode", () => {
  beforeEach(() => {
    disableAdminMode();
  });

  it("defaults to false", () => {
    expect(getIsAdmin()).toBe(false);
  });

  it("enable/disable toggles value", () => {
    enableAdminMode();
    expect(getIsAdmin()).toBe(true);
    disableAdminMode();
    expect(getIsAdmin()).toBe(false);
  });
});
