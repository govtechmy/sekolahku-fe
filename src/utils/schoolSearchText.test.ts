import { describe, expect, it } from "vitest";
import { matchesSchoolSearchText } from "./schoolSearchText";

describe("matchesSchoolSearchText", () => {
  it("recognises a carried API result for a full school name", () => {
    expect(
      matchesSchoolSearchText(
        "SK SEKOLAH KEBANGSAAN NILAI IMPIAN NBA1234",
        "SEKOLAH KEBANGSAAN NILAI IMPIAN",
      ),
    ).toBe(true);
  });

  it("recognises a carried API result for a partial multi-word query", () => {
    expect(
      matchesSchoolSearchText(
        "SK SEKOLAH KEBANGSAAN NILAI IMPIAN NBA1234",
        "nilai impian",
      ),
    ).toBe(true);
  });

  it("rejects a result from a previous query", () => {
    expect(
      matchesSchoolSearchText(
        "SK SEKOLAH KEBANGSAAN NILAI IMPIAN NBA1234",
        "kajang utama",
      ),
    ).toBe(false);
  });
});
