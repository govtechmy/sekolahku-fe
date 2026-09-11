import { Link, useParams } from "react-router-dom";
import { ArrowOutgoingIcon, CalendarIcon } from "@govtechmy/myds-react/icon";
import type { SiaranItem } from "../../models/response";
import { formatDate } from "../../utils/dateFormatter";
import { clx } from "@govtechmy/myds-react/utils";

type SectionItemNewsProps = {
  dataItemNews: SiaranItem[];
  mainTitle?: string;
  redirectDesc?: string;
  mainTitleClassName?: string;
};

export default function SectionItemNews({
  dataItemNews,
  mainTitle,
  redirectDesc,
  mainTitleClassName,
}: SectionItemNewsProps) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="w-full flex flex-col justify-center gap-8">
      <div className="flex flex-col gap-2">
        {/* Header */}
        <div
          className={clx("flex mb-12 mt-4 items-center", mainTitleClassName)}
        >
          {mainTitle && (
            <div className="text-txt-black-900 font-heading font-semibold text-heading-sm">
              {mainTitle}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6">
          {dataItemNews.slice(0, 4).map((item: SiaranItem, index: number) => (
            <Link
              key={index}
              to={`/${lang}/berita-kpm/${item._id}`}
              tabIndex={0}
              className="group border border-otl-gray-200 gap-[18px] rounded-lg p-2 md:p-3 w-full h-full flex flex-col cursor-pointer transition-shadow hover:shadow-lg focus:outline-primary-200"
            >
              {item.imageHero?.url && (
                <div className="relative flex-shrink-0">
                  <img
                    src={item.imageHero.url}
                    alt={item.imageHero.alt || "Imej Berita"}
                    className="w-full aspect-[16/9] rounded-[6px] object-cover"
                  />
                  {item.categoryInfo?.name && (
                    <span
                      className="absolute left-2 top-2 rounded-full px-2.5 py-1 text-body-xs font-semibold text-white"
                      style={{
                        backgroundColor: item.categoryInfo.colors || "#0062FF",
                      }}
                    >
                      {item.categoryInfo.name}
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 px-3 flex-grow">
                {item.articleDate && (
                  <div className="flex items-center gap-1.5 text-body-sm text-txt-black-500 font-body font-normal">
                    <CalendarIcon className="size-4 shrink-0" />
                    <span>{formatDate(item.articleDate, lang)}</span>
                  </div>
                )}

                {item.title && (
                  <div className="font-heading text-body-md font-semibold line-clamp-2 md:line-clamp-3">
                    {item.title}
                  </div>
                )}
              </div>

              <div className="flex flex-row justify-start items-center flex-shrink-0 mt-auto">
                <div className="px-2 md:px-3 pb-2 md:pb-0 flex items-center gap-1 text-txt-primary font-semibold text-xs md:text-sm transition-transform duration-300 ease-out group-hover:translate-x-0.5">
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
