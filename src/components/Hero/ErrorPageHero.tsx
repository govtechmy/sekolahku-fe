import BgErrorPage from "../../asset/BgErrorPage";
import BgErrorPageMobile from "../../asset/BgErrorPageMobile";
import Hero from "../shared/Hero";

export default function ErrorPageHero() {
  return (
    <Hero
      title=""
      variant="full"
      fullHeight={true}
      search={
        <div className="absolute inset-0 w-full h-full flex justify-center items-center">
           <img
            src="/utama/image-404.png"
            alt="404 Error"
            className="mx-auto my-auto align-middle pt-20"
          />
        </div>
      }
      background={
        <div className="absolute inset-0 w-full h-full z-10 bg-[radial-gradient(101.65%_92.54%_at_50%_0%,#E0EDFF_0%,#FAFCFF_27.57%,#FFF_100%)]">
          <BgErrorPageMobile className="mt-16 absolute inset-0 w-full h-full object-cover block md:hidden" />
          <BgErrorPage className="mt-10 absolute inset-0 w-full h-full object-cover hidden md:block" />
        </div>
      }
    />
  );
}
