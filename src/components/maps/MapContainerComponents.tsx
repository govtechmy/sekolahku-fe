import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
  Circle,
} from "react-leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import type { Dispatch, SetStateAction } from "react";
import type { MarkerMap } from "../../utils/markerProcessors";
import { calculateDistance } from "../../utils/calculateDistance";
import type { Coordinates, MarkerType } from "../../types/maps";
import { useMapViewStore } from "../../store/mapView";
import type { ItemSekolahModel, MarkerGroup } from "../../models/response";
import { getSchoolS3Json } from "../../services/school.svc";
import { useAppendNewMarkers } from "../../hooks/useAppendNewMarkers";
import { MapViewController } from "./MapViewController";

// Use the shared MarkerMap shape used by marker processors (lat/lng)

function MapEvents({
  onZoomChange,
  onCenterChange,
  onDragStart,
  onDragEnd,
}: {
  onZoomChange: (zoom: number) => void;
  onCenterChange: (center: Coordinates) => void;
  onDragStart?: () => void;
  onDragEnd?: (center: Coordinates) => void;
}) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
    moveend: (e) => {
      const center = e.target.getCenter();
      onCenterChange({ koordinatXX: center.lat, koordinatYY: center.lng });
    },
    dragstart: () => {
      onDragStart?.();
    },
    dragend: (e) => {
      const center = e.target.getCenter();
      onDragEnd?.({ koordinatXX: center.lat, koordinatYY: center.lng });
    },
  });
  return null;
}

interface MapContainerProps {
  schoolMarkers: MarkerMap;
  setSchoolMarkers: Dispatch<SetStateAction<MarkerMap>>;
  dragStartPos: Coordinates | null;
  setDragStartPos: Dispatch<SetStateAction<Coordinates | null>>;
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number
  ) => Promise<MarkerGroup[]>;
  setViewSchool: Dispatch<SetStateAction<ItemSekolahModel | null>>;
}

export function MapContainerComponent({
  dragStartPos,
  setDragStartPos,
  fetchNearbySchools,
  setViewSchool,
}: MapContainerProps) {
  const {
    center: mapCenter,
    setCenter: setMapCenter,
    setZoom,
    zoom,
    radius,
    schoolMarkers,
    setSchoolMarkers,
    initialLocationSet,
  } = useMapViewStore();
  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    setSchoolMarkers,
    radius,
    initialLocationSet,
    zoom,
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
          setMapCenter([center.koordinatXX, center.koordinatYY]);
        }}
        onDragStart={() => {
          setDragStartPos({ koordinatXX: mapCenter[0], koordinatYY: mapCenter[1] });
        }}
        onDragEnd={(newCenter) => {
          if (dragStartPos) {
            const distance = calculateDistance(
              dragStartPos.koordinatXX,
              dragStartPos.koordinatYY,
              newCenter.koordinatXX,
              newCenter.koordinatYY
            );

            if (distance > radius) {
              appendNewMarkers({ koordinatXX: newCenter.koordinatXX, koordinatYY: newCenter.koordinatYY });
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
