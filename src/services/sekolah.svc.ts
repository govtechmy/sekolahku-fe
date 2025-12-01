// Calculate distance between two points using Haversine formula

interface SchoolData {
  kodSekolah: string
  location: [number, number] // [lng, lat]
}

export async function fetchSchools() {
  try {
    // Fetch local data.json file
    const response = await fetch('/data.json')
    if (!response.ok) {
      throw new Error(`Failed to load data.json: ${response.status}`)
    }

    const schoolsData: SchoolData[] = await response.json()

    // Validate that we got an array
    if (!Array.isArray(schoolsData)) {
      throw new Error('data.json does not contain an array')
    }

    console.log(schoolsData.length + ' schools loaded from local data.json')

    return schoolsData
  } catch (error) {
    console.error('Error fetching schools from local data:', error)

    // Return empty array as fallback
    return []
  }
}
