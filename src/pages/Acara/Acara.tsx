import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import { Tag } from "@govtechmy/myds-react/tag";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState } from "react";
import { getAllAcara } from "../../services/acara.svc";
import type { AcaraItem } from "../../types/acara";
import { formatEventDay, formatEventDateMonth } from "../../utils/date";

export default function Acara() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  // later fetch, not functioning yet
  const [items, setItems] = useState<AcaraItem[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(12)
  const [totalRecord, setTotalRecord] = useState<number>(0)


  useEffect(() => {
    const fetchAcara = async () => {
      try {
        const response = await getAllAcara(pageNumber)
        setItems(response.items)
        setPageNumber(response.pageNumber)
        setPageSize(response.pageSize)
        setTotalRecord(response.totalRecords)
      } catch (error) {
        console.error("Error fetching acara:", error);
      }
    };

    fetchAcara();
  }, [pageNumber]);

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
            {items?.map((item) => (

              <div
                key={item._id}
                className="relative border border-otl-gray-200 rounded-lg h-[350px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => {
                  navigate(`/${lang}/acara/${item._id}`);
                }}
              >
                {/* Background image */}
                <img
                  src={item.imageHero.url}
                  alt={item.imageHero.alt}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Background Layer (only half height) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0)_100%)]"></div>
                {/* Foreground content */}
                <div className="relative z-10 flex flex-col justify-end h-full text-white p-4">
                  <Tag variant="primary" className="w-fit mb-3">
                  
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
          </div>
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <AutoPagination
              page={pageNumber}
              limit={pageSize}
              count={totalRecord}
              maxDisplay={4}
              onPageChange={(page) => setPageNumber(page)}
              type="default"
            />
          </div>
        </div>
      </div>
    </>
  );
}
