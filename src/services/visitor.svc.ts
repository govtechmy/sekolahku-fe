import type { APIResponse } from "../models/response";
import { authAxios } from "./http";

export interface VisitorCounts {
  daily: number;
  overall: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getVisitorCounts = async (): Promise<VisitorCounts> => {
  const response = await authAxios.get<APIResponse<VisitorCounts>>(
    `${BASE_URL}/pelawat`,
  );
  return response.data.data;
};
