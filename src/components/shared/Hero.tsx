import { clx } from "@govtechmy/myds-react/utils";

export default function Hero({
  title,
  search,
  links,
  background,
  content,
  smallHero,
}: {
  title?: string;
  search?: React.ReactNode;
  links?: React.ReactNode;
  background?: React.ReactNode;
  content?: React.ReactNode;
  smallHero?: boolean;
}) {
  return (
    <section className={
      clx("relative border-b border-outline-200", 
        smallHero? "w-full h-[520px] md:h-[408px] max-md:h-[480px] overflow-hidden" : "px-[109px]"
      )}>

      {/* SmallHero size background & content */}
      {smallHero ? 
        (<div className="bg-bg-primary-100 border-b-[var(--Outline-otl-divider,#F4F4F5)] bg-[radial-gradient(101.65%_92.54%_at_50%_0%,#E0EDFF_0%,#FAFCFF_55%,var(--Whites-Background-0,#FFF)_100%)]">
          {/* Background image */}
          {background}
          {/* Content */}
          <div className="px-[109px] py-[50px] md:px-[109px] md:py-[50px] max-md:px-2 max-md:py-4">
            {content}
          </div>
        </div>)
      :
        (<>
          {/* Hero size background */}
          <div className={`absolute -z-10 flex shrink-0 h-full justify-center overflow-x-hidden`}>
            {background}
          </div>
          <div className="w-full">
            {/* Hero size content */}
            <div className=" flex flex-col gap-8 py-16 w-[400px]">
              <h1 className="text-txt-black-900 font-heading font-semibold text-heading-md">
                <div className="text-[2rem]/10"> {title}</div>
              </h1>
              <div className="items-center flex w-full">
                <div className="flex-1 max-w-[600px]">{search}</div>
              </div>
              <div className="items-center flex w-full">
                <div className="flex-1 max-w-[600px]">{links}</div>
              </div>
            </div>
          </div>
        </>)
      }
    </section>
  );
}
