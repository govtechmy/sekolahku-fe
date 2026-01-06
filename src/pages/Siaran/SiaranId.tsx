import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@govtechmy/myds-react/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
import { ClockIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import SocialLinks from "../../components/shared/SocialLinks";
import FileList from "../../components/shared/FileList";
import { siaranSocialLinks } from "../../contentData";
import DotIcon from "../../icons/DotIcon";
import type { Document } from "../../types/files";
import { useEffect, useState } from "react";
import { getSiaranById } from "../../services/siaran.svc";
import type { SiaranItem } from "../../models/response";
import { formatDate } from "../../utils/dateFormatter";


export default function SiaranId() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [newsItem, setNewsItem] = useState<SiaranItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSiaran = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await getSiaranById(id);
        setNewsItem(response);
      } catch (error) {
        console.error("Error fetching siaran detail:", error);
        setNewsItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSiaran();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="px-4 md:px-20 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Memuatkan...</p>
        </div>
      </div>
    );
  }
  const filesItem: Document[] = siaranAcaraDummyDocuments;

  // If item not found, show error message
  if (!newsItem) {
    return (
      <div className="px-4 md:px-20 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Siaran Tidak Dijumpai</h1>
          <p className="text-gray-600 mb-6">
            Maaf, siaran yang anda cari tak wujud.
          </p>
          <Button onClick={() => navigate(`/${lang}/siaran`)}>
            Kembali ke Siaran
          </Button>
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
            className="text-sm font-semibold"
            style={{ color: newsItem.categoryDetails?.colors }}
          >
            {newsItem.categoryDetails?.name}
          </span>
          <p className=" text-2xl font-semibold">{newsItem.title}</p>

          <div className=" flex flex-row gap-2 text-bg-black-500 items-center">
            <div className=" flex flex-row gap-1 items-center">
              <ClockIcon /> Bacaan {newsItem.readTime} min
            </div>
            <DotIcon />
            <div>{formatDate(newsItem.articleDate)}</div>
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
            src={newsItem.imageHero?.url}
            alt={newsItem.imageHero?.alt}
            className="min-h-[250px] rounded-lg object-cover"
          />
        </div>

        <div className="md:px-10 prose max-w-none">
          {/* TODO: Implement proper content rendering based on newsItem.content structure */}
          <div className="whitespace-pre-wrap">
            {JSON.stringify(newsItem.content, null, 2)}
          </div>
        </div>

        <div className="border-t border-otl-gray-200 md:mx-10">
          <FileList files={filesItem} />
        </div>
      </div>
    </div>
  );
}
