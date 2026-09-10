// Geocoding service — turns a free-text place / POI query (e.g. "AEON Nilai",
// "Presint 8") into coordinates, so the map's "From" field can start a route
// from any place, not just the user's current location.
//
// Primary: Amazon Location Service GeoPlaces v2 SearchText, called over its
// REST endpoint with an API key (?key=) — no AWS SDK, no request signing.
// Falls back to OSM Nominatim when ALS isn't configured (VITE_ALS_API_KEY
// unset), so local dev keeps working before the key exists.
//
// NOTE: only the free-text place the *user types* is geocoded here. School
// addresses are NOT geocoded — schools already carry stored coordinates
// (data.infoLokasi.location) from the backend.

/** Minimum query length before a geocode request is worthwhile. */
export const MIN_GEOCODE_QUERY_LENGTH = 3;

export interface PoiResult {
  /** Stable id for React keys. */
  id: string;
  /** Primary display name, e.g. "AEON Nilai". */
  label: string;
  /** Secondary address context, e.g. "Putra Nilai, 71800, Negeri Sembilan". */
  sublabel: string;
  lat: number;
  lng: number;
}

// --- Amazon Location Service GeoPlaces v2 (primary) -----------------------

const ALS_API_KEY = import.meta.env.VITE_ALS_API_KEY as string | undefined;
const ALS_REGION =
  (import.meta.env.VITE_ALS_REGION as string | undefined) ?? "ap-southeast-5";

// [lng, lat] of KL — bias results towards Malaysia's centre of gravity.
const BIAS_POSITION: [number, number] = [101.6869, 3.139];

interface GeoPlacesResultItem {
  PlaceId?: string;
  Title?: string;
  Address?: { Label?: string };
  Position?: number[]; // [lng, lat]
}

async function searchPoiAls(
  q: string,
  signal?: AbortSignal,
): Promise<PoiResult[]> {
  const url = `https://places.geo.${ALS_REGION}.amazonaws.com/v2/search-text?key=${encodeURIComponent(ALS_API_KEY!)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      QueryText: q,
      Filter: { IncludeCountries: ["MYS"] },
      BiasPosition: BIAS_POSITION,
      MaxResults: 6,
      Language: "ms",
    }),
  });
  if (!res.ok) {
    console.error("[geocode] GeoPlaces request failed:", res.status);
    return [];
  }

  const data = (await res.json()) as { ResultItems?: GeoPlacesResultItem[] };
  return (data.ResultItems ?? []).flatMap((item): PoiResult[] => {
    const point = item.Position; // [lng, lat]
    if (!point || point.length < 2) return [];
    const [lng, lat] = point;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    const label = item.Title ?? item.Address?.Label?.split(",")[0].trim() ?? "";
    return [
      {
        id: item.PlaceId ?? `${lat},${lng}`,
        label,
        sublabel: item.Address?.Label ?? "",
        lat,
        lng,
      },
    ];
  });
}

// --- OSM Nominatim (fallback when ALS not configured) ---------------------

const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

interface NominatimItem {
  place_id: number | string;
  display_name?: string;
  name?: string;
  lat: string;
  lon: string;
}

async function searchPoiNominatim(
  q: string,
  signal?: AbortSignal,
): Promise<PoiResult[]> {
  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    countrycodes: "my",
    "accept-language": "ms,en",
  });

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

  try {
    return ALS_API_KEY
      ? await searchPoiAls(q, signal)
      : await searchPoiNominatim(q, signal);
  } catch (err) {
    // Aborts are expected when the user keeps typing — swallow quietly.
    if (err instanceof DOMException && err.name === "AbortError") return [];
    console.error("[geocode] search error:", err);
    return [];
  }
}
