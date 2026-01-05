import { authAxios } from "./http";

//pageSize hardcoded until required to change
export const getAllAcara = async (pageNumber: number) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
