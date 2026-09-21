import { describe, it, expect } from "vitest";
import { getBantuanList, getBantuanBySlug } from "./bantuan.svc";
import bantuanData from "../data/bantuan.json";

describe("bantuan.svc (static data)", () => {
  it("returns all items when no search query is given", async () => {
    const result = await getBantuanList();
    expect(result.items).toHaveLength(bantuanData.length);
    expect(result.totalRecords).toBe(bantuanData.length);
  });

  it("filters items by title/description search, case-insensitively", async () => {
    const result = await getBantuanList("SUSU");
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every(
        (item) =>
          item.title.toLowerCase().includes("susu") ||
          item.description.toLowerCase().includes("susu"),
      ),
    ).toBe(true);
  });

  it("returns an empty list for a query matching nothing", async () => {
    const result = await getBantuanList("no-such-program-xyz");
    expect(result.items).toHaveLength(0);
  });

  it("returns a matching item by slug", async () => {
    const item = await getBantuanBySlug("program-susu-sekolah-pss");
    expect(item.title).toBe("Program Susu Sekolah (PSS)");
    expect(item.sections.length).toBeGreaterThan(0);
  });

  it("throws for an unknown slug", async () => {
    await expect(getBantuanBySlug("does-not-exist")).rejects.toThrow();
  });
});
