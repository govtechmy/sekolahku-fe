import { AdvancedMarker } from "@vis.gl/react-google-maps";
import type { SchoolMarker } from "../../types/maps";

type SchoolMapMarkerProps = {
  school: SchoolMarker;
  onClick: () => void;
};

export function SchoolMapMarker({ school, onClick }: SchoolMapMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat: school.lat, lng: school.lng }}
      onClick={onClick}
    >
      <img
        src={"/images/iconSchool.png"}
        alt="School"
        style={{ width: 32, height: 32 }}
      />
    </AdvancedMarker>
  );
}
