import { CircleCheckBig } from "lucide-react";
import type { BantuanSection } from "../../models/response";
import { resolveDisplayLabel, resolveIcon } from "./bantuanSectionHelpers";

// Section icon accent rotates through 3 colours by position (design.pen:
// "Sekolahku - Bantuan KWAPM" cycles blue → purple → teal → blue …), not a
// fixed colour per heading, since headings differ per programme.
const SECTION_ACCENTS = [
  { bg: "#E7F0FE", fg: "#0062FF" }, // $gov-blue
  { bg: "#F1EEFE", fg: "#A78BFA" }, // $accent-purple
  { bg: "#E6F7F5", fg: "#14B8A6" }, // $accent-teal
];

type BantuanSectionCardProps = {
  section: BantuanSection;
  index?: number;
};

export default function BantuanSectionCard({
  section,
  index = 0,
}: BantuanSectionCardProps) {
  if (section.content.length === 0) return null;

  const Icon = resolveIcon(section.heading);
  const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#ECECEF] bg-bg-white p-6">
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: accent.bg }}
        >
          <Icon className="size-5" style={{ color: accent.fg }} />
        </div>
        <h3 className="font-heading text-lg font-bold text-[#17181C]">
          {resolveDisplayLabel(section.heading)}
        </h3>
      </div>
      <ul className="flex flex-col gap-2.5">
        {section.content.map((line, lineIndex) => (
          <li
            key={lineIndex}
            className="flex items-start gap-2.5 font-body text-sm leading-[1.5] text-[#404A5A]"
          >
            <CircleCheckBig
              className="mt-0.5 size-[18px] shrink-0"
              style={{ color: accent.fg }}
            />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
