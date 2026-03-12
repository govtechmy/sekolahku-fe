import { Marker } from "react-leaflet";
import type { SchoolMarkerInfo } from "../../types/maps";
import {
  sekolahMarkerIcon,
  selectedSekolahMarkerIcon,
  parlimenMarkerIcon,
  negeriMarkerIcon,
  userMarkerIcon,
} from "../../icons/MapMarker";

type SchoolMapMarkerProps = {
  school: SchoolMarkerInfo;
  onClick: () => void;
  isSelected?: boolean;
};

export function SchoolMapMarker({
  school,
  onClick,
  isSelected = false,
}: SchoolMapMarkerProps) {
  let icon;

  switch (school.markerType) {
    case "USER":
      icon = userMarkerIcon;
      break;
    case "INDIVIDUAL":
      icon = isSelected ? selectedSekolahMarkerIcon : sekolahMarkerIcon;
      break;
    case "PARLIMEN":
      icon = parlimenMarkerIcon(school.total);
      break;
    case "NEGERI":
      icon = negeriMarkerIcon(school.total);
      break;
    case "WEST_EAST_MALAYSIA":
      icon = negeriMarkerIcon(school.total);
      break;
    default:
      icon = isSelected ? selectedSekolahMarkerIcon : sekolahMarkerIcon;
  }

  return (
    <Marker
      position={[school.koordinatXX, school.koordinatYY]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
}
