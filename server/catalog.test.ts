import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("catalog persistence procedures", () => {
  it("registers the public list, initialize, save, and source settings procedures", () => {
    const procedures = appRouter._def.procedures as Record<string, unknown>;
    expect(procedures).toHaveProperty("catalog.list");
    expect(procedures).toHaveProperty("catalog.initialize");
    expect(procedures).toHaveProperty("catalog.save");
    expect(procedures).toHaveProperty("catalog.settings");
    expect(procedures).toHaveProperty("catalog.saveSettings");
  });
});
