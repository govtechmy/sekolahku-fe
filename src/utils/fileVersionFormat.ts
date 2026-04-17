export const formatFileVersion = (version?: string): string => {
  if (!version || version.length <= 4) return version ?? "Tiada Maklumat";
  return `${version.slice(0, -4)} ${version.slice(-4)}`;
};
