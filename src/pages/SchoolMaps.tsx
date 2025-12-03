import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@govtechmy/myds-react/button";
import { schoolMarkers } from "../components/schoolMarkers"; //temp data
import { MapSearchBar, SchoolInfoWindow, LocationPickerWindow } from "../components/maps";
import type { SchoolMarker } from "../types/maps";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom school icon
const schoolIcon = new L.Icon({
  iconUrl: "/images/iconSchool.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapEvents({ onZoomChange, onCenterChange, onDragStart }: { 
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

// Note: MapSearchBar will be rendered in a top-level sidebar div

function MapInstanceBridge({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);
  return null;
}

export default function SchoolMaps() {
  const initialPosition: [number, number] = [4.1969, 101.2561];
  const markersToShow = useMemo(() => schoolMarkers, []);
  const [selected, setSelected] = useState<SchoolMarker | null>(null);
  const [query, setQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState<SchoolMarker[]>(markersToShow);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({ lat: initialPosition[0], lng: initialPosition[1] });
  const [zoom, setZoom] = useState(7);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [selectionSource, setSelectionSource] = useState<"marker" | "search" | null>(null);

  console.log("User Location:", userLocation);// for future use
  console.log("Map Zoom Level:", zoom);// for future use

  return (
    <div className="h-screen w-full flex relative">
      <div className="absolute top-4 right-4 z-[1000]">
        {/* Temporary button */}
        <Button
          variant="default-outline"
          onClick={() => setShowLocationPicker(true)}
        >
          Pilih Lokasi
        </Button>
      </div>
      {/* Leaflet sidebar placeholder: MapSearchBar rendered here */}
      <div id="leaflet-sidebar" className="absolute top-4 left-4 z-[1000] w-[360px] max-w-[90vw] h-full">
        <MapSearchBar
          query={query}
          setQuery={setQuery}
          setFilteredMarkers={setFilteredMarkers}
          markersToShow={filteredMarkers}
          setSelected={(s) => {
            setSelected(s);
            setSelectionSource("search");
          }}
          panTo={(lat: number, lng: number) => mapRef?.panTo([lat, lng])}
          setZoom={(z: number) => mapRef?.setZoom(z)}
        />
      </div>
      <MapContainer
        center={initialPosition}
        zoom={7}
        className="h-full w-full "
        zoomControl={false}
      >
        {/* Bridge component to capture the Leaflet map instance */}
        {mapRef === null && (
          <MapInstanceBridge onMapReady={setMapRef} />
        )}
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
              setSelectionSource(null);
            }
          }}
        />
        {filteredMarkers.map((pos, index) => (
          <Marker
            key={index}
            position={[pos.lat, pos.lng]}
            icon={schoolIcon}
            eventHandlers={{
              click: () => {
                if (selected?.kodSekolah === pos.kodSekolah) {
                  return;
                }
                if (selected) {
                  setIsPopupClosing(true);
                  setSelected(null);
                  setSelectionSource(null);
                    setSelected(pos);
                    setSelectionSource("marker");
                    setIsPopupClosing(false);
                } else {
                  setSelected(pos);
                  setSelectionSource("marker");
                }
              },
            }}
          />
        ))}

        {selected && !isPopupClosing && (
          <Popup
            position={[selected.lat, selected.lng]}
            eventHandlers={{
              popupclose: () => {
                // Only clear selected if we're not in the process of switching markers
                if (!isPopupClosing) {
                  setSelected(null);
                  setSelectionSource(null);
                  console.log("Popup explicitly closed, marker cleared.");
                }
              },
            }}
          >
            <SchoolInfoWindow school={selected} />
          </Popup>
        )}
      </MapContainer>
      {showLocationPicker && (
        <LocationPickerWindow 
          onClose={() => setShowLocationPicker(false)}
        />
      )}
    </div>
  );
}
