import type { MarkerGroup } from "../models/response";

export const extractSchoolData = (markers: MarkerGroup[]) => {
    const schoolMap = new Map<
      string,
      { koordinatXX: number; koordinatYY: number; dataUrl: string }
    >();
    markers.forEach((marker) => {
      if (marker.items) {
        marker.items.forEach((item) => {
          const key = `${item.kodSekolah}`;
          schoolMap.set(key, {
            koordinatXX: item.infoLokasi.koordinatXX,
            koordinatYY: item.infoLokasi.koordinatYY,
            dataUrl: item.dataUrl,
          });
        });
      }
    });
    return schoolMap;
  };
  