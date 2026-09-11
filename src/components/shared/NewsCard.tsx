import { Link } from "react-router-dom";
import { ArrowOutgoingIcon, CalendarIcon } from "@govtechmy/myds-react/icon";
import type { SiaranContent } from "../../models/response";
import { formatDate } from "../../utils/dateFormatter";
import { getLexicalExcerpt } from "../../utils/lexicalExcerpt";

// Exactly the fields this card reads. A full `SiaranItem` is assignable to it,
// and so is the trimmed dev fallback (`DEMO_BERITA`) — no lying casts needed.
export type NewsCardItem = {
  _id: string;
  title: string;
  content?: SiaranContent;
  articleDate?: string;
  imageHero?: { url?: string; alt?: string };
  categoryInfo?: { name?: string; colors?: string };
};

type NewsCardProps = {
  item: NewsCardItem;
  lang?: string;
  redirectDesc?: string;
};

// Category colours come from the CMS and may be light; pick a readable text
// colour from the background's luminance so the tag label always has contrast.
function readableOn(hex: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return "#FFFFFF";
  const n = parseInt(m[1], 16);
  const luminance =
    (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) /
    255;
  return luminance > 0.6 ? "#17181C" : "#FFFFFF";
}

// Redesigned Berita KPM card (ported from the design mockup): full-bleed image
// with a category-colored tag overlay, date row, title, derived excerpt, and a
// "read more" affordance. Category colour comes from the backend
// (categoryInfo.colors) rather than a hardcoded palette.
export default function NewsCard({
  item,
  lang,
  redirectDesc = "Baca seterusnya",
}: NewsCardProps) {
  const excerpt = getLexicalExcerpt(item.content);
  const tagBg = item.categoryInfo?.colors || "#0062FF";

  return (
    <Link
      to={`/${lang}/berita-kpm/${item._id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#F7F8FA] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:ring-2 hover:ring-otl-primary-200 focus:outline focus:outline-2 focus:outline-otl-primary-200 focus:outline-offset-2"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-bg-gray-100">
        {item.imageHero?.url && (
          <img
            src={item.imageHero.url}
            alt={item.imageHero.alt || "Imej Berita"}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
        {item.categoryInfo?.name && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-body-xs font-semibold"
            style={{ backgroundColor: tagBg, color: readableOn(tagBg) }}
          >
            {item.categoryInfo.name}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {item.articleDate && (
          <div className="flex items-center gap-1.5 text-body-xs text-txt-black-500">
            <CalendarIcon className="size-4 shrink-0" />
            <span>{formatDate(item.articleDate, lang)}</span>
          </div>
        )}

        <h2 className="line-clamp-2 font-heading text-body-lg font-bold text-txt-black-900">
          {item.title}
        </h2>

        {excerpt && (
          <p className="line-clamp-2 text-body-sm text-txt-black-500">
            {excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center gap-1.5 pt-2 text-body-sm font-semibold text-txt-primary transition-transform duration-300 group-hover:translate-x-0.5">
          <span>{redirectDesc}</span>
          <ArrowOutgoingIcon className="size-4" />
        </div>
      </div>
    </Link>
  );
}
