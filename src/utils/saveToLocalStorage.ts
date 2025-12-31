export const saveToLocalStorage = (
  markersMap: Map<string, { lat: number; lng: number; dataUrl: string }>,
) => {
  try {
    const dataToStore = JSON.stringify([...markersMap]);
    localStorage.setItem("schoolMarkerData", dataToStore);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};
