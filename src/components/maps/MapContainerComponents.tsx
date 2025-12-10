import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState, useCallback, useMemo } from "react";
import L from "leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { findNearbyGroup, findNearbyGroupAppend } from "../../contentData";
import type { MarkerType } from "../../types/maps";

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
  setInitialPosition: React.Dispatch<React.SetStateAction<[number, number]>>;}

export function MapContainerComponent({
  initialPosition = [3.760115447396889, 108.46252441406251],
  initialZoom = 6,
  setInitialPosition
}: MapContainerProps) {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [schoolMarkers, setSchoolMarkers] = useState<Map<string, { lat: number; lng: number }>>(new Map());
  const [dragStartPos, setDragStartPos] = useState<{ lat: number; lng: number } | null>(null);
  
  // Helper function to calculate distance between two coordinates in meters (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }, []);
  
  const extractSchoolData = useCallback((markers: typeof findNearbyGroup.markerGroups) => {
    const schoolMap = new Map<string, { lat: number; lng: number }>();
    markers.forEach(marker => {
      if (marker.markerType === "GROUP" && marker.items) {
        marker.items.forEach(item => {
          const key = `${item.kodSekolah}`;
          schoolMap.set(key, {
            lat: item.infoLokasi.koordinatXX,
            lng: item.infoLokasi.koordinatYY
          });
        });
      } else if (marker.kodSekolah) {
        const key = `${marker.kodSekolah}`;
        schoolMap.set(key, {
          lat: marker.infoLokasi.koordinatXX,
          lng: marker.infoLokasi.koordinatYY
        });
      }
    });
    return schoolMap;
  }, []);

  const initialSchoolData = useMemo(() => {
    return extractSchoolData(findNearbyGroup.markerGroups);
  }, [extractSchoolData]);

  useEffect(() => {
    const storedData = localStorage.getItem('schoolMarkerData');
    if (storedData) {
      try {
        const parsedData = new Map<string, { lat: number; lng: number }>(JSON.parse(storedData));
        setSchoolMarkers(parsedData);
      } catch (error) {
        console.error('Failed to parse localStorage data:', error);
        initializeLocalStorage();
      }
    } else {
      initializeLocalStorage();
    }
    
    function initializeLocalStorage() {
      localStorage.setItem('schoolMarkerData', JSON.stringify([...initialSchoolData]));
      setSchoolMarkers(initialSchoolData);
    }
  }, [initialSchoolData]);

  const appendNewMarkers = useCallback(() => {

    setSchoolMarkers(prevMap => {
      const newMap = new Map(prevMap);
      let addedCount = 0;

      findNearbyGroupAppend.markerGroups.forEach(marker => {
        if (marker.markerType === "GROUP" && marker.items) {
          marker.items.forEach(item => {
            const key = `${item.kodSekolah}`;
            if (!newMap.has(key)) {
              newMap.set(key, {
                lat: item.infoLokasi.koordinatXX,
                lng: item.infoLokasi.koordinatYY
              });
              addedCount++;
            }
          });
        } else if (marker.kodSekolah) {
          const key = `${marker.kodSekolah}`;
          if (!newMap.has(key)) {
            newMap.set(key, {
              lat: marker.infoLokasi.koordinatXX,
              lng: marker.infoLokasi.koordinatYY
            });
            addedCount++;
          }
        }
      });

      if (addedCount > 0) {
        localStorage.setItem('schoolMarkerData', JSON.stringify([...newMap]));
        return newMap;
      } 
      
      return prevMap;
    });
  }, []); 

  return (
    <>
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
          onCenterChange={() => {}}
          onDragStart={() => {
            if (mapRef) {
              const center = mapRef.getCenter();
              setDragStartPos({ lat: center.lat, lng: center.lng });
            }
            appendNewMarkers();
          }}
          onDragEnd={(newCenter) => {
            if (dragStartPos) {
              const distance = calculateDistance(
                initialPosition[0],
                initialPosition[1],
                newCenter.lat,
                newCenter.lng
              );
              
              if (distance > 500) {
                console.log("hit more than 500m")
                setInitialPosition([newCenter.lat, newCenter.lng]);
              }
            }
            setDragStartPos(null);
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
                setInitialPosition([coords.lat,coords.lng]);
              }
            }}
          />
        ))}
      </LeafletMapContainer>
    </>
  );
}
