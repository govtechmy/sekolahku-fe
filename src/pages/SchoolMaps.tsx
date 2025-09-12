import { APIProvider, Map, AdvancedMarker, InfoWindow, useMap } from "@vis.gl/react-google-maps";
import { useMemo, useState } from "react";
import { schoolMarkers } from "../components/schoolMarkers"; //temp data
import {
  PhoneIcon,
  MapIcon,
  OrgChartIcon,
  EmailIcon,
  SearchIcon,
  CrossIcon,
  ChevronRightIcon,
  ArrowBackIcon,
} from "@govtechmy/myds-react/icon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@govtechmy/myds-react/select";

type SchoolMarker = {
  lat: number;
  lng: number;
  namaSekolah: string;
  kodSekolah?: string;
  noTelefon?: string;
  email?: string;
  alamatSurat?: string;
  poskodSurat?: string;
  bandarSurat?: string;
  negeri?: string;
  jenisLabel?: string;
  kluster?: string;
  lokasi?: string;
  skm_150?: boolean;
  ppd?: string;
  gred?: string;
  sesi?: string;
  bantuan?: string;
  tarikhTubuh?: string;
  distance?: number;
};

type SearchBarProps = {
  query: string;
  setQuery: (val: string) => void;
  setFilteredMarkers: (markers: SchoolMarker[]) => void;
  markersToShow: SchoolMarker[];
  setSelected: (marker: SchoolMarker | null) => void;
};

