import { describe, expect, it } from "vitest";
import { formatPPD } from "./ppdRemover";

describe("formatPPD", () => {
  it("drops the PPD prefix and title-cases the name", () => {
    expect(formatPPD("PPD SEREMBAN")).toBe("Seremban");
  });

  it("keeps office acronyms uppercase", () => {
    expect(formatPPD("PPW BANGSAR PUDU")).toBe("PPW Bangsar Pudu");
    expect(formatPPD("JPWP PUTRAJAYA")).toBe("JPWP Putrajaya");
    expect(formatPPD("JPN PERLIS")).toBe("JPN Perlis");
  });

  it("returns empty for missing values", () => {
    expect(formatPPD(null)).toBe("");
  });
});
