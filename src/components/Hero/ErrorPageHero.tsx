import BgErrorPage from "../../asset/BgErrorPage";
import BgErrorPageMobile from "../../asset/BgErrorPageMobile";
import Hero from "../shared/Hero";

export default function ErrorPageHero() {
  return (
    <Hero
      title=""
      variant="full"
      background={
        <div className="absolute inset-0 w-full h-full">
          <BgErrorPageMobile className="absolute inset-0 w-full h-full object-cover block md:hidden" />
          <BgErrorPage className="absolute inset-0 w-full h-full object-cover hidden md:block" />
        </div>
      }
    />
  );
}
