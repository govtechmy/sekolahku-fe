import Hero from "../../components/shared/Hero"
import SearchBarMain from "../../components/shared/SearchBar";
import Card from "../../components/shared/Cards";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemNews } from "../../contentData";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

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
                    {currentCards.map((item, index) => (
                       <Card.Item
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
                        }}/>
                    ))}  
                </Card>
                </div>
        </div>
    )
}