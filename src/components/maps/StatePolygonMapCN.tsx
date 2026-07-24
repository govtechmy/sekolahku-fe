import { Source, Layer } from "react-map-gl/maplibre";
import type { FillLayerSpecification, LineLayerSpecification } from "maplibre-gl";
import type { GeoJSONFeature } from "../../types/polygon";
import { getStateColor } from "../../utils/stateColors";

interface StatePolygonMapCNProps {
  stateName: string;
  geoJsonData: GeoJSONFeature;
}

export function StatePolygonMapCN({
  stateName,
  geoJsonData,
}: StatePolygonMapCNProps) {
  const color = getStateColor(stateName);

  if (!geoJsonData?.type || geoJsonData.type !== "Feature" || !geoJsonData.geometry) {
    return null;
  }

  const fillLayer: FillLayerSpecification = {
    id: `polygon-fill-${stateName}`,
    type: "fill",
    source: `polygon-source-${stateName}`,
    paint: {
      "fill-color": color.fillColor,
      "fill-opacity": color.fillOpacity ?? 0.2,
    },
  };

  const lineLayer: LineLayerSpecification = {
    id: `polygon-line-${stateName}`,
    type: "line",
    source: `polygon-source-${stateName}`,
    paint: {
      "line-color": color.borderColor,
      "line-width": 3,
    },
  };

  return (
    <Source
      id={`polygon-source-${stateName}`}
      type="geojson"
      data={geoJsonData as GeoJSON.Feature}
    >
      <Layer {...fillLayer} />
      <Layer {...lineLayer} />
    </Source>
  );
}
