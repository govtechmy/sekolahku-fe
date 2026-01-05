import { ExcelIcon, PdfIcon, WordIcon } from "@govtechmy/myds-react/icon";
import { type Document } from "../../types/files";
import { formatFileSize } from "../../utils/formatFileSize";

interface FileListProps {
  files: Document[];
  className?: string;
}

export default function FileList({ files, className }: FileListProps) {
  const baseIconClass =
    "shrink-0 rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity";

  const openFile = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, "_blank");
    }
  };

  const renderFileIcon = (
    file: Document,
    Icon: React.ElementType,
    size: string,
  ) => (
    <Icon
      className={`${baseIconClass} ${size}`}
      onClick={(e: React.MouseEvent) => openFile(e, file.fileurl)}
      {...(Icon === "img" ? { src: file.fileurl, alt: file.name } : {})}
    />
  );

  const getIcon = (file: Document) => {
    switch (true) {
      case file.type.startsWith("image/"):
        return renderFileIcon(file, "img", "size-[38px]");
      case file.type === "application/pdf":
        return renderFileIcon(file, PdfIcon, "size-[30px]");
      case file.type === "application/vnd.ms-excel":
        return renderFileIcon(file, ExcelIcon, "size-[30px]");
      case file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type === "application/msword":
        return renderFileIcon(file, WordIcon, "size-[30px]");
      default:
        return null;
    }
  };

  return (
    <div
      className={`mt-6 flex flex-col gap-y-2 sm:flex-row justify-between flex-wrap ${className || ""}`}
    >
      {files.map((file, index) => {
        const parts = file.name.split(".");
        const extension = parts.length > 1 ? "." + parts.pop() : "";
        const basename = parts.join(".");

        return (
          <div
            key={index}
            className="border border-otl-gray-200 w-full sm:w-[217px] rounded-lg cursor-pointer flex items-center justify-between p-2 gap-2"
            // Uncomment this line once download endpoint is ready
            /* onClick={() => generateDownloadLink(file.name, file.fileurl ?? '')} */
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getIcon(file)}

              <div className="text-start overflow-hidden">
                <div className="flex items-center">
                  <div className="max-w-[95px] truncate">{basename}</div>
                  <div className="flex-shrink-0">{extension}</div>
                </div>
                <div className="text-[#71717A] text-xs">
                  {formatFileSize(file.size)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
