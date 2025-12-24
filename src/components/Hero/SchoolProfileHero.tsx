import Hero from "../shared/Hero";
import BgSchoolProfile from "../../asset/BgSchoolProfile";
import BgSchoolProfileNoLogo from "../../asset/BgSchoolProfileNoLogo";
import type { ItemSekolahModel } from "../../models/response";
import { useState } from "react";

interface SchoolProfileHeroProps {
  school: ItemSekolahModel | undefined;
  url: string;
}

export default function SchoolProfileHero({ school, url }: SchoolProfileHeroProps) {
  const [imageError, setImageError] = useState(false);
  const hasLogo = url && !imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Hero
      title=""
      variant="full"
      background={
        <div className="absolute inset-0 w-full h-full">
          {hasLogo ? (
            <BgSchoolProfile className="absolute inset-0 w-full h-full bg-cover bg-center" />
          ) : (
            <BgSchoolProfileNoLogo className="absolute inset-0 w-full h-full bg-cover bg-center" />
          )}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-[1328px] px-6 lg:px-[109px] py-[50px] md:py-[50px] max-md:py-4 mx-auto">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full">
                <div className="max-w-xl pt-10 md:pt-0 text-center md:text-left">
                  <div className="text-txt-primary font-semibold gap-6 pb-6">NAMA SEKOLAH</div>
                  <div className="text-txt-black-900 text-heading-md max-md:text-heading-sm font-semibold gap-7 pb-7 max-w-[495px]">
                    {school?.namaSekolah ? school.namaSekolah : "Maktab Sultan Abu Bakar (English College)"}
                  </div>
                  <div className="text-txt-primary font-semibold">JENIS SEKOLAH
                    <span className="text-txt-black-500 font-medium"> : {school?.data.infoSekolah?.jenisLabel} </span>
                  </div>
                </div>
                {hasLogo && (
                  <div className="mt-8 md:mt-0 flex justify-center text-center">
                    <img
                      src={url}
                      alt="School Logo"
                      width={260}
                      height={260}
                      className="object-contain drop-shadow-xl max-md:w-1/2"
                      onError={handleImageError}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
