import { GeoJSON } from "react-leaflet";
import type { PathOptions } from "leaflet";
import type { GeoJSONFeature } from "../../types/polygon";
import { getStateColor } from "../../utils/stateColors";

interface StatePolygonProps {
  stateName: string;
  geoJsonData: GeoJSONFeature;
}

export function StatePolygon({ stateName, geoJsonData }: StatePolygonProps) {
  const color = getStateColor(stateName);
  const paneName = `polygon-layer-${color.zIndex}`;

  const pathOptions: PathOptions = {
    color: color.borderColor,
    fillColor: color.fillColor,
    fillOpacity: color.fillOpacity ?? 0.2,
    weight: 3,
  };

  if (!geoJsonData) {
    return null;
  }

  if (
    !geoJsonData.type ||
    geoJsonData.type !== "Feature" ||
    !geoJsonData.geometry
  ) {
    console.error(
      `[StatePolygon] Invalid GeoJSON for ${stateName}:`,
      geoJsonData,
    );
    return null;
  }

  try {
    return (
      <GeoJSON
        key={stateName}
        data={geoJsonData}
        pathOptions={pathOptions}
        style={pathOptions}
        pane={paneName}
      />
    );
  } catch (error) {
    console.error(`[StatePolygon] Error rendering ${stateName}:`, error);
    return null;
  }
}
