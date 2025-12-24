import {
  Footer,
  SiteInfo,
  FooterSection,
  FooterLogo
} from "@govtechmy/myds-react/footer";
import { FacebookIcon, TwitterXIcon, InstagramIcon, YoutubeIcon } from "@govtechmy/myds-react/icon";
import { Link } from "@govtechmy/myds-react/link";

export default function FooterMyds() {
  return (
    <Footer className="w-full max-md:px-0 md:px-0 gap-0">
      <FooterSection className="text-txt-black-500 md:max-lg:gap-4.5 mx-auto flex w-full max-w-screen-xl flex-col justify-between text-sm max-md:gap-4 lg:flex-row lg:gap-6 px-4.5 md:px-6 gap-0">
        <div className="flex flex-col gap-3 lg:flex-row max-w-[412px]">
          <SiteInfo>
            <div className="text-txt-black-900 flex items-center gap-x-2.5">
              <FooterLogo
                logoTitle={<p className="font-poppins text-body-md whitespace-nowrap font-semibold">Kementerian Pendidikan</p>}
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
              Kementerian Pendidikan, Blok E8, Kompleks E, Pusat Pentadbiran Kerajaan Persekutuan, 62604 W.P. Putrajaya, Malaysia
            </p>
            <p className="text-txt-black-900 text-body-sm font-semibold not-prose">Follow Us</p>
            <div className="flex gap-3">
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook link"
                underline="none"
                className="hover:text-txt-black-900"
              >
                <FacebookIcon className="text-txt-black-700" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter link"
                underline="none"
                className="hover:text-txt-black-900"
              >
                <TwitterXIcon className="text-txt-black-700" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram link"
                underline="none"
                className="hover:text-txt-black-900"
              >
                <InstagramIcon className="text-txt-black-700" />
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube link"
                underline="none"
                className="hover:text-txt-black-900"
              >
                <YoutubeIcon className="text-txt-black-700" />
              </Link>
            </div>
          </SiteInfo>
        </div>
        <div className="flex flex-col gap-3 font-semibold">
          <a href="#">Open Source</a>
          <div className="flex flex-col gap-2 font-normal">
            <a href="#">Github Repo</a>
            <a href="#">Figma</a>
          </div>
        </div>
      </FooterSection>
      <FooterSection className="text-txt-black-500 md:max-lg:gap-4.5 mx-auto flex w-full max-w-screen-xl flex-col justify-between border-none text-sm max-md:gap-4 lg:flex-row lg:gap-6 px-4.5 md:px-6 gap-0 pt-6 md:pb-0">
        <div className="flex flex-col gap-3 lg:flex-row">
          <p>© 2025 Kementerian Pendidikan. Semua hakcipta terpelihara.</p>
          <p className="hidden lg:inline">|</p>
          <div className="text-txt-black-700 flex flex-grow flex-row gap-3">
            <a href="#">Penafian </a>
            <a href="#">Dasar Privasi</a>
          </div>
        </div>
        <div className="text-gray-500 flex flex-grow flex-col gap-3 lg:flex-row lg:gap-3 lg:justify-end">
          <p>Kemaskini Terakhir: 01 Ogos 2025</p>
        </div>
      </FooterSection>
    </Footer>
  );
}
