import Hero from "../../components/shared/Hero"
import SearchBarMain from "../../components/shared/SearchBar";
import Card from "../../components/shared/Cards";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemNews } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { clx } from "@govtechmy/myds-react/utils";

export default function Siaran() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const inputRef = useRef<HTMLInputElement>(null!);

  const [hasFocus, setHasFocus] = useState(false);
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

  const PAGE_SIZE = 12;
  const totalPages = Math.ceil(dataItemNews.length / PAGE_SIZE);

  const startIndex = currentPage * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentCards = dataItemNews.slice(startIndex, endIndex);
  const searchData = dataItemNews.map((item) => ({
    key: item.id,
    name: item.title,
    note: item.description,
  }));
  const searchResult = searchData.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.note.toLowerCase().includes(query.toLowerCase())
  );
  const handleClick = (id: string) => {
    // handle any additional logic on click
    navigate(`/${lang}/siaran/${id}`);
  }

  return (
    <div className="">
      <Hero
        title="Siaran Sekolahku"
        variant="full"
        search={
          <SearchBarMain
            desc='"tajuk siaran", "pengumuman"'
            hasFocus={hasFocus}
            setHasFocus={setHasFocus}
            query={query}
            setQuery={setQuery}
            hasQuery={query.length > 0}
            inputRef={inputRef}
            results={searchResult}
            onClick={handleClick}
          />
        }
        background={<img src="/utama/siaran/hero-banner/sekolahku-1.png" alt="siaran hero" />}
        filters={<DateRangePicker />}>
      </Hero>

      <div className="px-4 md:px-20 py-12">
        <Card
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}

        >
          <div className="flex flex-col justify-center gap-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {Array.from({ length: PAGE_SIZE }).map((_, index) => {
                const item = currentCards[index];
                if (!item) {
                  return <div key={`placeholder-${index}`} className="h-[260px] sm:h-[300px] md:h-[354px]" />;
                }
                return (
                  <Card.Item
                    classNameHeader={clx(
                      item.header === 'Berita' && 'text-txt-primary',
                      item.header === 'Pengumuman' && 'text-success-700',
                    )}
                    key={startIndex + index}
                    item={{
                      imageSrc: item.imageSrc,
                      imageAlt: item.imageAlt,
                      header: item.header,
                      date: item.date,
                      title: item.title,
                      redirectDesc: "Baca",
                    }}
                    onClick={() => {
                      navigate(`/${lang}/siaran/${item.id}`);
                    }}
                  />
                );
              })}
            </div>
            <div className="flex justify-center">
              <Card.Pagination pageNumber={currentPage + 1} pageSize={PAGE_SIZE} totalRecords={dataItemNews.length} type="default" handlePageChange={(page) => setCurrentPage(page - 1)} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}