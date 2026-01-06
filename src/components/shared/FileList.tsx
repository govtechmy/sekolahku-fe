import { ExcelIcon, PdfIcon, WordIcon } from "@govtechmy/myds-react/icon";
import { type Document } from "../../types/files";
import { formatFileSize } from "../../utils/formatFileSize";
import { getFileExtension } from "../../utils/fileExtensions";
import { downloadFile } from "../../services/download.svc";

interface FileListProps {
  files: Document[];
  className?: string;
}

export default function FileList({ files, className }: FileListProps) {
  const renderFileIcon = (
    file: Document,
    Icon: React.ElementType,
    size: string,
  ) => (
    <Icon
      className={`shrink-0 rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity ${size}`}
      {...(Icon === "img" ? { src: file.fileurl, alt: file.name } : {})}
    />
  );

  const getIcon = (file: Document) => {
    const extension = getFileExtension(file.fileurl || "");
    switch (extension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "webp":
      case "svg":
        return renderFileIcon(file, "img", "size-[38px]");
      case "pdf":
        return renderFileIcon(file, PdfIcon, "size-[30px]");
      case "xls":
      case "xlsx":
        return renderFileIcon(file, ExcelIcon, "size-[30px]");
      case "doc":
      case "docx":
        return renderFileIcon(file, WordIcon, "size-[30px]");
      default:
        return (
          <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
            <span className="text-xs text-otl-gray-500">IMG</span>
          </div>
        );
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
            onClick={() => downloadFile(file.fileurl, file.name)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {getIcon(file)}

              <div className="text-start overflow-hidden">
                <div className="flex items-center">
                  <div className="max-w-[95px] truncate">{basename}</div>
                  <div className="flex-shrink-0">{extension}</div>
                </div>
                <div className="text-txt-black-500 text-body-xs font-normal">
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
