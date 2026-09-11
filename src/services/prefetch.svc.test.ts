import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./school.svc", () => ({
  getAllSchoolMarkers: vi.fn(() => Promise.resolve([])),
  getSchoolTypes: vi.fn(() => Promise.resolve([])),
  fetchNearbySchools: vi.fn(() => Promise.resolve([])),
}));

vi.mock("./polygon.svc", () => ({
  fetchMultipleStatePolygons: vi.fn(() => Promise.resolve(new Map())),
}));

// The map page pulls in maplibre/react-map-gl, which can't load in the node
// test env — mock the shared lazy import so we can assert the chunk is warmed
// without executing the real module.
vi.mock("../pages/SchoolMaps.lazy", () => ({
  importSchoolMapsPage: vi.fn(() => Promise.resolve({ default: () => null })),
}));

/** Minimal in-memory sessionStorage — the node test env has none. */
const stubSessionStorage = (entries: Record<string, string> = {}) => {
  const store = new Map(Object.entries(entries));
  vi.stubGlobal("sessionStorage", {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    length: store.size,
  });
};

/** Fresh module graph so `prefetchStarted` resets between tests. */
const loadPrefetch = async () => {
  vi.resetModules();
  const school = await import("./school.svc");
  const polygon = await import("./polygon.svc");
  const lazyMap = await import("../pages/SchoolMaps.lazy");
  const { prefetchCarianSekolah } = await import("./prefetch.svc");
  return { prefetchCarianSekolah, school, polygon, lazyMap };
};

describe("prefetchCarianSekolah", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stubSessionStorage();
  });

  it("warms the school points, filter options and state polygons", async () => {
    const { prefetchCarianSekolah, school, polygon } = await loadPrefetch();

    prefetchCarianSekolah();

    expect(school.getAllSchoolMarkers).toHaveBeenCalledTimes(1);
    expect(school.getSchoolTypes).toHaveBeenCalledWith("MENENGAH");
    expect(school.getSchoolTypes).toHaveBeenCalledWith("RENDAH");
    expect(polygon.fetchMultipleStatePolygons).toHaveBeenCalledTimes(1);
  });

  it("warms the lazy map route chunk via the shared dynamic import", async () => {
    const { prefetchCarianSekolah, lazyMap } = await loadPrefetch();

    prefetchCarianSekolah();

    // Same import React.lazy uses in the router, so the chunk is fetched once
    // and reused on navigation rather than blocking it.
    expect(lazyMap.importSchoolMapsPage).toHaveBeenCalledTimes(1);
  });

  it("warms the map chunk only once across repeat hovers", async () => {
    const { prefetchCarianSekolah, lazyMap } = await loadPrefetch();

    prefetchCarianSekolah();
    prefetchCarianSekolah();
    prefetchCarianSekolah();

    expect(lazyMap.importSchoolMapsPage).toHaveBeenCalledTimes(1);
  });

  it("is a no-op on repeat calls, so hovering again refetches nothing", async () => {
    const { prefetchCarianSekolah, school, polygon } = await loadPrefetch();

    prefetchCarianSekolah();
    prefetchCarianSekolah();
    prefetchCarianSekolah();

    expect(school.getAllSchoolMarkers).toHaveBeenCalledTimes(1);
    expect(school.getSchoolTypes).toHaveBeenCalledTimes(2); // MENENGAH + RENDAH
    expect(polygon.fetchMultipleStatePolygons).toHaveBeenCalledTimes(1);
  });

  it("does not prefetch nearby schools when no location is known", async () => {
    const { prefetchCarianSekolah, school } = await loadPrefetch();

    prefetchCarianSekolah();

    // No coords in sessionStorage => must not trigger a geolocation-dependent
    // request (and by extension never a permission prompt).
    expect(school.fetchNearbySchools).not.toHaveBeenCalled();
  });

  it("prefetches nearby schools using the location cached in this tab", async () => {
    stubSessionStorage({
      locationSession: JSON.stringify({
        state: { initialLocationUser: [3.139, 101.6869] },
      }),
    });

    const { prefetchCarianSekolah, school } = await loadPrefetch();

    prefetchCarianSekolah();

    // Same radius/zoom the map page uses on first load, so the cache key matches.
    expect(school.fetchNearbySchools).toHaveBeenCalledWith(
      3.139,
      101.6869,
      20000,
      true,
      11,
    );
  });

  it("ignores a malformed cached location", async () => {
    stubSessionStorage({
      locationSession: JSON.stringify({
        state: { initialLocationUser: [null, null] },
      }),
    });

    const { prefetchCarianSekolah, school } = await loadPrefetch();

    prefetchCarianSekolah();

    expect(school.fetchNearbySchools).not.toHaveBeenCalled();
  });
});
