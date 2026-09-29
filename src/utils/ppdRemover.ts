import { toTitleCase } from "./titleCaseConverter";

export function removePPD(value?: string | null): string {
  if (!value) return "";
  return value.replace(/^PPD/gi, "").trim();
}

// Office acronyms that prefix some PPD names in the data (e.g. "PPW BANGSAR PUDU").
const PPD_ACRONYMS = new Set(["JPN", "JPWP", "PPW"]);

/** "PPD SEREMBAN" → "Seremban", "PPW BANGSAR PUDU" → "PPW Bangsar Pudu". */
export function formatPPD(value?: string | null): string {
  return toTitleCase(removePPD(value))
    .split(" ")
    .map((word) =>
      PPD_ACRONYMS.has(word.toUpperCase()) ? word.toUpperCase() : word,
    )
    .join(" ");
}
