import type { TakwimItem } from "../types/takwim";

export function getTakwimAttachmentUrl(item: TakwimItem): string | null {
  const attachments = item.attachments ?? [];

  // Prefer non-image files (usually the primary downloadable document).
  const nonImageAttachment = attachments.find(
    (attachment) =>
      Boolean(attachment?.url) && !attachment?.mimeType?.startsWith("image/"),
  );

  if (nonImageAttachment?.url) {
    return nonImageAttachment.url;
  }

  const firstValidAttachment = attachments.find((attachment) =>
    Boolean(attachment?.url),
  );

  return firstValidAttachment?.url ?? null;
}
