import { useMap } from "react-leaflet";
import { useEffect } from "react";

/**
 * Hook to create custom map panes for polygon layering
 * Creates panes with different z-index values to control which borders appear on top
 */
export function usePolygonPanes() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const panes = [
      { name: "polygon-layer-400", zIndex: 400 }, // Green (Pahang, Melaka) - Top
      { name: "polygon-layer-300", zIndex: 300 }, // Gray (Perak, Terengganu, etc.)
      { name: "polygon-layer-200", zIndex: 200 }, // Red (Kelantan, Kedah, Selangor)
      { name: "polygon-layer-100", zIndex: 100 }, // Blue (Johor, Penang, Sabah)
    ];

    panes.forEach(({ name, zIndex }) => {
      // Check if pane already exists
      if (!map.getPane(name)) {
        const pane = map.createPane(name);
        pane.style.zIndex = String(zIndex);
        console.log(`[Polygon Panes] Created pane: ${name} with z-index ${zIndex}`);
      }
    });
  }, [map]);

  return null;
}
