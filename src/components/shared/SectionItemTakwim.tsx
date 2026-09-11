import { ChevronRightIcon } from "@govtechmy/myds-react/icon";
import type {
  ArticleContent,
  ParagraphNode,
  TakwimItem,
} from "../../types/takwim";

type SectionItemTakwimProps = {
  dataItemCalendar: TakwimItem[];
};

// Category → accent colour for the tag text (on a dark pill), matching the mockup.
const CATEGORY_COLORS: Record<string, string> = {
  Akademik: "#34D399",
  "Kenaikan Kebangsaan": "#F59E0B",
  "Cuti Sekolah": "#A78BFA",
};
const CATEGORY_FALLBACK = "#4F86F7";

// Takwim items carry no plain description, so pull the first non-empty
// paragraph out of the Lexical content for the row subtitle.
const firstParagraph = (content?: ArticleContent): string => {
  for (const node of (content?.root?.children ?? []) as ParagraphNode[]) {
    const text = (node.children ?? [])
      .map((child) => child.text ?? "")
      .join("")
      .trim();
    if (text) return text;
  }
  return "";
};

export default function SectionItemTakwim({
  dataItemCalendar,
}: SectionItemTakwimProps) {
  const openAttachmentByIndex = (item: TakwimItem, index: number) => {
    const validAttachments = (item.attachments ?? []).filter(
      (attachment) => attachment?.url,
    );

    if (validAttachments.length === 0) {
      return;
    }

    const attachment = validAttachments[index] ?? validAttachments[0];
    window.open(attachment.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3">
      {dataItemCalendar.map((item, index) => {
        const eventDate = item.articleDate || item.createdAt;
        const desc = firstParagraph(item.content);
        return (
          <div
            key={index}
            className="group flex w-full cursor-pointer items-center gap-3.5 rounded-xl bg-[#F7F8FA] p-3.5 transition-colors hover:bg-bg-gray-100 focus:outline-primary-200"
            tabIndex={0}
            role="button"
            aria-label={item.title ? `${item.title}` : "View event"}
            onClick={() => openAttachmentByIndex(item, index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openAttachmentByIndex(item, index);
              }
            }}
          >
            {eventDate && (
              <div className="flex w-[52px] shrink-0 flex-col items-center rounded-[10px] bg-bg-white py-2">
                <div className="text-body-xs font-bold text-txt-danger">
                  {new Date(eventDate)
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </div>
                <div className="text-body-lg font-bold text-txt-black-900">
                  {eventDate.slice(8, 10)}
                </div>
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              {item.category && (
                <span
                  className="w-fit rounded-lg bg-black px-2 py-0.5 text-body-xs font-bold"
                  style={{
                    color: CATEGORY_COLORS[item.category] ?? CATEGORY_FALLBACK,
                  }}
                >
                  {item.category}
                </span>
              )}
              {item.title && (
                <div className="text-body-sm font-semibold text-txt-black-900">
                  {item.title}
                </div>
              )}
              {desc && (
                <div className="line-clamp-2 text-body-xs text-txt-black-500">
                  {desc}
                </div>
              )}
            </div>
            <ChevronRightIcon className="size-4 shrink-0 text-txt-black-500" />
          </div>
        );
      })}
    </div>
  );
}
