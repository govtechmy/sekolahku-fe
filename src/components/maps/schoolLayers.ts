/**
 * Layer specifications for the clustered `schools` GeoJSON source.
 *
 * These are plain constants, kept out of the component so they can be asserted
 * in tests and rendered by an offline probe without pulling in the whole map
 * component (and so they are not rebuilt on every render).
 *
 * Individual schools are drawn with a native `circle` layer rather than a
 * `symbol` layer with `icon-image`. A symbol layer whose icon is not registered
 * on the live map draws nothing at all, which previously made every unclustered
 * school vanish while cluster circles kept rendering. Circles have no such
 * dependency.
 */
import type {
  CircleLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

export const SCHOOL_SOURCE_ID = "schools";

/**
 * Above this zoom the source emits individual points instead of clusters.
 * Tiles are requested at `floor(zoom)`, so clustering still applies across the
 * whole of e.g. 11.0–11.99.
 */
export const CLUSTER_MAX_ZOOM = 11;

export const CLUSTER_RADIUS = 50;

const BRAND_BLUE = "#2951E6";
// Per-peringkat pin colours (individual/unclustered schools).
const PIN_RENDAH = "#2A9D8F";
const PIN_MENENGAH = "#D99A3D";
// Schools returned by an active name search stay red so they stand out.
const PIN_SEARCH = "#EF4444";

export const schoolClusterLayer: CircleLayerSpecification = {
  id: "school-clusters",
  type: "circle",
  source: SCHOOL_SOURCE_ID,
  filter: ["has", "point_count"],
  paint: {
    "circle-color": BRAND_BLUE,
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
};

export const schoolClusterCountLayer: SymbolLayerSpecification = {
  id: "school-cluster-count",
  type: "symbol",
  source: SCHOOL_SOURCE_ID,
  filter: ["has", "point_count"],
  layout: {
    "text-field": ["get", "point_count_abbreviated"],
    "text-size": 13,
    "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
  },
  paint: {
    "text-color": "#ffffff",
  },
};

export const schoolUnclusteredLayer: CircleLayerSpecification = {
  id: "school-unclustered",
  type: "circle",
  source: SCHOOL_SOURCE_ID,
  filter: ["!", ["has", "point_count"]],
  paint: {
    // Red for active search results, otherwise colour by peringkat
    // (rendah = teal, menengah = amber) with a blue fallback.
    "circle-color": [
      "case",
      ["==", ["get", "isSearch"], 1],
      PIN_SEARCH,
      [
        "match",
        ["get", "peringkat"],
        "RENDAH",
        PIN_RENDAH,
        "MENENGAH",
        PIN_MENENGAH,
        BRAND_BLUE,
      ],
    ],
    "circle-opacity": 0.9,
    // Grow with zoom so dense areas stay legible when zoomed out.
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      CLUSTER_MAX_ZOOM + 1,
      5,
      14,
      7,
      17,
      10,
    ],
    "circle-stroke-width": 2,
    "circle-stroke-color": "#ffffff",
  },
};
