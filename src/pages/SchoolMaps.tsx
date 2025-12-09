import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@govtechmy/myds-react/button";
import {
  SearchBarMap,
  LocationPickerWindow,
} from "../components/maps";
import type { SearchBarMapProps } from "../types/maps";
import offset from "../utils/coordinateOffSet";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom school icon
const schoolIcon = new L.Icon({
  iconUrl: "/images/iconSchool.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

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

// Note: SearchBarMap will be rendered in a top-level sidebar div

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

export default function SchoolMaps() {
  const initialPosition: [number, number] = [3.760115447396889, 108.46252441406251];
  const [selected, setSelected] = useState<SearchBarMapProps | null>(null);
  const [query, setQuery] = useState("");
  // const [filteredMarker, setFilteredMarker] = useState<SearchBarMapProps[]>([]);
  const [filteredSearchResult, setFilteredSearchResult] = useState<SearchBarMapProps[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; } | null>({ lat: initialPosition[0], lng: initialPosition[1] });
  const [zoom, setZoom] = useState(7);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  console.log("User Location:", userLocation); // for future use
  console.log("Map Zoom Level:", zoom); // for future use

  return (
    <div className="h-full w-full flex relative">
      <div className="absolute top-4 right-4 z-[1000]">
        {/* Temporary button */}
        <Button
          variant="default-outline"
          onClick={() => setShowLocationPicker(true)}
        >
          Pilih Lokasi
        </Button>
      </div>
      <SearchBarMap
        query={query}
        setQuery={setQuery}
        setFilteredSearchResult={setFilteredSearchResult}
        markersToShow={filteredSearchResult}
        setSelected={(s) => {
          setSelected(s);
        } }
        panTo={(lat: number, lng: number) => mapRef?.panTo([lat, lng])}
        setZoom={(z: number) => mapRef?.setZoom(z)} 
        selected={selected}      
        />
      <MapContainer
        center={initialPosition}
        zoom={6}
        className="h-full w-full "
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
            if (selected) {
              setSelected(null);
            }
          }}
        />
        {filteredSearchResult.map((pos, index) => (
          <Marker
            key={index}
            position={[pos.lat, pos.lng]}
            icon={schoolIcon}
            eventHandlers={{
              click: () => {
                if (selected?.kodSekolah === pos.kodSekolah) {
                  return;
                }
                setSelected(pos);
                if (mapRef) {
                  mapRef.setView([pos.lat, pos.lng - offset], 17, {
                    animate: true,
                    duration: 0.5,
                  });
                }
              },
            }}
          />
        ))}

      </MapContainer>
      {showLocationPicker && (
        <LocationPickerWindow onClose={() => setShowLocationPicker(false)} />
      )}
    </div>
  );
}
