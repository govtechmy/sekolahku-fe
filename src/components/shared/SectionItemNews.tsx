import { useParams } from "react-router-dom";
import { clx } from "@govtechmy/myds-react/utils";
import NewsCard, { type NewsCardItem } from "./NewsCard";

type SectionItemNewsProps = {
  dataItemNews: NewsCardItem[];
  mainTitle?: string;
  redirectDesc?: string;
  mainTitleClassName?: string;
};

export default function SectionItemNews({
  dataItemNews,
  mainTitle,
  redirectDesc = "Baca seterusnya",
  mainTitleClassName,
}: SectionItemNewsProps) {
  const { lang } = useParams<{ lang: string }>();

  return (
    <div className="w-full flex flex-col justify-center gap-8">
      <div className="flex flex-col gap-2">
        {mainTitle && (
          <div
            className={clx("flex mb-12 mt-4 items-center", mainTitleClassName)}
          >
            <div className="text-txt-black-900 font-heading font-semibold text-heading-sm">
              {mainTitle}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {dataItemNews.slice(0, 4).map((item, index) => (
            <NewsCard
              key={item._id || index}
              item={item}
              lang={lang}
              redirectDesc={redirectDesc}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
