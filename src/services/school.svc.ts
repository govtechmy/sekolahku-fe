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
 * Fetch ALL school points in one call (lightweight coords + fields) to feed
 * client-side MapLibre clustering. ~10k schools, ~1MB gzipped.
 * Cached at module level so repeated mounts (incl. React StrictMode double
 * invoke in dev) reuse a single in-flight request / result.
 */
let allSchoolPointsCache: SchoolPoint[] | null = null;
let allSchoolPointsPromise: Promise<SchoolPoint[]> | null = null;

export const getAllSchoolMarkers = async (): Promise<SchoolPoint[]> => {
  if (allSchoolPointsCache) return allSchoolPointsCache;
  if (allSchoolPointsPromise) return allSchoolPointsPromise;

  allSchoolPointsPromise = (async () => {
    const response = await authAxios.get<APIResponse<ListSekolahModel>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/search?page=1&pageSize=20000`,
    );
    const items = response.data.data?.items || [];
    const points = items
      .filter((s) => {
        const c = s.data?.infoLokasi?.location?.coordinates;
        return Array.isArray(c) && c[0] != null && c[1] != null;
      })
      .map((s) => {
        const [lng, lat] = s.data.infoLokasi.location.coordinates;
        return {
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
        };
      });
    allSchoolPointsCache = points;
    return points;
  })();

  try {
    return await allSchoolPointsPromise;
  } catch (err) {
    // Allow a retry on next call if this attempt failed.
    allSchoolPointsPromise = null;
    throw err;
  }
};

export const getSchoolNearby = async (
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

export const getSchoolTypes = async (peringkat?: string): Promise<string[]> => {
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
