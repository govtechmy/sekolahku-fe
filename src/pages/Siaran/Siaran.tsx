import Hero from "../../components/shared/Hero";
import SearchBarMain from "../../components/shared/SearchBar";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { useNavigate, useParams } from "react-router-dom";
import { AutoPagination } from "@govtechmy/myds-react/pagination";
import { useEffect, useState } from "react";
import { getSiaranList } from "../../services/siaran.svc";
import type { SiaranItem } from "../../models/response";
import Card from "../../components/shared/Cards";
import { formatDate } from "../../utils/dateFormatter";

export default function Acara() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  // later fetch, not functioning yet
  const [items, setItems] = useState<SiaranItem[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [totalRecord, setTotalRecord] = useState<number>(0);

  useEffect(() => {
    const fetchAcara = async () => {
      try {
        const response = await getSiaranList({ pageNumber });
        setItems(response.items);
        setPageNumber(response.pageNumber);
        setPageSize(response.pageSize);
        setTotalRecord(response.totalRecords);
      } catch (error) {
        console.error("Error fetching acara:", error);
      }
    };

    fetchAcara();
  }, [pageNumber]);

  return (
    <>
      <Hero
        title="Siaran Sekolahku"
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
      <div className=" mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">
        <Card totalPages={totalRecord}>
          <div className="flex flex-col justify-center gap-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {items?.map((item, index) => {
                if (!item) {
                  return (
                    <div
                      key={`placeholder-${index}`}
                      className="h-[260px] sm:h-[300px] md:h-[354px]"
                    />
                  );
                }
                return (
                  <Card.Item
                    key={item._id}
                    item={{
                      imageSrc: item.imageHero?.url,
                      imageAlt: item.imageHero?.alt,
                      header: item.categoryDetails?.name,
                      headerColor: item.categoryDetails?.colors,
                      date: formatDate(item.articleDate),
                      title: item.title,
                      redirectDesc: "Baca",
                    }}
                    onClick={() => {
                      navigate(`/${lang}/siaran/${item._id}`);
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-center">
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
        </Card>
      </div>
    </>
  );
}
