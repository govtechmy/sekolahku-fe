// The MOE takwim API only returns the PDF url (its `alt` is always "Takwim"),
// so read the year off the file name, e.g.
// ".../Kalendar%20Akademik%20Tahun%202027.pdf" -> "Kalendar Akademik 2027".
export const getMoeTakwimTitle = (url: string): string => {
  const fileName = url.split(/[?#]/)[0].split("/").pop() ?? "";
  let decoded = fileName;
  try {
    decoded = decodeURIComponent(fileName);
  } catch {
    // Malformed escape sequence; the raw name may still contain the year.
  }
  const year = decoded.match(/(?<!\d)20\d{2}(?!\d)/)?.[0];
  return year ? `Kalendar Akademik ${year}` : "Kalendar Akademik";
};
