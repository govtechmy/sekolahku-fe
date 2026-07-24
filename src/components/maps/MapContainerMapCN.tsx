import {
  Map,
  NavigationControl,
  Source,
  Layer,
  Popup,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type { LineLayerSpecification, FillLayerSpecification } from "maplibre-gl";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Coordinates } from "../../types/maps";
import type { MarkerGroup } from "../../models/response";
import { useMapViewStore } from "../../store/mapView";
import { useLocationSessionStore } from "../../store/locationSession";
import { useAppendNewMarkers } from "../../hooks/useAppendNewMarkers";
import { calculateDistance } from "../../utils/calculateDistance";
import { toMapLibre, fromMapLibre } from "../../utils/coordinates";
import { createCirclePolygon } from "../../utils/circlePolygon";
import { SchoolMapMarkerMapCN } from "./SchoolMapMarkerMapCN";
import { StatePolygonMapCN } from "./StatePolygonMapCN";
import { getSchoolS3Json } from "../../services/school.svc";
import { getSchoolLogoUrl } from "../../utils/schoolHelpers";
import type { ViewStateChangeEvent, MapRef } from "react-map-gl/maplibre";

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

// Constants for zoom levels
const ZOOM_LEVELS = {
  WEST_EAST_MALAYSIA: 6,
  NEGERI: 9,
  PARLIMEN: 12,
  USER: 17,
  INDIVIDUAL: 18,
} as const;

interface MapContainerMapCNProps {
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

export function MapContainerMapCN({
  dragStartPos,
  setDragStartPos,
  fetchNearbySchools,
}: MapContainerMapCNProps) {
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
    pointA,
    pointB,
    routeCoordinates,
  } = useMapViewStore();

  const { initialLocationUser } = useLocationSessionStore();

  const mapRef = useRef<MapRef>(null);
  const hoverRequestIdRef = useRef(0);
  // Track whether the next store change was caused by the map's own moveEnd
  const skipNextFlyTo = useRef(false);

  const appendNewMarkers = useAppendNewMarkers({
    fetchNearbySchools,
    schoolMarkers,
    setSchoolMarkers,
    radius,
    initialLocationSet,
    zoom,
  });

  // Controlled view state
  const [viewState, setViewState] = useState({
    longitude: toMapLibre(center)[0],
    latitude: toMapLibre(center)[1],
    zoom: zoom,
  });

  // Track the rounded zoom to avoid re-filtering markers on fractional zoom changes during animation
  const [displayZoom, setDisplayZoom] = useState(Math.floor(zoom));

  // Marker currently hovered — drives the tooltip popup above the pin
  const [hoveredMarker, setHoveredMarker] = useState<{
    id: string;
    lat: number;
    lng: number;
    name: string;
    kod: string;
    daerah: string;
    logoUrl: string;
  } | null>(null);

