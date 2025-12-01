import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect, useMemo, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { fetchSchools } from "../services/sekolah.svc";
import { MapSearchBar, SchoolInfoWindow } from "../components/maps";
import type { SchoolMarker } from "../types/maps";

// Type for API response
type SchoolApiResponse = {
  kodSekolah: string;
  location: [number, number]; // [lng, lat]
};

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom school icon
const schoolIcon = new L.Icon({
  iconUrl: "/images/iconSchool.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapEvents({ onCenterChange, onBoundsChange }: { 
  onCenterChange: (center: { lat: number; lng: number }) => void;
  onBoundsChange: (bounds: L.LatLngBounds) => void;
}) {
  useMapEvents({
    moveend: (e) => {
      const center = e.target.getCenter();
      const newCenter = { lat: center.lat, lng: center.lng };
      onCenterChange(newCenter);
      onBoundsChange(e.target.getBounds());
    },
    zoomend: (e) => {
      onBoundsChange(e.target.getBounds());
    },
  });
  return null;
}

function MapControls({ query, setQuery, setFilteredMarkers, markersToShow, setSelected }: {
  query: string;
  setQuery: (val: string) => void;
  setFilteredMarkers: (markers: SchoolMarker[]) => void;
  markersToShow: SchoolMarker[];
  setSelected: (marker: SchoolMarker | null) => void;
}) {
  const map = useMap();

  const panTo = (lat: number, lng: number) => {
    map.panTo([lat, lng]);
  };

  const setZoomLevel = (zoom: number) => {
    map.setZoom(zoom);
  };

  return (
    <MapSearchBar
      query={query}
      setQuery={setQuery}
      setFilteredMarkers={setFilteredMarkers}
      markersToShow={markersToShow}
      setSelected={setSelected}
      panTo={panTo}
      setZoom={setZoomLevel}
    />
  );
}

export default function SchoolMaps() {
  const initialPosition = useMemo(() => [4.1969, 101.2561] as [number, number], []);
  const [markersToShow, setMarkersToShow] = useState<SchoolMarker[]>([]);
  const [selected, setSelected] = useState<SchoolMarker | null>(null);
  const [query, setQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState<SchoolMarker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({ lat: initialPosition[0], lng: initialPosition[1] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

  // Function to load all schools
  const loadAllSchools = useCallback(async () => {
    try {
      setError(null);

      const schoolsData: SchoolApiResponse[] = await fetchSchools();
      
      if (!schoolsData) {
        console.warn("API returned null/undefined");
        setMarkersToShow([]);
        setFilteredMarkers([]);
        setError("No schools found.");
        return;
      }
      
      if (!Array.isArray(schoolsData)) {
        console.error("API did not return an array:", typeof schoolsData, schoolsData);
        setMarkersToShow([]);
        setFilteredMarkers([]);
        setError("Invalid response from server.");
        return;
      }
      
      if (schoolsData.length === 0) {
        setMarkersToShow([]);
        setFilteredMarkers([]);
        setError("No schools found.");
        return;
      }

      // Transform API response to SchoolMarker format
      const schools: SchoolMarker[] = schoolsData.map((school: SchoolApiResponse) => { 
        if (school.location[1] == null || school.location[0] == null) {
          return {
            kodSekolah: school.kodSekolah,
            lat: 0,
            lng: 0,
            namaSekolah: school.kodSekolah, // Use kodSekolah as fallback for namaSekolah
          }
        }
        return {
          kodSekolah: school.kodSekolah,
          lat: school.location[1], // location is [lng, lat], so lat is index 1
          lng: school.location[0], // lng is index 0
          namaSekolah: school.kodSekolah, // Use kodSekolah as fallback for namaSekolah
        }
      });
      
      setMarkersToShow(schools);
      setFilteredMarkers(schools);
    } catch (err) {
      console.error("Error loading schools:", err);
      
      let errorMessage = "Failed to load schools";
      if (err instanceof Error) {
        if (err.message.includes('Network Error') || err.message.includes('CORS')) {
          errorMessage = "Network error - unable to connect to school database";
        } else if (err.message.includes('timeout')) {
          errorMessage = "Request timed out - please try again";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setMarkersToShow([]);
      setFilteredMarkers([]);
    }
  }, []);

  // Get user's location and load all schools
  useEffect(() => {
    const getUserLocationAndLoadSchools = async () => {
      try {
        // Load all schools first
        await loadAllSchools();

        // Get user's current location for map centering
        if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes
            });
          });

          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const userCenter = { lat: userLat, lng: userLng };
          setUserLocation(userCenter);
        } else {
          throw new Error("Geolocation is not supported by this browser");
        }
      } catch (err) {
        console.error("Error getting location:", err);
        // Fallback to default location
        const defaultCenter = { lat: initialPosition[0], lng: initialPosition[1] };
        setUserLocation(defaultCenter);
      } finally {
        setLoading(false);
      }
    };

    getUserLocationAndLoadSchools();
  }, [initialPosition, loadAllSchools]);

  // Filter markers based on map bounds and search query
  const visibleMarkers = useMemo(() => {
    if (!mapBounds) return filteredMarkers;
    
    // Only show markers within current map bounds to improve performance
    return filteredMarkers.filter(marker => 
      mapBounds.contains([marker.lat, marker.lng])
    );
  }, [filteredMarkers, mapBounds]);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center" style={{ height: "750px", width: "100%" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative flex items-center justify-center" style={{ height: "750px", width: "100%" }}>
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-gray-600">Please check your location permissions and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: "750px", width: "100%" }}>
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : initialPosition}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        maxBounds={[[-10, 95], [10, 125]]} // Limit to Malaysia region
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
          minZoom={5}
        />
        <MapEvents
          onCenterChange={setUserLocation}
          onBoundsChange={setMapBounds}
        />
        <MapControls
          query={query}
          setQuery={setQuery}
          setFilteredMarkers={setFilteredMarkers}
          markersToShow={markersToShow}
          setSelected={setSelected}
        />
        <MarkerClusterGroup key={`markers-${visibleMarkers.length}`}>
          {visibleMarkers.map((pos) => (
            <Marker
              key={`${pos.kodSekolah}-${pos.lat}-${pos.lng}`}
              position={[pos.lat, pos.lng]}
              icon={schoolIcon}
              eventHandlers={{
                click: () => setSelected(pos),
              }}
            />
          ))}
        </MarkerClusterGroup>        {selected && (
          <Popup
            position={[selected.lat, selected.lng]}
            eventHandlers={{
              remove: () => {
                setSelected(null);
                setFilteredMarkers(markersToShow);
              },
            }}
          >
            <SchoolInfoWindow school={selected} />
          </Popup>
        )}
      </MapContainer>
    </div>
  );
}
