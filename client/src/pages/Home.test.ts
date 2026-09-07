import { describe, expect, it } from "vitest";
import { initialCatalog, whatsappNumber } from "@/lib/catalog";

describe("Sakith Tech Store catalog contract", () => {
  it("contains exactly 250 starter products with 50 per requested category", () => {
    expect(initialCatalog).toHaveLength(250);
    for (const category of ["Chargers", "Phone Cases", "Cables", "Earbuds", "Headphones"]) {
      expect(initialCatalog.filter(product => product.category === category)).toHaveLength(50);
    }
  });

  it("uses the requested WhatsApp number for product ordering", () => {
    expect(whatsappNumber).toBe("94759375358");
  });
});
