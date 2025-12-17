import { Button } from "@govtechmy/myds-react/button";
import { FilterAscIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";

interface HeroBanner {
  "top-gradient": string;
  "middle-gradient": string;
  "bottom-gradient": string;
  desktop: {
    file_desktop: {
      url: string;
    } | string;
  };
  mobile: {
    file_mobile: {
      url: string;
    } | string;
  };
}

interface Link {
  label: string;
  link: string;
}

export default function Hero({
  title,
  search,
  links,
  filters,
  background,
  heroBanner,
  variant = "side",
}: {
  title: string;
  search?: React.ReactNode;
  links?: Link[];
  filters?: React.ReactNode;
  background?: React.ReactNode;
  heroBanner?: HeroBanner;
  variant?: "side" | "full";
}) {
  return (
    <section className={clx(
      "relative border-b border-outline-200",
      variant === "side" ? "lg:px-[109px] h-[515px] md:h-full" : "h-[350px]"
    )}>
      {variant === "side" && heroBanner ? (
        <div
          style={
            {
              "--top-gradient-color": heroBanner["top-gradient"],
              "--middle-gradient-color": heroBanner["middle-gradient"],
              "--bottom-gradient-color": heroBanner["bottom-gradient"],
            } as React.CSSProperties
          }
          className={clx(
            "absolute -z-10 flex h-full w-full justify-start overflow-hidden bg-gradient-radial from-0% via-[27.57%] to-100%",
            "from-[var(--middle-gradient-color)] via-[var(--top-gradient-color)] to-[var(--bottom-gradient-color)]"
          )}
        >
          <div
            className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block 2xl:bg-contain"
            style={{
              backgroundImage: `url('${typeof heroBanner.desktop.file_desktop !== "string" && heroBanner.desktop.file_desktop.url}')`,
            }}
          />
          <div
            className="bg-fill block h-full w-full bg-center bg-no-repeat sm:bg-contain lg:hidden"
            style={{
              backgroundImage: `url('${typeof heroBanner.mobile.file_mobile !== "string" && heroBanner.mobile.file_mobile.url}')`,
            }}
          />
        </div>
      ) : background ? (
        <div className="absolute -z-10 flex h-full w-full justify-center overflow-hidden">
          {background} 
        </div>
      ) : null}
      <div className="w-full flex justify-center lg:justify-start">
        <div className={clx(
          "flex flex-col gap-8 py-16 justify-center items-center text-center",
          variant === "side" ? "w-[400px] lg:justify-start lg:items-start lg:text-start" : ""
        )}>
          <h1 className="text-txt-black-900 font-heading font-semibold text-heading-md">
            <div className="text-[2rem]/10"> {title}</div>
          </h1>
          {search && (
            <div className={clx(
              "items-center flex w-full",
              variant === "full" ? "justify-center" : ""
            )}>
              <div className="flex-1 max-w-[600px]">{search}</div>
            </div>
          )}
          {links && links.length > 0 && (
            <div className="items-center flex w-full">
              <div className="flex-1 max-w-[600px]">
              <div className="text-body-sm text-txt-black-500">
              Pautan Popular:
            </div>
            <div className={clx(
              "gap-2 mt-4",
              links.length === 1 ? "flex md:justify-start justify-center" : "grid grid-cols-2"
            )}>
              {links.map((item, index) => (
                <Button
                  key={index}
                  variant="default-outline"
                  className="rounded-full text-xs text-txt-black-900"
                  size="medium"
                >
                  <div className="rounded-full bg-primary-50 text-txt-primary size-8 items-center justify-center flex">
                    <FilterAscIcon className="!size-5" />
                  </div>
                  <span>{item.label}</span>
                </Button>
              ))}
            </div>
            </div>
            </div>
          )}
          {filters && (
            <div className="flex w-full justify-center ">
              <div className="flex justify-center ">{filters}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
