import { CheckCircleFillIcon, CrossFillIcon } from "@govtechmy/myds-react/icon";
import { dataSekolahAbout, dataSekolahInfo, dataSekolahJumlah, dataSekolahSuggestion } from "../contentData";
import HeroMy from "../components/shared/HeroComponent";
import BgSchoolProfile from "../asset/BgSchoolProfile";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams } from "react-router-dom";
import schools from "../../school-list.json";

type SchoolProps = {
  KODSEKOLAH: string;
  NAMASEKOLAH: string;
}

export default function SchoolProfile() {
  const { id } = useParams(); // ABA0001,YRA4101 etc
  const school = schools.find((s:SchoolProps) => s.KODSEKOLAH === id)
  const domain = import.meta.env.VITE_DOMAIN_NAME
  const schoolProfile = "/halaman-sekolah"

  return (<>
    <HelmetMeta
      title={`${school?.NAMASEKOLAH} School Profile`}
      description={`School profile page for ${school?.NAMASEKOLAH}.`}
      canonical={`${domain}${schoolProfile}/${id}`}
    />
    <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
      <HeroMy className="relative w-full h-[408px] md:h-[408px] sm:h-[320px] max-sm:h-[300px] overflow-hidden border-b border-outline-200 bg-black">
        <HeroMy.Background>
          <div className="absolute inset-0 w-full h-full">
            <BgSchoolProfile className="absolute inset-0 w-full h-full bg-cover bg-center"/>
          </div>
        </HeroMy.Background>
        <HeroMy.Content className="max-lg:px-0 max-lg:py-0">
          <div className="px-[109px] py-[50px] md:px-[109px] md:py-[50px] max-md:px-2 max-md:py-4">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between h-full px-6 md:px-12">
              {/* LEFT CONTENT */}
              <div className="max-w-xl pt-10 md:pt-0 text-center md:text-left">
                <div className="text-txt-primary font-semibold gap-6 pb-6">NAMA SEKOLAH</div>
                <div className="text-txt-black-900 text-heading-md max-md:text-heading-sm font-semibold gap-7 pb-7 max-w-[495px]">
                  {school?.NAMASEKOLAH ? school.NAMASEKOLAH : "Maktab Sultan Abu Bakar (English College)"}
                </div>
                <div className="text-txt-primary font-semibold">JENIS SEKOLAH 
                  <span className="text-txt-black-500 font-medium"> : SMK </span>
                </div>
              </div>
              {/* RIGHT LOGO */}
              <div className="mt-8 md:mt-0 flex justify-center text-center">
                <img
                  src="/utama/image-159.png"
                  alt="School Logo"
                  width={260}
                  height={260}
                  className="object-contain drop-shadow-xl max-md:w-1/2"
                />
              </div>
            </div>
          </div>
        </HeroMy.Content>
      </HeroMy>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-2 mt-0 md:px-12 max-md:px-0">
        {dataSekolahJumlah.map((item, idx) => (
          <div key={idx} className="border-t-0 border-[1px] outline-otl-gray-200 gap-0.5 mt-0">
            <div className="flex w-full max-w-xl px-8 md:px-12 lg:px-16 py-8 items-start gap-4 shrink-0">
              <div className="flex w-[42px] h-[42px] justify-center items-center gap-x-[10px] gap-y-[10px] shrink-0 bg-primary-50 rounded-full">
                <div className="text-txt-primary font-semibold">{item.icon}</div>
              </div>
              <div className="flex flex-col items-start gap-1 flex-1">
                <p className="text-txt-primary text-center text-sm max-md:text-xs font-semibold leading-tight tracking-widest uppercase">
                  {item.label}
                </p>
                <div className="self-stretch text-txt-black-900 text-heading-lg max-md:text-heading-sm font-semibold">
                  {item.amount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* About Section */}
      <div className="pt-[84px] pb-[32px] px-[109px] max-md:pt-[48px] max-md:px-[28px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Mengenai Sekolah</div>
          <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              {dataSekolahAbout.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-1.5 self-stretch pb-4">
                    <div className="text-txt-primary">{item.icon}</div>
                    <div className="text-txt-black-500 text-body-lg font-medium">{item.label}</div>
                  </div>
                </div>
              ))}
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
        {dataSekolahInfo.map((item, idx) => (
          <div key={idx} className="border-[1px] outline-otl-gray-200 gap-0.5">
            <div className="py-8 px-2.5 rounded-xl shadow text-center">
              <div className="text-txt-primary uppercase pb-2">{item.label}</div>
              {item.value && <div className="text-txt-black-500">{item.value}</div>}
              {item.icon==="cross" && <div className="text-txt-danger flex items-center justify-center"><CrossFillIcon/></div>}
              {item.icon==="checked" && <div className="text-txt-success flex items-center justify-center"><CheckCircleFillIcon/></div>}
            </div>
          </div>
        ))}
      </div>

      {/* Nearby Schools */}
      <div className="py-[84px] px-[109px] max-md:px-[28px] max-md:py-[48px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Sekolah Berdekatan</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dataSekolahSuggestion.map((i) => (
            <div key={i.value} className="bg-white rounded-2xl shadow overflow-hidden border-[1px] outline-otl-gray-200">
              <img
                src="/utama/image-160.png"
                alt="Nearby School"
                className="w-full h-40 object-cover"
              />
              <div className="p-4.5">
                <h3 className="text-txt-black-900 font-medium">{i.label}</h3>
                <p className="text-gray-600 text-sm">{i.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>);
}
