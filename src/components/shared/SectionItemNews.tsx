import HorizontalCard from "./HorizontalCard";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
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
};

export default function SectionItemNews({
  dataItemNews,
  mainTitle,
}: SectionItemNewsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className=" w-full">
      <HorizontalCard mainTitle={mainTitle}>
        {dataItemNews.map((item: NewsItem, index: number) => (
          <Link
            key={index}
            to={`/${lang}/siaran/${item.id}`}
            className="border border-otl-gray-200 rounded-lg p-3 h-[354px] !w-[247px] flex-shrink-0 flex flex-col gap-4.5 transition-shadow hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
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

            <div className="flex flex-row justify-between items-center">
              <div className="px-3 pb-2 text-sm font-normal text-txt-black-500">
                {item.date}
              </div>
              <div
                className={`px-3 pb-2 flex items-center gap-1 text-txt-primary font-semibold text-sm transition-all duration-300 ${
                  hoveredIndex === index
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-2"
                }`}
              >
                <span>Baca</span>
                <ArrowOutgoingIcon/>
              </div>
            </div>
          </Link>
        ))}
      </HorizontalCard>
    </div>
  );
}
