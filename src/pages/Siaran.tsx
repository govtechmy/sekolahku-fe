import Hero from "../components/shared/Hero"
import SearchBarMain from "../components/shared/SeachBar"
import Card from "../components/shared/Cards";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemNews } from "../contentData";
import { useState } from "react";

const CARDS_PER_PAGE = 12;

export default function Siaran() {
    const [currentPage, setCurrentPage] = useState(0);
    
    const totalPages = Math.ceil(dataItemNews.length / CARDS_PER_PAGE);
    
    const startIndex = currentPage * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
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
                            title: item.title
                        }} />
                    ))}  
                </Card>
                </div>
        </div>
    )
}