import { clx } from "@govtechmy/myds-react/utils";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";
import type { ReactNode } from "react";
import { useState } from "react";

interface HorizontalCardProps {
  children: ReactNode;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function Card({ children}: HorizontalCardProps) {
  return (
    <>{children}</>
  );
}

interface HorizontalCardPaginationItemProps {
    pageNumber:number;
    pageSize: number;
    totalRecords: number;
    type: "default" | "simple";
    handlePageChange: (page: number) => void;
}

function HorizontalCardPagination({ pageNumber, pageSize, totalRecords, type, handlePageChange }: HorizontalCardPaginationItemProps) {
  const totalPages = Math.ceil(totalRecords / pageSize);

  if (totalPages <= 1) return null;

  return (
    <AutoPagination
      page={pageNumber}
      limit={pageSize}
      count={totalRecords}
      type={type}
      maxDisplay={4}
      onPageChange={handlePageChange}
    />
  );
}

interface HorizontalCardItemProps {
    item: {
      imageSrc: string;
      imageAlt: string;
      header: string;
      date: string;
      title: string;
    };
    className?: string;
    classNameHeader?: string; 
    onClick: () => void;
  }

function HorizontalCardItem({ item, className = "", classNameHeader="", onClick }: HorizontalCardItemProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`border border-otl-gray-200 rounded-lg p-2 md:p-3 h-[260px] sm:h-[300px] md:h-[354px] w-full flex flex-col cursor-pointer transition-shadow hover:shadow-lg ${className}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="w-full h-[110px] sm:h-[130px] md:h-[150px] rounded-[6px] object-cover flex-shrink-0"
        />

        <div className="flex flex-col gap-1.5 md:gap-2 px-2 md:px-3 flex-1 min-h-0 overflow-hidden pt-2 md:pt-3">
            <p className={clx(
                "text-xs md:text-sm font-semibold flex-shrink-0",
                classNameHeader
            )}>
                {item.header}
            </p>

            <p className="text-sm md:text-body-lg font-semibold text-txt-black-900 line-clamp-3 flex-1">
                {item.title}
            </p>
        </div>

        <div className="flex flex-row justify-between items-center">
            <p className="text-xs md:text-sm text-txt-black-500 px-2 md:px-3 pb-2 md:pb-0 flex-shrink-0">
                {item.date}
            </p>
            <div
                className={`px-2 md:px-3 pb-2 md:pb-0 flex items-center gap-1 text-txt-primary font-semibold text-xs md:text-sm transition-all duration-300 ${
                    isHovered
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                }`}
            >
                <span>Baca</span>
                <ArrowOutgoingIcon className="w-3 h-3 md:w-4 md:h-4"/>
            </div>
        </div>
    </div>
  );
}
Card.Pagination = HorizontalCardPagination;
Card.Item = HorizontalCardItem;


export default Card;
 