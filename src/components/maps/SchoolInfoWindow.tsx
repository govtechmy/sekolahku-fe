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
  /** "horizontal" renders the wide bottom bar used on desktop to match the
   * pen.dev design; "vertical" (default) is the narrow sidebar/mobile card. */
  layout?: "vertical" | "horizontal";
};

// label | colon | value columns, so InfoRow labels and colons line up.
const FACT_GRID =
  "grid grid-cols-[max-content_max-content_minmax(0,1fr)] items-baseline gap-x-1.5 gap-y-2";

export function SchoolInfoWindow({
  school,
  setSelected,
  mobile,
  isFullScreen,
  onToggleFullScreen,
  layout = "vertical",
}: SchoolInfoWindowProps) {
  const navigate = useNavigate();
  const lang = localStorage.getItem("lang") || "ms";
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/utama/info-school-default.svg";
    e.currentTarget.className = "h-full w-full object-cover";
  };

  const logoUrl = getSchoolLogoUrl(
    school?.data?.infoPentadbiran?.negeri,
    school?.data?.infoPentadbiran?.parlimen,
    school?.kodSekolah,
  );
  const schoolName =
    `${school?.namaSekolah ?? "Sekolah"} ${school?.kodSekolah ?? ""}`.trim();
  const jenisLabel = school?.data?.infoSekolah?.jenisLabel || "Sekolah";
  const goToSchoolPage = () => {
    if (school?.kodSekolah) {
      navigate(`/${lang}/halaman-sekolah/${school.kodSekolah}`);
    }
  };
  const closeWindow = () => setSelected(null);

  const contactRows = (
    <>
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
    </>
  );

  const factColumnA = (
    <>
      <InfoRow
        label="JPN"
        value={
          school?.data?.infoPentadbiran?.negeri
            ? "JPN " +
              toTitleCase(underScoreRemover(school.data.infoPentadbiran.negeri))
            : "Tiada Maklumat"
        }
      />
      <InfoRow
        label="Lokasi"
        value={
          school?.data?.infoPentadbiran?.negeri
            ? toTitleCase(underScoreRemover(school.data.infoPentadbiran.negeri))
            : "Tiada Maklumat"
        }
      />
      <InfoRow
        label="PPD"
        value={toTitleCase(
          removePPD(school?.data?.infoPentadbiran?.ppd) || "Tiada Maklumat",
        )}
      />
    </>
  );

  const factColumnB = (
    <>
      <InfoRow
        label="Daerah"
        value={toTitleCase(
          school?.data?.infoKomunikasi?.bandarSurat || "Tiada Maklumat",
        )}
      />
      <InfoRow
        label="Sesi"
        value={toTitleCase(
          school?.data?.infoPentadbiran?.sesi || "Tiada Maklumat",
        )}
      />
      <InfoRow
        label="Bantuan"
        value={(() => {
          const bantuanCode = school?.data?.infoPentadbiran?.bantuan ?? "";
          const bantuanLabel = SCHOOL_JENIS_BANTUAN[bantuanCode];
          return bantuanLabel
            ? toTitleCase(bantuanLabel)
            : bantuanCode || "Tiada Maklumat";
        })()}
      />
    </>
  );

  if (layout === "horizontal") {
    return (
      <div className="relative flex items-stretch gap-6 rounded-xl bg-white p-5 shadow-lg">
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
            }}
            variant="default-outline"
            className="p-1.5"
          >
            <CrossIcon className="size-4" />
          </Button>
        </div>

        <div className="flex h-[100px] w-[100px] shrink-0 items-center justify-center overflow-hidden rounded-lg">
          <img
            src={logoUrl}
            alt={school?.namaSekolah ?? "Sekolah"}
            className="h-full w-full object-contain"
            onError={handleImageError}
          />
        </div>

        <div className="flex w-[300px] shrink-0 flex-col gap-2 pr-4">
          <Tag mode="pill" variant="success" className="w-fit font-normal">
            {jenisLabel}
          </Tag>
          <div className="line-clamp-2 text-body-md font-semibold font-body">
            {schoolName}
          </div>
          <div className="flex flex-col gap-1.5 text-txt-black-700">
            {contactRows}
          </div>
        </div>

        <div className="w-px shrink-0 bg-otl-divider" />

        <div className="flex flex-1 items-center px-4">
          <div className="flex w-full items-start gap-10">
            <div className={`${FACT_GRID} flex-1`}>{factColumnA}</div>
            <div className={`${FACT_GRID} flex-1`}>{factColumnB}</div>
          </div>
        </div>

        <div className="w-px shrink-0 bg-otl-divider" />

        <div className="flex w-[200px] shrink-0 items-center pl-4">
          <Button
            variant="primary-outline"
            className="w-full justify-center"
            onClick={goToSchoolPage}
          >
            Lihat Lanjut
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white rounded-b-xl ${isFullScreen ? "min-h-full" : ""}`}
    >
      <div className="flex justify-center items-center h-48 bg-white rounded-t-xl relative">
        <div className="absolute top-2 right-2 z-10">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow();
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
          src={logoUrl}
          alt={school?.namaSekolah ?? "Sekolah"}
          className="max-h-32 w-auto object-contain"
          onError={handleImageError}
        />
      </div>
      <div className="p-2 w-full">
        <Button
          variant="primary-outline"
          className="w-full justify-center"
          onClick={goToSchoolPage}
        >
          Lihat Lanjut
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
            {jenisLabel}
          </Tag>
        </div>
        <div className="text-body-md font-semibold font-body">{schoolName}</div>
        <div className="flex flex-col gap-2 text-txt-black-700">
          {contactRows}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2 border-t border-otl-divider">
        <div className={FACT_GRID}>
          {factColumnA}
          {factColumnB}
        </div>
      </div>
    </div>
  );
}
