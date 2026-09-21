import { Link } from "react-router-dom";
import { ArrowForwardIcon, GovtOfficeIcon } from "@govtechmy/myds-react/icon";
import type { BantuanListItem } from "../../models/response";
import {
  BANTUAN_IMAGE_FALLBACK,
  getBantuanImage,
} from "../../utils/bantuanImages";

type BantuanCardProps = {
  item: BantuanListItem;
  lang?: string;
};

// Full-height illustration card with a bottom gradient scrim (per design.pen):
// image fills the card, title/provider/CTA sit on an overlay at the bottom
// rather than below a fixed-height thumbnail.
export default function BantuanCard({ item, lang }: BantuanCardProps) {
  return (
    <Link
      to={`/${lang}/bantuan-persekolahan/${item.slug}`}
      className="group relative flex h-[232px] flex-col overflow-hidden rounded-2xl border border-[#ECECEF] bg-bg-white shadow-[0_6px_16px_0_#0B12200D] transition hover:shadow-[0_10px_24px_0_#0B122014]"
    >
      <img
        src={getBantuanImage(item.slug)}
        alt=""
        onError={(e) => {
          // Real per-slug illustrations aren't exported into the repo yet -
          // fall back cleanly instead of showing a broken image icon.
          e.currentTarget.onerror = null;
          e.currentTarget.src = BANTUAN_IMAGE_FALLBACK;
        }}
        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(180% 110% at 0% 100%, #FFFFFFE6 0%, #FFFFFFB8 30%, #FFFFFF00 70%, #FFFFFF00 100%)",
        }}
      />
      <div className="relative mt-auto flex flex-col gap-1.5 p-3.5">
        <span className="font-body text-sm font-bold leading-[1.3] text-[#1A2233]">
          {item.title}
        </span>
        <div className="flex items-center gap-1.5">
          <GovtOfficeIcon className="size-3 shrink-0 text-[#4B5568]" />
          <span className="font-body text-[11px] text-[#4B5568]">
            Kementerian Pendidikan Malaysia
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-body text-xs font-bold text-[#0062FF]">
            Lihat Butiran
          </span>
          <ArrowForwardIcon className="size-3.5 text-[#0062FF]" />
        </div>
      </div>
    </Link>
  );
}
