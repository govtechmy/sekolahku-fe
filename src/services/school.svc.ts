import type { schoolSearchModel, ListSekolahModel, APIResponse, ItemSekolahModel, NearbySchoolsModel, NearbySchoolsParams, MarkerGroup } from '../models/response'
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

export const getSchoolS3Json = async (dataUrl?: string, negeri?: string, parlimen?: string, kodSekolah?: string): Promise<ItemSekolahModel> => {
  try {
    if (!dataUrl) {
      if (negeri && parlimen && kodSekolah) {
        dataUrl = `https://sekolahku-data.govtechmy.xyz/${negeri}/${parlimen}/${kodSekolah}/${kodSekolah}.json`
      } else {
        throw new Error('Insufficient parameters to construct S3 URL')
      }
    }
    const response = await authAxios.get<ItemSekolahModel>(dataUrl)
    return response.data
    
  } catch (error) {
    console.error('Error fetching school JSON:', error)
    throw error
  }
}

export const fetchNearbySchools = async (
    latitude: number,
    longitude: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number,
  ): Promise<MarkerGroup[]> => {
    
    if (initialLocationSet === false) {
      return [];
    }
    const latitudeFixed = parseFloat(latitude.toFixed(4));
    const longitudeFixed = parseFloat(longitude.toFixed(4));
    try {
      const nearbySchools = await getSchoolNearby({
        latitude: latitudeFixed,
        longitude: longitudeFixed,
        radiusInMeter,
        zoom,
      });

      return nearbySchools?.markerGroups || [];
    } catch (error) {
      console.error("Failed to fetch nearby schools:", error);
      return [];
    }
};