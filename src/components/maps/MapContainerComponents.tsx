import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { type Dispatch, type SetStateAction } from "react";
import { calculateDistance } from "../../utils/calculateDistance";
import type { Coordinates } from "../../types/maps";
import { useMapViewStore } from "../../store/mapView";
import type { MarkerGroup } from "../../models/response";
import { getSchoolS3Json } from "../../services/school.svc";
import { useAppendNewMarkers } from "../../hooks/useAppendNewMarkers";
import { MapViewController } from "./MapViewController";
import { StatePolygon } from "./StatePolygon";

// Constants for zoom levels
const ZOOM_LEVELS = {
  WEST_EAST_MALAYSIA: 8,
  NEGERI: 12,
  PARLIMEN: 14,
  USER: 17,
  INDIVIDUAL: 18,
} as const;

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
  dragStartPos: Coordinates | null;
  setDragStartPos: Dispatch<SetStateAction<Coordinates | null>>;
  fetchNearbySchools: (
    koordinatXX: number,
    koordinatYY: number,
    radiusInMeter: number,
    initialLocationSet?: boolean,
    zoom?: number,
  ) => Promise<MarkerGroup[]>;
}

export function MapContainerComponent({
  dragStartPos,
  setDragStartPos,
  fetchNearbySchools,
}: MapContainerProps) {
  const {
    center,
    setCenter,
    setZoom,
    zoom,
    radius,
    schoolMarkers,
    setSchoolMarkers,
    initialLocationSet,
    setViewSchool,
    statePolygons,
    userMarkers,
  } = useMapViewStore();

  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    schoolMarkers,
    setSchoolMarkers,
    radius,
    initialLocationSet,
    zoom,
  });

  // Determine if we should show polygons based on marker type
  const firstMarker = schoolMarkers.values().next().value;
  const currentMarkerType = firstMarker?.markerType;
  const shouldShowPolygons = currentMarkerType === "NEGERI";

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
          setCenter([center.koordinatXX, center.koordinatYY]);
        }}
        onDragStart={() => {
          setDragStartPos({ koordinatXX: center[0], koordinatYY: center[1] });
        }}
        onDragEnd={(newCenter) => {
          if (dragStartPos) {
            const distance = calculateDistance(
              dragStartPos.koordinatXX,
              dragStartPos.koordinatYY,
              newCenter.koordinatXX,
              newCenter.koordinatYY,
            );

            if (distance > radius / 100) {
              appendNewMarkers({
                koordinatXX: newCenter.koordinatXX,
                koordinatYY: newCenter.koordinatYY,
              });
            }
          }
          setDragStartPos(null);
        }}
      />

      {/* Render all state polygons when NEGERI markers are displayed */}
      {shouldShowPolygons &&
        Array.from(statePolygons.entries()).map(([stateName, geoJsonData]) => (
          <StatePolygon
            key={stateName}
            stateName={stateName}
            geoJsonData={geoJsonData}
          />
        ))}

      {Array.from(userMarkers.entries()).map(([id, coords]) => (
        <SchoolMapMarker
          key={`user-${id}`}
          school={{
            markerType: coords.markerType,
            radiusInMeter: 0,
            koordinatXX: coords.koordinatXX,
            koordinatYY: coords.koordinatYY,
            id,
            total: coords.total,
          }}
          onClick={() => {
            setCenter([coords.koordinatXX, coords.koordinatYY]);
            setZoom(ZOOM_LEVELS.USER);
          }}
        />
      ))}
      {Array.from(schoolMarkers.entries()).map(([kodSekolah, coords]) => (
        <SchoolMapMarker
          key={kodSekolah}
          school={{
            markerType: coords.markerType,
            radiusInMeter: 0,
            koordinatXX: coords.koordinatXX,
            koordinatYY: coords.koordinatYY,
            id: kodSekolah,
            total: coords.total,
          }}
          onClick={async () => {
            const { koordinatXX, koordinatYY, markerType } = coords;

            setCenter([koordinatXX, koordinatYY]);

            if (markerType === "WEST_EAST_MALAYSIA") {
              setZoom(ZOOM_LEVELS.WEST_EAST_MALAYSIA);
            } else if (markerType === "NEGERI") {
              setZoom(ZOOM_LEVELS.NEGERI);
            } else if (markerType === "PARLIMEN") {
              setZoom(ZOOM_LEVELS.PARLIMEN);
            } else if (markerType === "INDIVIDUAL") {
              setViewSchool(null);
              if (coords.dataUrl) {
                setViewSchool(await getSchoolS3Json(coords.dataUrl));
              }
              setZoom(ZOOM_LEVELS.INDIVIDUAL);
            }
          }}
        />
      ))}
    </LeafletMapContainer>
  );
}
