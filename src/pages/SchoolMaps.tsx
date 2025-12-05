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
  MapSearchBar,
  SchoolInfoWindow,
  LocationPickerWindow,
} from "../components/maps";
import type { SchoolMarker } from "../types/maps";

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

// Note: MapSearchBar will be rendered in a top-level sidebar div

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

function MapOverlayPopup({
  map,
  school,
  onClose,
}: {
  map: L.Map;
  school: SchoolMarker;
  onClose: () => void;
}) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const updatePosition = () => {
      const point = map.latLngToContainerPoint(
        L.latLng(school.lat, school.lng)
      );
      setPosition({ x: point.x, y: point.y });
    };

    updatePosition();
    map.on("move", updatePosition);
    map.on("zoom", updatePosition);
    return () => {
      map.off("move", updatePosition);
      map.off("zoom", updatePosition);
    };
  }, [map, school.lat, school.lng]);

  if (!position) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: -260,
        top: -480,
        transform: `translate(${position.x}px, ${position.y - 32}px)`,
        zIndex: 600,
        pointerEvents: "auto",
      }}
      className="leaflet-custom-popup"
    >
      <div className="rounded-lg shadow-lg bg-white border border-gray-200 min-w-[394px] max-w-[520px]">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
          <span className="font-medium">Maklumat Sekolah</span>
          <button
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-3">
          <SchoolInfoWindow school={school} />
        </div>
        <div
          className="absolute w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white left-1/2 -translate-x-1/2"
          style={{ bottom: -8 }}
        />
      </div>
    </div>
  );
}

export default function SchoolMaps() {
  const initialPosition: [number, number] = [4.1969, 101.2561];
  const schoolMarkers: SchoolMarker[] = [];
  const [selected, setSelected] = useState<SchoolMarker | null>(null);
  const [query, setQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] =
    useState<SchoolMarker[]>(schoolMarkers);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>({ lat: initialPosition[0], lng: initialPosition[1] });
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
      <MapSearchBar
        query={query}
        setQuery={setQuery}
        setFilteredMarkers={setFilteredMarkers}
        markersToShow={filteredMarkers}
        setSelected={(s) => {
          setSelected(s);
        } }
        panTo={(lat: number, lng: number) => mapRef?.panTo([lat, lng])}
        setZoom={(z: number) => mapRef?.setZoom(z)} selected={null}      />
      <MapContainer
        center={initialPosition}
        zoom={7}
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
                setSelected(pos);
                if (mapRef) {
                  const pixelOffset = 240;
                  const metersPerPixel =
                    (156543.03392 * Math.cos((pos.lat * Math.PI) / 180)) /
                    Math.pow(2, 17);
                  const latOffset = (pixelOffset * metersPerPixel) / 111320; // 111320 meters per degree latitude
                  mapRef.setView([pos.lat + latOffset, pos.lng], 17, {
                    animate: true,
                    duration: 0.5,
                  });
                }
              },
            }}
          />
        ))}

        {selected && mapRef && (
          <MapOverlayPopup
            map={mapRef}
            school={selected}
            onClose={() => {
              setSelected(null);
            }}
          />
        )}
      </MapContainer>
      {showLocationPicker && (
        <LocationPickerWindow onClose={() => setShowLocationPicker(false)} />
      )}
    </div>
  );
}
