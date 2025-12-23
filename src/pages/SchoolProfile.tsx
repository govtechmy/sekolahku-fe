import { CheckCircleFillIcon, CrossFillIcon, EmailIcon, GovtOfficeIcon, PhoneIcon, PinIcon, PrinterIcon, UserGroupIcon, UserIcon } from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SchoolProfileHero from "../components/Hero/SchoolProfileHero";
import { fetchSchools } from "../services/school.svc";
import type { ItemSekolahModel } from "../models/response";



export default function SchoolProfile() {
  const DATA_BASE_URL = import.meta.env.VITE_DATA_BASE_URL;
  const { id } = useParams();
  const [school, setSchool] = useState<ItemSekolahModel | null>(null);
  const [schoolNearbyDetails, setSchoolNearbyDetails] = useState<ItemSekolahModel[]>([]);
  const [loading, setLoading] = useState(true);
  const domain = import.meta.env.VITE_DOMAIN_NAME
  const schoolProfile = "/halaman-sekolah"

  useEffect(() => {
    if (id) {
      fetchSchools(id, setSchool, setSchoolNearbyDetails, setLoading);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">Loading school data...</div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">School not found</div>
      </div>
    );
  }

  return (<>
    <HelmetMeta
      title={`${school?.namaSekolah} School Profile`}
      description={`School profile page for ${school?.namaSekolah}.`}
      canonical={`${domain}${schoolProfile}/${id}`}
    />
    <HelmetMeta
      title={`${school?.namaSekolah} School Profile`}
      description={`School profile page for ${school?.namaSekolah}.`}
      canonical={`${domain}${schoolProfile}/${id}`}
    />
    <SchoolProfileHero school={school} url={`${DATA_BASE_URL}/${school.data.infoPentadbiran.negeri}/${school.data.infoPentadbiran.parlimen}/${school.kodSekolah}/assets/logo.png`}

    />
    <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 mt-0 md:px-12 max-md:px-0">
        <div className="border-t-0 border-[1px] outline-otl-gray-200 gap-0.5 mt-0">
          <div className="flex w-full max-w-xl px-8 md:px-12 lg:px-16 py-8 items-start gap-4 shrink-0">
            <div className="flex w-[42px] h-[42px] justify-center items-center gap-x-[10px] gap-y-[10px] shrink-0 bg-primary-50 rounded-full">
              <div className="text-txt-primary font-semibold"><UserGroupIcon /></div>
            </div>
            <div className="flex flex-col items-start gap-1 flex-1">
              <p className="text-txt-primary text-center text-sm max-md:text-xs font-semibold leading-tight tracking-widest uppercase">
                PELAJAR
              </p>
              <div className="self-stretch text-txt-black-900 text-heading-lg max-md:text-heading-sm font-semibold">
                {school?.data?.infoSekolah?.jumlahPelajar ?? "Data Tidak Tersedia"}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t-0 border-[1px] outline-otl-gray-200 gap-0.5 mt-0">
          <div className="flex w-full max-w-xl px-8 md:px-12 lg:px-16 py-8 items-start gap-4 shrink-0">
            <div className="flex w-[42px] h-[42px] justify-center items-center gap-x-[10px] gap-y-[10px] shrink-0 bg-primary-50 rounded-full">
              <div className="text-txt-primary font-semibold"><UserIcon /></div>
            </div>
            <div className="flex flex-col items-start gap-1 flex-1">
              <p className="text-txt-primary text-center text-sm max-md:text-xs font-semibold leading-tight tracking-widest uppercase">
                GURU
              </p>
              <div className="self-stretch text-txt-black-900 text-heading-lg max-md:text-heading-sm font-semibold">
                {school?.data?.infoSekolah?.jumlahGuru ?? "Data Tidak Tersedia"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="pt-[84px] pb-[32px] px-[109px] max-md:pt-[48px] max-md:px-[28px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Mengenai Sekolah</div>
        <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div>
              <div className="flex items-center gap-1.5 self-stretch pb-4">
                <div className="text-txt-primary"><GovtOfficeIcon width={24} height={24} /></div>
                <div className="text-txt-black-500 text-body-lg font-medium">{school.namaSekolah}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 self-stretch pb-4">
                <div className="text-txt-primary"><PhoneIcon width={24} height={24} /></div>
                <div className="text-txt-black-500 text-body-lg font-medium">{school.data.infoKomunikasi?.noTelefon}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 self-stretch pb-4">
                <div className="text-txt-primary"><PrinterIcon width={24} height={24} /></div>
                <div className="text-txt-black-500 text-body-lg font-medium">{school.data.infoKomunikasi?.noFax}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 self-stretch pb-4">
                <div className="text-txt-primary"><EmailIcon width={24} height={24} /></div>
                <div className="text-txt-black-500 text-body-lg font-medium">{school.data.infoKomunikasi?.email}</div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 self-stretch pb-4">
                <div className="text-txt-primary"><PinIcon width={24} height={24} /></div>
                <div className="text-txt-black-500 text-body-lg font-medium">{`${school.data.infoKomunikasi.alamatSurat || ""}${school.data.infoKomunikasi.alamatSurat ? ", " : ""
                  }${school.data.infoKomunikasi.poskodSurat || ""} ${school.data.infoKomunikasi.bandarSurat || ""}${school.data.infoPentadbiran?.negeri ? ", " + school.data.infoPentadbiran.negeri : ""
                  }`}</div>
              </div>
            </div>
          </div>
          <div>
            <img
              src="/utama/school-outline.png"
              alt="School building outline"
            />
          </div>
        </div>
      </div>

      {/* School Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 px-9">
        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">KOD SEKOLAH</div>
            <div className="text-txt-black-500">{school.kodSekolah}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">NEGERI</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.negeri}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">PPD</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.ppd}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">PARLIMEN</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.parlimen}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">BANTUAN</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.bantuan}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">BIL SESI</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.bilSesi}</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">PRASEKOLAH</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.prasekolah === true ?
              <div className="text-txt-success flex items-center justify-center"><CheckCircleFillIcon /></div> :
              <div className="text-txt-danger flex items-center justify-center"><CrossFillIcon /></div>
            }</div>
          </div>
        </div>

        <div className="border-[1px] outline-otl-gray-200 gap-0.5">
          <div className="py-8 px-2.5 rounded-xl shadow text-center">
            <div className="text-txt-primary uppercase pb-2">INTEGRASI</div>
            <div className="text-txt-black-500">{school.data.infoPentadbiran?.integrasi === true ?
              <div className="text-txt-success flex items-center justify-center"><CheckCircleFillIcon /></div> :
              <div className="text-txt-danger flex items-center justify-center"><CrossFillIcon /></div>}
            </div>
          </div>
        </div>

      </div>

      {/* Nearby Schools */}
      <div className="py-[84px] px-[109px] max-md:px-[28px] max-md:py-[48px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Sekolah Berdekatan</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schoolNearbyDetails.map((i) => (
            <div key={i.kodSekolah} className="bg-white rounded-2xl shadow overflow-hidden border-[1px] outline-otl-gray-200">
              <img
                src="/utama/image-160.png"
                alt="Nearby School"
                className="w-full h-40 object-cover"
              />
              <div className="p-4.5">
                <h3 className="text-txt-black-900 font-medium">{i.namaSekolah}</h3>
                <p className="text-gray-600 text-sm">{`${i.data.infoKomunikasi.alamatSurat || ""}${i.data.infoKomunikasi.alamatSurat ? ", " : ""
                  }${i.data.infoKomunikasi.poskodSurat || ""} ${i.data.infoKomunikasi.bandarSurat || ""}${i.data.infoPentadbiran?.negeri ? ", " + i.data.infoPentadbiran.negeri : ""
                  }`}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>);
}
