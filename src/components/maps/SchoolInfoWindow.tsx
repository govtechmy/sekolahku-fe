import {
  CrossIcon,
  EmailIcon,
  OrgChartIcon,
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
import underScoreRemover from "../../utils/underscoreRemover";

type SchoolInfoWindowProps = {
  school: ItemSekolahModel;
  setSelected: (marker: SearchBarMapProps | null) => void;
  mobile?: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
};

export function SchoolInfoWindow({
  school,
  setSelected,
  mobile,
  onToggleFullScreen,
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
      className="relative bg-white rounded-b-xl"
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
      <div className="flex justify-center items-center h-48 bg-white rounded-t-xl relative">
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={() => setSelected(null)}
            variant={"default-outline"}
            className="p-1.5"
          >
            <CrossIcon className="size-4" />
          </Button>
        </div>
        {mobile && (
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-10 h-1 bg-gray-500 rounded-full cursor-pointer"></div>
          </div>
        )}
        <img
          src={getSchoolLogoUrl(
            school.data.infoPentadbiran.negeri,
            school.data.infoPentadbiran.parlimen,
            school.kodSekolah,
          )}
          alt={school?.namaSekolah || "Sekolah"}
          className="max-h-32 w-auto object-contain"
          onError={handleImageError}
        />
      </div>
      <div className="p-3 flex flex-col gap-3 justify-start">
        <div>
          <Tag mode="pill" variant="success" className="font-normal">
            {school?.data?.infoSekolah?.jenisLabel || "Sekolah"}
          </Tag>
        </div>
        <div className="text-body-md font-semibold font-body">
          {school?.namaSekolah ?? ""}
        </div>
        <div className="flex flex-col gap-2 text-txt-black-700">
          <InfoIconRow
            icon={<OrgChartIcon />}
            value={school?.kodSekolah || "Tiada Maklumat"}
          />
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
            value={toTitleCase(formatSchoolAddress(school)) || "Tiada Maklumat"}
          />
        </div>
      </div>
      <div className="border-y border-otl-divider p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">JPN</div>
        <div className="flex gap-1 flex-col">
          <InfoRow
            label="Lokasi"
            value={
              underScoreRemover(school?.data?.infoPentadbiran?.negeri) ||
              "Tiada Maklumat"
            }
          />
          <InfoRow label="Status SKM" value={"Tiada Maklumat"} />
          <InfoRow label="Kategori Pedalaman" value={"Tiada Maklumat"} />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">PPD</div>
        <div className="flex gap-1 flex-col">
          <InfoRow
            label="Daerah"
            value={school?.data?.infoPentadbiran?.ppd || "Tiada Maklumat"}
          />
          {/* <InfoRow label="Gred" value={"Tiada Maklumat"} /> */}
          <InfoRow
            label="Sesi"
            value={school?.data?.infoPentadbiran?.sesi || "Tiada Maklumat"}
          />
          <InfoRow
            label="Jenis Bantuan"
            value={school?.data?.infoPentadbiran?.bantuan || "Tiada Maklumat"}
          />
          <InfoRow label="Tarikh Tubuh" value={"Tiada Maklumat"} />
        </div>
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
    </div>
  );
}
