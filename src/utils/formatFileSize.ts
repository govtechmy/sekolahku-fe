export const formatFileSize = (size: number | string) => {
  if (typeof size !== "number" || isNaN(size)) {
    return "0 B";
  }

  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};
