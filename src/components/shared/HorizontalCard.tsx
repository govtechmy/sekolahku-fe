import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ArrowBackIcon, ArrowForwardIcon } from "@govtechmy/myds-react/icon";
import { useRef } from "react";

interface HorizontalCardProps {
  mainTitle: string;
  children?: React.ReactNode;
}

export default function HorizontalCard({
  mainTitle,
  children,
}: HorizontalCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="justify-between flex mb-12 mt-4 items-center ">
        <div className="text-txt-black-900 font-heading font-semibold text-heading-sm ">
          {mainTitle}
        </div>

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
      </div>
      <div
        ref={scrollRef}
        className=" flex gap-4.5 w-full overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
      >
        {children}
      </div>
    </div>
  );
}
