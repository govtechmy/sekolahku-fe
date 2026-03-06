import {
  Dialog,
  DialogTrigger,
  DialogBody,
  DialogContent,
} from "@govtechmy/myds-react/dialog";
import { formatFileSize } from "../../utils/formatFileSize";

interface AttachmentItemProps {
  attachment: {
    id: string;
    filename: string;
    filesize: number;
    url: string;
    mimeType: string;
  };
}

export default function AttachmentItem({ attachment }: AttachmentItemProps) {
  if (
    !attachment.filename ||
    attachment.filesize == null ||
    !attachment.url ||
    !attachment.mimeType
  ) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={attachment.filename}
          className="border border-otl-gray-200 w-[202px] h-[248px] rounded-lg flex flex-col items-center focus:outline focus:outline-2 focus:outline-primary-200 cursor-pointer overflow-hidden"
        >
          <div className="h-[186px] w-[186px] flex items-center justify-center overflow-hidden">
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2 text-start border-t border-otl-gray-200 w-full">
            <div className="flex items-center">
              <div className="max-w-[150px] truncate text-body-sm">
                {attachment.filename.includes(".")
                  ? attachment.filename.slice(
                      0,
                      attachment.filename.lastIndexOf("."),
                    )
                  : attachment.filename}
              </div>
              <div className="flex-shrink-0 text-body-sm">
                {attachment.filename.includes(".")
                  ? `.${attachment.filename.split(".").pop()}`
                  : ""}
              </div>
            </div>
            <div className="text-txt-black-500 text-body-xs font-normal">
              {formatFileSize(attachment.filesize)}
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogBody>
        <DialogContent>
          <img
            src={attachment.url}
            alt={attachment.filename}
            className="w-full h-full object-contain"
          />
        </DialogContent>
      </DialogBody>
    </Dialog>
  );
}
