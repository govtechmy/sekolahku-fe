import {
  Footer,
  SiteInfo,
  FooterSection,
  SiteLink,
} from "@govtechmy/myds-react/footer";
import { JataNegaraIcon } from "@govtechmy/myds-react/icon";

export default function FooterMyds() {
  return (
    <Footer>
      <FooterSection className="text-txt-black-500 md:max-lg:gap-4.5 mx-auto flex w-full max-w-[1280px] flex-col justify-between border-none text-sm max-md:gap-4 lg:flex-row lg:gap-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <SiteInfo>
            <div className="text-txt-black-900 flex items-center gap-x-2.5">
              <JataNegaraIcon className="size-[44px]" />
              <div>
                <p className="font-heading text-txt-black-900 text-body-md whitespace-nowrap font-semibold">
                  Sekolahku
                </p>
                <p className="font-inter text-bg-black-500 text-body-xs font-normal">
                  © 2024 Government of Malaysia
                </p>
              </div>
            </div>
          </SiteInfo>
        </div>
        <div className="flex gap-4.5 font-body">
          <SiteLink href="#">API Docs</SiteLink>
          <SiteLink href="#"> Admin Login</SiteLink>
        </div>
      </FooterSection>
    </Footer>
  );
}
