// Returns undefined (not "") when there's no real version, so SectionHeader's
// `subTitle &&` check hides the "Data sehingga" line instead of rendering it
// with a blank date.
export const formatFileVersion = (version?: string): string | undefined => {
  if (!version) return undefined;
  if (version.length <= 4) return version;
  return `${version.slice(0, -4)} ${version.slice(-4)}`;
};
