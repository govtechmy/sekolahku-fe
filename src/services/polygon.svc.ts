const S3_BASE_URL = import.meta.env.S3_OBJECT_URL;

export const getStatePolygon = async (stateName: string) => {
  const state = stateName.toUpperCase().replace(/\s+/g, "_");

  try {
    const response = await fetch(`${S3_BASE_URL}/${state}.json`);
    if (!response.ok) {
      throw new Error("Failed to fetch state polygon");
    }
    console.log(`Fetched polygon for state: ${stateName}`);
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch state polygon");
  }
};

export const getStatePolygonLocal = async (state: string) => {
  const formatted = state.toLowerCase().replace(/\s+/g, "");
  const response = await fetch(`/polygon/state/${formatted}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch polygon for ${state}`);
  }

  return response.json();
};
