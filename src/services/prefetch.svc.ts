import {
  FIRST_LOAD_RADIUS_METERS,
  FIRST_LOAD_ZOOM,
} from "../constants/mapDefaults";
import { NEGERI_LIST } from "../contentData";
import { getSessionInitialLocation } from "../utils/sessionInitialLocation";
import { fetchMultipleStatePolygons } from "./polygon.svc";
import { importSchoolMapsPage } from "../pages/SchoolMaps.lazy";
import {
  fetchNearbySchools,
  getAllSchoolMarkers,
  getSchoolTypes,
} from "./school.svc";

/**
 * Warms every network request the `carian-sekolah` page performs on mount:
 *
 *  - `getAllSchoolMarkers()` — the heavy ~10k school points payload used by
 *    both the clustered map and the sidebar fuzzy search.
 *  - `getSchoolTypes()`      — the MENENGAH / RENDAH filter dropdown options.
 *  - state polygons          — one JSON per state from S3.
 *  - nearby schools          — only when the user's location is already known
 *    from a previous visit in this tab. Never triggers a permission prompt.
 *
 * All are module-cached in their own services, so the page mount reuses the
 * prefetched result (or joins the in-flight request) instead of firing a
 * second one.
 *
 * Safe to call repeatedly — extra calls are no-ops.
 */
let prefetchStarted = false;

export const prefetchCarianSekolah = (): void => {
  if (prefetchStarted) return;
  prefetchStarted = true;

  // Now that the map page is a lazy route, its JS chunk is a new blocking cost
  // on navigation. Warm it here too, using the SAME dynamic import that
  // `React.lazy` uses in the router, so the module system caches it once and
  // the later route render reuses it instead of fetching again. Fire and
  // forget — a failure just means `lazy` fetches it on navigation as before.
  importSchoolMapsPage().catch(() => {});

  // Fire and forget. Failures are swallowed here on purpose: the page mount
  // will retry and surface the error through its own handling.
  getAllSchoolMarkers().catch(() => {
    // Reset so a later hover (or the page itself) can retry.
    prefetchStarted = false;
  });

  Promise.all([getSchoolTypes("MENENGAH"), getSchoolTypes("RENDAH")]).catch(
    () => {},
  );

  fetchMultipleStatePolygons(NEGERI_LIST).catch(() => {});

  // The map page's first nearby fetch needs coordinates. If sessionStorage
  // already holds them (the user has been to the map page in this tab), warm
  // that request too. On a cold session we skip it rather than asking for
  // geolocation permission from a page the user hasn't opted into.
  const sessionLocation = getSessionInitialLocation();
  if (sessionLocation) {
    const [latitude, longitude] = sessionLocation;
    // `fetchNearbySchools` already swallows its own errors and rounds the
    // coordinates the same way the page will, so the cache key matches.
    void fetchNearbySchools(
      latitude,
      longitude,
      FIRST_LOAD_RADIUS_METERS,
      true,
      FIRST_LOAD_ZOOM,
    );
  }
};
