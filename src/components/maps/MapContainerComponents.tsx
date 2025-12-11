import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
  useMap,
  Circle,
} from "react-leaflet";
import { useEffect, useCallback, useMemo } from "react";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { calculateDistance } from "../../utils/calculateDistance";
import type { MarkerType } from "../../types/maps";
import type { ItemSekolahModel, MarkerGroup } from "../../models/response";

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

// Component to handle map view changes declaratively
function MapViewController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
}

interface MapContainerProps {
  initialPosition?: [number, number];
  initialZoom?: number;
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenter: React.Dispatch<React.SetStateAction<[number, number]>>;
  setMapZoom: React.Dispatch<React.SetStateAction<number>>;
  setInitialPosition: React.Dispatch<React.SetStateAction<[number, number]>>;
  schoolMarkers: Map<string, { lat: number; lng: number; dataUrl: string }>;
  setSchoolMarkers: React.Dispatch<
    React.SetStateAction<Map<string, { lat: number; lng: number; dataUrl: string }>>
  >;
  dragStartPos: { lat: number; lng: number } | null;
  setDragStartPos: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  fetchNearbySchools: (latitude: number, longitude: number, radiusInMeter?: number) => Promise<MarkerGroup[]>;
  setViewSchool: React.Dispatch<React.SetStateAction<ItemSekolahModel | null>>;
}

export function MapContainerComponent({
  initialPosition = [3.760115447396889, 108.46252441406251],
  initialZoom = 6,
  mapCenter,
  mapZoom,
  setMapCenter,
  setMapZoom,
  setInitialPosition,
  schoolMarkers,
  setSchoolMarkers,
  dragStartPos,
  setDragStartPos,
  fetchNearbySchools,
  setViewSchool,
}: MapContainerProps) {
  useEffect(() => {
    localStorage.removeItem("schoolMarkerData");
  }, []);

  // Memoize localStorage data - will return null after cache is cleared
  const cachedSchoolData = useMemo(() => {
    const storedData = localStorage.getItem("schoolMarkerData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        return new Map<string, { lat: number; lng: number; dataUrl: string }>(parsed);
      } catch (error) {
        console.error("Failed to parse localStorage data:", error);
        return null;
      }
    }
    return null;
  }, []); 

  const extractSchoolData = useCallback(
    (markers: MarkerGroup[]) => {
      const schoolMap = new Map<string, { lat: number; lng: number; dataUrl: string }>();
      markers.forEach((marker) => {
        if (marker.items) {
          marker.items.forEach((item) => {
            const key = `${item.kodSekolah}`;
            schoolMap.set(key, {
              lat: item.infoLokasi.koordinatYY,
              lng: item.infoLokasi.koordinatXX,
              dataUrl: item.dataUrl,
            });
          });
        }
      });
      return schoolMap;
    },
    []
  );

  const saveToLocalStorage = useCallback((markersMap: Map<string, { lat: number; lng: number; dataUrl: string }>) => {
    try {
      const dataToStore = JSON.stringify([...markersMap]);
      localStorage.setItem("schoolMarkerData", dataToStore);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Use memoized cached data
    if (cachedSchoolData && cachedSchoolData.size > 0) {
      setSchoolMarkers(cachedSchoolData);
    } else {
      console.log("No cache found, loading initial schools");
      loadInitialSchools();
    }

    async function loadInitialSchools() {
      try {
        const markersArray = await fetchNearbySchools(
          initialPosition[0],
          initialPosition[1],
          10000
        );
        
        const schoolData = extractSchoolData(markersArray);
        
        // Save to localStorage using memoized function
        saveToLocalStorage(schoolData);
        setSchoolMarkers(schoolData);
      } catch (error) {
        console.error("Failed to load initial schools:", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedSchoolData, fetchNearbySchools, extractSchoolData, saveToLocalStorage]);

  const appendNewMarkers = useCallback(
    async (center: { lat: number; lng: number }) => {
      try {
        const markersArray = await fetchNearbySchools(
          center.lat,
          center.lng,
          10000
        );


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
                    dataUrl: item.dataUrl,
                  });
                  addedCount++;
                }
              });
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
    [setSchoolMarkers, saveToLocalStorage, fetchNearbySchools]
  );


  return (
    <LeafletMapContainer
      center={initialPosition}
      zoom={initialZoom}
      className="h-full w-full"
      zoomControl={false}
    >
      <MapViewController center={mapCenter} zoom={mapZoom} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents
        onZoomChange={(zoom) => {
          setMapZoom(zoom);
        }}
        onCenterChange={(center) => {
          // Update the current center for circle visualization
          setInitialPosition([center.lat, center.lng]);
          setMapCenter([center.lat, center.lng]);
        }}
        onDragStart={() => {
          setDragStartPos({ lat: mapCenter[0], lng: mapCenter[1] });
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
            setViewSchool(null); // Reset before setting new school
            fetch(coords.dataUrl)
              .then((res) => res.json())
              .then((data: ItemSekolahModel) => {
                setViewSchool(data);
              })
              .catch((error) => {
                console.error("Failed to fetch school data:", error);
              });
            setMapCenter([coords.lat, coords.lng]);
            setMapZoom(18);
            setInitialPosition([coords.lat, coords.lng]);
          }}
        />
      ))}
    </LeafletMapContainer>
  );
}
