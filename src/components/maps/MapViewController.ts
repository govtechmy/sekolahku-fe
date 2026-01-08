import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapViewStore } from "../../store/mapView";

export function MapViewController() {
  const map = useMap();
  const { center, zoom } = useMapViewStore();

  useEffect(() => {
    if (!map) return;

    const panes = [
      { name: "polygon-layer-500", zIndex: 400 }, // Gray/Black (Perak, Terengganu, WP KL, WP Putrajaya)
      { name: "polygon-layer-400", zIndex: 300 }, // Red (Kelantan, Kedah, Selangor)
      { name: "polygon-layer-300", zIndex: 500 }, // Green (Pahang, Melaka) - Highest
      { name: "polygon-layer-200", zIndex: 200 }, // Blue (Johor, Penang, Sabah, WP Labuan)
      { name: "polygon-layer-100", zIndex: 201 }, // Yellow (Sarawak, Negeri Sembilan, Perlis)
    ];

    panes.forEach(({ name, zIndex }) => {
      if (!map.getPane(name)) {
        const pane = map.createPane(name);
        pane.style.zIndex = String(zIndex);
      }
    });
  }, [map]);

  // Sync map view with store values
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}
