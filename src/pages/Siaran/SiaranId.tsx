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
import { ClockIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import SocialLinks from "../../components/shared/SocialLinks";
import { siaranSocialLinks } from "../../contentData";

export default function SiaranId() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  // Find the news item by ID
  const newsItem = dataItemNews.find((item) => item.id === id);

  // If item not found, show error message
  if (!newsItem) {
    return (
      <div className="px-4 md:px-20 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Siaran Tidak Dijumpai</h1>
          <p className="text-gray-600 mb-6">
            Maaf, siaran yang anda cari tak wujud.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate(`/${lang}/siaran`)}>
              Kembali ke Siaran
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center print:py-0">
      <div className="flex flex-col gap-6 max-w-[825px]">
        <Breadcrumb className="md:px-10 print:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/siaran`}>Siaran</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{newsItem.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col gap-3 md:px-10">
          <span
            className={clx(
              "text-sm font-semibold",
              newsItem.header === "Berita"
                ? "text-txt-primary"
                : "text-success-700",
            )}
          >
            {newsItem.header}
          </span>
          <p className=" text-2xl font-semibold">{newsItem.title}</p>

          <div className=" flex flex-row gap-2 text-bg-black-500">
            <div className=" flex flex-row gap-1 items-center">
              <ClockIcon /> Bacaan {newsItem.readTime}
            </div>
            .<div>{newsItem.date}, 2:30PM</div>
          </div>
        </div>

        <div className="md:px-10 print:hidden">
          <div className="flex justify-between pb-[18px] border-b-2 border-gray-200">
            <SocialLinks links={siaranSocialLinks} classNameButton="p-2" />
            <div className="flex items-center ">
              <Button variant="default-outline" onClick={() => window.print()}>
                <PrinterIcon /> Cetak
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <img
            src={newsItem.imageSrc}
            alt={newsItem.imageAlt}
            className="min-h-[250px] rounded-lg"
          />
          <span className="text-bg-black-500 text-center">
            Image from {newsItem.link}
          </span>
        </div>

        <p className=" text-2xl font-semibold md:px-10">
          {newsItem.description}
        </p>

        <p className="md:px-10">{newsItem.content}</p>
      </div>
    </div>
  );
}
