import { describe, expect, it } from "vitest";
import { getMoeTakwimTitle } from "./moeTakwimTitle";

describe("getMoeTakwimTitle", () => {
  it("takes the year from the PDF file name", () => {
    expect(
      getMoeTakwimTitle(
        "https://www.moe.gov.my/storage/files/shares/Takwim/Takwim%20Persekolahan/Kalendar%20Akademik%20Tahun%202027.pdf",
      ),
    ).toBe("Kalendar Akademik 2027");
  });

  it("ignores years in the folder path", () => {
    expect(
      getMoeTakwimTitle("https://moe.gov.my/files/2026/kalendar-akademik.pdf"),
    ).toBe("Kalendar Akademik");
  });

  it("falls back when the file name has no year", () => {
    expect(getMoeTakwimTitle("https://moe.gov.my/kalendar.pdf")).toBe(
      "Kalendar Akademik",
    );
  });

  it("still finds the year when the name has a bad escape", () => {
    expect(getMoeTakwimTitle("https://moe.gov.my/Kalendar%E0_2028.pdf")).toBe(
      "Kalendar Akademik 2028",
    );
  });
});
