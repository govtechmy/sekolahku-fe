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

  // Check if Google Maps API keys are available
  const hasGoogleMapsKeys = import.meta.env.VITE_GOOGLE_MAPS_KEY && 
                           import.meta.env.VITE_GOOGLE_MAPS_ID && 
                           import.meta.env.VITE_GOOGLE_MAPS_KEY !== "" && 
                           import.meta.env.VITE_GOOGLE_MAPS_ID !== "";

  console.log("User Location:", userLocation);// for future use
  console.log("Map Zoom Level:", zoom);// for future use

  // If no API keys, show iframe with same settings as Google Maps component
  if (!hasGoogleMapsKeys) {
    return (
      <div className="relative" style={{ height: "750px", width: "100%" }}>
        {/* Google Maps iframe matching Map component settings:
            - zoomControl: true (zoom +/- buttons enabled)
            - streetViewControl: false (no street view control)
            - mapTypeControl: false (no map/satellite toggle)
            - fullscreenControl: false (no fullscreen button)
            - gestureHandling: greedy (pan/zoom with mouse)
        */}
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1018097.7281356298!2d101.2561!3d4.1969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1699123456789!5m2!1sen!2sus&amp;t=m&amp;z=7&amp;output=embed&amp;iwloc=near"
          className="w-full h-full border-0"
          title="Malaysia Schools Demo"
          loading="lazy"
          allowFullScreen={false}
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            background: '#f0f9ff',
            pointerEvents: 'none',
            filter: 'saturate(0.9)'
          }}
        />
        
        {/* Overlay to hide any remaining UI elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Hide bottom attribution */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent"></div>
          {/* Hide top-right controls */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-white/60 to-transparent"></div>
        </div>
        
        <MapSearchBar
          query={query}
          setQuery={setQuery}
          setFilteredMarkers={setFilteredMarkers}
          markersToShow={markersToShow}
          setSelected={setSelected}
        />
      </div>
    );
  }

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
