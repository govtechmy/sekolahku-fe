import type { schoolSearchModel, School, SchoolDetailResponse } from '../models/response'
import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const SCHOOL_ENDPOINT = '/schools'

export const getSchoolSuggestion = async (params?: schoolSearchModel): Promise<School[]> => {
  try {
    const response = await authAxios.get<SchoolDetailResponse>(`${BASE_URL}${SCHOOL_ENDPOINT}/search`, {
      params,
      paramsSerializer: { indexes: null },
    })
    const filteredData = response.data.data.filter(school => 
      school.data.infoLokasi.koordinatYY !== undefined && 
      school.data.infoLokasi.koordinatXX !== undefined
    )
    return filteredData
  } catch (error) {
    console.error('Error fetching school suggestions:', error)
    throw error
  }
}