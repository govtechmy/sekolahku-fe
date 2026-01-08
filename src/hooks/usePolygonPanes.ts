import { useMap } from "react-leaflet";
import { useEffect } from "react";

export function usePolygonPanes() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const panes = [
      { name: "polygon-layer-500", zIndex: 450 }, // Gray/Black (Perak, Terengganu, WP KL, WP Putrajaya) - Top
      { name: "polygon-layer-400", zIndex: 440 }, // Red (Kelantan, Kedah, Selangor) - Second from top
      { name: "polygon-layer-300", zIndex: 451 }, // Green (Pahang, Melaka)
      { name: "polygon-layer-200", zIndex: 420 }, // Blue (Johor, Penang, Sabah, WP Labuan)
      { name: "polygon-layer-100", zIndex: 410 }, // Yellow (Sarawak, Negeri Sembilan, Perlis) - Bottom
    ];

    panes.forEach(({ name, zIndex }) => {
      // Check if pane already exists
      if (!map.getPane(name)) {
        const pane = map.createPane(name);
        pane.style.zIndex = String(zIndex);
        console.log(
          `[Polygon Panes] Created pane: ${name} with z-index ${zIndex}`,
        );
      }
    });
  }, [map]);

  return null;
}
