import { useParams, useNavigate } from "react-router-dom";
import { dataItemNews } from "../../contentData";
import { Button } from "@govtechmy/myds-react/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
import { ClockIcon, LinkDiagonalIcon, EmailIcon, FacebookIcon, TwitterXIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import "./print.css";

export default function SiaranId() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();

    // Find the news item by ID
    const newsItem = dataItemNews.find(item => item.id === id);

    // If item not found, show error message
    if (!newsItem) {
        return (
            <div className="px-4 md:px-20 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Siaran Tidak Dijumpai</h1>
                    <p className="text-gray-600 mb-6">Maaf, siaran yang anda cari tak wujud.</p>
                    <Button onClick={() => navigate(`/${lang}/siaran`)}>
                        Kembali ke Siaran
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center">
            <div className="flex flex-col gap-6 max-w-[825px] print-area">
                <Breadcrumb className="md:px-10 no-print">
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/${lang}/siaran`}>Siaran</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{newsItem.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </Breadcrumb>

                <div className="flex flex-col gap-3 md:px-10">
                    <span className={
                        clx("text-sm font-semibold",
                            newsItem.header === "Berita" ? "text-txt-primary" : "text-success-700"
                        )}>
                        {newsItem.header}
                    </span>
                    <p className=" text-2xl font-semibold">{newsItem.title}</p>

                    <div className=" flex flex-row gap-2 text-bg-black-500">
                        <div className=" flex flex-row gap-1"><ClockIcon /> Bacaan {newsItem.readTime}</div>
                        .
                        <div>{newsItem.date}, 2:30PM</div>
                    </div>
                </div>

                <div className="md:px-10 no-print">
                    <div className=" flex flex-row justify-between pb-[18px] border-b-2 border-gray-200">
                        <ul className=" flex flex-row items-center gap-4">
                            <li className=" hover:text-primary-500"><LinkDiagonalIcon /></li>
                            <li className=" hover:text-primary-500"><EmailIcon /></li>
                            <li className=" hover:text-primary-500"><FacebookIcon /></li>
                            <li className=" hover:text-primary-500"><TwitterXIcon /></li>
                        </ul>

                        <div className=" py-[6px] px-[10px] flex flex-row gap-2 border border-otl-gray-200 rounded-md hover:bg-otl-gray-100 cursor-pointer" onClick={() => window.print()}>
                            <PrinterIcon />
                            <span className="text-sm font-medium">Cetak</span>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col gap-3">
                    <img
                        src={newsItem.imageSrc}
                        alt={newsItem.imageAlt}
                        className="min-h-[250px] rounded-lg"
                    />
                    <span className="text-bg-black-500 text-center">Image from {newsItem.link}</span>
                </div>

                <p className=" text-2xl font-semibold md:px-10">{newsItem.description}</p>

                <p className="md:px-10">{newsItem.content}</p>
            
            </div>
        </div>
    );
}