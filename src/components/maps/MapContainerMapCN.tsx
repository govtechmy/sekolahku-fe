import {
  Map,
  NavigationControl,
  Source,
  Layer,
  Popup,
  Marker,
} from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import type {
  LineLayerSpecification,
  FillLayerSpecification,
  CircleLayerSpecification,
  SymbolLayerSpecification,
  MapLayerMouseEvent,
} from "maplibre-gl";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMapViewStore } from "../../store/mapView";
import { useLocationSessionStore } from "../../store/locationSession";
import { toMapLibre, fromMapLibre } from "../../utils/coordinates";
import { createCirclePolygon } from "../../utils/circlePolygon";
import { SchoolMapMarkerMapCN } from "./SchoolMapMarkerMapCN";
import { StatePolygonMapCN } from "./StatePolygonMapCN";
import { getSchoolS3Json, getAllSchoolMarkers } from "../../services/school.svc";
import type { SchoolPoint } from "../../services/school.svc";
import { getSchoolLogoUrl } from "../../utils/schoolHelpers";
import type { ViewStateChangeEvent, MapRef } from "react-map-gl/maplibre";

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
    let cancelled = false;
    getAllSchoolMarkers()
      .then((points) => {
        console.log("[MapCN] loaded school points:", points.length);
        if (!cancelled) setAllPoints(points);
      })
      .catch((err) => {
        console.error("[MapCN] Failed to load school points:", err);
      });
    return () => {
      cancelled = true;
    };
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

  const clusterLayer: CircleLayerSpecification = useMemo(
    () => ({
      id: "school-clusters",
      type: "circle",
      source: "schools",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": "#2951E6",
        "circle-opacity": 0.9,
        "circle-radius": [
          "step",
          ["get", "point_count"],
          16,
          50,
          22,
          200,
          30,
          1000,
          40,
        ],
        "circle-stroke-width": 3,
        "circle-stroke-color": "#ffffff",
      },
    }),
    [],
  );

  const clusterCountLayer: SymbolLayerSpecification = useMemo(
    () => ({
      id: "school-cluster-count",
      type: "symbol",
      source: "schools",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-size": 13,
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      },
      paint: {
        "text-color": "#ffffff",
      },
    }),
    [],
  );

  const unclusteredLayer: SymbolLayerSpecification = useMemo(
    () => ({
      id: "school-unclustered",
      type: "symbol",
      source: "schools",
      filter: ["!", ["has", "point_count"]],
      layout: {
        "icon-image": "school-pin",
        "icon-size": 0.9,
        "icon-allow-overlap": true,
        "icon-anchor": "center",
      },
    }),
    [],
  );


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

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

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

  // Register the custom school pin icon (blue circle + white school glyph)
  // as a map image so the unclustered symbol layer can use it.
  const handleMapLoad = useCallback(() => {
    const map = mapRef.current?.getMap?.();
    if (!map || map.hasImage("school-pin")) return;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 40 40'>
      <circle cx='20' cy='20' r='18' fill='#2951E6'/>
      <g transform='translate(8,8)' fill='#ffffff'>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M8.75 7.25C7.92157 7.25 7.25 7.92157 7.25 8.75V19.75H14.75V8.75C14.75 7.92157 14.0785 7.25 13.25 7.25H8.75ZM6.25 8.75C6.25 7.36929 7.36929 6.25 8.75 6.25H13.25C14.6307 6.25 15.75 7.36929 15.75 8.75V20.25C15.75 20.5261 15.5261 20.75 15.25 20.75H6.75C6.47386 20.75 6.25 20.5261 6.25 20.25V8.75Z'/>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M15.75 12.75V19.75H19V13.75C19 13.1977 18.5523 12.75 18 12.75H15.75ZM14.75 20.75H20V13.75C20 12.6454 19.1046 11.75 18 11.75H14.75V20.75Z'/>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M10.5 1.15143C10.5 0.72068 10.9404 0.43026 11.3364 0.599941L14.4825 1.94829C14.9674 2.15609 14.9674 2.84346 14.4825 3.05126L11.5 4.32947V6.99977H10.5V1.15143ZM11.5 3.2415L13.2307 2.49977L11.5 1.75804V3.2415Z'/>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M5.25 20.25C5.25 19.9739 5.47386 19.75 5.75 19.75H20.25C20.5261 19.75 20.75 19.9739 20.75 20.25C20.75 20.5261 20.5261 20.75 20.25 20.75H5.75C5.47386 20.75 5.25 20.5261 5.25 20.25Z'/>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M10.75 15.25C9.92154 15.25 9.25 15.9215 9.25 16.75V19.75H12.75V16.75C12.75 15.9215 12.0785 15.25 11.25 15.25H10.75ZM8.25 16.75C8.25 15.3693 9.36926 14.25 10.75 14.25H11.25C12.6307 14.25 13.75 15.3693 13.75 16.75V20.25C13.75 20.5261 13.5261 20.75 13.25 20.75H8.75C8.47386 20.75 8.25 20.5261 8.25 20.25V16.75Z'/>
        <path fill-rule='evenodd' clip-rule='evenodd' d='M11 12C11.5523 12 12 11.5523 12 11C12 10.4477 11.5523 10 11 10C10.4477 10 10 10.4477 10 11C10 11.5523 10.4477 12 11 12ZM11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z'/>
      </g>
    </svg>`;
    const img = new Image(80, 80);
    img.onload = () => {
      if (!map.hasImage("school-pin")) {
        map.addImage("school-pin", img, { pixelRatio: 2 });
      }
    };
    img.src =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
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

  return (
    <Map
      ref={mapRef}
      mapLib={maplibregl}
      mapStyle={MAP_STYLE}
      {...viewState}
      onMove={handleMove}
      onMoveEnd={handleMoveEnd}
      onLoad={handleMapLoad}
      onClick={handleMapClick}
      onMouseMove={handleMapMouseMove}
      onMouseLeave={handleMapMouseLeave}
      interactiveLayerIds={["school-clusters", "school-unclustered"]}
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
        id="schools"
        type="geojson"
        data={schoolsGeoJSON}
        cluster
        clusterMaxZoom={11}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredLayer} />
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
