import { clx } from "@govtechmy/myds-react/utils";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { ArrowOutgoingIcon } from "@govtechmy/myds-react/icon";
import type { ReactNode } from "react";

interface HorizontalCardProps {
  children: ReactNode;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function Card({ children }: HorizontalCardProps) {
  return <>{children}</>;
}

interface HorizontalCardPaginationItemProps {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  type: "default" | "simple";
  handlePageChange: (page: number) => void;
}

//maintain image aspect ratio 16:9

function HorizontalCardPagination({
  pageNumber,
  pageSize,
  totalRecords,
  type,
  handlePageChange,
}: HorizontalCardPaginationItemProps) {
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
    headerColor?: string;
    date: string;
    title: string;
    redirectDesc?: string;
  };
  className?: string;
  classNameHeader?: string;
  onClick: () => void;
}

function HorizontalCardItem({
  item,
  className = "",
  classNameHeader = "",
  onClick,
}: HorizontalCardItemProps) {
  return (
    <div
      tabIndex={0}
      className={`group border border-otl-gray-200 rounded-lg p-2 md:p-3
          w-full flex flex-col cursor-pointer
          transition-shadow hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <img
        src={item.imageSrc}
        alt={item.imageAlt}
        className="w-full aspect-[16/9] rounded-[6px] object-cover flex-shrink-0"
      />

      <div className="flex flex-col gap-1.5 md:gap-2 px-2 md:px-3 pt-2 md:pt-3 pb-2 min-h-[120px] md:min-h-[140px]">
        <p
          className={clx(
            "text-xs md:text-sm font-semibold flex-shrink-0",
            classNameHeader,
          )}
          style={item.headerColor ? { color: item.headerColor } : undefined}
        >
          {item.header}
        </p>

        <p className="text-sm md:text-body-lg font-semibold text-txt-black-900 line-clamp-2 md:line-clamp-3">
          {item.title}
        </p>
      </div>

      <div className="flex flex-row justify-between items-center flex-shrink-0">
        <p className="text-xs md:text-sm text-txt-black-500 px-2 md:px-3 pb-2 md:pb-0 flex-shrink-0">
          {item.date}
        </p>
        {item.redirectDesc && (
          <div
            className="px-2 md:px-3 pb-2 md:pb-0 flex items-center gap-1 text-txt-primary font-semibold
                    text-xs md:text-sm opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-300 ease-out"
          >
            <span>{item.redirectDesc}</span>
            <ArrowOutgoingIcon className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
Card.Pagination = HorizontalCardPagination;
Card.Item = HorizontalCardItem;

export default Card;
