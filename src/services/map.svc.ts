import { authAxios } from "./http";

export const getMapParlimenCenteroid = async (negeri: string) => {
  const BASE_URL = import.meta.env.VITE_DATA_BASE_URL;
  try {
    const response = await authAxios.get(
      `${BASE_URL}/centroid/MAP/${negeri}.json`,
    );
    return response.data.districts;
  } catch (error) {
    console.error("Error fetching list of parlimen centeroid", error);
    throw error;
  }
};
