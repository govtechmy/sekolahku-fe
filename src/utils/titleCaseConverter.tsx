export const toTitleCase = (value: string) => {
  const lower = value.toLowerCase();
  return lower.replace(/\b([a-z])/g, (m) => m.toUpperCase());
};