import { PdfIcon } from "@govtechmy/myds-react/icon";
import { type SiaranAcaraDocument } from "../../types/files";

interface FileListProps {
  files: SiaranAcaraDocument[];
  className?: string;
}

export default function FileList({ files, className }: FileListProps) {
  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  const renderImageIcon = (file: SiaranAcaraDocument) => {
    const extendedFile = file as File & {
      isExistingFile?: boolean;
      s3Url?: string;
      fileurl?: string;
      thumbnailUrl?: string;
    };

    if (extendedFile.isExistingFile) {
      const imageUrl =
        extendedFile.thumbnailUrl || extendedFile.fileurl || extendedFile.s3Url;
      if (imageUrl) {
        const fullImageUrl =
          extendedFile.fileurl ||
          extendedFile.s3Url ||
          extendedFile.thumbnailUrl;
        return (
          <img
            src={imageUrl}
            alt={file.name}
            className="shrink-0 size-[38px] rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              if (fullImageUrl) {
                window.open(fullImageUrl, "_blank");
              }
            }}
          />
        );
      }
      return (
        <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
          <span className="text-xs text-otl-gray-500">IMG</span>
        </div>
      );
    }

    try {
      const objectUrl = URL.createObjectURL(file as unknown as File);
      return (
        <img
          src={objectUrl}
          alt={file.name}
          className="shrink-0 size-[38px] rounded-[4px] object-cover"
          onLoad={() => {
            URL.revokeObjectURL(objectUrl);
          }}
        />
      );
    } catch (error) {
      console.warn("Failed to create object URL:", error);
      return (
        <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
          <span className="text-xs text-otl-gray-500">IMG</span>
        </div>
      );
    }
  };

  const renderPdfIcon = (file: SiaranAcaraDocument) => {
    const extendedFile = file as File & {
      isExistingFile?: boolean;
      s3Url?: string;
      fileurl?: string;
      thumbnailUrl?: string;
    };
    const s3URLRedirect =
      extendedFile.fileurl || extendedFile.s3Url || extendedFile.thumbnailUrl;
    return (
      <PdfIcon
        className="shrink-0 size-[30px] rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          if (s3URLRedirect) {
            window.open(s3URLRedirect, "_blank");
          }
        }}
      />
    );
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
              {file.type.startsWith("image/")
                ? renderImageIcon(file)
                : file.type === "application/pdf"
                  ? renderPdfIcon(file)
                  : null}

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
