import Hero from "../../components/shared/Hero"
import SearchBarMain from "../../components/shared/SearchBar";
import Card from "../../components/shared/Cards";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemNews } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { clx } from "@govtechmy/myds-react/utils";

export default function Siaran() {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();
    
    const PAGE_SIZE = 12;
    const totalPages = Math.ceil(dataItemNews.length / PAGE_SIZE);

    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentCards = dataItemNews.slice(startIndex, endIndex);

    return (
        <div className="">
            <Hero 
            title="Siaran Sekolahku"
            variant="full"
            search={<SearchBarMain desc='"tajuk siaran", "pengumuman"' />}
            background={
                <>
                    <div
                        className="block h-full w-full bg-center bg-no-repeat bg-cover lg:hidden"
                        style={{
                            backgroundImage: `url('/utama/siaran/hero-banner/mobile-sekolahku.svg')`,
                        }}
                    />
                    <div
                        className="hidden h-full w-full bg-cover bg-center bg-no-repeat lg:block"
                        style={{
                            backgroundImage: `url('/utama/siaran/hero-banner/large-sekolahku.svg')`,
                        }}
                    />
                </>
            }
            filters={<DateRangePicker/>}>
            </Hero>

            <div className="py-12">
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