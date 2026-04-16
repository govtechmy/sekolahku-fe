import type { TakwimItem } from "../../types/takwim";
import { getTakwimAttachmentUrl } from "../../utils/takwimAttachment";
import DownloadAttachmentItem from "./DownloadAttachmentItem";

type SectionItemTakwimProps = {
  dataItemCalendar: TakwimItem[];
};

export default function SectionItemTakwim({
  dataItemCalendar,
}: SectionItemTakwimProps) {
  const openAttachment = (item: TakwimItem) => {
    const attachmentUrl = getTakwimAttachmentUrl(item);

    if (!attachmentUrl) {
      return;
    }

    window.open(attachmentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6">
      {dataItemCalendar.map((item, index) => (
        <div
          key={index}
          className="flex gap-3 w-full border border-otl-gray-200  p-3 rounded-lg cursor-pointer focus:outline-primary-200 hover:bg-bg-gray-50"
          onClick={() => {
            openAttachment(item);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openAttachment(item);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={item.title ? `${item.title}` : "View event"}
        >
          <div className="flex flex-col items-center justify-center w-[55px]">
            <div className="text-body-xs font-medium text-txt-danger">FEB</div>
            <div className="text-body-xl font-semibold">20</div>
            <div className="text-body-xs font-medium text-txt-black-500">
              2025
            </div>
          </div>
          <div className="border-r order-otl-gray-200"></div>
          <div>
            <div className="text-txt-black-700 text-body-lg font-semibold pb-2">
              Hari Sukan Malaysia 2025
            </div>
            <div>
              <DownloadAttachmentItem
                classNameButton={"w-[234px]"}
                classNameButtonString="max-w-[145px]"
                attachments={item.attachments ?? []}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
