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
import {
  siaranAcaraDummyDocuments,
  siaranSocialLinks,
} from "../../contentData";
import DotIcon from "../../icons/DotIcon";
import type { Document } from "../../types/files";
import FileList from "../../components/shared/FileList";

export default function AcaraId() {
  const { lang } = useParams<{ lang: string }>();

  // Find the news item by ID
  const filesItem: Document[] = siaranAcaraDummyDocuments;

  return (
    <div className=" py-12 px-[18px] md:px-20  md:flex md:justify-center print:py-0">
      <div className="flex flex-col gap-6 max-w-[825px]">
        <Breadcrumb className="md:px-10 print:hidden">
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/siaran`}>Siaran</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>calendarItem.title</BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col gap-3 md:px-10">
          <span className={clx("text-sm font-semibold text-success-700")}>
            Acara
          </span>
          <p className=" text-2xl font-semibold">calendarItem.title</p>

          <div className=" flex flex-row gap-2 text-bg-black-500 items-center">
            <div className=" flex flex-row gap-1 items-center">
              <ClockIcon /> Bacaan calendarItem.readtime
            </div>
            <DotIcon />
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
          {/* <img
            src={calendarItem.imageSrc}
            alt={calendarItem.imageAlt}
            className="min-h-[250px] rounded-lg"
          /> */}
          <span className="text-bg-black-500 text-center">
            Image from calendarItem.link
          </span>
        </div>

        <p className=" text-2xl font-semibold md:px-10">
          calendarItem.description
        </p>

        <div className="border-t border-otl-gray-200 md:mx-10">
          <FileList files={filesItem} />
        </div>
      </div>
    </div>
  );
}
