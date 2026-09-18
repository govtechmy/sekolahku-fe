import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@govtechmy/myds-react/dialog";
import { useState } from "react";

// Minimal shape the gallery actually renders - lets both CMS attachments
// (mapped from `Attachment`) and MOE images (which have no filename/mimeType/
// filesize) share this viewer without faking unused fields.
export type GalleryImage = {
  id: string;
  url: string;
  label: string;
};

interface ImageAttachmentItemProps {
  attachments: GalleryImage[];
}

export default function ImageAttachmentItem({
  attachments,
}: ImageAttachmentItemProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const validAttachments = attachments.filter((attachment) => attachment.url);

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
          aria-label={attachment.label}
          className="group border border-otl-gray-200 rounded-lg flex flex-col items-center focus:outline focus:outline-2 focus:outline-primary-200 cursor-pointer overflow-hidden transition-all duration-200 hover:border-otl-gray-300 hover:shadow-md"
          onClick={() => handleOpenDialog(index)}
        >
          <div className="h-[186px] w-[186px] flex items-center justify-center overflow-hidden relative">
            <img
              src={attachment.url}
              alt={attachment.label}
              className="w-full h-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </button>
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogBody className="!max-w-[95vw] lg:!max-w-[1200px] !h-[90vh] lg:!h-[85vh] flex flex-col max-sm:!h-[80vh]">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="pb-2">Paparan Imej</DialogTitle>
          </DialogHeader>
          <DialogContent className="flex-1 flex items-center justify-center overflow-hidden p-4 min-h-0 border-y">
            <img
              src={validAttachments[selectedImageIndex]?.url}
              alt={validAttachments[selectedImageIndex]?.label}
              className="max-w-full max-h-full object-contain"
            />
          </DialogContent>
          <DialogFooter className="flex-shrink-0 flex justify-center items-center py-4 border-otl-gray-200">
            <div className="flex gap-3 overflow-x-auto max-w-full px-4 py-1">
              {validAttachments.map((attachment, index) => (
                <button
                  key={attachment.id}
                  type="button"
                  aria-label={`View ${attachment.label}`}
                  className={`flex-shrink-0 flex items-center justify-center w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-lg border-2 cursor-pointer transition-all focus:outline focus:outline-2 focus:outline-primary-200 ${
                    selectedImageIndex === index
                      ? "border-primary-300 shadow-md"
                      : "border-otl-gray-200 hover:border-otl-gray-300"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={attachment.url}
                    alt={attachment.label}
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