  // Programmatic flyTo when store center/zoom changes externally
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  useEffect(() => {
    const centerChanged =
      prevCenter.current[0] !== center[0] || prevCenter.current[1] !== center[1];
    const zoomChanged = prevZoom.current !== zoom;

    prevCenter.current = center;
    prevZoom.current = zoom;

    if (!centerChanged && !zoomChanged) return;

    // Skip flyTo if this store update came from user interaction on the map
    if (skipNextFlyTo.current) {
      skipNextFlyTo.current = false;
      return;
    }

    const [lng, lat] = toMapLibre(center);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: zoom,
        duration: 1000,
      });
    } else {
      // Map not ready yet, update viewState directly
      setViewState({ longitude: lng, latitude: lat, zoom });
    }
  }, [center, zoom]);

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
    // Only update displayZoom when the integer zoom level changes
    const newFloor = Math.floor(evt.viewState.zoom);
    setDisplayZoom((prev) => (prev !== newFloor ? newFloor : prev));
  }, []);

  const prevViewZoom = useRef(viewState.zoom);

  const handleMoveEnd = useCallback(
    (evt: ViewStateChangeEvent) => {
      const { longitude, latitude, zoom: newZoom } = evt.viewState;
      const [lat, lng] = fromMapLibre([longitude, latitude]);

      // Tell the useEffect to skip flyTo since this change comes from user interaction
      skipNextFlyTo.current = true;
      setCenter([lat, lng]);
      setZoom(newZoom);

      // Directly trigger marker fetch on zoom change to ensure markers load
      // Skip if a drag just occurred (handleDragEnd already fetched)
      if (justDragged.current) {
        justDragged.current = false;
        prevViewZoom.current = newZoom;
        return;
      }

      if (initialLocationSet && Math.abs(newZoom - prevViewZoom.current) >= 0.5) {
        prevViewZoom.current = newZoom;
        appendNewMarkers({ koordinatXX: lat, koordinatYY: lng });
      }
    },
    [setCenter, setZoom, initialLocationSet, appendNewMarkers],
  );

  const handleDragStart = useCallback(() => {
    setDragStartPos({ koordinatXX: center[0], koordinatYY: center[1] });
  }, [center, setDragStartPos]);

  const justDragged = useRef(false);

  const handleDragEnd = useCallback(
    (evt: ViewStateChangeEvent) => {
      const { longitude, latitude } = evt.viewState;
      const [lat, lng] = fromMapLibre([longitude, latitude]);
      const newCenter: Coordinates = { koordinatXX: lat, koordinatYY: lng };

      justDragged.current = true;

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
    },
    [dragStartPos, radius, appendNewMarkers, setDragStartPos],
  );

  // Polygon toggle - same as original: always false for now
  const shouldShowPolygons = false;

  // Route GeoJSON data
  const routeGeoJSON = useMemo((): GeoJSON.Feature<GeoJSON.LineString> | null => {
    if (!pointA || !pointB) return null;
    const positions =
      routeCoordinates.length > 0 ? routeCoordinates : [pointA, pointB];
    // Convert from [lat, lng] to [lng, lat] for GeoJSON
    const coordinates = positions.map(
      ([lat, lng]) => [lng, lat] as [number, number],
    );
    return {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates,
      },
    };
  }, [pointA, pointB, routeCoordinates]);

  // User radius circle GeoJSON (Tier 1: 3km)
  const userCircleGeoJSON = useMemo(() => {
    const [lat, lng] = initialLocationUser;
    if (lat == null || lng == null) return null;
    return createCirclePolygon([lng, lat], 3000);
  }, [initialLocationUser]);

  // User radius circle GeoJSON (Tier 2: 20km)
  const userCircleOuterGeoJSON = useMemo(() => {
    const [lat, lng] = initialLocationUser;
    if (lat == null || lng == null) return null;
    return createCirclePolygon([lng, lat], 20000);
  }, [initialLocationUser]);

  // Route layer styles
  const routeLineLayer: LineLayerSpecification = useMemo(
    () => ({
      id: "route-line",
      type: "line" as const,
      source: "route-source",
      paint: {
        "line-color": "#3366FF",
        "line-width": 4,
        "line-opacity": 0.8,
      },
      layout: {
        "line-cap": "round" as const,
        "line-join": "round" as const,
      },
    }),
    [],
  );

  // User circle layer styles
  const circleFillLayer: FillLayerSpecification = useMemo(
    () => ({
      id: "user-circle-fill",
      type: "fill" as const,
      source: "user-circle-source",
      paint: {
        "fill-color": "#3366FF",
        "fill-opacity": 0.08,
      },
    }),
    [],
  );

  const circleLineLayer: LineLayerSpecification = useMemo(
    () => ({
      id: "user-circle-line",
      type: "line" as const,
      source: "user-circle-source",
      paint: {
        "line-color": "#3366FF",
        "line-width": 1.5,
      },
    }),
    [],
  );

  // Outer (20km) circle layer styles
  const circleOuterFillLayer: FillLayerSpecification = useMemo(
    () => ({
      id: "user-circle-outer-fill",
      type: "fill" as const,
      source: "user-circle-outer-source",
      paint: {
        "fill-color": "#FF3B30",
        "fill-opacity": 0.03,
      },
    }),
    [],
  );

  const circleOuterLineLayer: LineLayerSpecification = useMemo(
    () => ({
      id: "user-circle-outer-line",
      type: "line" as const,
      source: "user-circle-outer-source",
      paint: {
        "line-color": "#FF3B30",
        "line-width": 2,
        "line-opacity": 0.7,
        "line-dasharray": [2, 1.5],
      },
    }),
    [],
  );

  // Filter markers by zoom level - overlap only the aggregate ranges.
  const filteredSchoolMarkers = useMemo(() => {
    const entries = Array.from(schoolMarkers.entries());
    const visibleMarkers = entries.filter(([, coords]) => {
      const type = coords.markerType;
      if (displayZoom < ZOOM_LEVELS.WEST_EAST_MALAYSIA) {
        return type === "WEST_EAST_MALAYSIA";
      }
      if (displayZoom < ZOOM_LEVELS.NEGERI) {
        return type === "NEGERI" || type === "WEST_EAST_MALAYSIA";
      }
      if (displayZoom < ZOOM_LEVELS.PARLIMEN) {
        return type === "PARLIMEN" || type === "NEGERI";
      }
      // Do not retain aggregate markers here: they can overlap school pins
      // and capture the pointer before the individual marker receives hover.
      return type === "INDIVIDUAL";
    });

    // Search responses contain individual schools only. If an aggregate fetch
    // has not populated the current tier yet, keep those pins available rather
    // than rendering an empty, non-interactive map.
    if (visibleMarkers.length === 0) {
      return entries.filter(([, coords]) => coords.markerType === "INDIVIDUAL");
    }

    return visibleMarkers;
  }, [schoolMarkers, displayZoom]);

  const fetchMarkerSchoolDetail = useCallback(
    async (kodSekolah: string) => {
      const coords = useMapViewStore.getState().schoolMarkers.get(kodSekolah);
      if (!coords || coords.markerType !== "INDIVIDUAL") return null;

      const hasFallbackPath = Boolean(coords.negeri && coords.parlimen);
      if (!coords.dataUrl && !hasFallbackPath) {
        console.warn(
          `[MapContainerMapCN] Missing school detail location for ${kodSekolah}`,
        );
        return null;
      }

      try {
        return await getSchoolS3Json(
          coords.dataUrl || undefined,
          coords.negeri,
          coords.parlimen,
          kodSekolah,
        );
      } catch (error) {
        console.error(
          `[MapContainerMapCN] Failed to load school detail for ${kodSekolah}:`,
          error,
        );
        return null;
      }
    },
    [],
  );

  const handleMarkerClick = useCallback(
    async (markerId: string) => {
      const coords = useMapViewStore.getState().schoolMarkers.get(markerId);
      if (!coords) return;

      setCenter([coords.koordinatXX, coords.koordinatYY]);

      if (coords.markerType !== "INDIVIDUAL") {
        setViewSchool(null);
        // Zoom IN to the next detail level when clicking a cluster marker
        if (coords.markerType === "WEST_EAST_MALAYSIA") {
          setZoom(ZOOM_LEVELS.NEGERI);
        } else if (coords.markerType === "NEGERI") {
          setZoom(ZOOM_LEVELS.PARLIMEN);
        } else {
          // PARLIMEN → show individual schools
          setZoom(ZOOM_LEVELS.PARLIMEN + 1);
        }
        return;
      }

      const requestId = ++hoverRequestIdRef.current;
      setZoom(ZOOM_LEVELS.INDIVIDUAL);
      const detail = await fetchMarkerSchoolDetail(markerId);
      if (requestId === hoverRequestIdRef.current && detail) {
        setViewSchool(detail);
      }
    },
    [fetchMarkerSchoolDetail, setCenter, setViewSchool, setZoom],
  );

  const handleMarkerHover = useCallback(
    async (kodSekolah: string) => {
      const coords = useMapViewStore.getState().schoolMarkers.get(kodSekolah);
      if (!coords || coords.markerType !== "INDIVIDUAL") return;

      const requestId = ++hoverRequestIdRef.current;
      const detail = await fetchMarkerSchoolDetail(kodSekolah);
      if (requestId !== hoverRequestIdRef.current) return;
      const negeri = detail?.data?.infoPentadbiran?.negeri ?? coords.negeri ?? "";
      const parlimen =
        detail?.data?.infoPentadbiran?.parlimen ?? coords.parlimen ?? "";
      setHoveredMarker({
        id: kodSekolah,
        lat: coords.koordinatXX,
        lng: coords.koordinatYY,
        name: detail?.namaSekolah ?? "Sekolah",
        kod: detail?.kodSekolah ?? kodSekolah,
        daerah: detail?.data?.infoKomunikasi?.bandarSurat ?? "",
        logoUrl: getSchoolLogoUrl(negeri, parlimen, detail?.kodSekolah ?? kodSekolah),
      });
    },
    [fetchMarkerSchoolDetail],
  );

  const handleMarkerLeave = useCallback(() => {
    hoverRequestIdRef.current++;
    setHoveredMarker(null);
  }, []);

  const handleUserMarkerClick = useCallback(
    (id: string) => {
      const markerId = id.replace("user-", "");
      const coords = useMapViewStore.getState().userMarkers.get(markerId);
      if (!coords) return;
      setCenter([coords.koordinatXX, coords.koordinatYY]);
      setZoom(ZOOM_LEVELS.USER);
    },
    [setCenter, setZoom],
  );

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      mapStyle={MAP_STYLE}
      {...viewState}
      onMove={handleMove}
      onMoveEnd={handleMoveEnd}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="bottom-right" />

      {/* State Polygons */}
      {shouldShowPolygons &&
        Array.from(statePolygons.entries()).map(([stateName, geoJsonData]) => (
          <StatePolygonMapCN
            key={stateName}
            stateName={stateName}
            geoJsonData={geoJsonData}
          />
        ))}

      {/* User Markers */}
      {Array.from(userMarkers.entries()).map(([id, coords]) => (
        <SchoolMapMarkerMapCN
          key={`user-${id}`}
          id={`user-${id}`}
          markerType={coords.markerType}
          koordinatXX={coords.koordinatXX}
          koordinatYY={coords.koordinatYY}
          total={coords.total}
          onClick={handleUserMarkerClick}
        />
      ))}

      {/* User Radius Circle */}
      {userCircleOuterGeoJSON && (
        <Source
          id="user-circle-outer-source"
          type="geojson"
          data={userCircleOuterGeoJSON}
        >
          <Layer {...circleOuterFillLayer} />
          <Layer {...circleOuterLineLayer} />
        </Source>
      )}
      {userCircleGeoJSON && (
        <Source id="user-circle-source" type="geojson" data={userCircleGeoJSON}>
          <Layer {...circleFillLayer} />
          <Layer {...circleLineLayer} />
        </Source>
      )}

      {/* Route Polyline */}
      {routeGeoJSON && (
        <Source id="route-source" type="geojson" data={routeGeoJSON}>
          <Layer {...routeLineLayer} />
        </Source>
      )}

      {/* School Markers */}
      {filteredSchoolMarkers.map(([kodSekolah, coords]) => (
        <SchoolMapMarkerMapCN
          key={kodSekolah}
          id={kodSekolah}
          markerType={coords.markerType}
          koordinatXX={coords.koordinatXX}
          koordinatYY={coords.koordinatYY}
          total={coords.total}
          isSelected={
            coords.markerType === "INDIVIDUAL" &&
            viewSchool?.kodSekolah === kodSekolah
          }
          onClick={handleMarkerClick}
          onMouseEnter={handleMarkerHover}
          onMouseLeave={handleMarkerLeave}
        />
      ))}

      {/* Hover tooltip above the pinpoint */}
      {hoveredMarker && (
        <Popup
          longitude={hoveredMarker.lng}
          latitude={hoveredMarker.lat}
          anchor="bottom"
          offset={[0, -38]}
          closeButton={false}
          closeOnClick={false}
          className="school-hover-tooltip"
        >
          <div className="flex items-center gap-2.5 py-0.5 pr-1">
            <img
              src={hoveredMarker.logoUrl}
              alt={hoveredMarker.name}
              className="h-10 w-10 flex-shrink-0 rounded object-contain"
              onError={(e) => {
                e.currentTarget.src = "/utama/info-school-default.svg";
              }}
            />
            <div className="min-w-0">
              <p className="max-w-[220px] text-xs font-semibold text-gray-900 whitespace-normal break-words">
                {hoveredMarker.name}
              </p>
              <p className="text-[11px] text-gray-500">{hoveredMarker.kod}</p>
              {hoveredMarker.daerah && (
                <p className="max-w-[220px] truncate text-[11px] text-gray-500">
                  {hoveredMarker.daerah}
                </p>
              )}
            </div>
          </div>
        </Popup>
      )}
    </Map>
  );
}
