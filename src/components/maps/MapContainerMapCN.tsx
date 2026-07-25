import {
  Map,
  NavigationControl,
  Source,
  Layer,
  Popup,
  Marker,
  useControl,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type {
  LineLayerSpecification,
  FillLayerSpecification,
  MapLayerMouseEvent,
  IControl,
} from "maplibre-gl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMapViewStore } from "../../store/mapView";
import { useLocationSessionStore } from "../../store/locationSession";
import { toMapLibre, fromMapLibre } from "../../utils/coordinates";
import { createCirclePolygon } from "../../utils/circlePolygon";
import { SchoolMapMarkerMapCN } from "./SchoolMapMarkerMapCN";
import { StatePolygonMapCN } from "./StatePolygonMapCN";
import {
  getSchoolS3Json,
  subscribeSchoolMarkers,
} from "../../services/school.svc";
import type { SchoolPoint } from "../../services/school.svc";
import { getSchoolLogoUrl } from "../../utils/schoolHelpers";
import type { ViewStateChangeEvent, MapRef } from "react-map-gl/maplibre";
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  SCHOOL_SOURCE_ID,
  schoolClusterCountLayer,
  schoolClusterLayer,
  schoolUnclusteredLayer,
} from "./schoolLayers";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

// Constants for zoom levels
const ZOOM_LEVELS = {
  WEST_EAST_MALAYSIA: 6,
  NEGERI: 9,
  PARLIMEN: 12,
  USER: 17,
  INDIVIDUAL: 18,
} as const;

const MY_LOCATION_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`;

/**
 * "Go to my location" button rendered as a real MapLibre control rather than an
 * absolutely-positioned overlay. MapLibre inserts bottom-position controls
 * before the existing ones, so registering this AFTER <NavigationControl />
 * places it directly above the zoom-in (+) button — and it inherits the
 * standard control margins, so it can't collide with the attribution bar the
 * way a hard-coded offset would.
 */
function MyLocationControl({ onClick }: { onClick: () => void }) {
  // Keep the latest handler without re-creating (and thus re-adding) the control.
  const handlerRef = useRef(onClick);
  handlerRef.current = onClick;

  useControl(
    () => {
      // MapLibre expects a control to detach its own element on removal. Without
      // this, StrictMode's mount → unmount → mount cycle leaves an orphaned
      // empty control container behind, which shows up as a phantom gap in the
      // control column.
      let container: HTMLDivElement | null = null;

      const control: IControl = {
        onAdd: () => {
          container = document.createElement("div");
          container.className = "maplibregl-ctrl maplibregl-ctrl-group";

          const button = document.createElement("button");
          button.type = "button";
          button.title = "Pergi ke lokasi saya";
          button.setAttribute("aria-label", "Go to my location");
          button.addEventListener("click", () => handlerRef.current());

          // MapLibre's control buttons are display:block with no padding, so an
          // inline <svg> child would sit on the text baseline (offset left and
          // pushed down). Use the same span.maplibregl-ctrl-icon pattern the
          // built-in +/−/compass buttons use, which centres via
          // background-position: 50%.
          const icon = document.createElement("span");
          icon.className = "maplibregl-ctrl-icon";
          icon.setAttribute("aria-hidden", "true");
          icon.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(
            MY_LOCATION_ICON,
          )}")`;
          icon.style.backgroundSize = "18px 18px";
          button.appendChild(icon);

          container.appendChild(button);
          return container;
        },
        onRemove: () => {
          container?.parentNode?.removeChild(container);
          container = null;
        },
      };
      return control;
    },
    { position: "bottom-right" },
  );

  return null;
}

