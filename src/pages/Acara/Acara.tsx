import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import { Tag } from "@govtechmy/myds-react/tag";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemCalendar } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useState } from "react";

export default function Acara() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  // later fetch, not functioning yet
  const [currentPage, setCurrentPage] = useState(0);
  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(dataItemCalendar.length / PAGE_SIZE);
  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCards = dataItemCalendar.slice(startIndex, endIndex);

  return (
    <>
      <Hero
        title="Acara Sekolahku"
        variant="full"
        search={<SearchBarMain />}
        background={
          <>
            <div className="block lg:hidden h-full w-full bg-[url('/utama/siaran/hero-banner/mobile-sekolahku.svg')] bg-contain bg-center bg-no-repeat" />
            <div className="hidden lg:block h-full w-full bg-[url('/utama/siaran/hero-banner/large-sekolahku.svg')] bg-cover bg-center bg-no-repeat" />
          </>
        }
        filters={<DateRangePicker />}
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
