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

export const getSchoolSuggestion = async (
  params?: schoolSearchModel,
  pageNumber: number = 1,
): Promise<ItemSekolahModel[]> => {
  try {
    const response = await authAxios.get<APIResponse<ListSekolahModel>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/search?page=${pageNumber}&pageSize=12`,
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
    return filteredData;
  } catch (error) {
    console.error("Error fetching school suggestions:", error);
    throw error;
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
  zoom?: number,
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
        zoom,
        name,
      });
      return nearbySchools?.markerGroups || [];
    } else {
      const nearbySchools = await getSchoolNearby({
        latitude: latitudeFixed,
        longitude: longitudeFixed,
        radiusInMeter,
        zoom,
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

export const getSchoolTypes = async (): Promise<string[]> => {
  try {
    const response = await authAxios.get<APIResponse<string[]>>(
      `${BASE_URL}${SCHOOL_ENDPOINT}/filter/school-type`,
    );
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching school types:", error);
    throw error;
  }
};
