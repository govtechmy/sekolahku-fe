import type { schoolSearchModel, SchoolData } from '../models/response'
import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const SCHOOL_ENDPOINT = '/schools'

export const getSchoolSuggestion = async (params?: schoolSearchModel): Promise<SchoolData[]> => {
  try {
    const response = await authAxios.get<SchoolData[]>(`${BASE_URL}${SCHOOL_ENDPOINT}/search`, {
      params,
      paramsSerializer: { indexes: null },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching school suggestions:', error)
    throw error
  }
}