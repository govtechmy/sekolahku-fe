export function buildSchoolSearchPath(
  lang: string | undefined,
  query?: string,
): string {
  const path = `/${lang || "ms"}/carian-sekolah`;
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) return path;

  const searchParams = new URLSearchParams({ q: trimmedQuery });
  return `${path}?${searchParams.toString()}`;
}
