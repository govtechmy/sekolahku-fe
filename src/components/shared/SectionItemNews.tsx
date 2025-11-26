import HorizontalCard from "./HorizontalCard";

type NewsItem = {
  imageSrc: string;
  imageAlt: string;
  header: string;
  title: string;
  date: string;
};

type SectionItemNewsProps = {
  dataItemNews: NewsItem[];
  mainTitle: string;
};

export default function SectionItemNews({
  dataItemNews,
  mainTitle,
}: SectionItemNewsProps) {
  return (
    <div className=" w-full">
      <HorizontalCard mainTitle={mainTitle}>
        {dataItemNews.map((item: NewsItem, index: number) => (
          <div
            key={index}
            className="border border-otl-gray-200 rounded-lg p-3 h-[354px] !w-[247px] flex-shrink-0 flex flex-col gap-4.5"
          >
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="h-[150px] rounded-[6px] overflow-hidden"
            />

            <div className="flex flex-col gap-2 px-3 flex-grow">
              {item.header === "Berita" && (
                <div className="text-txt-primary font-body text-sm font-semibold">
                  {item.header}
                </div>
              )}
              {item.header === "Penggumuman" && (
                <div className="text-txt-success font-body text-sm font-semibold">
                  {item.header}
                </div>
              )}

              <div className="font-heading text-body-lg font-semibold">
                {item.title}
              </div>
            </div>

            <div className="px-3 pb-2 text-sm font-normal text-txt-black-500">
              {item.date}
            </div>
          </div>
        ))}
      </HorizontalCard>
    </div>
  );
}
