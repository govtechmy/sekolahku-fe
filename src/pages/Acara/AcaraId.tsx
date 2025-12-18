import { useParams, useNavigate } from "react-router-dom";
import { dataItemCalendar } from "../../contentData";
import { Button } from "@govtechmy/myds-react/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
  } from "@govtechmy/myds-react/breadcrumb";
  import { CalendarIcon, LinkDiagonalIcon, EmailIcon, FacebookIcon, TwitterXIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import { Tag } from "@govtechmy/myds-react/tag";

export default function AcaraId() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();
    
    const calendarIndex = parseInt(id || '0', 10);
    const calendarItem = dataItemCalendar[calendarIndex];

    if (!calendarItem) {
        return (
            <div className="px-4 md:px-20 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Acara Tidak Dijumpai</h1>
                    <p className="text-gray-600 mb-6">Maaf, acara yang anda cari tidak wujud.</p>
                    <Button onClick={() => navigate(`/${lang}/acara`)}>
                        Kembali ke Acara
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center">
          <div className="flex flex-col gap-6 max-w-[825px]">
            <Breadcrumb className="md:px-10">
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${lang}/acara`}>Acara</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{calendarItem.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </Breadcrumb>
           
            <div className="flex flex-col gap-3 md:px-10">
                <Tag variant="primary" className="w-fit">
                    <div>{calendarItem.day}</div>
                    <div> | </div>
                    <div>{calendarItem.date}</div>
                </Tag>
                <p className="text-2xl font-semibold">{calendarItem.title}</p>

                <div className="flex flex-row gap-2 text-bg-black-500">
                    <div className="flex flex-row gap-1">
                        <CalendarIcon/> 
                        Acara {calendarItem.day}
                    </div>
                    .
                    <div>{calendarItem.date}</div>
                </div>
            </div>

            <div className="md:px-10">
                <div className=" flex flex-row justify-between pb-[18px] border-b-2 border-gray-200">
                    <ul className=" flex flex-row items-center gap-4">
                        <li className=" hover:text-primary-500"><LinkDiagonalIcon/></li>
                        <li className=" hover:text-primary-500"><EmailIcon/></li>
                        <li className=" hover:text-primary-500"><FacebookIcon/></li>
                        <li className=" hover:text-primary-500"><TwitterXIcon/></li>
                    </ul>

                    <div className=" py-[6px] px-[10px] flex flex-row gap-2 border border-otl-gray-200 rounded-md hover:bg-otl-gray-100 cursor-pointer">
                        <PrinterIcon/>
                        <span className="text-sm font-medium">Cetak</span>
                    </div>
                </div>
            </div>
                        

            <div className="flex flex-col gap-3">
                <img 
                    src={calendarItem.imageSrc} 
                    alt={calendarItem.imageAlt}
                    className="min-h-[250px] rounded-lg"
                />
                <span className="text-bg-black-500 text-center">Gambar acara {calendarItem.title}</span>
            </div>

            <div className="md:px-10">
                <h3 className="text-xl font-semibold mb-4">Butiran Acara</h3>
                <div className="space-y-3">
                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Nama Acara:</span>
                        <span>{calendarItem.title}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Tarikh:</span>
                        <span>{calendarItem.day}, {calendarItem.date}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-medium">Penerangan:</span>
                        <span>Maklumat lanjut mengenai acara ini akan dikemas kini tidak lama lagi.</span>
                    </div>
                </div>
            </div>
         
            </div>
        </div>
    );
}