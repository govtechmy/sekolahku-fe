/** TEMPORARY verification harness — deleted after the run. */
import maplibregl from "maplibre-gl";
import {
  CLUSTER_MAX_ZOOM,
  CLUSTER_RADIUS,
  SCHOOL_SOURCE_ID,
  schoolClusterCountLayer,
  schoolClusterLayer,
  schoolUnclusteredLayer,
} from "../components/maps/schoolLayers";

const COUNT = 10245;

// Deterministic spread over peninsular Malaysia, no network needed.
const features = Array.from({ length: COUNT }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180;
  const r = 2.2 * Math.sqrt(i / COUNT);
  return {
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [101.7 + r * Math.cos(a), 3.1 + r * Math.sin(a)],
    },
    properties: { kodSekolah: `K${i}`, namaSekolah: `Sekolah ${i}` },
  };
});

const map = new maplibregl.Map({
  container: "map",
  // Blank style: no external tiles, so this runs with no network access.
  style: {
    version: 8,
    glyphs: undefined,
    sources: {},
    layers: [
      {
        id: "bg",
        type: "background",
        paint: { "background-color": "#eef1f5" },
      },
    ],
  },
  center: [101.7, 3.1],
  zoom: 12,
  attributionControl: false,
});

interface ProbeResult {
  zoom: number;
  clusters: number | string;
  pins: number | string;
}

declare global {
  interface Window {
    __probe: { ready: boolean; errors: string[]; results: ProbeResult[] };
    __sweep: (zooms: number[]) => Promise<ProbeResult[]>;
  }
}

window.__probe = { ready: false, errors: [], results: [] };
map.on("error", (e) =>
  window.__probe.errors.push(String(e.error?.message ?? e)),
);

map.on("load", () => {
  map.addSource(SCHOOL_SOURCE_ID, {
    type: "geojson",
    data: { type: "FeatureCollection", features },
    cluster: true,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
    clusterRadius: CLUSTER_RADIUS,
  });
  map.addLayer(schoolClusterLayer);
  // The cluster count layer needs glyphs, which a blank offline style lacks;
  // it is unrelated to the pin change, so it is left out of the probe.
  void schoolClusterCountLayer;
  map.addLayer(schoolUnclusteredLayer);
  window.__probe.ready = true;
});

const idle = () =>
  new Promise<void>((resolve) => {
    map.once("idle", () => resolve());
    map.triggerRepaint();
  });

window.__sweep = async (zooms) => {
  const out: ProbeResult[] = [];
  for (const z of zooms) {
    map.setZoom(z);
    await idle();
    const count = (id: string) =>
      map.getLayer(id)
        ? map.queryRenderedFeatures({ layers: [id] }).length
        : "no-layer";
    out.push({
      zoom: z,
      clusters: count("school-clusters"),
      pins: count("school-unclustered"),
    });
  }
  window.__probe.results = out;
  return out;
};
