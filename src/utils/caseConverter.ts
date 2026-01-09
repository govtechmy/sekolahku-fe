export default function caseConverter(value?: string | null): string {
  if (!value) return "";

  return value.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase());
}
