import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  Circle,
  Polyline,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import { SchoolMapMarker } from "./SchoolMapMarker";
import { type Dispatch, type SetStateAction, useRef } from "react";
import { calculateDistance } from "../../utils/calculateDistance";
import type { Coordinates } from "../../types/maps";
import { useMapViewStore } from "../../store/mapView";
import { useLocationSessionStore } from "../../store/locationSession";
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

function UserRadiusCircle() {
  const { initialLocationUser } = useLocationSessionStore();
  const [lat, lng] = initialLocationUser;

  if (lat == null || lng == null) return null;

  return (
    <>
      {/* Tier 2: outer 20km radius */}
      <Circle
        center={[lat, lng]}
        radius={20000}
        pathOptions={{
          color: "#3366FF",
          fillColor: "#3366FF",
          fillOpacity: 0.03,
          weight: 2,
          opacity: 0.7,
          dashArray: "8, 6",
        }}
      />
      {/* Tier 1: inner 3km radius */}
      <Circle
        center={[lat, lng]}
        radius={3000}
        pathOptions={{
          color: "#3366FF",
          fillColor: "#3366FF",
          fillOpacity: 0.08,
          weight: 1.5,
        }}
      />
    </>
  );
}

function RoutePolyline() {
  const pointA = useMapViewStore((s) => s.pointA);
  const pointB = useMapViewStore((s) => s.pointB);
  const routeCoordinates = useMapViewStore((s) => s.routeCoordinates);

  if (!pointA || !pointB) return null;

  // Use OSRM road-following route if available, otherwise fall back to a
  // straight dashed line between origin and destination.
  const positions =
    routeCoordinates.length > 0 ? routeCoordinates : [pointA, pointB];

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#3366FF",
        weight: 4,
        opacity: 0.8,
        dashArray: routeCoordinates.length > 0 ? undefined : "10, 10",
      }}
    />
  );
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
    viewSchool,
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

  const hoverRequestIdRef = useRef(0);

  // All markers are individual - no clustering
  const shouldShowPolygons = false;

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
      <ZoomControl position="bottomright" />
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

      {/* Radius circle around user's current location */}
      <UserRadiusCircle />
      {/* Route polyline between point A and point B */}
      <RoutePolyline />
      {Array.from(schoolMarkers.entries())
        .filter(([, coords]) => {
          // Only show markers appropriate for current zoom level
          if (zoom < ZOOM_LEVELS.WEST_EAST_MALAYSIA)
            return coords.markerType === "WEST_EAST_MALAYSIA";
          if (zoom < ZOOM_LEVELS.NEGERI)
            return (
              coords.markerType === "NEGERI" ||
              coords.markerType === "WEST_EAST_MALAYSIA"
            );
          if (zoom < ZOOM_LEVELS.PARLIMEN)
            return (
              coords.markerType === "PARLIMEN" || coords.markerType === "NEGERI"
            );
          return coords.markerType === "INDIVIDUAL";
        })
        .map(([kodSekolah, coords]) => (
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
            isSelected={
              coords.markerType === "INDIVIDUAL" &&
              viewSchool?.kodSekolah === kodSekolah
            }
            onClick={async () => {
              const { koordinatXX, koordinatYY } = coords;
              setCenter([koordinatXX, koordinatYY]);
              setViewSchool(null);
              if (coords.dataUrl) {
                setViewSchool(await getSchoolS3Json(coords.dataUrl));
              }
              setZoom(ZOOM_LEVELS.INDIVIDUAL);
            }}
            onMouseOver={async () => {
              if (viewSchool?.kodSekolah === kodSekolah) return;
              const requestId = ++hoverRequestIdRef.current;
              setViewSchool(null);
              if (coords.dataUrl) {
                const detail = await getSchoolS3Json(coords.dataUrl);
                if (requestId === hoverRequestIdRef.current) {
                  setViewSchool(detail);
                }
              }
            }}
          />
        ))}
    </LeafletMapContainer>
  );
}
