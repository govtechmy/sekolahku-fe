import { authAxios } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//pageSize hardcoded until required to change
export const getAllTakwim = async (pageNumber: number = 1) => {
  try {
    const response = await authAxios.get(
      `${BASE_URL}/takwim?page=${pageNumber}&pageSize=12`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all takwim", error);
    throw error;
  }
};

export const getSearchTakwim = async (
  pageNumber: number,
  search: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    let url = `${BASE_URL}/takwim?page=${pageNumber}&pageSize=12`;
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
    console.error("Error fetching all takwim", error);
    throw error;
  }
};

export const getTakwimById = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await authAxios.get(`${BASE_URL}/takwim/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching acara by id", error);
    throw error;
  }
};
