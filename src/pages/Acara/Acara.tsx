import Hero from "../../components/shared/Hero"
import SearchBarMain from "../../components/shared/SearchBar";
import { Tag } from "@govtechmy/myds-react/tag";
import { DateRangePicker } from "@govtechmy/myds-react/daterange-picker";
import { dataItemCalendar } from "../../contentData";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Acara() {
    const [currentPage, setCurrentPage] = useState(0);
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();
    
    const PAGE_SIZE = 12;
    const totalPages = Math.ceil(dataItemCalendar.length / PAGE_SIZE);

    const startIndex = currentPage * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const currentCards = dataItemCalendar.slice(startIndex, endIndex);

    return (
        <div className="">
            <Hero 
            title="Acara Sekolahku"
            variant="full"
            search={<SearchBarMain desc='"tajuk acara", "kalendar"' />}
            background={<img src="/utama/siaran/hero-banner/sekolahku-1.png" alt="acara hero"/>}
            filters={<DateRangePicker/>}>
            </Hero>

            <div className="px-4 md:px-20 py-12">
                <div className="flex flex-col gap-8">                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentCards.map((item, index) => (
                            <div
                                key={startIndex + index}
                                className="relative border border-otl-gray-200 rounded-lg h-[350px] flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => {
                                    // Navigate to individual calendar page using index as ID
                                    const calendarIndex = startIndex + index;
                                    navigate(`/${lang}/acara/${calendarIndex}`);
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
                        
                        {/* Fill remaining slots with empty divs for consistent grid */}
                        {Array.from({ length: PAGE_SIZE - currentCards.length }).map((_, index) => (
                            <div key={`empty-${index}`} className="h-[350px]" />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 border border-otl-gray-300 rounded disabled:opacity-50 hover:bg-bg-gray-50"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="px-4 py-2 border border-otl-gray-300 rounded disabled:opacity-50 hover:bg-bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}