import { beforeEach, describe, expect, it } from "vitest";
import { addToCart, clearCart, getCart, removeFromCart } from "./cart";

describe("cart", () => {
  beforeEach(() => {
    clearCart();
  });

  it("defaults to empty", () => {
    expect(getCart()).toEqual({ songIds: [] });
  });

  it("add/remove/clear works and is idempotent", () => {
    addToCart("s1");
    addToCart("s1");
    addToCart("s2");
    expect(getCart().songIds).toEqual(["s1", "s2"]);

    removeFromCart("s1");
    removeFromCart("s1");
    expect(getCart().songIds).toEqual(["s2"]);

    clearCart();
    expect(getCart().songIds).toEqual([]);
  });
});

