import { Marker } from "react-leaflet";
import L from "leaflet";
import type { SchoolMarker } from "../../types/maps";

// Custom school icon
const schoolIcon = new L.Icon({
  iconUrl: "/images/iconSchool.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

type SchoolMapMarkerProps = {
  school: SchoolMarker;
  onClick: () => void;
};

export function SchoolMapMarker({ school, onClick }: SchoolMapMarkerProps) {
  return (
    <Marker
      position={[school.lat, school.lng]}
      icon={schoolIcon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
