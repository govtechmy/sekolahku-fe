import {
  PhoneIcon,
  MapIcon,
  OrgChartIcon,
  EmailIcon,
} from "@govtechmy/myds-react/icon";
import type { SchoolMarker } from "../../types/maps";

type SchoolInfoWindowProps = {
  school: SchoolMarker;
};

export function SchoolInfoWindow({ school }: SchoolInfoWindowProps) {
  return (
    <div className="pl-3 w-full max-w-[500px] md:max-w-[500px] sm:max-w-[95vw] font-roboto shadow-lg bg-white flex flex-col rounded-md">
      <div className="flex flex-col md:flex-row">
        <div className="w-[225px] h-[220px] flex-shrink-0">
          <img
            src="/images/sekDefault.png"
            alt={school?.namaSekolah || "Sekolah"}
            className="w-full h-full object-cover rounded-md"
          />
        </div>

        <div className="flex-1 flex flex-col px-3 py-1">
          <div className="mb-2 bg-bg-success-50 text-txt-success text-xs font-normal px-2 py-1 rounded-full border border-bg-success-700 text-center">
            {school?.kluster || "Tiada Maklumat"}
          </div>

          <h3 className="text-[16px] md:text-[18px] font-medium text-[#202124] leading-snug mb-1">
            {school?.namaSekolah || "Maktab Sultan Abu Bakar"}{" "}
            {school?.jenisLabel ? `(${school.jenisLabel})` : "(Tiada Maklumat)"}
          </h3>

          <p className="my-2 flex items-center gap-2">
            <OrgChartIcon className="text-txt-primary" />
            {school?.kodSekolah || "Tiada Maklumat"}
          </p>
          <p className="my-1 flex items-center gap-2">
            <PhoneIcon className="text-txt-primary" />
            {school?.noTelefon || "Tiada Maklumat"}
          </p>
          <p className="my-1 flex items-center gap-2">
            <EmailIcon className="text-txt-primary" />
            {school?.email || "Tiada Maklumat"}
          </p>
          <p className="my-1 flex items-start gap-2">
            <MapIcon className="text-txt-primary" />
            {school
              ? `${school.alamatSurat}, ${school.poskodSurat} ${school.bandarSurat}, ${school.negeri}`
              : "Tiada Maklumat"}
          </p>
        </div>
      </div>

      <hr className="border-t border-[#dadce0] my-2" />

      <div className="flex flex-col sm:flex-row px-1 pb-4 text-[13px] gap-1 text-txt-black-500">
        <div className="flex-1">
          <div className="font-bold mb-2 text-[#202124]">JPN</div>
          <p className="my-1">
            <span className="pr-2">Lokasi:</span>
            <span className="font-bold">{school?.lokasi || "Tiada Maklumat"}</span>
          </p>
          <p className="my-1">
            <span className="pr-2">Status SKM:</span>
            <span className="font-bold">{school?.skm_150 ? "Ya" : "Tidak"}</span>
          </p>
        </div>

        <div className="flex-1">
          <div className="font-bold mb-2 text-[#202124]">PPD</div>
          <p className="my-1">
            <span className="pr-2">Daerah:</span>
            <span className="font-bold">{school?.ppd || "Tiada Maklumat"}</span>
          </p>
          <p className="my-1">
            <span className="pr-2">Gred:</span>
            <span className="font-bold">{school?.gred || "Tiada Maklumat"}</span>
          </p>
          <p className="my-1">
            <span className="pr-2">Sesi:</span>
            <span className="font-bold">{school?.sesi || "Tiada Maklumat"}</span>
          </p>
          <p className="my-1">
            <span className="pr-2">Jenis Bantuan:</span>
            <span className="font-bold">{school?.bantuan || "Tiada Maklumat"}</span>
          </p>
          <p className="my-1">
            <span className="pr-2">Tarikh Tubuh:</span>
            <span className="font-bold">{school?.tarikhTubuh || "Tiada Maklumat"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
