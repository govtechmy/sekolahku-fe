import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL
const PATH = `/file/download`

export const getPresignedUrl = async (url: string) => {
  try {
    const response = await axios.post(`${BASE_URL}${PATH}`, { url })
    return response.data.data.url as string
  } catch (error) {
    console.error('Error fetching presigned URL:', error)
    return url
  }
}

export const generateDownloadLink = async (fileName: string, url: string) => {
  if (!url) {
    console.error('No URL provided for download.')
    return
  }

  const presignedUrl = await getPresignedUrl(url)
  const link = document.createElement('a')
  link.href = presignedUrl
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
