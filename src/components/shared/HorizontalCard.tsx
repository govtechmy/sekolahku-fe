import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ArrowBackIcon, ArrowForwardIcon } from "@govtechmy/myds-react/icon";
import { useRef } from "react";

type MobileVariant = "scroll" | "grid";

interface HorizontalCardProps {
  mainTitle?: string;
  children?: React.ReactNode;
  showNavigation?: boolean;
  mobileVariant?: MobileVariant;
}

export default function HorizontalCard({
  mainTitle,
  children,
  showNavigation = true,
  mobileVariant = "scroll",
}: HorizontalCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const isMobileGrid = mobileVariant === "grid";

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex justify-between mb-12 mt-4 items-center">
        <div className="text-txt-black-900 font-heading font-semibold text-heading-sm">
          {mainTitle}
        </div>

        {/* Navigation (desktop only, and disabled for mobile grid) */}
        {showNavigation && !isMobileGrid && (
          <div className="flex gap-2 pl-2 max-md:hidden">
            <Button
              variant="default-outline"
              className="p-2"
              onClick={() => scroll(-260)}
            >
              <ButtonIcon>
                <ArrowBackIcon className="size-5" />
              </ButtonIcon>
            </Button>

            <Button
              variant="default-outline"
              className="p-2"
              onClick={() => scroll(260)}
            >
              <ButtonIcon>
                <ArrowForwardIcon className="size-5" />
              </ButtonIcon>
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className={`
          w-full

          ${
            isMobileGrid
              ? "grid grid-cols-2 gap-4"
              : "flex gap-4.5 overflow-x-auto snap-x snap-mandatory hide-scrollbar"
          }

          md:flex md:gap-4.5 md:overflow-x-auto md:snap-x md:snap-mandatory
        `}
      >
        {children}
      </div>
    </div>
  );
}
