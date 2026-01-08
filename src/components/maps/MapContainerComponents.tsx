import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import type { Dispatch, SetStateAction } from "react";
import { calculateDistance } from "../../utils/calculateDistance";
import type { Coordinates } from "../../types/maps";
import { useMapViewStore } from "../../store/mapView";
import type { MarkerGroup } from "../../models/response";
import { getSchoolS3Json } from "../../services/school.svc";
import { useAppendNewMarkers } from "../../hooks/useAppendNewMarkers";
import { MapViewController } from "./MapViewController";
import { StatePolygon } from "./StatePolygon";
import { usePolygonPanes } from "../../hooks/usePolygonPanes";

// Component to initialize polygon panes with z-index layering
function PolygonPaneInitializer() {
  usePolygonPanes();
  return null;
}

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

  return (
    <LeafletMapContainer
      center={[3.760115447396889, 108.46252441406251]}
      zoom={6}
      className="h-full w-full"
      zoomControl={false}
    >
      <PolygonPaneInitializer />
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
      {/* <Circle
        center={center}
        radius={radius}
        pathOptions={{
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          weight: 2,
        }}
      />
    */}

      {/* Render state polygons when NEGERI markers are displayed */}
      {Array.from(statePolygons.entries()).map(([stateName, geoJsonData]) => (
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
            setZoom(17);
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
            if (coords.markerType === "WEST_EAST_MALAYSIA") {
              setCenter([coords.koordinatXX, coords.koordinatYY]);
              setZoom(8);
            }
            if (coords.markerType === "NEGERI") {
              setCenter([coords.koordinatXX, coords.koordinatYY]);
              setZoom(12);
            }
            if (coords.markerType === "PARLIMEN") {
              setCenter([coords.koordinatXX, coords.koordinatYY]);
              setZoom(14);
            }
            if (coords.markerType === "INDIVIDUAL") {
              setViewSchool(null); // Reset before setting new school
              setViewSchool(await getSchoolS3Json(coords.dataUrl));
              setCenter([coords.koordinatXX, coords.koordinatYY]);
              setZoom(18);
            }
          }}
        />
      ))}
    </LeafletMapContainer>
  );
}
