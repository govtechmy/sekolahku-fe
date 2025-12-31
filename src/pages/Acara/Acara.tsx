import { Tag } from "@govtechmy/myds-react/tag";
import { dataItemCalendar } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useRef, useState, useMemo } from "react";
import AcaraHero from "../../components/Hero/AcaraHero";

export default function Acara() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const inputRef = useRef<HTMLInputElement>(null!);
  // later fetch, not functioning yet
  const [currentPage, setCurrentPage] = useState(0);
  const [query, setQuery] = useState("");

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        // Avoid triggering when typing in inputs
        const target = e.target as HTMLElement;
        const isTyping =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;
  
        if (isTyping) return;
  
        if (e.key === "/") {
          e.preventDefault(); // stop browser quick-find
          inputRef.current?.focus();
        }
      };
  
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, []);
  
    const filteredResult = useMemo(() => {
      if (!query) return dataItemCalendar;
      return dataItemCalendar.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
    }, [query]);
  
    const handleValueChange = (value: string) => {
      setQuery(value);
      setCurrentPage(0); 
    };
  
  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(filteredResult.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCards = filteredResult.slice(startIndex, endIndex);

  return (
    <>
      <AcaraHero
              query={query}
              setQuery={setQuery}
              handleValueChange={handleValueChange}
              suggestions={filteredResult.slice(0, 10)}
      />
      <div className=" mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1280px] py-16 flex flex-col">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCards.map((item) => (
              <div
                key={item.id}
                className="relative border border-otl-gray-200 rounded-lg h-[350px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  navigate(`/${lang}/acara/${item.id}`);
                }}
              >
                {/* Background image */}
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Background Layer (only half height) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)]"></div>

                {/* Foreground content */}
                <div className="relative z-10 flex flex-col justify-end h-full text-white p-4">
                  <Tag variant="primary" className="w-fit mb-3">
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
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <AutoPagination
              page={currentPage}
              limit={PAGE_SIZE}
              count={totalPages}
              maxDisplay={4}
              onPageChange={(page) => setCurrentPage(page - 1)}
              type="default"
            />
          </div>
        </div>
      </div>
    </>
  );
}
