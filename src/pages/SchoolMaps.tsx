import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { useMemo, useState } from "react";
import { schoolMarkers } from "../components/schoolMarkers"; //temp data
import { MapSearchBar, SchoolInfoWindow, SchoolMapMarker } from "../components/maps";
import type { SchoolMarker } from "../types/maps";

export default function SchoolMaps() {
  const initialPosition = { lat: 4.1969, lng: 101.2561 };
  const markersToShow = useMemo(() => schoolMarkers, []);
  const [selected, setSelected] = useState<SchoolMarker | null>(null);
  const [query, setQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState<SchoolMarker[]>(markersToShow);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(initialPosition);
  const [zoom, setZoom] = useState(7);

  console.log("User Location:", userLocation);// for future use
  console.log("Map Zoom Level:", zoom);// for future use

  return (
    <div className="relative" style={{ height: "750px", width: "100%" }}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
        <Map
          defaultCenter={initialPosition}
          defaultZoom={7}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          gestureHandling="greedy"
          zoomControl={true}
          streetViewControl={false}
          mapTypeControl={false}
          fullscreenControl={false}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
          onCenterChanged={(e) => {
            const center = e.detail.center;
            setUserLocation(center);
          }}
        >
          {filteredMarkers.map((pos, index) => (
            <SchoolMapMarker
              key={index}
              school={pos}
              onClick={() => setSelected(pos)}
            />
          ))}
          
          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => {
                setSelected(null);
                setFilteredMarkers(markersToShow);
              }}
              disableAutoPan={false}
            >
              <SchoolInfoWindow school={selected} />
            </InfoWindow>
          )}
        </Map>

        <MapSearchBar
          query={query}
          setQuery={setQuery}
          setFilteredMarkers={setFilteredMarkers}
          markersToShow={markersToShow}
          setSelected={setSelected}
        />
      </APIProvider>
    </div>
  );
}
