import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import { useEffect, useCallback, useMemo } from "react";
import L from "leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { getSchoolNearby } from "../../services/school.svc";
import { calculateDistance } from "../../utils/calculateDistance";
import type { MarkerType } from "../../types/maps";
import type { MarkerGroup } from "../../models/response";

function MapEvents({
  onZoomChange,
  onCenterChange,
  onDragStart,
  onDragEnd,
}: {
  onZoomChange: (zoom: number) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onDragStart?: () => void;
  onDragEnd?: (center: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
    moveend: (e) => {
      const center = e.target.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    },
    dragstart: () => {
      onDragStart?.();
    },
    dragend: (e) => {
      const center = e.target.getCenter();
      onDragEnd?.({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}

function MapInstanceBridge({
  onMapReady,
}: {
  onMapReady: (map: L.Map) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

interface MapContainerProps {
  initialPosition?: [number, number];
  initialZoom?: number;
  setInitialPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  mapRef: L.Map | null;
  setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>>;
  schoolMarkers: Map<string, { lat: number; lng: number }>;
  setSchoolMarkers: React.Dispatch<
    React.SetStateAction<Map<string, { lat: number; lng: number }>>
  >;
  dragStartPos: { lat: number; lng: number } | null;
  setDragStartPos: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
}

export function MapContainerComponent({
  initialPosition = [3.760115447396889, 108.46252441406251],
  initialZoom = 6,
  setInitialPosition,
  mapRef,
  setMapRef,
  schoolMarkers,
  setSchoolMarkers,
  dragStartPos,
  setDragStartPos,
}: MapContainerProps) {

  // Memoize localStorage data - only parse once
  const cachedSchoolData = useMemo(() => {
    const storedData = localStorage.getItem("schoolMarkerData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return new Map<string, { lat: number; lng: number }>(parsed);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        return null;
      }
    }
    return null;
  }, []); 

  const extractSchoolData = useCallback(
    (markers: MarkerGroup[]) => {
      const schoolMap = new Map<string, { lat: number; lng: number }>();
      markers.forEach((marker) => {
        if (marker.items) {
          marker.items.forEach((item) => {
            const key = `${item.kodSekolah}`;
            schoolMap.set(key, {
              lat: item.infoLokasi.koordinatYY,
              lng: item.infoLokasi.koordinatXX,
            });
          });
        }
      });
      return schoolMap;
    },
    []
  );

  const saveToLocalStorage = useCallback((markersMap: Map<string, { lat: number; lng: number }>) => {
    try {
      const dataToStore = JSON.stringify([...markersMap]);
      localStorage.setItem("schoolMarkerData", dataToStore);
      console.log("Saved", markersMap.size, "schools to localStorage");
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Use memoized cached data
    if (cachedSchoolData && cachedSchoolData.size > 0) {
      console.log("Loading", cachedSchoolData.size, "schools from memoized cache");
      setSchoolMarkers(cachedSchoolData);
    } else {
      console.log("No cache found, loading initial schools");
      loadInitialSchools();
    }

    async function loadInitialSchools() {
      try {
        const nearbySchools = await getSchoolNearby({
          latitude: initialPosition[0],
          longitude: initialPosition[1],
          radiusInMeter: 10000, 
        });

        const markersArray = nearbySchools?.markerGroups || [];
        
        const schoolData = extractSchoolData(markersArray);
        
        // Save to localStorage using memoized function
        saveToLocalStorage(schoolData);
        setSchoolMarkers(schoolData);
      } catch (error) {
        console.error("Failed to load initial schools:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedSchoolData]);

  const appendNewMarkers = useCallback(
    async (center: { lat: number; lng: number }) => {
      try {
        console.log("Fetching schools near:", center);
        const nearbySchools = await getSchoolNearby({
          latitude: center.lat,
          longitude: center.lng,
          radiusInMeter: 10000, // 10000m radius for nearby search
        });

        console.log("Received schools:", nearbySchools);
        const markersArray = nearbySchools?.markerGroups || [];

        setSchoolMarkers((prevMap) => {
          const newMap = new Map(prevMap);
          let addedCount = 0;

          markersArray.forEach((marker) => {
            if (marker.items) {
              marker.items.forEach((item) => {
                const key = `${item.kodSekolah}`;
                if (!newMap.has(key)) {
                  newMap.set(key, {
                    lat: item.infoLokasi.koordinatYY,
                    lng: item.infoLokasi.koordinatXX,
                  });
                  addedCount++;
                }
              });
            }
          });

          if (addedCount > 0) {
            console.log(`Added ${addedCount} new schools. Total: ${newMap.size}`);
            // Use memoized save function
            saveToLocalStorage(newMap);
            return newMap;
          }

          console.log("No new schools to add");
          return prevMap;
        });
      } catch (error) {
        console.error("Failed to fetch nearby schools:", error);
      }
    },
    [setSchoolMarkers, saveToLocalStorage]
  );

  console.log("Rendering map with", schoolMarkers.size, "school markers");

  return (
    <LeafletMapContainer
      center={initialPosition}
      zoom={initialZoom}
      className="h-full w-full"
      zoomControl={false}
    >
      {mapRef === null && <MapInstanceBridge onMapReady={setMapRef} />}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents
        onZoomChange={() => {}}
        onCenterChange={(center) => {
          // Update the current center for circle visualization
          setInitialPosition([center.lat, center.lng]);
        }}
        onDragStart={() => {
          if (mapRef) {
            const center = mapRef.getCenter();
            setDragStartPos({ lat: center.lat, lng: center.lng });
          }
        }}
        onDragEnd={(newCenter) => {
          if (dragStartPos) {
            const distance = calculateDistance(
              dragStartPos.lat,
              dragStartPos.lng,
              newCenter.lat,
              newCenter.lng
            );

            if (distance > 1000) {
              console.log("hit more than 1000m, fetching new markers");
              appendNewMarkers({ lat: newCenter.lat, lng: newCenter.lng });
              setInitialPosition([newCenter.lat, newCenter.lng]);
            }
          }
          setDragStartPos(null);
        }}
      />
      <Circle
        center={initialPosition}
        radius={10000}
        pathOptions={{
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          weight: 2,
        }}
      />
      {Array.from(schoolMarkers.entries()).map(([kodSekolah, coords]) => (
        <SchoolMapMarker
          key={kodSekolah}
          school={{
            markerType: "INDIVIDUAL" as MarkerType,
            radiusInMeter: 0,
            koordinatXX: coords.lat,
            koordinatYY: coords.lng,
            id: kodSekolah,
          }}
          onClick={() => {
            console.log("Clicked on school:", kodSekolah);
            if (mapRef) {
              mapRef.setView([coords.lat, coords.lng], 18);
              setInitialPosition([coords.lat, coords.lng]);
            }
          }}
        />
      ))}
    </LeafletMapContainer>
  );
}
