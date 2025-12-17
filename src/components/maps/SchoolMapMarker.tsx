import { Marker } from "react-leaflet";
import type { SchoolMarkerInfo } from "../../types/maps";
import { sekolahMarkerIcon } from "../../icons/MapMarker";


type SchoolMapMarkerProps = {
  school: SchoolMarkerInfo;
  onClick: () => void;
};

export function SchoolMapMarker({ school, onClick }: SchoolMapMarkerProps) {
  return (
    <Marker
      position={[school.koordinatXX, school.koordinatYY]}
      icon={sekolahMarkerIcon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
