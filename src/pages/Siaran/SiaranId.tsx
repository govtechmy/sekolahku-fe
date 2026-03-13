import { useParams } from "react-router-dom";
import { Button } from "@govtechmy/myds-react/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@govtechmy/myds-react/breadcrumb";
// import { ClockIcon, PrinterIcon } from "@govtechmy/myds-react/icon";
import { PrinterIcon } from "@govtechmy/myds-react/icon";
import { clx } from "@govtechmy/myds-react/utils";
import SocialLinks from "../../components/shared/SocialLinks";
import ImageAttachmentItem from "../../components/shared/ImageAttachmentItem";
import DownloadAttachmentItem from "../../components/shared/DownloadAttachmentItem";
import { siaranSocialLinks } from "../../contentData";
// import DotIcon from "../../icons/DotIcon";
import { useEffect, useState, useMemo } from "react";
// import {
//   formatFullEventDate,
//   formatEventTime,
//   translateEnglishMonthToMalay,
// } from "../../utils/date";
import { formatEventDateDDMMYY } from "../../utils/date";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SiaranItem } from "../../models/response";
import { getSiaranById } from "../../services/siaran.svc";
import PrintDisplay from "../../components/shared/PrintDisplay";

export default function SiaranId() {
  const { lang } = useParams<{ lang: string }>();

  // Find the news item by ID
  const { id } = useParams<{ id: string }>();
  const [contents, setContents] = useState<SiaranItem | null>(null);

  useEffect(() => {
    const fetchSiaranById = async (id: string) => {
      try {
        const response = await getSiaranById(id);
        setContents(response);
      } catch (error) {
        console.error("Error fetching siaran by id:", error);
      }
    };

    if (id) {
      fetchSiaranById(id);
    }
  }, [id]);

  // Filter attachments once to avoid multiple iterations
  const imageAttachments = useMemo(
    () =>
      contents?.attachments?.filter((att) =>
        att?.mimeType?.startsWith("image/"),
      ) ?? [],
    [contents],
  );

  const documentAttachments = useMemo(
    () =>
      contents?.attachments?.filter(
        (att) => !att?.mimeType?.startsWith("image/"),
      ) ?? [],
    [contents],
  );

  return (
    <div className="py-12 justify-center print:py-0 mx-auto px-4.5 flex w-full relative md:px-6 max-w-screen-xl">
      {contents && (
        <div className="flex flex-col gap-6 max-w-[825px] lg:min-w-[825px]">
          <div className="hidden print:block">
            <PrintDisplay>
              <div className="flex flex-col gap-3">
                {contents.categoryInfo?.name && (
                  <span
                    className={clx(
                      "text-body-sm font-body font-semibold text-txt-primary",
                    )}
                  >
                    {contents.categoryInfo.name}
                  </span>
                )}
                {contents.title && (
                  <p className="text-2xl font-semibold font-body">
                    {contents.title}
                  </p>
                )}
                <div className=" flex flex-row gap-2 text-txt-black-500">
                  {contents.articleDate && (
                    <div className="text-body-sm font-body font-normal pb-5">
                      {formatEventDateDDMMYY(contents.articleDate)}
                    </div>
                  )}
                </div>
              </div>
              {contents.imageHero && (
                <div className="flex flex-col gap-3 pb-5">
                  <div className="flex justify-center">
                    <img
                      src={contents.imageHero.url}
                      alt={contents.imageHero.alt || "Imej Siaran"}
                      className="w-fit max-h-[415px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              )}
              {contents.content && (
                <div className="text-xl text-justify font-normal md:px-10">
                  <RichText
                    className="flex flex-col text-body-md text-txt-black-700 font-body font-normal"
                    data={contents.content}
                  />
                </div>
              )}
            </PrintDisplay>
          </div>
          <Breadcrumb className="md:px-10 print:hidden">
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${lang}/berita-kpm`}>
                Berita KPM
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{contents.title ?? ""}</BreadcrumbPage>
            </BreadcrumbItem>
          </Breadcrumb>
          <div className="flex flex-col gap-3 md:px-10 print:hidden">
            {contents.categoryInfo?.name && contents.categoryInfo?.colors && (
              <span
                className={clx(
                  "text-body-sm font-body font-semibold text-txt-primary",
                )}
                // style={
                //   contents.categoryInfo.colors
                //     ? { color: contents.categoryInfo.colors }
                //     : undefined
                // }
              >
                {contents.categoryInfo.name}
              </span>
            )}
            {contents.title && (
              <p className="text-2xl font-semibold font-body">
                {contents.title}
              </p>
            )}
            <div className=" flex flex-row gap-2 text-txt-black-500">
              {/* <div className=" flex flex-row gap-1 items-center text-body-sm font-body font-normal">
                <ClockIcon /> Bacaan {contents.readTime} min
              </div>
              <div className="flex items-center">
                <DotIcon className="size-0.5" />
              </div> */}
              {contents.articleDate && (
                <div className="text-body-sm font-body font-normal">
                  {formatEventDateDDMMYY(contents.articleDate)}
                  {/* Previous format (kept for reference), incase they wanted the old design back or translate to English because design is bad:
                {translateEnglishMonthToMalay(formatFullEventDate(contents.articleDate))}
                {formatEventTime(contents.articleDate)}
                */}
                </div>
              )}
            </div>
          </div>
          <div className="md:px-10 print:hidden">
            <div className="flex justify-between pb-[18px] border-b border-gray-200">
              <SocialLinks
                links={siaranSocialLinks}
                classNameButton="p-2"
                isShareLinks={true}
              />
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
          {contents.imageHero && (
            <div className="flex flex-col gap-3 print:hidden">
              <div className="flex justify-center">
                <img
                  src={contents.imageHero.url}
                  alt={contents.imageHero.alt || "Imej Siaran"}
                  className="w-fit max-h-[415px] object-contain rounded-lg"
                />
              </div>
              {/* <span className="text-txt-black-500 text-center font-body font-normal text-body-sm md:px-10">
              Image from{" "}
              <span className="italic">{contents.imageHero.url}</span>
            </span> */}
            </div>
          )}
          {contents.content && (
            <div className="text-xl text-justify font-normal md:px-10 print:hidden">
              <RichText
                className="flex flex-col text-body-md text-txt-black-700 font-body font-normal"
                data={contents.content}
              />
            </div>
          )}
          {contents.attachments && contents.attachments.length > 0 && (
            <div className="md:px-10 print:hidden">
              <div className="flex flex-col pt-6 border-t border-gray-200 gap-4">
                {/* PDF/Document Attachments */}
                {documentAttachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-body-lg font-semibold font-body">
                      Lampiran
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <DownloadAttachmentItem
                        attachments={documentAttachments}
                      />
                    </div>
                  </div>
                )}

                {/* Image Attachments */}
                {imageAttachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h3 className="text-body-lg font-semibold font-body">
                      Gambar
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <ImageAttachmentItem attachments={imageAttachments} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
