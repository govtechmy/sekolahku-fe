type LinkItem = {
  icon: React.ReactElement;
  name: string;
  link: string;
  desc?: string;
  iconBg?: string;
};

type SectionItemLinksProps = {
  dataItemLinks: LinkItem[];
};

export default function SectionItemLinks({
  dataItemLinks,
}: SectionItemLinksProps) {
  return (
    <div className="flex flex-col gap-3">
      {dataItemLinks.map((item: LinkItem, index: number) => (
        <button
          key={index}
          type="button"
          onClick={() =>
            window.open(item.link, "_blank", "noopener,noreferrer")
          }
          className="group flex flex-col gap-2.5 rounded-[14px] bg-[#F7F8FA] p-4 text-left transition-shadow hover:shadow-md focus:outline-primary-200"
        >
          <div
            className="flex size-10 items-center justify-center rounded-[10px]"
            style={{ backgroundColor: item.iconBg ?? "#E7F0FE" }}
          >
            {item.icon}
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-body-sm font-bold text-txt-black-900">
              {item.name}
            </div>
            {item.desc && (
              <div className="text-body-xs text-txt-black-500">{item.desc}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
