import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@govtechmy/myds-react/breadcrumb";
import { CheckIcon, ChevronRightIcon } from "@govtechmy/myds-react/icon";
import { useState, useEffect } from "react";
import { dataPilihLokasi } from "../../contentData";

interface LocationPickerWindowProps {
  onClose?: () => void;
  onLocationSelect?: (state: string, district: string) => void;
}

const getDistrictItemClasses = (isSelected: boolean) => 
  `bg-white border rounded-lg px-4 py-3 shadow-sm cursor-pointer focus:outline-none ${
    isSelected 
      ? "border-primary-600" 
      : "border-outline-200 hover:shadow-md"
  }`;

const StateFlagImage = ({ flagFile, name }: { flagFile: string; name: string }) => (
  <div className="rounded-sm overflow-hidden w-6 h-6 border-[1.5px] border-outline-200">
    <img 
      src={`/images/negeri/${flagFile}`} 
      alt={`Flag of ${name}`}
      className="h-full w-full object-cover"
    />
  </div>
);

export function LocationPickerWindow({ onClose, onLocationSelect }: LocationPickerWindowProps) {
  const [currentView, setCurrentView] = useState<'states' | 'districts'>('states');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentView === 'districts') {
          setCurrentView('states');
          setSelectedState(null);
          setSelectedDistrict(null);
        } else if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [currentView, onClose]);

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentView('districts');
  };

  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
  };

  const handleBackToStates = () => {
    setCurrentView('states');
    setSelectedState(null);
    setSelectedDistrict(null);
  };

  const handleConfirmSelection = () => {
    if (selectedState && selectedDistrict && onLocationSelect) {
      onLocationSelect(selectedState, selectedDistrict);
    }
    if (onClose) {
      onClose();
    }
  };

  const selectedStateData = selectedState ? dataPilihLokasi.find(state => state.name === selectedState) : null;
  const currentDistricts = selectedStateData ? selectedStateData.districts : [];

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-picker-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-auto sm:min-w-96 sm:max-w-md lg:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-outline-200">
          <h2 
            id="location-picker-title"
            className="font-heading text-body-lg font-semibold text-txt-black-900"
          >
            Pilih Lokasi Anda
          </h2>
          {onClose && (
            <Button
              variant="default-ghost"
              iconOnly
              size="small"
              onClick={onClose}
              aria-label="Close dialog"
            >
              <ButtonIcon>
                <span className="text-lg font-normal">×</span>
              </ButtonIcon>
            </Button>
          )}
        </div>
        
        {currentView === 'districts' && selectedState && (
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
                <BreadcrumbPage>
                  {selectedState}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        )}
        
        <div className="flex-1 overflow-hidden">
          <div className="p-4 pb-2 pr-2">
            <div className="w-full font-body pr-2">
              <div className="max-h-[calc(80vh-200px)] overflow-y-auto space-y-3 pb-4 pr-2 scrollbar-thin scrollbar-track-washed-100 scrollbar-thumb-outline-300">
                {currentView === 'states' ? (
                  dataPilihLokasi.map((state) => (
                    <div 
                      key={state.name} 
                      className="bg-white border border-outline-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md cursor-pointer focus:outline-none"
                      onClick={() => handleStateClick(state.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
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
                          <StateFlagImage flagFile={state.flagFile} name={state.name} />
                          <span className="font-medium text-body-sm text-txt-black-700">{state.name}</span>
                        </div>
                        <ChevronRightIcon className="h-5 w-5 text-txt-black-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  currentDistricts.map((district) => (
                    <div 
                      key={district} 
                      className={getDistrictItemClasses(selectedDistrict === district)}
                      onClick={() => handleDistrictClick(district)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDistrictClick(district);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`Select ${district}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-body-sm">{district}</span>
                        {selectedDistrict === district && (
                          <div className="text-primary-600">
                            <CheckIcon className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
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
          >
            Pilih Lokasi
          </Button>
        </div>
      </div>
    </div>
  );
}
