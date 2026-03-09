import { formatFileSize } from "../../utils/formatFileSize";
import { getIcon } from "../../utils/getIconLogo";
import { downloadFile } from "../../services/download.svc";

interface DownloadAttachmentItemProps {
  attachments: Array<{
    id: string;
    filename: string;
    filesize: number;
    url: string;
    mimeType: string;
  }>;
}

export default function DownloadAttachmentItem({
  attachments,
}: DownloadAttachmentItemProps) {
  return (
    <>
      {attachments.map((attachment) => {
        if (
          !attachment.filename ||
          attachment.filesize == null ||
          !attachment.url ||
          !attachment.mimeType
        ) {
          return null;
        }

        return (
          <div
            key={attachment.id}
            tabIndex={0}
            role="button"
            aria-label={attachment.filename}
            className={`border border-otl-gray-200 w-[204px] h-[54px] rounded-lg flex items-center justify-between focus:outline focus:outline-2 focus:outline-primary-200 p-2 gap-2 ${attachment.url ? "cursor-pointer" : "cursor-default"}`}
            onClick={
              attachment.url
                ? () => downloadFile(attachment.url, attachment.filename)
                : undefined
            }
            onKeyDown={
              attachment.url
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      downloadFile(attachment.url, attachment.filename);
                    }
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getIcon(attachment.mimeType.split("/")[1], attachment.url)}
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
        );
      })}
    </>
  );
}
