import type { AnalyticsModel, APIResponse } from "../models/response";
import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const ANALYTICS_ENDPOINT = '/analitik'

export const getAnalytics = async (): Promise<AnalyticsModel> => {
  try {
    const response = await authAxios.get<APIResponse<AnalyticsModel>>(`${BASE_URL}${ANALYTICS_ENDPOINT}`)
    
    console.log('Analytics response data:', response.data)

    return response.data.data
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}