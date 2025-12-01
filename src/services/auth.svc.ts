import { authAxios } from './http'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const AUTH_ENDPOINT = '/auth'

//sample use
export const userAuthTest = async (publicuser: string) => {
  try {
    const response = await authAxios.put(`${BASE_URL}${AUTH_ENDPOINT}/`, publicuser)
    return response.data.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}