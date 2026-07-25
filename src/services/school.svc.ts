import type {
  schoolSearchModel,
  ListSekolahModel,
  APIResponse,
  ItemSekolahModel,
  NearbySchoolsModel,
  NearbySchoolsParams,
  MarkerGroup,
} from "../models/response";
import { authAxios } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SCHOOL_ENDPOINT = "/schools";
export const DATA_BASE_URL = import.meta.env.VITE_DATA_BASE_URL;

type CenterCoord = [number | null, number | null];

export const getSchoolSuggestion = async (
  params?: schoolSearchModel,
  pageNumber: number = 1,
  initialLocationUser?: CenterCoord,
): Promise<{
  filteredData: ItemSekolahModel[];
  totalSchool: number;
  totalInSinglePage: number;
}> => {
  try {
    if (params?.namaSekolah) {
      params = {
        ...params,
        namaSekolah: params.namaSekolah.trim().replace(/\s+/g, " "),
      };
    }

    const [lat, lng] = initialLocationUser || [null, null];
    let locationParams = ``;
    if (lat != null && lng != null) {
      locationParams = `latitude=${lat}&longitude=${lng}&`;
    }
    const searchParams = `/search?${locationParams}page=${pageNumber}&pageSize=12`;

    if (params?.peringkat && params.peringkat !== "ALL") {
      // peringkat is now a direct field on the school — pass it as-is to the API.
      // Only strip jenis if it wasn't explicitly set.
      if (params.jenis && params.jenis !== "ALL") {
        const existingJenis = params.jenis.split(",");
        const allJenis = [...new Set([...existingJenis])];
        params = { ...params, jenis: allJenis.join(",") };
      } else {
        // Remove jenis so the API filters purely by peringkat
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { jenis: _jenis, ...rest } = params;
        params = rest;
      }
    }

    const response = await authAxios.get<APIResponse<ListSekolahModel>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}${searchParams}`,
      {
        params,
        paramsSerializer: { indexes: null },
      },
    );

    const list = response.data.data?.items || [];
    const filteredData = list.filter(
      (school) =>
        school.data.infoLokasi.koordinatYY != null &&
        school.data.infoLokasi.koordinatXX != null,
    );
    const totalSchool = response.data.data?.totalRecords ?? 0;
    const pageSize = response.data.data?.pageSize ?? 0;
    const safeTotalSchool = isNaN(totalSchool) ? 0 : totalSchool;
    const safePageSize = isNaN(pageSize) ? 0 : pageSize;
    const totalInSinglePage =
      safeTotalSchool > safePageSize ? safePageSize : safeTotalSchool;

    return { filteredData, totalSchool, totalInSinglePage };
  } catch (error) {
    console.error("Error fetching school suggestions:", error);
    throw error;
  }
};

export interface SchoolPoint {
  kodSekolah: string;
  namaSekolah: string;
  lng: number;
  lat: number;
  negeri: string;
  parlimen: string;
  peringkat: string;
  jenisLabel: string;
  bandarSurat: string;
  sesi: string;
  isSekolahAngkatMADANI: boolean;
}

/**
 * Loads ALL school points (lightweight coords + fields) to feed client-side
 * MapLibre clustering.
 *
 * The naive single `pageSize=20000` request is slow enough to be felt: measured
 * ~1.2–2.9s TTFB for 1 MB gzip / 8.9 MB raw, and CloudFront reports a cache
 * miss every time, so every visitor paid it in full before a single pin could
 * appear. Instead we page it: page 1 lands in ~0.3s and is published
 * immediately so pins render right away, while the remaining pages are fetched
 * in parallel (measured ~1.0s wall for all five) and published as they arrive.
 *
 * Cached at module level so repeated mounts (incl. React StrictMode double
 * invoke in dev) reuse a single in-flight load / result.
 */
const MARKER_PAGE_SIZE = 2500;

let allSchoolPointsCache: SchoolPoint[] | null = null;
let allSchoolPointsPromise: Promise<SchoolPoint[]> | null = null;

/** Points accumulated so far by an in-flight load. */
let partialSchoolPoints: SchoolPoint[] = [];

/** Subscribers notified on every batch, so the map can paint progressively. */
type SchoolPointsListener = (points: SchoolPoint[]) => void;
const schoolPointsListeners = new Set<SchoolPointsListener>();

const publishSchoolPoints = (points: SchoolPoint[]) => {
  partialSchoolPoints = points;
  schoolPointsListeners.forEach((listener) => {
    try {
      listener(points);
    } catch (error) {
      console.error("[school.svc] school points listener failed:", error);
    }
  });
};

const getSchoolCoordinates = (
  school: ItemSekolahModel,
): [lng: number, lat: number] | null => {
  const geoJsonCoordinates = school.data?.infoLokasi?.location?.coordinates;
  if (
    Array.isArray(geoJsonCoordinates) &&
    Number.isFinite(geoJsonCoordinates[0]) &&
    Number.isFinite(geoJsonCoordinates[1])
  ) {
    return [geoJsonCoordinates[0], geoJsonCoordinates[1]];
  }

  const longitude = school.data?.infoLokasi?.koordinatXX;
  const latitude = school.data?.infoLokasi?.koordinatYY;
  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return [longitude, latitude];
  }

  return null;
};

const toSchoolPoints = (items: ItemSekolahModel[]): SchoolPoint[] =>
  items.flatMap((s) => {
    const coordinates = getSchoolCoordinates(s);
    if (!coordinates) return [];

    const [lng, lat] = coordinates;
    return [
      {
        kodSekolah: s.kodSekolah ?? "",
        namaSekolah: s.namaSekolah ?? "Sekolah",
        lng,
        lat,
        negeri: s.data.infoPentadbiran?.negeri ?? "",
        parlimen: s.data.infoPentadbiran?.parlimen ?? "",
        peringkat: s.data.infoPentadbiran?.peringkat ?? "",
        jenisLabel: s.data.infoSekolah?.jenisLabel ?? "",
        bandarSurat: s.data.infoKomunikasi?.bandarSurat ?? "",
        sesi: s.data.infoPentadbiran?.sesi ?? "",
        isSekolahAngkatMADANI: s.isSekolahAngkatMADANI ?? false,
      },
    ];
  });

const fetchSchoolPointsPage = async (
  page: number,
): Promise<{ points: SchoolPoint[]; totalRecords: number }> => {
  const response = await authAxios.get<APIResponse<ListSekolahModel>>(
    `${BASE_URL}${SCHOOL_ENDPOINT}/search?page=${page}&pageSize=${MARKER_PAGE_SIZE}`,
  );
  return {
    points: toSchoolPoints(response.data.data?.items || []),
    totalRecords: response.data.data?.totalRecords ?? 0,
  };
};

const loadAllSchoolMarkers = async (): Promise<SchoolPoint[]> => {
  // Page ordering isn't documented as stable, so merge by school code rather
  // than concatenating — that way an overlap between pages can't create
  // duplicate pins.
  const byCode = new Map<string, SchoolPoint>();
  const merge = (points: SchoolPoint[]) => {
    points.forEach((p) => byCode.set(p.kodSekolah || `${p.lng},${p.lat}`, p));
  };

  const first = await fetchSchoolPointsPage(1);
  merge(first.points);
  publishSchoolPoints([...byCode.values()]);

  const totalPages = Math.max(
    1,
    Math.ceil(first.totalRecords / MARKER_PAGE_SIZE),
  );

  if (totalPages > 1) {
    const remaining = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    await Promise.all(
      remaining.map(async (page) => {
        const { points } = await fetchSchoolPointsPage(page);
        merge(points);
        publishSchoolPoints([...byCode.values()]);
      }),
    );
  }

  return [...byCode.values()];
};

export const getAllSchoolMarkers = async (): Promise<SchoolPoint[]> => {
  if (allSchoolPointsCache) return allSchoolPointsCache;
  if (allSchoolPointsPromise) return allSchoolPointsPromise;

  allSchoolPointsPromise = loadAllSchoolMarkers();

  try {
    const points = await allSchoolPointsPromise;
    allSchoolPointsCache = points;
    publishSchoolPoints(points);
    return points;
  } catch (err) {
    // Allow a retry on next call if this attempt failed.
    allSchoolPointsPromise = null;
    partialSchoolPoints = [];
    throw err;
  }
};

/**
 * Subscribe to school points as they load. Fires immediately with whatever is
 * already available (full cache, or the pages loaded so far) and again on each
 * subsequent batch. Starts the load if it hasn't begun.
 *
 * Consumers get pins on screen after the first page instead of waiting for the
 * whole dataset.
 */
export const subscribeSchoolMarkers = (
  listener: SchoolPointsListener,
): (() => void) => {
  schoolPointsListeners.add(listener);

  if (allSchoolPointsCache) {
    listener(allSchoolPointsCache);
  } else {
    if (partialSchoolPoints.length > 0) listener(partialSchoolPoints);
    void getAllSchoolMarkers().catch((error) =>
      console.error("[school.svc] failed to load school points:", error),
    );
  }

  return () => {
    schoolPointsListeners.delete(listener);
  };
};

/**
 * Short-lived cache for nearby lookups, keyed on the exact query params.
 * Coordinates are already rounded to 4 decimals by `fetchNearbySchools`, so
 * keys are stable across calls for the same viewport. This is what lets a
 * hover prefetch be reused by the map page's first-load fetch — and it also
 * spares the API when the user pans back to a viewport they've already seen.
 */
const NEARBY_CACHE_TTL_MS = 5 * 60 * 1000;
const NEARBY_CACHE_MAX_ENTRIES = 50;

const nearbyCache = new Map<string, { at: number; data: NearbySchoolsModel }>();
const nearbyPromises = new Map<string, Promise<NearbySchoolsModel>>();

const nearbyCacheKey = (params?: NearbySchoolsParams): string =>
  JSON.stringify([
    params?.latitude ?? null,
    params?.longitude ?? null,
    params?.radiusInMeter ?? null,
    params?.name ?? "",
  ]);

export const getSchoolNearby = async (
  params?: NearbySchoolsParams,
): Promise<NearbySchoolsModel> => {
  const key = nearbyCacheKey(params);

  const cached = nearbyCache.get(key);
  if (cached && Date.now() - cached.at < NEARBY_CACHE_TTL_MS) {
    return cached.data;
  }

  const inFlight = nearbyPromises.get(key);
  if (inFlight) return inFlight;

  const promise = fetchSchoolNearby(params);
  nearbyPromises.set(key, promise);

  try {
    const data = await promise;
    nearbyCache.set(key, { at: Date.now(), data });
    // Bound memory during long panning sessions — drop the oldest entry.
    if (nearbyCache.size > NEARBY_CACHE_MAX_ENTRIES) {
      const oldestKey = nearbyCache.keys().next().value;
      if (oldestKey !== undefined) nearbyCache.delete(oldestKey);
    }
    return data;
  } finally {
    nearbyPromises.delete(key);
  }
};

const fetchSchoolNearby = async (
  params?: NearbySchoolsParams,
): Promise<NearbySchoolsModel> => {
  try {
    const response = await authAxios.get<APIResponse<NearbySchoolsModel>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/find-nearby`,
      {
        params,
        paramsSerializer: { indexes: null },
      },
    );

    const data = response.data.data;

    if (data?.markerGroups) {
      data.markerGroups = data.markerGroups.filter(
        (school) =>
          school.infoLokasi?.koordinatXX != null &&
          school.infoLokasi?.koordinatYY != null,
      );

      if (data.markerGroups.length === 0) {
        console.error(
          "Return data empty - no schools with valid coordinates found",
        );
      }
    } else {
      console.warn("Return data empty - markerGroups is null or undefined");
    }

    return data;
  } catch (error) {
    console.error("Error fetching nearby schools:", error);
    throw error;
  }
};

