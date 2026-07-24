import {
  CrossIcon,
  EmailIcon,
  PhoneIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import { Tag } from "@govtechmy/myds-react/tag";
import { toTitleCase } from "../../utils/titleCaseConverter";
import { Button } from "@govtechmy/myds-react/button";
import { InfoIconRow, InfoRow } from "../shared/CardInfo";
import type { ItemSekolahModel } from "../../models/response";
import type { SearchBarMapProps } from "../../types/maps";
import { useNavigate } from "react-router-dom";
import {
  formatSchoolAddress,
  getSchoolLogoUrl,
} from "../../utils/schoolHelpers";
import { removePPD } from "../../utils/ppdRemover";
import { SCHOOL_JENIS_BANTUAN } from "../../constants/schoolTypes";
import underScoreRemover from "../../utils/underscoreRemover";
import SekolahAngkatMadaniImage from "../../icons/SekolahAngkatMadaniImage";

type SchoolInfoWindowProps = {
  school: ItemSekolahModel;
  setSelected: (marker: SearchBarMapProps | null) => void;
  mobile?: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  searchQuery?: string;
};

/**
 * Highlights matching text portions by wrapping them in a styled <mark> element.
 */
function highlightMatch(text: string, query?: string): React.ReactNode {
  if (!query || query.trim().length < 2) return text;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-gray-900 rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function SchoolInfoWindow({
  school,
  setSelected,
  mobile,
  isFullScreen,
  onToggleFullScreen,
  searchQuery,
}: SchoolInfoWindowProps) {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "ms";
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/utama/info-school-default.svg";
    e.currentTarget.className = "h-full w-full object-cover";
  };

  return (
    <div
      className={`relative bg-white rounded-b-xl ${isFullScreen ? "min-h-full" : ""}`}
    >
      <div className="flex justify-center items-center h-48 bg-white rounded-t-xl relative">
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setSelected(null);
            }}
            variant={"default-outline"}
            className="p-1.5"
          >
            <CrossIcon className="size-4" />
          </Button>
        </div>
        {mobile && (
          <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
            onClick={() => {
              if (onToggleFullScreen) {
                onToggleFullScreen();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (onToggleFullScreen) {
                  onToggleFullScreen();
                }
              }
            }}
            role="button"
            aria-label="Toggle fullscreen school info window"
            tabIndex={0}
          >
            <div className="w-10 h-1 bg-gray-500 rounded-full"></div>
          </div>
        )}
        <img
          src={getSchoolLogoUrl(
            school?.data?.infoPentadbiran?.negeri,
            school?.data?.infoPentadbiran?.parlimen,
            school?.kodSekolah,
          )}
          alt={school?.namaSekolah ?? "Sekolah"}
          className="max-h-32 w-auto object-contain"
          onError={handleImageError}
        />
      </div>
      <div className="p-2 w-full">
        <Button
          variant="primary-outline"
          className="w-full justify-center"
          onClick={() => {
            if (school?.kodSekolah) {
              navigate(`/${lang}/halaman-sekolah/${school.kodSekolah}`);
            }
          }}
        >
          Lihat Laman Web
        </Button>
      </div>
      {school?.isSekolahAngkatMADANI && (
        <div className="items-center justify-center flex pt-3">
          <SekolahAngkatMadaniImage />
        </div>
      )}
      <div className="p-3 flex flex-col gap-3 justify-start">
        <div>
          <Tag mode="pill" variant="success" className="font-normal">
            {school?.data?.infoSekolah?.jenisLabel || "Sekolah"}
          </Tag>
        </div>
        <div className="text-body-md font-semibold font-body">
          {highlightMatch(
            `${school?.namaSekolah ?? "Sekolah"} ${school?.kodSekolah ?? ""}`.trim(),
            searchQuery,
          )}
        </div>
        <div className="flex flex-col gap-2 text-txt-black-700">
          <InfoIconRow
            icon={<PhoneIcon />}
            value={school?.data?.infoKomunikasi?.noTelefon || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<EmailIcon />}
            value={school?.data?.infoKomunikasi?.email || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<PinIcon />}
            value={highlightMatch(
              toTitleCase(formatSchoolAddress(school)) || "Tiada Maklumat",
              searchQuery,
            )}
          />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 border-t border-otl-divider">
        <div className="flex gap-1 flex-col">
          <InfoRow
            label="JPN"
            value={
              school?.data?.infoPentadbiran?.negeri
                ? underScoreRemover("JPN " + school.data.infoPentadbiran.negeri)
                : "Tiada Maklumat"
            }
          />
          <InfoRow
            label="Lokasi"
            value={highlightMatch(
              school?.data?.infoPentadbiran?.negeri
                ? underScoreRemover(school.data.infoPentadbiran.negeri)
                : "Tiada Maklumat",
              searchQuery,
            )}
          />
          <InfoRow
            label="PPD"
            value={
              removePPD(school?.data?.infoPentadbiran?.ppd) || "Tiada Maklumat"
            }
          />
          <InfoRow
            label="Daerah"
            value={highlightMatch(
              school?.data?.infoKomunikasi.bandarSurat || "Tiada Maklumat",
              searchQuery,
            )}
          />
          <InfoRow
            label="Sesi"
            value={school?.data?.infoPentadbiran?.sesi || "Tiada Maklumat"}
          />
          <InfoRow
            label="Bantuan"
            value={
              (SCHOOL_JENIS_BANTUAN[
                school?.data?.infoPentadbiran?.bantuan ?? ""
              ] ??
                school?.data?.infoPentadbiran?.bantuan) ||
              "Tiada Maklumat"
            }
          />
        </div>
      </div>
    </div>
  );
}
