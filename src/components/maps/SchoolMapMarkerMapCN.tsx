import { memo } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { MarkerType } from "../../types/maps";
import { SekolahMarkerIcon } from "../../icons/SekolahMarkerIcon";
import { NegeriMarkerIcon } from "../../icons/NegeriMarkerIcon";
import { ParlimenMarkerIcon } from "../../icons/ParlimenMarkerIcon";
import { UserMarkerIcon } from "../../icons/UserMarkerIcon";

interface SchoolMapMarkerMapCNProps {
  id?: string;
  markerType: MarkerType;
  koordinatXX: number; // latitude
  koordinatYY: number; // longitude
  total?: number;
  isSelected?: boolean;
  onClick: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: (id: string) => void;
}

/**
 * Get the appropriate anchor for each marker type.
 * - INDIVIDUAL/USER: "bottom" — pin-style markers point down to the coordinate
 * - NEGERI/WEST_EAST_MALAYSIA/PARLIMEN: "center" — circular cluster markers centered on coordinate
 */
function getAnchor(markerType: MarkerType): "center" | "bottom" {
  switch (markerType) {
    case "USER":
      return "center";
    case "INDIVIDUAL":
      return "bottom";
    case "PARLIMEN":
    case "NEGERI":
    case "WEST_EAST_MALAYSIA":
      return "center";
    default:
      return "bottom";
  }
}

export const SchoolMapMarkerMapCN = memo(function SchoolMapMarkerMapCN({
  id = "",
  markerType,
  koordinatXX,
  koordinatYY,
  total,
  isSelected = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SchoolMapMarkerMapCNProps) {
  const renderIcon = () => {
    switch (markerType) {
      case "USER":
        return <UserMarkerIcon />;
      case "INDIVIDUAL":
        return SekolahMarkerIcon(undefined, isSelected);
      case "PARLIMEN":
        return ParlimenMarkerIcon(String(total ?? ""));
      case "NEGERI":
      case "WEST_EAST_MALAYSIA":
        return NegeriMarkerIcon(String(total ?? ""));
      default:
        return SekolahMarkerIcon(undefined, isSelected);
    }
  };

  return (
    <Marker
      longitude={koordinatYY}
      latitude={koordinatXX}
      anchor={getAnchor(markerType)}
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick(id);
      }}
    >
      <div
        onMouseEnter={() => onMouseEnter?.(id)}
        onMouseLeave={() => onMouseLeave?.(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick(id);
        }}
        aria-label={`Marker ${markerType}`}
        style={{ cursor: "pointer" }}
      >
        {renderIcon()}
      </div>
    </Marker>
  );
});
