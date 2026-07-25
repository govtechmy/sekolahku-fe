export function matchesSchoolSearchText(
  searchText: string,
  query: string,
): boolean {
  const normalizedText = searchText.toLowerCase();
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

  return (
    tokens.length > 0 && tokens.every((token) => normalizedText.includes(token))
  );
}
