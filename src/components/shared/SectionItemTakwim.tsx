import { SearchIcon } from "@govtechmy/myds-react/icon";
import { Tag } from "@govtechmy/myds-react/tag";
import PdfIconTakwim from "../../icons/pdfIconTakwim";
import type { TakwimItem } from "../../types/takwim";
import { formatEventDateMonth, formatEventDay } from "../../utils/date";
import { useNavigate } from "react-router-dom";

type SectionItemTakwimProps = {
  dataItemCalendar: TakwimItem[];
  lang: string | undefined;
};

export default function SectionItemTakwim({
  dataItemCalendar,
  lang,
}: SectionItemTakwimProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-6">
      {dataItemCalendar.map((item, index) => (
        <div
          key={index}
          className="w-full border border-otl-gray-200 rounded-lg cursor-pointer focus:outline-primary-200 hover:bg-bg-gray-50"
          onClick={() => {
            navigate(`/${lang}/takwim/${item._id}`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate(`/${lang}/takwim/${item._id}`);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={item.title ? `${item.title}` : "View event"}
        >
          <div className="flex p-3 gap-2">
            <PdfIconTakwim className="size-[60px] flex-shrink-0" />
            <div className="grow gap-2 flex flex-col min-w-0">
              <div>
                {item.articleDate && (
                  <Tag mode="pill" variant="primary">
                    <div>{formatEventDay(item.articleDate).toUpperCase()}</div>
                    <div> | </div>
                    <div>
                      {formatEventDateMonth(item.articleDate).toUpperCase()}
                    </div>
                  </Tag>
                )}
              </div>

              {item.title && (
                <div className="text-txt-black-700 text-body-lg font-semibold">
                  {item.title}
                </div>
              )}
            </div>
            <div className="items-center flex max-sm:hidden !w-[161px] flex-shrink-0">
              <div className="border border-otl-gray-200 flex px-2.5 py-1.5 rounded-md gap-1.5 items-center flex-shrink-0 shadow-button hover:bg-bg-gray-50">
                <SearchIcon className="size-4" />
                <div className="text-body-sm font-medium text-txt-black-700">
                  Semak Takwim
                </div>
              </div>
            </div>
          </div>
          <div className="items-center flex sm:hidden pl-[80px] mb-3">
            <div className="border border-otl-gray-200 flex px-2.5 py-1.5 rounded-md gap-1.5 items-center flex-shrink-0 shadow-button hover:bg-bg-gray-50">
              <SearchIcon className="size-4" />
              <div className="text-body-sm font-medium text-txt-black-700">
                Semak Takwim
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
