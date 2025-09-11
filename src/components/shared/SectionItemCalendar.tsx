import { Tag } from "@govtechmy/myds-react/tag";
import HorizontalCard from "./HorizontalCard";

type CalendarItem = {
  day: string;
  date: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
};

type SectionItemCalendarProps = {
  dataItemCalendar: CalendarItem[];
  mainTitle: string;
};
export default function SectionItemCalendar({
  dataItemCalendar,
  mainTitle,
}: SectionItemCalendarProps) {
  return (
    <div className="w-full">
      <HorizontalCard mainTitle={mainTitle}>
        {dataItemCalendar.map((item, index) => (
          <div
            key={index}
            className="relative border border-otl-gray-200 rounded-lg p-3 h-[350px] !w-[248px] flex flex-shrink-0 flex-col gap-4.5"
          >
            {/* Background image */}
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="absolute inset-0 w-full h-full object-cover rounded-[6px] z-0 "
            />
            {/* Background Layer (only half height) */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)]"></div>

            {/* Foreground content */}
            <div className="relative z-10 flex flex-col justify-end h-full text-white px-3 pb-4 rounded-[6px] ">
              <Tag variant="primary" className="w-fit">
                <div>{item.day}</div>
                <div> | </div>
                <div>{item.date}</div>
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
