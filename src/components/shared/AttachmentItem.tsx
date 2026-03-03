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

  const isImage = attachment.mimeType.startsWith("image/");
  const isPdf = attachment.mimeType === "application/pdf";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={attachment.filename}
          className="border border-otl-gray-200 w-[217px] rounded-lg flex items-center justify-between focus:outline focus:outline-2 focus:outline-primary-200 p-2 gap-2 cursor-pointer"
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
        </button>
      </DialogTrigger>
      <DialogBody>
        <DialogHeader>
          <DialogTitle>{attachment.filename}</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="flex justify-center items-center">
            {isImage && (
              <img
                src={attachment.url}
                alt={attachment.filename}
                className="max-w-full max-h-[70vh] object-contain"
              />
            )}
            {!isImage && isPdf && (
              <iframe
                src={attachment.url}
                title={attachment.filename}
                className="w-full h-[70vh]"
              />
            )}
            {!isImage && !isPdf && (
              <div className="flex flex-col items-center gap-4 p-6">
                <div className="text-center">
                  {getIcon(attachment.mimeType.split("/")[1], attachment.url)}
                </div>
                <p className="text-body-md font-medium text-center break-all">
                  {attachment.filename}
                </p>
                <p className="text-body-sm text-txt-black-500">
                  {formatFileSize(attachment.filesize)}
                </p>
                <Button
                  variant="primary-fill"
                  onClick={() => window.open(attachment.url, "_blank")}
                >
                  Open File
                </Button>
              </div>
            )}
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
