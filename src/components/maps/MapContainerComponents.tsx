import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
  Circle,
} from "react-leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { calculateDistance } from "../../utils/calculateDistance";
import type { MarkerType } from "../../types/maps";
import { useMapViewStore } from "../../store/mapView";
import type { ItemSekolahModel, MarkerGroup } from "../../models/response";
import { getSchoolS3Json } from "../../services/school.svc";
import { useAppendNewMarkers } from "../../hooks/useAppendNewMarkers";
import { MapViewController } from "./MapViewController";

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

interface MapContainerProps {
  schoolMarkers: Map<string, { lat: number; lng: number; dataUrl: string }>;
  setSchoolMarkers: React.Dispatch<
    React.SetStateAction<
      Map<string, { lat: number; lng: number; dataUrl: string }>
    >
  >;
  dragStartPos: { lat: number; lng: number } | null;
  setDragStartPos: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  fetchNearbySchools: (
    latitude: number,
    longitude: number,
    radiusInMeter: number
  ) => Promise<MarkerGroup[]>;
  setViewSchool: React.Dispatch<React.SetStateAction<ItemSekolahModel | null>>;
}

export function MapContainerComponent({
  schoolMarkers,
  setSchoolMarkers,
  dragStartPos,
  setDragStartPos,
  fetchNearbySchools,
  setViewSchool,
}: MapContainerProps) {
  const {
    center: mapCenter,
    setCenter: setMapCenter,
    setZoom,
    radius,
  } = useMapViewStore();
  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    setSchoolMarkers,
    radius,
  });

  return (
    <LeafletMapContainer
      center={[3.760115447396889, 108.46252441406251]}
      zoom={6}
      className="h-full w-full"
      zoomControl={false}
    >
      <MapViewController />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents
        onZoomChange={(zoom) => {
          setZoom(zoom);
        }}
        onCenterChange={(center) => {
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
            }
          }
          setDragStartPos(null);
        }}
      />
      <Circle
        center={mapCenter}
        radius={radius}
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
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
          onClick={async () => {
            setViewSchool(null); // Reset before setting new school
            setViewSchool(await getSchoolS3Json(coords.dataUrl));
            setMapCenter([coords.lat, coords.lng]);
            setZoom(18);
          }}
        />
      ))}
    </LeafletMapContainer>
  );
}
