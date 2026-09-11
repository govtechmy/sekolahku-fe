import { describe, expect, it } from "vitest";
import { buildSchoolSearchPath } from "./schoolSearchUrl";

describe("buildSchoolSearchPath", () => {
  it("carries the trimmed home query to the school-search page", () => {
    expect(buildSchoolSearchPath("ms", "  nilai impian  ")).toBe(
      "/ms/carian-sekolah?q=nilai+impian",
    );
  });

  it("defaults to Malay and omits an empty query", () => {
    expect(buildSchoolSearchPath(undefined, "   ")).toBe("/ms/carian-sekolah");
  });
});
