import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useMemo, useState } from "react";
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

function MapEvents({ onZoomChange, onCenterChange }: { onZoomChange: (zoom: number) => void; onCenterChange: (center: { lat: number; lng: number }) => void }) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
    moveend: (e) => {
      const center = e.target.getCenter();
      onCenterChange({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
}

function MapControls({ query, setQuery, setFilteredMarkers, markersToShow, setSelected }: {
  query: string;
  setQuery: (val: string) => void;
  setFilteredMarkers: (markers: SchoolMarker[]) => void;
  markersToShow: SchoolMarker[];
  setSelected: (marker: SchoolMarker | null) => void;
}) {
  const map = useMap();

  const panTo = (lat: number, lng: number) => {
    map.panTo([lat, lng]);
  };

  const setZoomLevel = (zoom: number) => {
    map.setZoom(zoom);
  };

  return (
    <MapSearchBar
      query={query}
      setQuery={setQuery}
      setFilteredMarkers={setFilteredMarkers}
      markersToShow={markersToShow}
      setSelected={setSelected}
      panTo={panTo}
      setZoom={setZoomLevel}
    />
  );
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

  console.log("User Location:", userLocation);// for future use
  console.log("Map Zoom Level:", zoom);// for future use

  return (
    <div className="relative" style={{ height: "750px", width: "100%" }}>
      <div className="absolute top-4 right-4 z-[1000]">
        {/* Temporary button */}
        <Button
          variant="default-outline"
          onClick={() => setShowLocationPicker(true)}
        >
          Pilih Lokasi
        </Button>
      </div>
      <MapContainer
        center={initialPosition}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents
          onZoomChange={setZoom}
          onCenterChange={setUserLocation}
        />
        <MapControls
          query={query}
          setQuery={setQuery}
          setFilteredMarkers={setFilteredMarkers}
          markersToShow={markersToShow}
          setSelected={setSelected}
        />
        {filteredMarkers.map((pos, index) => (
          <Marker
            key={index}
            position={[pos.lat, pos.lng]}
            icon={schoolIcon}
            eventHandlers={{
              click: () => setSelected(pos),
            }}
          />
        ))}

        {selected && (
          <Popup
            position={[selected.lat, selected.lng]}
            eventHandlers={{
              remove: () => {
                setSelected(null);
                setFilteredMarkers(markersToShow);
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
