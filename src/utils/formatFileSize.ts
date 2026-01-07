export const formatFileSize = (size: number | string) => {
  const parsedSize = Number(size);
  if (typeof parsedSize !== "number" || isNaN(parsedSize)) {
    return "0 B";
  }

  if (parsedSize < 1024) return `${parsedSize} B`;
  if (parsedSize < 1024 * 1024) return `${(parsedSize / 1024).toFixed(1)} KB`;
  return `${(parsedSize / 1024 / 1024).toFixed(1)} MB`;
};