function SearchBar({ query, setQuery, setFilteredMarkers, markersToShow, setSelected }: SearchBarProps) {
  const map = useMap();
  const [suggestions, setSuggestions] = useState<SchoolMarker[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [selectedNegeri, setSelectedNegeri] = useState("");
  const [selectedJenis, setSelectedJenis] = useState("");

  const negeriList = useMemo(() => {
    const unique = Array.from(new Set(markersToShow.map((m: SchoolMarker) => m.negeri).filter(Boolean)));
    return unique;
  }, [markersToShow]);

  const jenisList = Array.from(new Set(markersToShow.map((m: SchoolMarker) => m.jenisLabel))).sort();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelected(null);

    filterMarkers(value, selectedNegeri, selectedJenis);
  };

  const filterMarkers = (value: string, negeri: string, jenis: string) => {
    let filtered = markersToShow;

    if (value) {
      filtered = filtered.filter((marker: SchoolMarker) =>
        marker.namaSekolah.toLowerCase().includes(value.toLowerCase())
      );
    }

    if (negeri && negeri !== "all") {
      filtered = filtered.filter((marker: SchoolMarker) => marker.negeri === negeri);
    }

    if (jenis && jenis !== "all") {
      filtered = filtered.filter((marker: SchoolMarker) => marker.jenisLabel === jenis);
    }

    setFilteredMarkers(filtered);
    setSuggestions(filtered);
  };


  const handleSelect = (school: SchoolMarker) => {
    setQuery(school.namaSekolah);
    setFilteredMarkers([school]);
    setSelected(school);
    map?.panTo({ lat: school.lat, lng: school.lng });
    map?.setZoom(14);
    setSuggestions([school]);
  };

  return (
    <div
      className={`absolute flex justify-start pointer-events-none w-[350px] transition-all 
        ${isExpanded ? "top-0 left-0" : "top-2 left-2"}
      `}
    >
      <div
        className={`w-full pointer-events-auto shadow-md border border-gray-200 bg-white 
          ${isExpanded ? "" : "rounded-full cursor-pointer"}
        `}
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        <div className="relative">
          <div className="flex items-center px-3 py-2 gap-2">
            {isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(false);
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowBackIcon className="w-5 h-5" />
              </button>
            )}

            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Carian Sekolah"
              className="flex-1 px-2 text-sm text-gray-700 focus:outline-none"
              readOnly={!isExpanded}
            />

            {isExpanded && (
              <button
                onClick={() => {
                  setQuery("");
                  setFilteredMarkers(markersToShow);
                  setSuggestions([]);
                  setSelected(null);
                  setSelectedNegeri("all");
                  setSelectedJenis("all");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <CrossIcon className="w-4 h-4" />
              </button>
            )}

            <div className="flex bg-bg-primary-600 items-center justify-center rounded-full p-1.5">
              <SearchIcon className="w-4 h-4 text-txt-white" />
            </div>
          </div>

          {isExpanded && (
            <div className="px-3 py-2 border-t border-gray-200 flex gap-2 text-sm">
              <Select
                size="small"
                variant="outline"
                onValueChange={(val) => {
                  setSelectedNegeri(val);
                  filterMarkers(query, val, selectedJenis); 
                }}
                value={selectedNegeri}
              >
                <SelectTrigger 
                  aria-label="Pilih Negeri"
                  className="w-[155px] justify-between"
                >
                  <SelectValue placeholder="Jenis Negeri" />
                </SelectTrigger>
                <SelectContent
                >
                  <SelectGroup >
                    <SelectItem value="all">Semua Negeri</SelectItem>
                    {negeriList
                      .filter((n): n is string => typeof n === "string")
                      .map((n, idx) => (
                        <SelectItem key={idx} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select
                size="small"
                variant="outline"
                onValueChange={(val) => {
                  setSelectedJenis(val);
                  filterMarkers(query, selectedNegeri, val);
                }}
                value={selectedJenis}
              >
                <SelectTrigger 
                  aria-label="Pilih Jenis"
                  className="w-[155px] justify-between"
                >
                  <SelectValue placeholder="Jenis Sekolah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {jenisList
                      .filter((x): x is string => typeof x === "string")
                      .map((x, idx: number) => (
                        <SelectItem key={idx} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}

          {isExpanded && (
            <ul className="w-full bg-white rounded-b-md shadow-lg h-[660px] overflow-y-auto border-t border-gray-200">
              {suggestions.length > 0 ? (
                suggestions.map((school, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelect(school)}
                    className="px-4 py-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-txt-primary bg-bg-primary-100 px-2 py-0.5 rounded-full w-fit mb-1 border border-bg-primary-700">
                          {school.jenisLabel || "Sekolah"}
                        </span>

                        <span className="text-base font-medium text-gray-900">
                          {school.namaSekolah}
                        </span>

                        <span className="text-sm text-gray-500">
                          {school.bandarSurat}, {school.negeri}
                        </span>

                        <span className="mt-1 flex items-center text-sm text-blue-600 gap-1">
                          <MapIcon className="w-4 h-4" />
                          {school.distance
                            ? `${school.distance.toFixed(2)} km dari lokasi anda`
                            : "Jarak tidak tersedia"}
                        </span>
                      </div>

                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 text-sm text-gray-500">Tiada hasil carian</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

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
            <AdvancedMarker
              key={index}
              position={{ lat: pos.lat, lng: pos.lng }}
              onClick={() => setSelected(pos)}
            >
              <img
                src={"/images/iconSchool.png"}
                alt="School"
                style={{ width: 32, height: 32 }}
              />
            </AdvancedMarker>
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
              <div className="pl-3 w-full max-w-[500px] md:max-w-[500px] sm:max-w-[95vw] font-roboto shadow-lg bg-white flex flex-col rounded-md">
                <div className="flex flex-col md:flex-row">
                  <div className="w-[225px] h-[220px] flex-shrink-0">
                    <img
                      src="/images/sekDefault.png"
                      alt={selected?.namaSekolah || "Sekolah"}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 flex flex-col px-3 py-1">
                    <div className="mb-2 bg-bg-success-50 text-txt-success text-xs font-normal px-2 py-1 rounded-full border border-bg-success-700 text-center">
                      {selected?.kluster || "Sekolah Kluster Kecemerlangan"}
                    </div>

                    <h3 className="text-[16px] md:text-[18px] font-medium text-[#202124] leading-snug mb-1">
                      {selected?.namaSekolah || "Maktab Sultan Abu Bakar"}{" "}
                      {selected?.jenisLabel ? `(${selected.jenisLabel})` : "(English College)"}
                    </h3>

                      <p className="my-2 flex items-center gap-2">
                       <OrgChartIcon className="text-txt-primary"/>
                      {selected?.kodSekolah || "Tiada Maklumat"}
                     </p>
                      <p className="my-1 flex items-center gap-2">
                        <PhoneIcon className="text-txt-primary" />
                        {selected?.noTelefon || "Tiada Maklumat"}
                      </p>
                      <p className="my-1 flex items-center gap-2">
                        <EmailIcon className="text-txt-primary" />
                        {selected?.email || "Tiada Maklumat"}
                      </p>
                      <p className="my-1 flex items-start gap-2">
                        <MapIcon className="text-txt-primary" />
                        {selected
                          ? `${selected.alamatSurat}, ${selected.poskodSurat} ${selected.bandarSurat}, ${selected.negeri}`
                          : "Tiada Maklumat"}
                      </p>

                    {/* <div className="mt-3">
                      <a
                        href="https://www.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-[#1a73e8] text-white py-2 px-3 rounded-md no-underline font-medium text-[14px] w-full"
                      >
                        <ArrowOutgoingIcon className="mr-2 w-4 h-4" />
                        Lihat Laman Web
                      </a>
                    </div> */}
                  </div>
                </div>

                <hr className="border-t border-[#dadce0] my-2" />

                <div className="flex flex-col sm:flex-row px-1 pb-4 text-[13px] gap-1 text-txt-black-500">
                  <div className="flex-1">
                    <div className="font-bold mb-2 text-[#202124]">JPN</div>
                    <p className="my-1">
                      <span className="pr-2">Lokasi:</span>
                      <span className="font-bold">{selected?.lokasi || "Tiada Maklumat"}</span>
                    </p>
                    <p className="my-1">
                      <span className="pr-2">Status SKM:</span>
                      <span className="font-bold">{selected?.skm_150 ? "Ya" : "Tidak"}</span>
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="font-bold mb-2 text-[#202124]">PPD</div>
                    <p className="my-1">
                      <span className="pr-2">Daerah:</span>
                      <span className="font-bold">{selected?.ppd || "Tiada Maklumat"}</span>
                    </p>
                    <p className="my-1">
                      <span className="pr-2">Gred:</span>
                      <span className="font-bold">{selected?.gred || "Tiada Maklumat"}</span>
                    </p>
                    <p className="my-1">
                      <span className="pr-2">Sesi:</span>
                      <span className="font-bold">{selected?.sesi || "Tiada Maklumat"}</span>
                    </p>
                    <p className="my-1">
                      <span className="pr-2">Jenis Bantuan:</span>
                      <span className="font-bold">{selected?.bantuan || "Tiada Maklumat"}</span>
                    </p>
                    <p className="my-1">
                      <span className="pr-2">Tarikh Tubuh:</span>
                      <span className="font-bold">{selected?.tarikhTubuh || "Tiada Maklumat"}</span>
                    </p>
                  </div>
                </div>
              </div>
            </InfoWindow>

          )}
        </Map>

        <SearchBar
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
