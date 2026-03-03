import { Button } from "@govtechmy/myds-react/button";
import {
  Dialog,
  DialogTrigger,
  DialogBody,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@govtechmy/myds-react/dialog";
import { formatFileSize } from "../../utils/formatFileSize";
import { getIcon } from "../../utils/getIconLogo";

interface AttachmentItemProps {
  attachment: {
    id: string;
    filename: string;
    filesize: number;
    url: string;
    mimeType: string;
  };
  hasValidUrl: boolean;
}

export default function AttachmentItem({
  attachment,
  hasValidUrl,
}: AttachmentItemProps) {
  if (
    !attachment.filename ||
    !attachment.filesize ||
    !attachment.url ||
    !attachment.mimeType
  ) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          tabIndex={0}
          role="button"
          aria-label={attachment.filename}
          className={`border border-otl-gray-200 w-[217px] rounded-lg flex items-center justify-between focus:outline focus:outline-2 focus:outline-primary-200 p-2 gap-2 ${hasValidUrl ? "cursor-pointer" : "cursor-default"}`}
          onKeyDown={
            hasValidUrl
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.currentTarget.click();
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
      </DialogTrigger>
      <DialogBody>
        <DialogHeader>
          <DialogTitle>{attachment.filename}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="flex justify-center items-center">
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </DialogContent>
        <DialogFooter>
          <DialogClose>
            <Button variant="default-outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
}
