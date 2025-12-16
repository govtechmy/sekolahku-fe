import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useMapViewStore } from "../../store/mapView";

/**
 * Syncs the Leaflet map view with values from `useMapViewStore`.
 * Must be used within a child of `MapContainer` to access Leaflet context.
 */
export function MapViewController() {
  const map = useMap();
  const { center, zoom } = useMapViewStore();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}