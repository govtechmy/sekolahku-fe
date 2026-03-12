import { unauthAxios } from "./http";

interface TinybirdResponse {
  data: { total_visitors: number }[];
}

const OVERALL_URL = import.meta.env.VITE_GET_SEKOLAHKU_PUBLIC_VISITOR_OVERALL;
const DAILY_URL = import.meta.env.VITE_GET_SEKOLAHKU_PUBLIC_VISITOR_DAILY;

export const getVisitorOverall = async (): Promise<number> => {
  const response = await unauthAxios.get<TinybirdResponse>(OVERALL_URL);
  return response.data.data[0]?.total_visitors ?? 0;
};

export const getVisitorDaily = async (): Promise<number> => {
  const response = await unauthAxios.get<TinybirdResponse>(DAILY_URL);
  return response.data.data[0]?.total_visitors ?? 0;
};
