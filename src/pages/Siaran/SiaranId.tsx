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
import {
    LinkDiagonalIcon,
    EmailIcon,
    FacebookIcon,
    TwitterXIcon,
    PrinterIcon,
    ClockIcon,
  } from "@govtechmy/myds-react/icon";
import DotIcon from "../../icons/DotIcon";

export default function SiaranId() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { lang } = useParams<{ lang: string }>();
    
    // Find the news item by ID
    const newsItem = dataItemNews.find(item => item.id === id);
    
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedTitle = newsItem ? encodeURIComponent(newsItem.title) : '';

    const shareIcons = [
        {
            name: "Copy Link",
            icon: <LinkDiagonalIcon />,
            action: async () => {
                try {
                    await navigator.clipboard.writeText(currentUrl);
                } catch {
                    alert("Failed to copy link");
                }
            },
        },
        {
            name: "Email",
            icon: <EmailIcon />,
            action: () =>
                window.open(
                    `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
                    "_self"
                ),
        },
        {
            name: "Facebook",
            icon: <FacebookIcon />,
            action: () =>
                window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
                    "_blank",
                    "noopener,noreferrer"
                ),
        },
        {
            name: "Twitter",
            icon: <TwitterXIcon />,
            action: () =>
                window.open(
                    `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
                    "_blank",
                    "noopener,noreferrer"
                ),
        },
    ];

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
        <div className="mx-auto px-[18px] sm:px-[18px] md:px-[24px] lg:px-[24px] xl:px-[24px] max-w-[1328px] py-12 items-center justify-center flex">
          <div className="flex flex-col gap-6 max-w-[825px]">
            <Breadcrumb className="">
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/${lang}/siaran`}>Siaran</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{newsItem.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </Breadcrumb>
           
            <div className="flex flex-col gap-3">
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
                    <div>
                      <DotIcon />
                    </div>
                    <div>{newsItem.date}, 2:30PM</div>
                </div>
            </div>

           <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
                {shareIcons.map((iconItem) => (
                    <Button 
                        key={iconItem.name}
                        variant="default-ghost"
                        onClick={iconItem.action}
                        aria-label={iconItem.name}
                    >
                        {iconItem.icon}
                    </Button>
                ))}
            </div>

            <div>
                <Button
                    variant="default-outline"
                    onClick={() => window.print()}
                >
                    <PrinterIcon className="mr-2" />
                    Cetak
                </Button>
            </div>
           </div>

           <hr />

            <div className="flex flex-col gap-3">
                <img 
                    src={newsItem.imageSrc} 
                    alt={newsItem.imageAlt}
                    className="min-h-[250px] rounded-lg"
                />
                <span className="text-bg-black-500 text-center">Image from {newsItem.link}</span>
            </div>

            <p className=" text-2xl font-semibold">{newsItem.description}</p>

            <p>{newsItem.content}</p>
         
            </div>
        </div>
    );
}