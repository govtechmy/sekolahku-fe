import { ExcelIcon, PdfIcon, WordIcon } from "@govtechmy/myds-react/icon";

const renderFileIcon = (Icon: React.ElementType) => (
  <Icon
    className={`shrink-0 rounded-[4px] object-cover cursor-pointer hover:opacity-80 transition-opacity size-[30px]`}
  />
);

export const getIcon = (extension: string) => {
  switch (extension) {
    case "pdf":
      return renderFileIcon(PdfIcon);
    case "xls":
    case "xlsx":
      return renderFileIcon(ExcelIcon);
    case "doc":
    case "docx":
      return renderFileIcon(WordIcon);
    case "":
      return (
        <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
          <span className="text-xs text-otl-gray-500 flex items-center justify-center">
            FILE
          </span>
        </div>
      );
    default:
      return (
        <div className="shrink-0 size-[30px] rounded-[4px] bg-otl-gray-200 flex items-center justify-center">
          <span className="text-xs text-otl-gray-500 flex items-center justify-center">
            {extension.toUpperCase()}
          </span>
        </div>
      );
  }
};
