import { ChevronRightIcon } from "@govtechmy/myds-react/icon";
import type {
  ArticleContent,
  ParagraphNode,
  TakwimItem,
} from "../../types/takwim";

type SectionItemTakwimProps = {
  dataItemCalendar: TakwimItem[];
};

type TakwimListItemProps = {
  leading: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  href?: string;
  ariaLabel: string;
  showChevron?: boolean;
};

export function TakwimListItem({
  leading,
  title,
  description,
  onClick,
  href,
  ariaLabel,
  showChevron = false,
}: TakwimListItemProps) {
  const content = (
    <>
      {leading}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="line-clamp-2 text-body-sm font-semibold text-txt-black-900">
          {title}
        </div>
        {description && (
          <div className="line-clamp-2 text-body-xs text-txt-black-500">
            {description}
          </div>
        )}
      </div>
      {showChevron && (
        <ChevronRightIcon className="size-4 shrink-0 text-txt-black-500" />
      )}
    </>
  );

  const className =
    "group flex w-full items-center gap-3.5 rounded-xl bg-[#F7F8FA] p-3.5 transition-colors hover:bg-bg-gray-100 focus:outline-primary-200";

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={`${className} cursor-pointer text-left`}
      onClick={onClick}
    >
      {content}
    </button>
  );
}

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
          <TakwimListItem
            key={item._id ?? index}
            leading={
              eventDate ? (
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
              ) : null
            }
            title={item.title ?? "Acara takwim"}
            description={desc}
            onClick={() => openAttachmentByIndex(item, index)}
            ariaLabel={item.title ?? "Lihat acara"}
            showChevron
          />
        );
      })}
    </div>
  );
}
