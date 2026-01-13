import { Tag } from "@govtechmy/myds-react/tag";
import HorizontalCard from "./HorizontalCard";
import type { AcaraItem } from "../../types/acara";
import { formatEventDateMonth, formatEventDay } from "../../utils/date";
import { useNavigate } from "react-router-dom";

type SectionItemCalendarProps = {
  dataItemCalendar: AcaraItem[];
  mainTitle: string;
  lang: string | undefined;
};
export default function SectionItemCalendar({
  dataItemCalendar,
  mainTitle,
  lang,
}: SectionItemCalendarProps) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <HorizontalCard mainTitle={mainTitle}>
        {dataItemCalendar.map((item, index) => (
          <div
            key={index}
            className="relative border border-otl-gray-200 focus:border-otl-primary-200 focus:outline-none focus:ring-2 focus:ring-otl-primary-200 rounded-lg p-3 h-[350px] !w-[248px] flex flex-shrink-0 flex-col gap-4.5 group overflow-hidden cursor-pointer"
            onClick={() => {
              navigate(`/${lang}/acara/${item._id}`);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(`/${lang}/acara/${item._id}`);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={item.title ? `${item.title}` : "View event"}
          >
            {/* Background image */}
            <img
              src={item.imageHero.url}
              alt={item.imageHero.alt}
              className="absolute inset-0 w-full h-full object-cover rounded-[6px] z-0 transition-transform duration-300 group-hover:scale-110"
            />
            {/* Background Layer (only half height) with hover darker gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)] group-hover:bg-[linear-gradient(0deg,rgba(0,0,0,0.9)_0%,rgba(0,0,0,0)_100%)] transition-colors duration-300"></div>

            {/* Foreground content */}
            <div className="relative z-10 flex flex-col justify-end h-full text-white px-3 pb-4 rounded-[6px] ">
              <Tag variant="primary" className="w-fit">
                <div>{formatEventDay(item.articleDate)}</div>
                <div> | </div>
                <div>{formatEventDateMonth(item.articleDate)}</div>
              </Tag>
              <div className="text-txt-white text-body-lg font-semibold">
                {item.title}
              </div>
            </div>
          </div>
        ))}
      </HorizontalCard>
    </div>
  );
}
