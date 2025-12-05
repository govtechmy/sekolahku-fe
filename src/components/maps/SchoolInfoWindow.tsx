import {
  EmailIcon,
  OrgChartIcon,
  PhoneIcon,
  PinIcon,
} from "@govtechmy/myds-react/icon";
import type { SchoolMarker } from "../../types/maps";
import { Tag } from "@govtechmy/myds-react/tag";
import { toTitleCase } from "../../utils/titleCaseConverter";
import { Button } from "@govtechmy/myds-react/button";

type SchoolInfoWindowProps = {
  school: SchoolMarker;
};

export function SchoolInfoWindow({ school }: SchoolInfoWindowProps) {
  return (
    <div>
      <img
        src="/images/sekDefault.png"
        alt={school?.namaSekolah || "Sekolah"}
        className="w-full h-full object-cover rounded-t-xl"
      />

      <div className="p-3 flex flex-col gap-3 justify-start">
        <div>
          <Tag mode="pill" variant="success" className="font-normal">
            {school?.kluster || "Sekolah Kluster Kecemerlangan"}
          </Tag>
        </div>
        <div className="text-body-md font-semibold font-body">
          {school?.namaSekolah || "Maktab Sultan Abu Bakar (English College)"}
        </div>
        <div className="flex flex-col gap-2 text-txt-black-700">
          <div className="flex items-center gap-1.5">
            <OrgChartIcon className="text-txt-primary" />
            <span className="text-txt-black-500 text-body-xs font-medium">
              {school?.kodSekolah || "Tiada Maklumat"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <PhoneIcon className="text-txt-primary" />
            <span className="text-txt-black-500 text-body-xs font-medium">
              {school?.noTelefon || "Tiada Maklumat"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <EmailIcon className="text-txt-primary" />
            <span className="text-txt-black-500 text-body-xs font-medium">
              {school?.email || "Tiada Maklumat"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <PinIcon className="text-txt-primary" />
            <span className="text-txt-black-500 text-body-xs font-medium">
              {school
                ? toTitleCase(
                    `${school.alamatSurat || ""}${
                      school.alamatSurat ? ", " : ""
                    }${school.poskodSurat || ""} ${school.bandarSurat || ""}${
                      school.negeri ? ", " + school.negeri : ""
                    }`
                  )
                : "Tiada Maklumat"}
            </span>
          </div>
        </div>
      </div>
      <div className="border-y border-otl-divider p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">JPN</div>
        <div className="flex gap-1 flex-col">
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Lokasi
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.lokasi || "Tiada Maklumat"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Status SKM
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.skm_150 ? "Ya" : "Tidak"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Kategori Pedalaman
            </div>
            <div className="text-body-sm text-txt-black-900">
              Tiada Maklumat
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">PPD</div>
        <div className="flex gap-1 flex-col">
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Daerah
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.ppd || "Tiada Maklumat"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Gred
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.gred || "Tiada Maklumat"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Sesi
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.sesi || "Tiada Maklumat"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Jenis Bantuan
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.bantuan || "Tiada Maklumat"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-txt-black-500 text-body-xs font-normal">
              Tarikh Tubuh
            </div>
            <div className="text-body-sm text-txt-black-900">
              {school?.tarikhTubuh || "Tiada Maklumat"}
            </div>
          </div>
        </div>
      </div>
      <div className="p-2 w-full">
        <Button variant="primary-outline" className="w-full justify-center">
          Lihat Laman Web
        </Button>
      </div>
    </div>
  );
}