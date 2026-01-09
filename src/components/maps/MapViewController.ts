import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useMapViewStore } from "../../store/mapView";

export function MapViewController() {
  const map = useMap();
  const { center, zoom } = useMapViewStore();
  const panesInitialized = useRef(false);

  useEffect(() => {
    if (!map || panesInitialized.current) return;
    const panes = [
      { name: "polygon-layer-500", zIndex: 400 },
      { name: "polygon-layer-400", zIndex: 300 },
      { name: "polygon-layer-300", zIndex: 500 },
      { name: "polygon-layer-200", zIndex: 200 },
      { name: "polygon-layer-100", zIndex: 201 },
    ];

    panes.forEach(({ name, zIndex }) => {
      if (!map.getPane(name)) {
        const pane = map.createPane(name);
        pane.style.zIndex = String(zIndex);
      }
    });

    panesInitialized.current = true;
  }, [map]);

  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}
