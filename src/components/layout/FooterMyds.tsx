import {
  Footer,
  SiteInfo,
  FooterSection,
  FooterLogo,
  SiteLinkGroup,
} from "@govtechmy/myds-react/footer";
import { footerSocialLinks } from "../../contentData";
import SocialLinks from "../shared/SocialLinks";
import { SiteLink } from "@govtechmy/myds-react/footer";
import { useNavigate } from "react-router-dom";

export default function FooterMyds() {
  const lang = localStorage.getItem("lang") || "ms";
  const navigate = useNavigate();

  return (
    <Footer className="w-full max-md:px-0 md:px-0 gap-0">
      <FooterSection className="text-txt-black-500 md:max-lg:gap-4.5 mx-auto flex w-full max-w-screen-xl flex-col justify-between text-sm max-md:gap-4 lg:flex-row lg:gap-6 px-4.5 md:px-6 gap-0">
        <div className="flex flex-col gap-3 lg:flex-row max-w-[412px]">
          <SiteInfo>
            <div className="text-txt-black-900 flex items-center gap-x-2.5">
              <FooterLogo
                logoTitle={
                  <p className="font-poppins text-body-md whitespace-nowrap font-semibold">
                    Kementerian Pendidikan
                  </p>
                }
                logo={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coat_of_arms_of_Malaysia.svg/500px-Coat_of_arms_of_Malaysia.svg.png"
                    width={36}
                    alt="Malaysia Coat of Arms"
                    className="select-none"
                  />
                }
              />
            </div>
            <p className="text-txt-black-700 text-body-sm not-prose">
              Kementerian Pendidikan, Blok E8, Kompleks E, Pusat Pentadbiran
              Kerajaan Persekutuan, 62604 W.P. Putrajaya, Malaysia
            </p>
            <p className="text-txt-black-900 text-body-sm font-semibold not-prose">
              Ikuti Kami
            </p>
            <SocialLinks
              links={footerSocialLinks}
              className="gap-3"
              classNameButton="p-0 hover:text-txt-black-900"
            />
          </SiteInfo>
        </div>
        <div className="flex flex-col gap-3">
          <SiteLinkGroup groupTitle="Sumber terbuka">
            <SiteLink
              href="https://github.com/govtechmy/sekolahku-fe"
              target="_blank"
              className="focus:outline-otl-primary-200"
            >
              Repositori Github
            </SiteLink>
            <SiteLink
              href="https://www.figma.com/design/oDUTO2KqIfVDKGKQrur9FP/Sekolahku-UI"
              target="_blank"
              className="focus:outline-otl-primary-200"
            >
              Figma
            </SiteLink>
          </SiteLinkGroup>
        </div>
      </FooterSection>
      <FooterSection className="text-txt-black-500 md:max-lg:gap-4.5 mx-auto flex w-full max-w-screen-xl flex-col justify-between border-none text-sm max-md:gap-4 lg:flex-row lg:gap-6 px-4.5 md:px-6 gap-0 pt-6 md:pb-0">
        <div className="flex flex-col gap-3 lg:flex-row">
          <p>© 2026 Kementerian Pendidikan. Semua hakcipta terpelihara.</p>
          <p className="hidden lg:inline">|</p>
          <div className="text-txt-black-700 flex flex-grow flex-row gap-3">
            <SiteLink
              className="focus:outline-otl-primary-200 cursor-pointer"
              onClick={() => {
                navigate(`/${lang}/disclaimer`);
              }}
            >
              Penafian
            </SiteLink>
            <p className="hidden lg:inline">|</p>
            <SiteLink
              className="focus:outline-otl-primary-200 cursor-pointer"
              onClick={() => {
                navigate(`/${lang}/privacy-policy`);
              }}
            >
              Dasar Privasi
            </SiteLink>
          </div>
        </div>
        <div className="text-gray-500 flex flex-grow flex-col gap-3 lg:flex-row lg:gap-3 lg:justify-end">
          <p>Kemaskini Terakhir: 15 Januari 2026</p>
        </div>
      </FooterSection>
    </Footer>
  );
}
