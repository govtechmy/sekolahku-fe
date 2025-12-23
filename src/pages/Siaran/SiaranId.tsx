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
import { clx } from "@govtechmy/myds-react/utils";
import { ClockIcon } from "@govtechmy/myds-react/icon";
import { ShareBar } from "../../components/shared/ShareBar";
  

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
        <div className="mx-auto px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-16 items-center justify-center flex">
          <div className="flex flex-col gap-6 max-w-[825px]">
            <Breadcrumb className="md:px-10">
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

                <div className="flex items-center gap-2 self-start text-bg-black-500">
                    <div className="flex items-center gap-1">
                        <ClockIcon />
                        <div>Bacaan {newsItem.readTime}</div>
                    </div>
                    <div className="">
                      <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="5" cy="5" r="1.5" fill="gray" />
                      </svg>
                    </div>
                    <div>{newsItem.date}, 2:30PM</div>
                </div>
            </div>

           <ShareBar title={newsItem.title} />

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