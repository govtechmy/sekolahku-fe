import Hero from "../shared/Hero";
import BgSchoolProfile from "../../asset/BgSchoolProfile";
import type { ItemSekolahModel } from "../../models/response";

interface SchoolProfileHeroProps {
  school: ItemSekolahModel | undefined;
  url: string;
}

export default function SchoolProfileHero({ school, url }: SchoolProfileHeroProps) {
  return (
    <Hero
      title=""
      variant="full"
      background={
        <div className="absolute inset-0 w-full h-full">
          <BgSchoolProfile className="absolute inset-0 w-full h-full bg-cover bg-center"/>
          {/* Custom content overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full px-[109px] py-[50px] md:px-[109px] md:py-[50px] max-md:px-2 max-md:py-4">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-12">
                {/* LEFT CONTENT */}
                <div className="max-w-xl pt-10 md:pt-0 text-center md:text-left">
                  <div className="text-txt-primary font-semibold gap-6 pb-6">NAMA SEKOLAH</div>
                  <div className="text-txt-black-900 text-heading-md max-md:text-heading-sm font-semibold gap-7 pb-7 max-w-[495px]">
                    {school?.namaSekolah ? school.namaSekolah : "Maktab Sultan Abu Bakar (English College)"}
                  </div>
                  <div className="text-txt-primary font-semibold">JENIS SEKOLAH 
                    <span className="text-txt-black-500 font-medium"> : {school?.data.infoSekolah?.jenisLabel} </span>
                  </div>
                </div>
                {/* RIGHT LOGO */}
                <div className="mt-8 md:mt-0 flex justify-center text-center">
                  <img
                    src={url}
                    alt="School Logo"
                    width={260}
                    height={260}
                    className="object-contain drop-shadow-xl max-md:w-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
