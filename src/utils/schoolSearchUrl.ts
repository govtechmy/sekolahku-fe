export interface SchoolSearchFilters {
  negeri?: string;
  peringkat?: string;
  jenis?: string;
}

export function buildSchoolSearchPath(
  lang: string | undefined,
  query?: string,
  filters?: SchoolSearchFilters,
): string {
  const path = `/${lang || "ms"}/carian-sekolah`;
  const searchParams = new URLSearchParams();

  const trimmedQuery = query?.trim();
  if (trimmedQuery) searchParams.set("q", trimmedQuery);
  if (filters?.negeri && filters.negeri !== "ALL")
    searchParams.set("negeri", filters.negeri);
  if (filters?.peringkat && filters.peringkat !== "ALL")
    searchParams.set("peringkat", filters.peringkat);
  if (filters?.jenis && filters.jenis !== "ALL")
    searchParams.set("jenis", filters.jenis);

  const qs = searchParams.toString();
  return qs ? `${path}?${qs}` : path;
}
