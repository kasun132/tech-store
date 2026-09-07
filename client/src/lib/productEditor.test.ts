import { describe, expect, it } from "vitest";
import { canSaveProduct, replaceSavedProduct } from "./productEditor";
import type { Product } from "./catalog";

const draft: Product = { id: 7, name: "Draft", category: "Chargers", price: 1290, image: "old-image", tag: "READY", description: "Draft product" };
const saved: Product = { ...draft, image: "/manus-storage/sakith-tech-store/products/updated.jpg" };

describe("product image save flow", () => {
  it("blocks save while an image or product mutation is pending", () => {
    expect(canSaveProduct(true, false, false)).toBe(false);
    expect(canSaveProduct(false, true, false)).toBe(false);
    expect(canSaveProduct(false, false, true)).toBe(false);
    expect(canSaveProduct(false, false, false)).toBe(true);
  });

  it("replaces the draft with the saved product and keeps the storage URL", () => {
    const result = replaceSavedProduct([draft], draft, saved);
    expect(result).toHaveLength(1);
    expect(result[0]?.image).toBe("/manus-storage/sakith-tech-store/products/updated.jpg");
  });
});
