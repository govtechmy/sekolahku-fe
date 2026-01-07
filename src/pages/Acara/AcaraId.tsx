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
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getIcon } from "../../utils/getIconLogo";
import { formatFileSize } from "../../utils/formatFileSize";
import { downloadFile } from "../../services/download.svc";

export default function AcaraId() {
  const { lang } = useParams<{ lang: string }>();

  // Find the news item by ID
  const { id } = useParams<{ id: string }>();
  const [contents, setContents] = useState<AcaraItem | null>(null);

  useEffect(() => {
    const fetchAcaraById = async (id: string) => {
      try {
        const response = await getAcaraById(id);
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
            <span
              className={clx(
                "text-body-sm font-body font-semibold text-success-700",
              )}
            >
              Acara
            </span>
            <p className="text-2xl font-semibold font-body">{contents.title}</p>

            <div className=" flex flex-row gap-2 text-bg-black-500">
              <div className=" flex flex-row gap-1 items-center text-body-sm font-body font-normal">
                <ClockIcon /> Bacaan {contents.readTime} min
              </div>
              <div className="flex items-center">
                <DotIcon className="size-0.5" />
              </div>
              <div className="text-body-sm font-body font-normal">
                {formatFullEventDate(contents.articleDate)},{" "}
                {formatEventTime(contents.articleDate)}
              </div>
            </div>
          </div>
          <div className="md:px-10 print:hidden">
            <div className="flex justify-between pb-[18px] border-b border-gray-200">
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
              className="w-full max-h-[415px] object-contain rounded-lg"
            />
            <span className="text-txt-black-500 text-center font-body font-normal text-sm">
              Image from{" "}
              <span className="italic">{contents.imageHero.url}</span>
            </span>
          </div>
          <div className="text-xl text-justify font-normal md:px-10">
            <RichText
              className="richTextdiv flex flex-col gap-10 text-[15px] text-txt-black-700 font-body font-normal"
              data={contents.content}
            />
          </div>
          {contents.attachments.length > 0 && (
            <div className="md:px-10">
              <div className="flex flex-wrap pt-6 border-t border-gray-200 gap-2">
                {contents.attachments.map((attachment) => {
                  const hasValidUrl = !!attachment.url;
                  return (
                    <div key={attachment.id}>
                      {attachment.filename &&
                        attachment.filesize &&
                        attachment.url &&
                        attachment.mimeType && (
                          <div
                            className={`border border-otl-gray-200 w-[217px] rounded-lg flex items-center justify-between p-2 gap-2 ${hasValidUrl ? "cursor-pointer" : "cursor-default"}`}
                            onClick={
                              hasValidUrl
                                ? () =>
                                    downloadFile(
                                      attachment.url,
                                      attachment.filename,
                                    )
                                : undefined
                            }
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {getIcon(
                                attachment.mimeType.split("/")[1],
                                attachment.url,
                              )}

                              <div className="text-start overflow-hidden">
                                <div className="flex items-center">
                                  <div className="max-w-[95px] truncate">
                                    {attachment.filename.includes(".")
                                      ? attachment.filename.slice(
                                          0,
                                          attachment.filename.lastIndexOf("."),
                                        )
                                      : attachment.filename}
                                  </div>
                                  <div className="flex-shrink-0">
                                    .{attachment.mimeType.split("/")[1]}
                                  </div>
                                </div>
                                <div className="text-txt-black-500 text-body-xs font-normal">
                                  {formatFileSize(attachment.filesize)}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
