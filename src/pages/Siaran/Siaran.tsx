import Card from "../../components/shared/Cards";
import { dataItemNews } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { clx } from "@govtechmy/myds-react/utils";
import SiaranHero from "../../components/Hero/SiaranHero";

export default function Siaran() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const inputRef = useRef<HTMLInputElement>(null!);

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

    return (
        <>
            <SiaranHero/>
            <div className=" mx-auto flex-1 px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 flex flex-col">

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
        </>
    )
}