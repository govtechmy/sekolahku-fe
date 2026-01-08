import HorizontalCard from "./HorizontalCard";
import { Link, useParams } from "react-router-dom";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";
import type { SiaranItem } from "../../models/response";
import CategoryLabel from "./CategoryLabel";
import { formatDate } from "../../utils/dateFormatter";

type SectionItemNewsProps = {
  dataItemNews: SiaranItem[];
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
    <div className=" w-full">
      <HorizontalCard
        mainTitle={mainTitle}
        showNavigation={false}
        mobileVariant="grid"
      >
        {dataItemNews.slice(0, 4).map((item: SiaranItem, index: number) => (
          <Link
            key={index}
            to={`/${lang}/siaran/${item._id}`}
            className="group border border-otl-gray-200 rounded-lg p-3 h-[354px] !max-w-[247px] flex-shrink-0 flex flex-col gap-4.5 transition-shadow hover:shadow-lg cursor-pointer"
          >
            <img
              src={item.imageHero.url}
              alt={item.imageHero.alt}
              className="h-[150px] rounded-[6px] overflow-hidden"
            />

            <div className="flex flex-col gap-2 px-3 flex-grow">
              <CategoryLabel categoryName={item.categoryInfo.name} />

              <div className="font-heading text-body-lg font-semibold">
                {item.title}
              </div>
            </div>

            <div className="flex flex-row justify-between items-center">
              <div className="px-3 pb-2 text-sm font-normal text-txt-black-500">
                {formatDate(item.articleDate).toUpperCase()}
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
      </HorizontalCard>
    </div>
  );
}
