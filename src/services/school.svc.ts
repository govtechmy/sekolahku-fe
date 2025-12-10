import type { schoolSearchModel, ListSekolahModel, APIResponse, ItemSekolahModel, NearbySchoolsModel, NearbySchoolsParams } from '../models/response'
import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const SCHOOL_ENDPOINT = '/schools'

export const getSchoolId = async (id: string): Promise<ItemSekolahModel | null> => {
  try {
    const response = await authAxios.get<APIResponse<ItemSekolahModel>>(`${BASE_URL}${SCHOOL_ENDPOINT}/${id}`)

    return response.data.data || null
  } catch (error) {
    console.error('Error fetching school suggestions:', error)
    throw error
  }
}

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

export const getSchoolNearby = async (params?: NearbySchoolsParams): Promise<NearbySchoolsModel> => {
  try {
    const response = await authAxios.get<APIResponse<NearbySchoolsModel>>(`${BASE_URL}${SCHOOL_ENDPOINT}/find-nearby`, {
      params,
      paramsSerializer: { indexes: null },
    })
    return response.data.data
  } catch (error) {
    console.error('Error fetching nearby schools:', error)
    throw error
  }
}

