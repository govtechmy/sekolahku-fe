import { PinIcon, ArrowForwardIcon } from "@govtechmy/myds-react/icon";
import type { ItemSekolahModel } from "../../models/response";

interface NearbySchoolCardCompactProps {
  school: ItemSekolahModel;
  distanceKm?: number;
  url: string;
  onClick: (schoolId: string) => void;
}

export default function NearbySchoolCardCompact({
  school,
  distanceKm,
  url,
  onClick,
}: NearbySchoolCardCompactProps) {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/utama/nearby-school-default.svg";
  };

  return (
    <div
      className="bg-bg-white outline-otl-divider flex h-full w-full cursor-pointer flex-col justify-between gap-2 rounded-2xl p-4 outline transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-otl-primary-200 focus:outline-primary-200"
      onClick={() => onClick(school.kodSekolah)}
      role="button"
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick(school.kodSekolah);
      }}
      tabIndex={0}
      aria-label={school.namaSekolah}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-white">
          <img
            src={url || "/utama/nearby-school-default.svg"}
            alt={school.namaSekolah}
            className="size-full object-contain"
            onError={handleImageError}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <h3 className="font-body line-clamp-2 text-[13px] font-bold text-txt-black-900">
            {school.namaSekolah}
          </h3>
          <p className="font-body truncate text-[11px] text-txt-black-500">
            {school.data.infoSekolah.jenisLabel}
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        {distanceKm != null ? (
          <div className="flex items-center gap-1">
            <PinIcon className="size-3 text-[#0062FF]" />
            <span className="font-body text-xs font-semibold text-[#0062FF]">
              {distanceKm.toFixed(1)} km
            </span>
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-0.5">
          <span className="font-body text-xs font-semibold text-[#0062FF]">
            Lihat profil
          </span>
          <ArrowForwardIcon className="size-3 text-[#0062FF]" />
        </div>
      </div>
    </div>
  );
}
