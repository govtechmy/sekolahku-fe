import type { APIResponse, SiaranList, SiaranItem } from "../models/response";
import { authAxios } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SIARAN_ENDPOINT = "/siaran";

export interface GetSiaranListParams {
  pageNumber?: number;
  pageSize?: number;
  query?: string;
  category?: string;
}

export const getSiaranList = async (
  params: GetSiaranListParams = {},
): Promise<SiaranList> => {
  try {
    const response = await authAxios.get<APIResponse<SiaranList>>(
      `${BASE_URL}${SIARAN_ENDPOINT}`,
      {
        params: {
          page: params.pageNumber ?? 1,
          pageSize: params.pageSize ?? 12,
          query: params.query ?? undefined,
          category: params.category ?? undefined,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching siaran list:", error);
    throw error;
  }
};

export const getSearchSiaran = async (
  pageNumber: number,
  search: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    let url = `${BASE_URL}${SIARAN_ENDPOINT}?page=${pageNumber}&pageSize=12`;
    if (search) {
      url += `&search=${encodeURI(search)}`;
    }
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    const response = await authAxios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error searching siaran", error);
    throw error;
  }
};

export const getSiaranById = async (id: string): Promise<SiaranItem> => {
  try {
    const response = await authAxios.get<APIResponse<SiaranItem>>(
      `${BASE_URL}${SIARAN_ENDPOINT}/${id}`,
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching siaran detail:", error);
    throw error;
  }
};
