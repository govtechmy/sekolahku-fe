export function removePPD(value?: string | null): string {
  if (!value) return "";
  return value.replace(/ppd/gi, "").trim();
}
