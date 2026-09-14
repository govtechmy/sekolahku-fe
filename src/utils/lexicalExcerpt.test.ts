import { describe, expect, it } from "vitest";
import { getLexicalExcerpt } from "./lexicalExcerpt";
import type { SiaranContent } from "../models/response";

const wrap = (text: string): SiaranContent =>
  ({
    root: {
      type: "root",
      children: [{ type: "paragraph", children: [{ type: "text", text }] }],
    },
  }) as unknown as SiaranContent;

describe("getLexicalExcerpt", () => {
  it("returns empty string for missing content", () => {
    expect(getLexicalExcerpt(undefined)).toBe("");
    expect(getLexicalExcerpt({} as SiaranContent)).toBe("");
  });

  it("returns full text when under the limit", () => {
    expect(getLexicalExcerpt(wrap("Berita ringkas KPM"))).toBe(
      "Berita ringkas KPM",
    );
  });

  it("truncates at a word boundary with an ellipsis", () => {
    const long = wrap(
      "satu dua tiga empat lima enam tujuh lapan sembilan sepuluh",
    );
    const out = getLexicalExcerpt(long, 20);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(21);
    expect(out).not.toContain("  ");
  });
});
