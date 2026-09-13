import type {
  APIResponse,
  SiaranList,
  SiaranItem,
  SiaranCategory,
} from "../models/response";
import { authAxios } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SIARAN_ENDPOINT = "/siaran";

export interface GetSiaranListParams {
  pageNumber?: number;
  pageSize?: number;
  // Backend reads `search`, `category`, `startDate`, `endDate` on /siaran.
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

// Single list endpoint that handles browse + search + category + date range.
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
          search: params.search || undefined,
          category: params.category || undefined,
          startDate: params.startDate || undefined,
          endDate: params.endDate || undefined,
        },
      },
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching siaran list:", error);
    throw error;
  }
};

export const getSiaranCategories = async (): Promise<SiaranCategory[]> => {
  try {
    const response = await authAxios.get<APIResponse<SiaranCategory[]>>(
      `${BASE_URL}${SIARAN_ENDPOINT}/categories`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching siaran categories:", error);
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
