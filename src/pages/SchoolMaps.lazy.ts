/**
 * Single source of truth for the dynamic import of the `carian-sekolah` map
 * page. Both `React.lazy` in the router and the hover-prefetch path call this,
 * so the chunk is fetched at most once and shared through the module system's
 * own cache — hovering warms the chunk, and the later `lazy` render reuses it.
 */
export const importSchoolMapsPage = () => import("./SchoolMaps");