export const getSchoolS3Json = async (
  dataUrl?: string,
  negeri?: string,
  parlimen?: string,
  kodSekolah?: string,
): Promise<ItemSekolahModel> => {
  try {
    if (!dataUrl) {
      if (negeri && parlimen && kodSekolah) {
        dataUrl = `${DATA_BASE_URL}/${negeri}/${parlimen}/${kodSekolah}/${kodSekolah}.json`;
      } else {
        throw new Error("Insufficient parameters to construct S3 URL");
      }
    }
    const response = await authAxios.get<ItemSekolahModel>(dataUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching school JSON:", error);
    throw error;
  }
};

export const fetchNearbySchools = async (
  latitude: number,
  longitude: number,
  radiusInMeter: number,
  initialLocationSet?: boolean,
  _zoom?: number,
  name?: string,
): Promise<MarkerGroup[]> => {
  if (initialLocationSet === false) {
    return [];
  }
  const latitudeFixed = parseFloat(latitude.toFixed(4));
  const longitudeFixed = parseFloat(longitude.toFixed(4));
  try {
    if (name && name !== "") {
      const nearbySchools = await getSchoolNearby({
        latitude: latitudeFixed,
        longitude: longitudeFixed,
        radiusInMeter,
        name,
      });
      return nearbySchools?.markerGroups || [];
    } else {
      const nearbySchools = await getSchoolNearby({
        latitude: latitudeFixed,
        longitude: longitudeFixed,
        radiusInMeter,
      });
      return nearbySchools?.markerGroups || [];
    }
  } catch (error) {
    console.error("Failed to fetch nearby schools:", error);
    return [];
  }
};

export const getSchoolProfile = async (
  id: string,
  nearbyRadius: number = 1000,
) => {
  if (!id) {
    throw new Error("School ID is required");
  }

  const basicSchoolInfo = await getSchoolId(id);

  if (!basicSchoolInfo?.data?.infoPentadbiran) {
    throw new Error("School not found or invalid data structure");
  }

  const { negeri, parlimen } = basicSchoolInfo.data.infoPentadbiran;
  const { kodSekolah } = basicSchoolInfo;
  const schoolDetails = await getSchoolS3Json(
    undefined,
    negeri,
    parlimen,
    kodSekolah,
  );

  const { koordinatYY, koordinatXX } = basicSchoolInfo.data.infoLokasi;
  const nearbyMarkers = await fetchNearbySchools(
    koordinatYY,
    koordinatXX,
    nearbyRadius,
    true,
    15,
  );

  const nearbyDetailsPromises = nearbyMarkers
    .slice(1, 4)
    .map(async (school) => {
      try {
        return await getSchoolS3Json(school.dataUrl);
      } catch (error) {
        console.warn(
          `Failed to fetch data for school ${school.kodSekolah}:`,
          error,
        );
        return null;
      }
    });

  const nearbySchools = (await Promise.all(nearbyDetailsPromises)).filter(
    (s): s is ItemSekolahModel => s !== null,
  );

  return {
    school: schoolDetails,
    nearbySchools,
  };
};

export const getSchoolId = async (
  id: string,
): Promise<ItemSekolahModel | null> => {
  try {
    const response = await authAxios.get<APIResponse<ItemSekolahModel>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/${id}`,
    );

    return response.data.data || null;
  } catch (error) {
    console.error("Error fetching school suggestions:", error);
    throw error;
  }
};

/**
 * Cached per-peringkat so a prefetch on hover is reused by the map page mount
 * instead of triggering a second request.
 */
const schoolTypesCache = new Map<string, string[]>();
const schoolTypesPromises = new Map<string, Promise<string[]>>();

export const getSchoolTypes = async (peringkat?: string): Promise<string[]> => {
  const cacheKey = peringkat && peringkat !== "ALL" ? peringkat : "ALL";

  const cached = schoolTypesCache.get(cacheKey);
  if (cached) return cached;

  const inFlight = schoolTypesPromises.get(cacheKey);
  if (inFlight) return inFlight;

  const promise = fetchSchoolTypes(peringkat);
  schoolTypesPromises.set(cacheKey, promise);

  try {
    const data = await promise;
    schoolTypesCache.set(cacheKey, data);
    return data;
  } catch (error) {
    schoolTypesPromises.delete(cacheKey);
    throw error;
  }
};

const fetchSchoolTypes = async (peringkat?: string): Promise<string[]> => {
  try {
    const params: Record<string, string> = {};
    if (peringkat && peringkat !== "ALL") {
      params.peringkat = peringkat;
    }

    const response = await authAxios.get<APIResponse<string[]>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/filter/school-type`,
      { params },
    );
    const data = response.data.data || [];
    return data.filter((item) => item !== "TIADA MAKLUMAT");
  } catch (error) {
    console.error("Error fetching school types:", error);
    throw error;
  }
};

export const getSchoolPeringkat = async (): Promise<string[]> => {
  try {
    const response = await authAxios.get<APIResponse<string[]>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/filter/peringkat`,
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching school peringkat:", error);
    throw error;
  }
};
