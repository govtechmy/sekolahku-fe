import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@govtechmy/myds-react/dialog";
import { formatFileSize } from "../../utils/formatFileSize";
import { useState } from "react";
import type { Attachment } from "../../types/takwim";
interface AttachmentItemProps {
  attachments: Attachment[];
}

export default function AttachmentItem({ attachments }: AttachmentItemProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const validAttachments = attachments.filter(
    (attachment) =>
      attachment.filename &&
      attachment.filesize != null &&
      attachment.url &&
      attachment.mimeType,
  );

  if (validAttachments.length === 0) {
    return null;
  }

  const handleOpenDialog = (index: number) => {
    setSelectedImageIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      {validAttachments.map((attachment, index) => (
        <button
          key={attachment.id}
          type="button"
          aria-label={attachment.filename}
          className="border border-otl-gray-200 w-[202px] h-[248px] rounded-lg flex flex-col items-center focus:outline focus:outline-2 focus:outline-primary-200 cursor-pointer overflow-hidden"
          onClick={() => handleOpenDialog(index)}
        >
          <div className="h-[186px] w-[186px] flex items-center justify-center overflow-hidden py-2">
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="w-full h-full object-cover rounded-md"
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
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogBody className="!max-w-[95vw] lg:!max-w-[1200px] !h-[90vh] lg:!h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Paparan Imej</DialogTitle>
          </DialogHeader>
          <DialogContent className="flex-1 flex items-center justify-center overflow-hidden p-4 min-h-0">
            <img
              src={validAttachments[selectedImageIndex]?.url}
              alt={validAttachments[selectedImageIndex]?.filename}
              className="max-w-full max-h-full object-contain"
            />
          </DialogContent>
          <DialogFooter className="flex-shrink-0 flex justify-center items-center py-4 border-t border-otl-gray-200">
            <div className="flex gap-3 overflow-x-auto max-w-full px-4">
              {validAttachments.map((attachment, index) => (
                <button
                  key={attachment.id}
                  type="button"
                  aria-label={`View ${attachment.filename}`}
                  className={`flex-shrink-0 flex items-center justify-center w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-lg border-2 cursor-pointer transition-all focus:outline focus:outline-2 focus:outline-primary-200 ${
                    selectedImageIndex === index
                      ? "border-primary-600 shadow-md"
                      : "border-otl-gray-200 hover:border-otl-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={attachment.url}
                    alt={attachment.filename}
                    className="w-[72px] h-[72px] lg:w-[92px] lg:h-[92px] object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          </DialogFooter>
        </DialogBody>
      </Dialog>
    </>
  );
}
