import { MapContainer as LeafletMapContainer, TileLayer, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

function MapEvents({
  onZoomChange,
  onCenterChange,
  onDragStart,
}: {
  onZoomChange: (zoom: number) => void;
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onDragStart?: () => void;
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
}

export function MapContainerComponent({
  initialPosition = [3.760115447396889, 108.46252441406251],
  initialZoom = 6,
}: MapContainerProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: initialPosition[0],
    lng: initialPosition[1],
  });
  const [zoom, setZoom] = useState(initialZoom);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  // Log for debugging purposes
  console.log("User Location:", userLocation);
  console.log("Map Zoom Level:", zoom);

  // When initialPosition or initialZoom changes from parent, update map view
  useEffect(() => {
    if (mapRef) {
      mapRef.setView(L.latLng(initialPosition[0], initialPosition[1]), initialZoom);
    }
  }, [mapRef, initialPosition, initialZoom]);

  return (
    <>
      <LeafletMapContainer
        center={initialPosition}
        zoom={initialZoom}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Bridge component to capture the Leaflet map instance */}
        {mapRef === null && <MapInstanceBridge onMapReady={setMapRef} />}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents
          onZoomChange={setZoom}
          onCenterChange={setUserLocation}
          onDragStart={() => {
            // no-op when dragging; selection handled in search component
          }}
        />
        {/* Map markers intentionally removed; search-only UI */}
      </LeafletMapContainer>
    </>
  );
}
