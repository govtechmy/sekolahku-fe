import { Link, useParams } from "react-router-dom";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";

type NewsItem = {
  imageSrc: string;
  imageAlt: string;
  header: string;
  title: string;
  date: string;
  id: string;
};

type SectionItemNewsProps = {
  dataItemNews: NewsItem[];
  mainTitle: string;
  redirectDesc?: string;
};

export default function SectionItemNews({
  dataItemNews,
  mainTitle,
  redirectDesc,
}: SectionItemNewsProps) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="w-full flex flex-col justify-center gap-8">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div className="flex justify-between mb-12 mt-4 items-center">
          <div className="text-txt-black-900 font-heading font-semibold text-heading-sm">
            {mainTitle}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {dataItemNews.slice(0, 4).map((item: NewsItem, index: number) => (
            <Link
              key={index}
              to={`/${lang}/siaran/${item.id}`}
              tabIndex={0}
              className="group border border-otl-gray-200 gap-[18px] rounded-lg p-2 md:p-3 w-full h-full flex flex-col cursor-pointer transition-shadow hover:shadow-lg"
            >
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="w-full aspect-[16/9] rounded-[6px] object-cover flex-shrink-0"
              />

              <div className="flex flex-col gap-1.5 md:gap-2 px-2 md:px-3">
                {item.header === "Berita" && (
                  <div className="text-txt-primary font-body text-sm font-semibold">
                    {item.header}
                  </div>
                )}
                {item.header === "Pengumuman" && (
                  <div className="text-txt-success font-body text-sm font-semibold">
                    {item.header}
                  </div>
                )}

                <div className="font-heading text-body-lg font-semibold">
                  {item.title}
                </div>
              </div>

              <div className="flex flex-row justify-between items-center flex-shrink-0 mt-auto">
                <div className="text-xs md:text-body-sm text-txt-black-500 px-2 md:px-3 flex-shrink-0 font-body font-normal">
                  {item.date}
                </div>
                <div
                  className="px-2 md:px-3 pb-2 md:pb-0 flex items-center gap-1 text-txt-primary font-semibold
                    text-xs md:text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out"
                >
                  <span>{redirectDesc}</span>
                  <ArrowOutgoingIcon />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
