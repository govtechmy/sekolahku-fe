import { Marker } from "react-leaflet";
import type { SchoolMarkerInfo } from "../../types/maps";
import { sekolahMarkerIcon } from "../../icons/MapMarker";
import { parlimenMarkerIcon } from "../../icons/MapMarker";
import { negeriMarkerIcon } from "../../icons/MapMarker"; 

  
type SchoolMapMarkerProps = {
  school: SchoolMarkerInfo;
  onClick: () => void;
};

export function SchoolMapMarker({ school, onClick }: SchoolMapMarkerProps) {
  let icon;

  switch (school.markerType) {
    case "INDIVIDUAL":
      icon = sekolahMarkerIcon;
      break;
    case "PARLIMEN":
      icon = parlimenMarkerIcon;
      break;
    case "NEGERI":
      icon = negeriMarkerIcon;
      break;
    default:
      icon = sekolahMarkerIcon;
  }

  return (
    <Marker
      position={[school.koordinatXX, school.koordinatYY]}
      icon={icon as L.DivIcon | L.Icon<L.IconOptions>}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
