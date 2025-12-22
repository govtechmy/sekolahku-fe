import { Button } from "@govtechmy/myds-react/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
import {
  CheckIcon,
  ChevronRightIcon,
} from "@govtechmy/myds-react/icon";
import { useState } from "react";
import { useMapViewStore } from "../../store/mapView";
import { dataPilihLokasi } from "../../contentData";
import StateFlagImage from "../../icons/StateFlagIcon";
import { clx } from "@govtechmy/myds-react/utils";

interface LocationPickerWindowProps {
  onClose: () => void; 
}

type DistrictEntry = Record<string, [number, number]>;

export function LocationPickerWindow({
  onClose,
}: LocationPickerWindowProps) {
  const { setCenter, setZoom, setInitialLocationSet, setInitialLocationUser } = useMapViewStore();
  const [currentView, setCurrentView] = useState<"states" | "districts">("states");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);


  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentView("districts");
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

    // Find the selected district entry and extract coordinates
    const stateData = dataPilihLokasi.find((s) => s.name === selectedState);
    const entry = stateData?.districts.find((d) => Object.keys(d)[0] === selectedDistrict) as DistrictEntry | undefined;
    const coords = entry ? (Object.values(entry)[0] as [number, number]) : null;

    if (coords) {
      setCenter(coords);
      setInitialLocationUser(coords)
      setZoom(15);
      onClose();
      setInitialLocationSet(true);
    }

  };

  const selectedStateData = selectedState
    ? dataPilihLokasi.find((state) => state.name === selectedState)
    : null;
  const currentDistricts: DistrictEntry[] = selectedStateData ? (selectedStateData.districts as unknown as DistrictEntry[]) : [];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-auto sm:min-w-96 sm:max-w-md lg:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center p-6 pb-4.5 border-b border-outline-200">
          <h2
            id="location-picker-title"
            className="font-heading text-body-lg font-semibold text-txt-black-900"
          >
            Pilih Lokasi Anda
          </h2>
        </div>

        {currentView === "districts" && selectedState && (
          <div className="px-4 pt-3 pb-2">
            <Breadcrumb className="text-xs text-dim">
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
                <BreadcrumbPage>{selectedState}</BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          <div>
            <div className="w-full font-body px-4 py-2">
              <div className="overflow-y-auto max-h-[calc(80vh-200px)]  space-y-3">
                {currentView === "states"
                  ? dataPilihLokasi.map((state) => (
                      <div
                        key={state.name}
                        className="bg-white border border-otl-gray-200 rounded-lg px-3 py-2 shadow-sm hover:shadow-md cursor-pointer focus:outline-none scroll"
                        onClick={() => handleStateClick(state.name)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleStateClick(state.name);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select ${state.name}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <StateFlagImage
                              flagFile={state.flagFile}
                              name={state.name}
                            />
                            <span className="font-medium text-body-sm text-txt-black-700">
                              {state.name}
                            </span>
                          </div>
                          <ChevronRightIcon className="h-5 w-5 text-txt-black-500" />
                        </div>
                      </div>
                    ))
                    : currentDistricts.map((districtObj) => {
                      const district = Object.keys(districtObj)[0];
                      return (
                      <div
                        key={district}
                        className={clx(
                          "bg-white border rounded-lg px-4 py-3 shadow-sm cursor-pointer focus:outline-none",
                          selectedDistrict === district
                            ? "border-primary-600"
                            : "border-otl-gray-200 hover:shadow-md"
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
                          <span className="font-medium text-body-sm">
                            {district}
                          </span>
                          {selectedDistrict === district && (
                            <div className="text-primary-600">
                              <CheckIcon className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                      );
                    })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-outline-200 bg-washed-100">
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
