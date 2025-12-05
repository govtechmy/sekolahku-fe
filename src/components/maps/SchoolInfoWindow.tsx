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
import { InfoIconRow, InfoRow } from "../shared/CardInfo";

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
          <InfoIconRow
            icon={<OrgChartIcon/>}
            value={school?.kodSekolah || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<PhoneIcon/>}
            value={school?.noTelefon || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<EmailIcon/>}
            value={school?.email || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<PinIcon/>}
            value={
              school
                ? toTitleCase(
                    `${school.alamatSurat || ""}${
                      school.alamatSurat ? ", " : ""
                    }${school.poskodSurat || ""} ${school.bandarSurat || ""}${
                      school.negeri ? ", " + school.negeri : ""
                    }`
                  )
                : "Tiada Maklumat"
            }
          />
        </div>
      </div>
      <div className="border-y border-otl-divider p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">JPN</div>
        <div className="flex gap-1 flex-col">
          <InfoRow label="Lokasi" value={school?.lokasi || "Tiada Maklumat"} />
          <InfoRow label="Status SKM" value={school?.skm_150 ? "Ya" : "Tidak"} />
          <InfoRow label="Kategori Pedalaman" value={"Tiada Maklumat"} />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">PPD</div>
        <div className="flex gap-1 flex-col">
          <InfoRow label="Daerah" value={school?.ppd || "Tiada Maklumat"} />
          <InfoRow label="Gred" value={school?.gred || "Tiada Maklumat"} />
          <InfoRow label="Sesi" value={school?.sesi || "Tiada Maklumat"} />
          <InfoRow label="Jenis Bantuan" value={school?.bantuan || "Tiada Maklumat"} />
          <InfoRow label="Tarikh Tubuh" value={school?.tarikhTubuh || "Tiada Maklumat"} />
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