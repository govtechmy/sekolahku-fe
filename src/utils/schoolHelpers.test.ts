import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import schoolLogoFallback from "../data/schoolLogoFallback.json";
import {
  getSchoolLogoFallbackUrl,
  trySchoolLogoFallback,
} from "./schoolHelpers";

// Minimal stand-in for an <img>: the helper only touches src and dataset.
const makeImg = (src = "https://cdn/logo.png") =>
  ({ src, dataset: {} }) as unknown as HTMLImageElement;

describe("getSchoolLogoFallbackUrl", () => {
  it("points at the local logo with its original extension", () => {
    expect(getSchoolLogoFallbackUrl("BKA4001")).toBe(
      "/logo-sekolah/BKA4001.jpg",
    );
  });

  it("returns undefined for a school without a fallback", () => {
    expect(getSchoolLogoFallbackUrl("NOTASCHOOL")).toBeUndefined();
    expect(getSchoolLogoFallbackUrl(undefined)).toBeUndefined();
  });

  it("has a file in public/logo-sekolah for every manifest entry", () => {
    const missing = Object.entries(schoolLogoFallback)
      .map(([kod, ext]) => `${kod}.${ext}`)
      .filter(
        (file) =>
          !existsSync(resolve(__dirname, "../../public/logo-sekolah", file)),
      );
    expect(missing).toEqual([]);
  });
});

describe("trySchoolLogoFallback", () => {
  it("swaps to the fallback once, then lets the caller show its default", () => {
    const img = makeImg();
    expect(trySchoolLogoFallback(img, "BKA4001")).toBe(true);
    expect(img.src).toBe("/logo-sekolah/BKA4001.jpg");
    // The fallback itself failed: don't loop, hand back to the caller.
    expect(trySchoolLogoFallback(img, "BKA4001")).toBe(false);
  });

  it("tries again when the same <img> is reused for another school", () => {
    const img = makeImg();
    trySchoolLogoFallback(img, "BKA4001");
    expect(trySchoolLogoFallback(img, "JBA0001")).toBe(true);
    expect(img.src).toBe("/logo-sekolah/JBA0001.jpg");
  });

  it("leaves the image alone when the school has no fallback", () => {
    const img = makeImg();
    expect(trySchoolLogoFallback(img, "NOTASCHOOL")).toBe(false);
    expect(img.src).toBe("https://cdn/logo.png");
  });
});
