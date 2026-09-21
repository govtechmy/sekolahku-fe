import type { MarkerType } from "../types/maps";

export type MarkerMap = Map<
  string,
  {
    koordinatXX: number;
    koordinatYY: number;
    dataUrl: string;
    markerType: MarkerType;
    total?: number;
    negeri?: string;
    parlimen?: string;
    region?: string;
  }
>;
