import { authAxios } from "./http";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

//pageSize hardcoded until required to change
export const getAllAcara = async (pageNumber: number = 1) => {
  try {
    const response = await authAxios.get(
      `${BASE_URL}/acara?page=${pageNumber}&pageSize=12`,
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all acara", error);
    throw error;
  }
};

export const getSearchAcara = async (
  pageNumber: number,
  search: string,
  startDate?: string,
  endDate?: string,
) => {
  try {
    let url = `${BASE_URL}/acara?page=${pageNumber}&pageSize=12`;
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
    console.error("Error fetching all acara", error);
    throw error;
  }
};

export const getAcaraById = async (id: string) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await authAxios.get(`${BASE_URL}/acara/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching acara by id", error);
    throw error;
  }
};
