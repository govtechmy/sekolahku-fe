// Geocoding service (OpenStreetMap Nominatim).
//
// Used to turn a free-text place / POI query (e.g. "McDonald's Putrajaya")
// into coordinates, so the map's "From" field can start a route from any
// place — Google-Maps style — not just the user's current location.
//
// IMPORTANT (production): this hits the public Nominatim server which has a
// strict usage policy (max ~1 req/sec, no bulk use, valid Referer required).
// Callers must debounce and avoid per-keystroke calls. For heavy/production
// traffic, self-host Nominatim or use a provider with an API key
// (Geoapify / LocationIQ / Mapbox / OpenRouteService) and proxy via backend.

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

/** Minimum query length before a geocode request is worthwhile. */
export const MIN_GEOCODE_QUERY_LENGTH = 3;

export interface PoiResult {
  /** Stable id (Nominatim place_id) for React keys. */
  id: string;
  /** Primary display name, e.g. "McDonald's". */
  label: string;
  /** Secondary address context, e.g. "Presint 8, Putrajaya, 62250". */
  sublabel: string;
  lat: number;
  lng: number;
}

interface NominatimItem {
  place_id: number | string;
  display_name?: string;
  name?: string;
  lat: string;
  lon: string;
}

/**
 * Search places / POIs by free text, biased to Malaysia.
 *
 * Returns an empty array on abort or error (never throws) so the UI can treat
 * "no results" and "failed" uniformly.
 *
 * @param query  Free-text place name.
 * @param signal Optional AbortSignal to cancel an in-flight request.
 */
export async function searchPoi(
  query: string,
  signal?: AbortSignal,
): Promise<PoiResult[]> {
  const q = query.trim();
  if (q.length < MIN_GEOCODE_QUERY_LENGTH) return [];

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "my",
    "accept-language": "ms,en",
  });

  try {
    const res = await fetch(`${NOMINATIM_SEARCH_URL}?${params.toString()}`, {
      signal,
    });
    if (!res.ok) {
      console.error("[geocode] Nominatim request failed:", res.status);
      return [];
    }

    const data = (await res.json()) as NominatimItem[];
    return data
      .map((item): PoiResult => {
        const display = item.display_name ?? "";
        const label =
          item.name && item.name.trim().length > 0
            ? item.name
            : display.split(",")[0].trim();
        const sublabel = display.startsWith(label)
          ? display.slice(label.length).replace(/^,\s*/, "")
          : display;
        return {
          id: String(item.place_id),
          label,
          sublabel,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        };
      })
      .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  } catch (err) {
    // Aborts are expected when the user keeps typing — swallow quietly.
    if (err instanceof DOMException && err.name === "AbortError") return [];
    console.error("[geocode] Nominatim search error:", err);
    return [];
  }
}
