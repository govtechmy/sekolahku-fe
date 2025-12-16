import { useCallback } from "react";
import type { MarkerGroup } from "../models/response";

type MarkerMap = Map<string, { lat: number; lng: number; dataUrl: string }>;

interface UseAppendNewMarkersParams {
  fetchNearbySchools: (
    latitude: number,
    longitude: number,
    radiusInMeter: number
  ) => Promise<MarkerGroup[]>;
  setSchoolMarkers: React.Dispatch<React.SetStateAction<MarkerMap>>;
  saveToLocalStorage: (markersMap: MarkerMap) => void;
  radius: number;
}

export function useAppendNewMarkers({
  fetchNearbySchools,
  setSchoolMarkers,
  saveToLocalStorage,
  radius,
}: UseAppendNewMarkersParams) {
  const append = useCallback(
    async (center: { lat: number; lng: number }) => {
      try {
        const markersArray = await fetchNearbySchools(
          center.lat,
          center.lng,
          radius
        );

        setSchoolMarkers((prevMap) => {
          const newMap = new Map(prevMap);
          let addedCount = 0;

          markersArray.forEach((marker) => {
            if (marker.markerType === "GROUP" && marker.items) {
              marker.items.forEach((item) => {
                const key = `${item.kodSekolah}`;
                if (!newMap.has(key)) {
                  newMap.set(key, {
                    lat: item.infoLokasi.koordinatYY,
                    lng: item.infoLokasi.koordinatXX,
                    dataUrl: item.dataUrl,
                  });
                  addedCount++;
                }
              });
            }

            if (marker.markerType === "INDIVIDUAL") {
              const key = `${marker.kodSekolah}`;
              if (!newMap.has(key)) {
                newMap.set(key, {
                  lat: marker.infoLokasi.koordinatYY,
                  lng: marker.infoLokasi.koordinatXX,
                  dataUrl: marker.dataUrl,
                });
                addedCount++;
              }
            }

            if (marker.markerType === "PARLIMEN") {
              const key = `${marker.negeri}-${marker.parlimen}`;
              if (!newMap.has(key)) {
                newMap.set(key, {
                  lat: marker.infoLokasi.koordinatYY,
                  lng: marker.infoLokasi.koordinatXX,
                  dataUrl: marker.total?.toString() ?? "",
                });
                addedCount++;
              }
            }

            if (marker.markerType === "NEGERI") {
              const key = `${marker.negeri}`;
              if (!newMap.has(key)) {
                newMap.set(key, {
                  lat: marker.infoLokasi.koordinatYY,
                  lng: marker.infoLokasi.koordinatXX,
                  dataUrl: marker.total?.toString() ?? "",
                });
                addedCount++;
              }
            }
          });

          if (addedCount > 0) {
            saveToLocalStorage(newMap);
            return newMap;
          }

          return prevMap;
        });
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [fetchNearbySchools, setSchoolMarkers, saveToLocalStorage, radius]
  );

  return append;
}
