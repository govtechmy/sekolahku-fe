import type { schoolSearchModel, ListSekolahModel, APIResponse, ItemSekolahModel } from '../models/response'
import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const SCHOOL_ENDPOINT = '/schools'

export const getSchoolSuggestion = async (params?: schoolSearchModel): Promise<ItemSekolahModel[]> => {
  try {
    const response = await authAxios.get<APIResponse<ListSekolahModel>>(`${BASE_URL}${SCHOOL_ENDPOINT}/search`, {
      params,
      paramsSerializer: { indexes: null },
    })

    const list = response.data.data?.items || []
    const filteredData = list.filter(school => school.data.infoLokasi.koordinatYY != null && school.data.infoLokasi.koordinatXX != null)
    return filteredData
  } catch (error) {
    console.error('Error fetching school suggestions:', error)
    throw error
  }
}
