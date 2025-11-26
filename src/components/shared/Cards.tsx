import { Button, ButtonIcon } from "@govtechmy/myds-react/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useRef, createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


interface HorizontalCardContextType {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  scroll: (offset: number) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  totalPages: number;
  setTotalPages: (total: number) => void;
}

const HorizontalCardContext = createContext<HorizontalCardContextType | null>(null);
const scrollAmount = 248 + 18;

const useHorizontalCard = () => {
  const context = useContext(HorizontalCardContext);
  if (!context) {
    throw new Error('HorizontalCard components must be used within a HorizontalCard');
  }
  return context;
};

interface HorizontalCardProps {
  children: ReactNode;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

function Card({ children, totalPages: externalTotalPages, currentPage: externalCurrentPage, onPageChange }: HorizontalCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const [internalTotalPages, setInternalTotalPages] = useState(4);
  const activeIndex = externalCurrentPage !== undefined ? externalCurrentPage : internalActiveIndex;
  const totalPages = externalTotalPages !== undefined ? externalTotalPages : internalTotalPages;
  
  const setActiveIndex = (newIndex: number) => {
    if (onPageChange) {
      onPageChange(newIndex);
    } else {
      setInternalActiveIndex(newIndex);
    }
  };

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  const contextValue = {
    scrollRef,
    scroll,
    activeIndex,
    setActiveIndex,
    totalPages,
    setTotalPages: setInternalTotalPages,
  };

  return (
    <HorizontalCardContext.Provider value={contextValue}>
      <div className=" flex flex-col justify-center  gap-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 min-h-[calc(3*260px+2*12px)] sm:min-h-[calc(3*300px+2*12px)] md:min-h-[calc(3*354px+2*24px)]">{children}</div>
        <div className="flex justify-center">
          <HorizontalCardDots />
        </div>
      </div>
    </HorizontalCardContext.Provider>
  );
}

interface HorizontalCardArrowButtonProps {
  direction: 'left' | 'right';
}

function HorizontalCardArrowButton({ direction }: HorizontalCardArrowButtonProps) {
  const { activeIndex, setActiveIndex, totalPages, scrollRef } = useHorizontalCard();
  
  const handleClick = () => {
    let newIndex = activeIndex;
    
    if (direction === 'left' && activeIndex > 0) {
      newIndex = activeIndex - 1;
    } else if (direction === 'right' && activeIndex < totalPages - 1) {
      newIndex = activeIndex + 1;
    }
    
    // Update the active index
    setActiveIndex(newIndex);
    
    // Scroll to the new position
    if (scrollRef.current) {
      const scrollPosition = scrollAmount * newIndex;
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
  };

  const isDisabled = 
    (direction === 'left' && activeIndex === 0) || 
    (direction === 'right' && activeIndex === totalPages - 1);

  return (
    <Button
      variant="default-outline"
      className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={handleClick}
      disabled={isDisabled}
    >
      <ButtonIcon>
        {direction === 'left' ? (
          <ChevronLeftIcon className="size-5" />
        ) : (
          <ChevronRightIcon className="size-5" />
        )}
      </ButtonIcon>
    </Button>
  );
}


// Numbered pagination with navigation arrows
function HorizontalCardDots() {
  const { activeIndex, setActiveIndex, totalPages } = useHorizontalCard();

  const handlePageChange = (page: number) => {
    setActiveIndex(page - 1);
  };

  if (totalPages <= 1) return null;

  return (
    <AutoPagination
      page={activeIndex + 1} // Convert to 1-based index for AutoPagination
      limit={1} // Items per page (not relevant for our use case, but required)
      count={totalPages} // Total number of pages
      type="default"
      maxDisplay={5} // Maximum number of page buttons to display
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
    onClick: () => void;
  }

function HorizontalCardItem({ item, className = "", onClick }: HorizontalCardItemProps) {
    return (
      <div
        className={`border border-otl-gray-200 rounded-lg p-2 md:p-3 h-[260px] sm:h-[300px] md:h-[354px] w-full flex flex-col cursor-pointer ${className}`}
        onClick={onClick}
      >
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="w-full h-[110px] sm:h-[130px] md:h-[150px] rounded-[6px] object-cover flex-shrink-0"
        />

        <div className="flex flex-col gap-1.5 md:gap-2 px-2 md:px-3 flex-1 min-h-0 overflow-hidden pt-2 md:pt-3">
            <p className={clx(
                "text-xs md:text-sm font-semibold flex-shrink-0",
                item.header === 'Berita' && 'text-txt-primary',
                item.header === 'Pengumuman' && 'text-success-700',
            )}>
                {item.header}
            </p>

            <p className="text-sm md:text-body-lg font-semibold text-txt-black-900 line-clamp-3 flex-1">
                {item.title}
            </p>
        </div>

        <p className="text-xs md:text-sm text-txt-black-500 px-2 md:px-3 pb-2 md:pb-0 flex-shrink-0">
            {item.date}
        </p>
    </div>
  );
}



// Compound component exports
Card.ArrowButton = HorizontalCardArrowButton;
Card.Dots = HorizontalCardDots;
Card.Item = HorizontalCardItem;


export default Card;
 