import { Button } from "@govtechmy/myds-react/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
import {
  CheckCircleFillIcon,
  ChevronRightIcon,
} from "@govtechmy/myds-react/icon";
import { useState, useRef } from "react";
import { useMapViewStore } from "../../store/mapView";
import { NEGERI_LIST } from "../../contentData";
import StateFlagImage from "../../icons/StateFlagIcon";
import { getMapParlimenCenteroid } from "../../services/map.svc";
import { toTitleCase } from "../../utils/titleCaseConverter";
import { Spinner } from "@govtechmy/myds-react/spinner";
import { clx } from "@govtechmy/myds-react/utils";
import { useLocationSessionStore } from "../../store/locationSession";

type ParlimenCenteroidProps = {
  [district: string]: [number, number];
};

export function LocationPickerWindow() {
  // cache using useRef for negeri based data
  const negeriDistrictCache = useRef<{
    [state: string]: ParlimenCenteroidProps[];
  }>({});
  const {
    setCenter,
    setZoom,
    setInitialLocationSet,

    setUserMarkers,
  } = useMapViewStore();

  const { setInitialLocationUser } = useLocationSessionStore();
  const [currentView, setCurrentView] = useState<"states" | "districts">(
    "states",
  );
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [mapParlimenCenteroid, setMapParlimenCenteroid] = useState<
    ParlimenCenteroidProps[]
  >([]);

  // setting cache here
  const handleStateClick = async (stateName: string) => {
    setSelectedState(stateName);
    if (negeriDistrictCache.current[stateName]) {
      setMapParlimenCenteroid(negeriDistrictCache.current[stateName]);
      setCurrentView("districts");
    } else {
      // Trigger loading while fetching
      setMapParlimenCenteroid([]);
      setCurrentView("districts");
      const dataParlimenCenteroid = await getMapParlimenCenteroid(stateName);
      negeriDistrictCache.current[stateName] = dataParlimenCenteroid;
      setMapParlimenCenteroid(dataParlimenCenteroid);
    }
  };

  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  const handleBackToStates = () => {
    setCurrentView("states");
    setSelectedState(null);
    setSelectedDistrict(null);
  };

  const handleConfirmSelection = () => {
    if (!selectedState || !selectedDistrict) return;

    // Find the selected district entry and extract coordinates from mapParlimenCenteroid
    const dataCenteroid = mapParlimenCenteroid.find(
      (data) => Object.keys(data)[0] === selectedDistrict,
    );
    const coords = dataCenteroid
      ? (Object.values(dataCenteroid)[0] as [number, number])
      : null;

    if (coords) {
      setCenter(coords);
      setInitialLocationUser(coords);
      setUserMarkers((prev) => {
        const next = new Map(prev);
        next.clear();
        next.set("user", {
          koordinatXX: coords[0],
          koordinatYY: coords[1],
          dataUrl: "",
          markerType: "USER",
        });
        return next;
      });
      setZoom(14);
      setInitialLocationSet(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      <div className="bg-white rounded-lg w-full sm:w-auto sm:min-w-96 sm:max-w-md lg:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center p-6 pb-4.5 border-b border-otl-gray-200">
          <h2 className="font-heading text-body-lg font-semibold text-txt-black-900">
            Pilih Lokasi Anda
          </h2>
        </div>

        {currentView === "districts" && selectedState && (
          <div className="px-6 py-6">
            <Breadcrumb className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={handleBackToStates}
                  className="cursor-pointer hover:text-primary-600"
                >
                  Pilih Lokasi
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{toTitleCase(selectedState)}</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <div>
            <div className="w-full font-body pl-6 pr-1 pb-0">
              <div
                className={clx(
                  "pt-6 overflow-y-auto max-h-[calc(80vh-200px)] space-y-3 pr-5",
                  currentView === "districts" && "pt-0 pb-8",
                )}
              >
                {currentView === "states" &&
                  NEGERI_LIST.map((negeri, index) => (
                    <div
                      key={index}
                      className="bg-white border border-otl-gray-200 rounded-lg px-3 py-2 cursor-pointer focus:outline-none scroll"
                      onClick={() => handleStateClick(negeri)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleStateClick(negeri);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select ${negeri}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StateFlagImage
                            flagFile={`Flag_of_${toTitleCase(negeri)}.svg`}
                            name={toTitleCase(negeri)}
                          />
                          <span className="font-medium text-body-md text-txt-black-700">
                            {toTitleCase(negeri)}
                          </span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-txt-black-500" />
                      </div>
                    </div>
                  ))}

                {currentView === "districts" &&
                  mapParlimenCenteroid.map((centroid) => {
                    const district = Object.keys(centroid)[0];
                    return (
                      <div
                        key={district}
                        className={clx(
                          "bg-white border rounded-lg px-3 py-2 cursor-pointer focus:outline-none border-otl-gray-200",
                          selectedDistrict === district && "border-primary-600",
                        )}
                        onClick={() => handleDistrictClick(district)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleDistrictClick(district);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${district}`}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={clx(
                              "font-medium text-body-md text-txt-black-700",
                              selectedDistrict === district &&
                                "text-txt-primary",
                            )}
                          >
                            {toTitleCase(district)}
                          </span>
                          {selectedDistrict === district && (
                            <div className="text-primary-600">
                              <CheckCircleFillIcon className="size-5" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {currentView === "districts" &&
                  mapParlimenCenteroid.length === 0 && (
                    <div className="flex items-center justify-center gap-2 text-body-md font-medium">
                      Loading <Spinner />
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-6">
          <Button
            variant="primary-fill"
            size="small"
            onClick={handleConfirmSelection}
            className="font-medium w-full flex items-center justify-center text-body-md"
            disabled={!selectedState || !selectedDistrict}
          >
            Pilih Lokasi
          </Button>
        </div>
      </div>
    </div>
  );
}
