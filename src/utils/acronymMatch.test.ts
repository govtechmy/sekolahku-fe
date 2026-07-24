import { describe, it, expect } from "vitest";
import {
  matchAcronym,
  matchSchoolAcronym,
  toAcronymWords,
  isAcronymMatch,
} from "./acronymMatch";

// The corpus word list mirrors SearchBarMap: `${jenisLabel} ${namaSekolah}`.
const words = (jenisLabel: string, namaSekolah: string) =>
  toAcronymWords(`${jenisLabel} ${namaSekolah}`);

// Real records fetched from the dev API for "putrajaya presint 8".
const SMK_P8 = words(
  "SMK",
  "SEKOLAH MENENGAH KEBANGSAAN PUTRAJAYA PRESINT 8(1)",
);
const SK_P8_1 = words("SK", "SEKOLAH KEBANGSAAN PUTRAJAYA PRESINT 8(1)");
const SK_P8_3 = words("SK", "SEKOLAH KEBANGSAAN PUTRAJAYA PRESINT 8 (3)");
const SK_GOMBAK = words("SK", "SEKOLAH KEBANGSAAN GOMBAK SETIA");

// Schools that previously matched "meru" as a scattered-letter false positive.
const SMK_RUSILA = words("SMK", "SEKOLAH MENENGAH KEBANGSAAN RUSILA");
const SMK_RAJA = words("SMK", "SEKOLAH MENENGAH KEBANGSAAN RAJA TUN UDA");
const SK_JALAN_MERU = words("SK", "SEKOLAH KEBANGSAAN (2) JALAN MERU");

describe("toAcronymWords", () => {
  it("splits on whitespace, parens and punctuation", () => {
    expect(SMK_P8).toEqual([
      "smk",
      "sekolah",
      "menengah",
      "kebangsaan",
      "putrajaya",
      "presint",
      "8",
      "1",
    ]);
  });

  it("separates a trailing number in parentheses", () => {
    expect(toAcronymWords("PRESINT 8(1)")).toEqual(["presint", "8", "1"]);
    expect(toAcronymWords("PRESINT 8 (3)")).toEqual(["presint", "8", "3"]);
  });
});

describe("matchAcronym", () => {
  it("resolves the motivating case: smkpp8 -> SMK Putrajaya Presint 8", () => {
    expect(matchAcronym("smkpp8", SMK_P8)).toBeGreaterThanOrEqual(2);
  });

  it("returns -1 when the query cannot be fully consumed", () => {
    expect(matchAcronym("smkpp8", SK_P8_1)).toBe(-1); // no 'm' word in an SK
    expect(matchAcronym("smkpp88", SMK_P8)).toBe(-1); // extra digit
    expect(matchAcronym("xyz", SMK_P8)).toBe(-1);
  });

  it("returns -1 for empty inputs", () => {
    expect(matchAcronym("", SMK_P8)).toBe(-1);
    expect(matchAcronym("smk", [])).toBe(-1);
  });
});

describe("isAcronymMatch", () => {
  it("matches the exact requested scenario", () => {
    expect(isAcronymMatch("smkpp8", SMK_P8)).toBe(true);
  });

  it("does not match SK schools for an 'smk' acronym (the 'm' disambiguates)", () => {
    expect(isAcronymMatch("smkpp8", SK_P8_1)).toBe(false);
    expect(isAcronymMatch("smkpp8", SK_P8_3)).toBe(false);
  });

  it("matches SK variants for an 'sk' acronym", () => {
    expect(isAcronymMatch("skpp8", SK_P8_1)).toBe(true);
    expect(isAcronymMatch("skpp8", SK_P8_3)).toBe(true);
  });

  it("supports partial acronyms", () => {
    expect(isAcronymMatch("smkp", SMK_P8)).toBe(true); // s-m-k-p(utrajaya)
    expect(isAcronymMatch("smkpp", SMK_P8)).toBe(true);
  });

  it("ignores multi-word (spaced) queries — those go through the token path", () => {
    expect(isAcronymMatch("smk putrajaya", SMK_P8)).toBe(false);
  });

  it("ignores very short queries", () => {
    expect(isAcronymMatch("sm", SMK_P8)).toBe(false);
    expect(isAcronymMatch("smk", SMK_P8)).toBe(false); // below minQueryLength 4
  });

  it("does not match unrelated schools", () => {
    expect(isAcronymMatch("smkpp8", SK_GOMBAK)).toBe(false);
    expect(isAcronymMatch("skgs", SK_GOMBAK)).toBe(true); // s-k-g(ombak)-s(etia)
  });

  it("respects custom thresholds", () => {
    expect(isAcronymMatch("smk", SMK_P8, { minQueryLength: 3 })).toBe(true);
    expect(isAcronymMatch("smkpp8", SMK_P8, { minWords: 99 })).toBe(false);
  });
});

describe("matchSchoolAcronym (type-code anchored)", () => {
  it("matches real type + initials acronyms", () => {
    expect(matchSchoolAcronym("smkpp8", SMK_P8)).toBeGreaterThanOrEqual(1);
    expect(matchSchoolAcronym("skpp8", SK_P8_1)).toBeGreaterThanOrEqual(1);
    expect(matchSchoolAcronym("smkputrajaya", SMK_P8)).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("rejects plain words that scatter across unrelated words (the bug)", () => {
    // "meru" must NOT match via me(nengah)+ru(sila) or me+r(aja)+u(da).
    expect(matchSchoolAcronym("meru", SMK_RUSILA)).toBe(-1);
    expect(matchSchoolAcronym("meru", SMK_RAJA)).toBe(-1);
    // Nor a "Jalan Meru" school — that's handled by exact-word matching, and
    // "meru" doesn't start with the type code "sk".
    expect(matchSchoolAcronym("meru", SK_JALAN_MERU)).toBe(-1);
  });

  it("still matches when the query includes the type code + the word", () => {
    expect(matchSchoolAcronym("skmeru", SK_JALAN_MERU)).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("does not match when only the type code is given", () => {
    expect(matchSchoolAcronym("smk", SMK_P8)).toBe(-1);
  });

  it("disambiguates SMK vs SK via the type code", () => {
    // "smkpp8" can't match an SK (remainder "mkpp8" has no 'm' word).
    expect(matchSchoolAcronym("smkpp8", SK_P8_1)).toBe(-1);
  });
});