export function MapContainerMapCN() {
  const {
    center,
    setCenter,
    setZoom,
    zoom,
    setViewSchool,
    statePolygons,
    userMarkers,
    pointA,
    pointB,
    routeCoordinates,
    mapFilters,
    initialLocationSet,
  } = useMapViewStore();

  const { initialLocationUser } = useLocationSessionStore();

  const mapRef = useRef<MapRef>(null);
  const hoverRequestIdRef = useRef(0);
  // Track whether the next store change was caused by the map's own moveEnd
  const skipNextFlyTo = useRef(false);
  const prevCenter = useRef(center);
  const prevZoom = useRef(zoom);

  // Controlled view state
  const [viewState, setViewState] = useState({
    longitude: toMapLibre(center)[0],
    latitude: toMapLibre(center)[1],
    zoom: zoom,
  });

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

  // ---- Client-side clustering (MapLibre native) ----
  // Load ALL school points once and let MapLibre cluster them on the GPU.
  const [allPoints, setAllPoints] = useState<SchoolPoint[]>([]);

  useEffect(() => {
    // Subscribe rather than await: pins appear as soon as the first page of
    // schools lands, then fill in as the remaining pages arrive.
    return subscribeSchoolMarkers((points) => {
      setAllPoints(points);
    });
  }, []);

  // Build a GeoJSON FeatureCollection from all school points, applying the
  // active dropdown filters (negeri / peringkat / jenis) so the clustered map
  // reflects the same result set as the sidebar.
  const schoolsGeoJSON = useMemo<GeoJSON.FeatureCollection>(() => {
    const { negeri, peringkat, jenis, sesi } = mapFilters;
    const filtered = allPoints.filter((p) => {
      if (negeri !== "ALL" && p.negeri !== negeri) return false;
      if (peringkat !== "ALL" && p.peringkat !== peringkat) return false;
      if (jenis === "SEKOLAH_ANGKAT_MADANI") {
        if (!p.isSekolahAngkatMADANI) return false;
      } else if (jenis !== "ALL" && p.jenisLabel !== jenis) {
        return false;
      }
      if (sesi !== "ALL" && p.sesi !== sesi) return false;
      return true;
    });
    return {
      type: "FeatureCollection",
      features: filtered.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
        properties: {
          kodSekolah: p.kodSekolah,
          namaSekolah: p.namaSekolah,
          negeri: p.negeri,
          parlimen: p.parlimen,
          bandarSurat: p.bandarSurat,
        },
      })),
    };
  }, [allPoints, mapFilters]);

  useEffect(() => {
    const centerChanged =
      prevCenter.current[0] !== center[0] ||
      prevCenter.current[1] !== center[1];
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

  // Diagnostic logging for the "pins sometimes missing at certain zoom levels"
  // report. Logs on every zoom change while scrolling, along with the signals
  // that decide whether pins can render at all: which mode the cluster source
  // is in, how many features each layer actually rendered, and whether the
  // school-pin image the unclustered symbol layer depends on is registered.
  const lastLoggedZoom = useRef<number | null>(null);

  const logZoomState = useCallback(
    (z: number) => {
      if (
        lastLoggedZoom.current !== null &&
        Math.abs(z - lastLoggedZoom.current) < 0.01
      ) {
        return;
      }
      lastLoggedZoom.current = z;

      const map = mapRef.current?.getMap?.();
      const countRendered = (layerId: string) => {
        if (!map?.getLayer(layerId)) return "no-layer";
        return map.queryRenderedFeatures({ layers: [layerId] }).length;
      };

      console.log(
        `[MapCN] zoom=${z.toFixed(2)}`,
        // Tiles are requested at floor(zoom), so clustering applies for the
        // whole of e.g. 11.0–11.99 even though the fractional zoom is above
        // clusterMaxZoom.
        `mode=${Math.floor(z) <= CLUSTER_MAX_ZOOM ? "clustered" : "individual pins"}`,
        `clusters=${countRendered("school-clusters")}`,
        `pins=${countRendered("school-unclustered")}`,
        `points=${allPoints.length}`,
      );
    },
    [allPoints.length],
  );

  const handleMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      setViewState(evt.viewState);
      logZoomState(evt.viewState.zoom);
    },
    [logZoomState],
  );

  const handleMoveEnd = useCallback(
    (evt: ViewStateChangeEvent) => {
      const { longitude, latitude, zoom: newZoom } = evt.viewState;
      const [lat, lng] = fromMapLibre([longitude, latitude]);
      // Tell the useEffect to skip flyTo since this change comes from user interaction
      skipNextFlyTo.current = true;
      setCenter([lat, lng]);
      setZoom(newZoom);
    },
    [setCenter, setZoom],
  );

  // Polygon toggle - same as original: always false for now
  const shouldShowPolygons = false;

  // Route GeoJSON data
  const routeGeoJSON =
    useMemo((): GeoJSON.Feature<GeoJSON.LineString> | null => {
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

  // Click on a cluster (zoom to expand) or an individual school (open detail).
  const handleMapClick = useCallback(
    (evt: MapLayerMouseEvent) => {
      const map = mapRef.current;
      const feature = evt.features?.[0];
      if (!map || !feature) return;
      const props = feature.properties ?? {};
      const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [
        number,
        number,
      ];

      if (props.cluster) {
        const clusterId = props.cluster_id as number;
        const src = map.getSource("schools") as maplibregl.GeoJSONSource;
        src
          .getClusterExpansionZoom(clusterId)
          .then((z) => {
            skipNextFlyTo.current = true;
            map.easeTo({ center: [lng, lat], zoom: z, duration: 500 });
          })
          .catch(() => {});
        return;
      }

      // Individual school pin
      setCenter([lat, lng]);
      setZoom(ZOOM_LEVELS.INDIVIDUAL);
      const requestId = ++hoverRequestIdRef.current;
      getSchoolS3Json(
        undefined,
        String(props.negeri ?? ""),
        String(props.parlimen ?? ""),
        String(props.kodSekolah ?? ""),
      )
        .then((detail) => {
          if (requestId === hoverRequestIdRef.current && detail) {
            setViewSchool(detail);
          }
        })
        .catch((error) =>
          console.error("[MapCN] Failed to load school detail:", error),
        );
    },
    [setCenter, setZoom, setViewSchool],
  );

  // Hover over an individual school pin → show tooltip above it.
  const handleMapMouseMove = useCallback((evt: MapLayerMouseEvent) => {
    const map = mapRef.current;
    if (!map) return;
    const feature = evt.features?.[0];
    if (!feature) {
      map.getCanvas().style.cursor = "";
      setHoveredMarker((h) => (h ? null : h));
      return;
    }
    map.getCanvas().style.cursor = "pointer";
    const props = feature.properties ?? {};
    if (props.cluster) {
      setHoveredMarker((h) => (h ? null : h));
      return;
    }
    const [lng, lat] = (feature.geometry as GeoJSON.Point).coordinates as [
      number,
      number,
    ];
    const kod = String(props.kodSekolah ?? "");
    setHoveredMarker({
      id: kod,
      lat,
      lng,
      name: String(props.namaSekolah ?? "Sekolah"),
      kod,
      daerah: String(props.bandarSurat ?? ""),
      logoUrl: getSchoolLogoUrl(
        String(props.negeri ?? ""),
        String(props.parlimen ?? ""),
        kod,
      ),
    });
  }, []);

  const handleMapMouseLeave = useCallback(() => {
    const map = mapRef.current;
    if (map) map.getCanvas().style.cursor = "";
    setHoveredMarker(null);
  }, []);

  // Smooth pulsing animation for the 3km user radius circle. Uses a sine wave
  // to gently oscillate the fill/line opacity and line width via requestAnimationFrame.
  useEffect(() => {
    if (!userCircleGeoJSON) return;
    let rafId: number;
    const start = performance.now();
    // One full pulse cycle every 2.5 seconds.
    const PERIOD = 2500;

    const animate = (now: number) => {
      const map = mapRef.current?.getMap?.();
      if (map && map.getLayer("user-circle-fill")) {
        // t oscillates 0 → 1 → 0 smoothly.
        const t = (Math.sin(((now - start) / PERIOD) * Math.PI * 2) + 1) / 2;
        map.setPaintProperty(
          "user-circle-fill",
          "fill-opacity",
          0.05 + t * 0.12,
        );
        if (map.getLayer("user-circle-line")) {
          map.setPaintProperty(
            "user-circle-line",
            "line-opacity",
            0.4 + t * 0.6,
          );
          map.setPaintProperty("user-circle-line", "line-width", 1 + t * 2.5);
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [userCircleGeoJSON]);

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

  // Recenter on the location the user picked / was geolocated to.
  const handleGoToMyLocation = useCallback(() => {
    const [lat, lng] = useLocationSessionStore.getState().initialLocationUser;
    if (lat == null || lng == null) return;
    setCenter([lat, lng]);
    setZoom(ZOOM_LEVELS.USER);
  }, [setCenter, setZoom]);

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      mapStyle={MAP_STYLE}
      {...viewState}
      onMove={handleMove}
      onMoveEnd={handleMoveEnd}
      onClick={handleMapClick}
      onMouseMove={handleMapMouseMove}
      onMouseLeave={handleMapMouseLeave}
      interactiveLayerIds={["school-clusters", "school-unclustered"]}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="bottom-right" />
      {/* Registered after NavigationControl so it stacks above the + button. */}
      {initialLocationSet && (
        <MyLocationControl onClick={handleGoToMyLocation} />
      )}

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

      {/* Origin (A) dot — shown while a route/destination is active */}
      {pointA && pointB && (
        <Marker
          longitude={toMapLibre(pointA)[0]}
          latitude={toMapLibre(pointA)[1]}
          anchor="center"
        >
          <div
            className="h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"
            aria-label="Titik asal"
          />
        </Marker>
      )}

      {/* Destination (B) pin — the selected school */}
      {pointB && (
        <Marker
          longitude={toMapLibre(pointB)[0]}
          latitude={toMapLibre(pointB)[1]}
          anchor="bottom"
        >
          <svg
            width="32"
            height="42"
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Lokasi sekolah"
            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}
          >
            <path
              d="M12 0C5.373 0 0 5.373 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.373 18.627 0 12 0z"
              fill="#E11D48"
            />
            <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
          </svg>
        </Marker>
      )}

      {/* School Markers — clustered GeoJSON source (GPU rendered) */}
      <Source
        id={SCHOOL_SOURCE_ID}
        type="geojson"
        data={schoolsGeoJSON}
        cluster
        clusterMaxZoom={CLUSTER_MAX_ZOOM}
        clusterRadius={CLUSTER_RADIUS}
      >
        <Layer {...schoolClusterLayer} />
        <Layer {...schoolClusterCountLayer} />
        <Layer {...schoolUnclusteredLayer} />
      </Source>

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
