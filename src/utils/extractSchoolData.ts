import type { MarkerGroup } from "../models/response";

export const extractSchoolData = (markers: MarkerGroup[]) => {
    const schoolMap = new Map<
      string,
      { lat: number; lng: number; dataUrl: string }
    >();
    markers.forEach((marker) => {
      if (marker.items) {
        marker.items.forEach((item) => {
          const key = `${item.kodSekolah}`;
          schoolMap.set(key, {
            lat: item.infoLokasi.koordinatYY,
            lng: item.infoLokasi.koordinatXX,
            dataUrl: item.dataUrl,
          });
        });
      }
    });
    return schoolMap;
  };
  