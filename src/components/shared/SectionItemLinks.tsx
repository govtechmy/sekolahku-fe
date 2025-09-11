import { Button } from "@govtechmy/myds-react/button";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";

type LinkItem = {
  icon: React.ReactElement;
  name: string;
  link: string;
};

type SectionItemLinksProps = {
  dataItemLinks: LinkItem[];
};

export default function SectionItemLinks({
  dataItemLinks,
}: SectionItemLinksProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2  xl:grid-cols-3 ">
      {dataItemLinks.map((item: LinkItem, index: number) => {
        return (
          <div key={index}>
            <Button
              variant={"default-outline"}
              size="large"
              className="flex justify-between gap-4.5 p-4.5 rounded-[14px] w-full"
            >
              <div className="flex items-center">
                <div className="bg-bg-white-hover size-12 rounded-full border border-otl-divider items-center justify-center flex">
                  {item.icon}
                </div>
                <div className="pl-2 text-start font-heading text-body-md font-semibold">
                  {item.name}
                </div>
              </div>
              <div className="p-1.5">
                <ArrowOutgoingIcon />
              </div>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
