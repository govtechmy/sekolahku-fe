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
    
    const totalPages = Math.ceil(dataItemNews.length / 12);

    const startIndex = currentPage * 12;
    const endIndex = startIndex + 12;
    const currentCards = dataItemNews.slice(startIndex, endIndex);

    return (
        <div className="">
            <Hero 
            title="Siaran Sekolahku"
            variant="full"
            search={<SearchBarMain desc='"tajuk siaran", "pengumuman"' />}
            background={<img src="/utama/siaran/hero-banner/sekolahku-1.png" alt="siaran hero"/>}
            filters={<DateRangePicker/>}>
            </Hero>

            <div className="px-4 md:px-20 py-12">
                <Card 
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                >
                    <div className="flex flex-col justify-center gap-8">
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6 min-h-[calc(3*260px+2*12px)] sm:min-h-[calc(3*300px+2*12px)] md:min-h-[calc(3*354px+2*24px)]">
                            {currentCards.map((item, index) => (
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
                                    }} 
                                    onClick={() => {
                                        navigate(`/${lang}/siaran/${item.id}`);
                                    }}
                                />
                            ))}  
                        </div>
                        <div className="flex justify-center">
                            <Card.Pagination pageNumber={currentPage + 1} pageSize={12} totalRecords={dataItemNews.length} type="default" handlePageChange={(page) => setCurrentPage(page - 1)} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}