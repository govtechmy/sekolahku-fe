/**
 * Shared map defaults. These live outside the page component so the hover
 * prefetch (`prefetch.svc.ts`) can issue byte-identical requests to the ones
 * `SchoolMaps` fires on mount — if these drift apart, the prefetch silently
 * stops being reused.
 */

/** Radius of the map page's very first nearby-schools fetch. */
export const FIRST_LOAD_RADIUS_METERS = 20000;

/** Zoom applied once the user's initial location is known. */
export const FIRST_LOAD_ZOOM = 11;
