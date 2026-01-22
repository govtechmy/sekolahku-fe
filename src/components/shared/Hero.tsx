import { Button } from "@govtechmy/myds-react/button";
import { FilterAscIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";

interface HeroBanner {
  "top-gradient": string;
  "middle-gradient": string;
  "bottom-gradient": string;
  desktop: {
    file_desktop:
      | {
          url: string;
        }
      | string;
  };
  mobile: {
    file_mobile:
      | {
          url: string;
        }
      | string;
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
  HeroclassName,
  fullHeight = false,
  className,
}: {
  title: string;
  search?: React.ReactNode;
  links?: Link[];
  filters?: React.ReactNode;
  background?: React.ReactNode;
  heroBanner?: HeroBanner;
  variant?: "side" | "full";
  HeroclassName?: string;
  fullHeight?: boolean;
  className?: string;
}) {
  return (
    <section
      className={clx(
        "relative border-b border-outline-200",
        fullHeight ? "min-h-[calc(100vh-450px)]" : "h-[515px]",
        variant === "side" ? "" : "",
        className,
      )}
    >
      {variant === "side" && heroBanner ? (
        <div
          className={clx(
            `absolute -z-10 flex h-full w-full justify-start overflow-hidden bg-gradient-radial from-0% via-[27.57%] to-100%, ${HeroclassName}`,
          )}
        >
          <div
            className="hidden lg:block h-full w-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${typeof heroBanner.desktop.file_desktop !== "string" && heroBanner.desktop.file_desktop.url}')`,
            }}
          />
          <div
            className="block lg:hidden h-full w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('${typeof heroBanner.mobile.file_mobile !== "string" && heroBanner.mobile.file_mobile.url}')`,
            }}
          />
        </div>
      ) : background ? (
        <div
          className={clx(
            "absolute -z-10 flex h-full w-full justify-center overflow-hidden object-scale-down",
            HeroclassName,
          )}
        >
          {background}
        </div>
      ) : null}
      <div
        className={clx(
          "w-full h-full flex px-[18px] py-6 md:p-6 justify-center items-center ",
          variant === "side"
            ? "md:max-w-[1328px] lg:px-[74px] mx-auto flex-1 lg:justify-start"
            : "",
        )}
      >
        <div
          className={clx(
            "flex flex-col gap-8 py-16 items-center lg:text-start text-center",
            variant === "side" ? "md:w-[550px] lg:w-[350px]" : " ",
          )}
        >
          <div></div>
          <h1
            className={clx(
              "text-txt-black-900 font-heading font-semibold text-3xl w-full",
              variant === "full" ? "text-center" : "",
            )}
          >
            {title}
          </h1>
          {search && (
            <div
              className={clx(
                "items-center flex w-full",
                variant === "full" ? "justify-center" : "",
              )}
            >
              <div className="flex-1 max-w-[600px]">{search}</div>
            </div>
          )}
          {links && links.length > 0 && (
            <div className="items-center flex w-full">
              <div className="flex-1 max-w-[600px]">
                <div className="text-body-sm text-txt-black-500">
                  Pautan Popular:
                </div>
                <div
                  className={clx(
                    "gap-2 mt-4",
                    links.length === 1
                      ? "flex lg:justify-start justify-center"
                      : "grid grid-cols-2",
                  )}
                >
                  {links.map((item, index) => (
                    <Button
                      key={index}
                      variant="default-outline"
                      className="rounded-full text-xs text-txt-black-900"
                      size="medium"
                      onClick={() => {
                        if (item.link.startsWith("#")) {
                          const targetId = item.link.slice(1);
                          const targetElement =
                            document.getElementById(targetId);

                          if (targetElement) {
                            targetElement.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        } else if (item.link) {
                          window.history.pushState(null, "", item.link);
                        }
                      }}
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
