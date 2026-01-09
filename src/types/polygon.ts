export type Position = [number, number];

export interface MultiPolygonGeometry {
  type: "MultiPolygon";
  coordinates: Position[][][];
}

export interface NegeriBoundary {
  negeri: string;
  geometry: MultiPolygonGeometry;
  updatedAt: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    negeri: string;
    updatedAt: string;
  };
  geometry: MultiPolygonGeometry;
}

export interface GeoJSONPageProps {
  pageProps: {
    geojson: GeoJSONFeature;
  };
}

export type GeoJSONData = GeoJSONFeature | NegeriBoundary | GeoJSONPageProps;
