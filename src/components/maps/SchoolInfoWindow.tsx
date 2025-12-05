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
import type { SchoolMarker } from "../../types/maps";

type SchoolInfoWindowProps = {
  school: ItemSekolahModel;
    setSelected: (marker: SchoolMarker | null) => void;
};

export function SchoolInfoWindow({ school, setSelected}: SchoolInfoWindowProps) {
  return (
    <div className="relative bg-white rounded-b-xl">
      <div className="sticky top-0 -mt-12 flex justify-end p-2 bg-transparent">
        <Button onClick={ () => setSelected(null) } variant={"default-outline"} className="p-1.5"><CrossIcon className="size-4" /></Button>
      </div>
      <img
        src="/images/sekDefault.png"
        alt={school?.namaSekolah || "Sekolah"}
        className="w-full h-full object-cover rounded-t-xl"
      />
    

      <div className="p-3 flex flex-col gap-3 justify-start">
        <div>
          <Tag mode="pill" variant="success" className="font-normal">
            {school?.data?.infoSekolah?.jenisLabel || "Sekolah"}
          </Tag>
        </div>
        <div className="text-body-md font-semibold font-body">
          {school?.namaSekolah || "Maktab Sultan Abu Bakar (English College)"}
        </div>
        <div className="flex flex-col gap-2 text-txt-black-700">
          <InfoIconRow
            icon={<OrgChartIcon />}
            value={school?.kodSekolah || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<PhoneIcon/>}
            value={school?.data?.infoKomunikasi?.noTelefon || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<EmailIcon/>}
            value={school?.data?.infoKomunikasi?.email || "Tiada Maklumat"}
          />
          <InfoIconRow
            icon={<PinIcon />}
            value={
              school?.data?.infoKomunikasi
                ? toTitleCase(
                    `${school.data.infoKomunikasi.alamatSurat || ""}${
                      school.data.infoKomunikasi.alamatSurat ? ", " : ""
                    }${school.data.infoKomunikasi.poskodSurat || ""} ${school.data.infoKomunikasi.bandarSurat || ""}${
                      school.data.infoPentadbiran?.negeri ? ", " + school.data.infoPentadbiran.negeri : ""
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
          <InfoRow label="Lokasi" value={school?.data?.infoPentadbiran?.negeri || "Tiada Maklumat"} />
          <InfoRow label="Status SKM" value={"Tiada Maklumat"} />
          <InfoRow label="Kategori Pedalaman" value={"Tiada Maklumat"} />
        </div>
      </div>
      <div className="p-3 flex flex-col gap-2 ">
        <div className="font-body text-body-xs font-semibold">PPD</div>
        <div className="flex gap-1 flex-col">
          <InfoRow label="Daerah" value={school?.data?.infoPentadbiran?.ppd || "Tiada Maklumat"} />
          <InfoRow label="Gred" value={"Tiada Maklumat"} />
          <InfoRow label="Sesi" value={school?.data?.infoPentadbiran?.sesi || "Tiada Maklumat"} />
          <InfoRow label="Jenis Bantuan" value={school?.data?.infoPentadbiran?.bantuan || "Tiada Maklumat"} />
          <InfoRow label="Tarikh Tubuh" value={"Tiada Maklumat"} />
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
