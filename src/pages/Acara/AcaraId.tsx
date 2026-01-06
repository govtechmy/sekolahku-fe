import { useParams } from "react-router-dom";
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
import DotIcon from "../../icons/DotIcon";
import { useEffect, useState } from "react";
import type { AcaraItem } from "../../types/acara";
import { getAcaraById } from "../../services/acara.svc";
import { formatFullEventDate, formatEventTime } from "../../utils/date";
import LexicalRenderer from "../../components/LexicalRenderer";

export default function AcaraId() {
  const { lang } = useParams<{ lang: string }>();

  // Find the news item by ID
  const { id } = useParams<{ id: string }>();
  const [contents, setContents] = useState<AcaraItem | null>(null);

  useEffect(() => {
    const fetchAcaraById = async (id: string) => {
      try {
        const response = await getAcaraById(id);
        console.log("acara by id:", response);
        setContents(response);
      } catch (error) {
        console.error("Error fetching acara by id:", error);
      }
    };

    if (id) {
      fetchAcaraById(id);
    }
  }, [id]);

  return (
    <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center print:py-0">
      {contents && (
        <div className="flex flex-col gap-6 max-w-[825px]">
          <Breadcrumb className="md:px-10 print:hidden">
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/acara`}>Acara</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{contents.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>

          <div className="flex flex-col gap-3 md:px-10">
            <span className={clx("text-sm font-semibold text-success-700")}>
              Acara
            </span>
            <p className=" text-2xl font-semibold">{contents.title}</p>

            <div className=" flex flex-row gap-2 text-bg-black-500">
              <div className=" flex flex-row gap-1 items-center">
                <ClockIcon /> Bacaan {contents.readTime} min
              </div>
              <div className="flex items-center">
                <DotIcon className="size-0.5" />
              </div>
              <div>
                {formatFullEventDate(contents.articleDate)},{" "}
                {formatEventTime(contents.articleDate)}
              </div>
            </div>
          </div>

          <div className="md:px-10 print:hidden">
            <div className="flex justify-between pb-[18px] border-b-2 border-gray-200">
              <SocialLinks links={siaranSocialLinks} classNameButton="p-2" />
              <div className="flex items-center ">
                <Button
                  variant="default-outline"
                  onClick={() => window.print()}
                >
                  <PrinterIcon /> Cetak
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <img
              src={contents.imageHero.url}
              alt={contents.imageHero.alt}
              className="h-[415px] object-contain rounded-lg"
            />
            <span className="text-txt-black-500 text-center font-body font-normal text-sm">
              Image from{" "}
              <span className="italic">{contents.imageHero.url}</span>
            </span>
          </div>

          <div className="text-xl text-justify font-normal md:px-10">
            <LexicalRenderer
              editorState={contents.content}
              className=" flex flex-col gap-10 text-[15px] text-txt-black-700 font-body font-normal"
            />
          </div>

          {JSON.stringify(contents.attachments)}

          <div className="md:px-10 pt-6 border-t border-otl-gray-200">
            {/* <FileList files={contents.attachments} /> */}
          </div>
        </div>
      )}
    </div>
  );
}
