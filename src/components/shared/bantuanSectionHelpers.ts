import type { FunctionComponent, SVGProps } from "react";
import {
  Coins,
  FileDown,
  HandCoins,
  HeartPulse,
  History,
  House,
  Info,
  Scale,
  Send,
  Target,
  TrendingUp,
  Trophy,
  UserRoundCheck,
} from "lucide-react";

type IconComponent = FunctionComponent<SVGProps<SVGSVGElement>>;

// Bantuan items don't share one fixed set of section headings (e.g. Program
// 3K3C uses ANJAKAN/INISIATIF/SASARAN/... instead of KADAR/PEMILIHAN/...), so
// this only styles the headings that occur across the 20 programs (per
// design.pen) and falls back to a generic icon for anything unrecognised
// rather than hiding/breaking on it.
const SECTION_ICON_MAP: Record<string, IconComponent> = {
  KADAR: Coins,
  "KADAR BANTUAN": Coins,
  "KADAR ELAUN": Coins,
  "SKOP BANTUAN": Trophy,
  PEMILIHAN: UserRoundCheck,
  "KRITERIA PEMILIHAN": UserRoundCheck,
  "KRITERIA KELAYAKAN": UserRoundCheck,
  "KAEDAH PENYALURAN": Send,
  "KAEDAH PELAKSANAAN": Send,
  "PUNCA KUASA": Scale,
  "JENIS BANTUAN": HandCoins,
  "SUMBER PERUNTUKAN": UserRoundCheck,
  "RANGKA KERJA": Send,
  "MUAT TURUN": FileDown,
  "MUAT TURUN & PAUTAN": FileDown,
  TUJUAN: House,
  "LATAR BELAKANG": UserRoundCheck,
  ANJAKAN: Target,
  INISIATIF: History,
  SASARAN: UserRoundCheck,
  "OBJEKTIF PROGRAM": Send,
  "PROJEK KHAS 3C": HeartPulse,
  IMPAK: TrendingUp,
};

export function resolveIcon(heading: string): IconComponent {
  return SECTION_ICON_MAP[heading.toUpperCase()] ?? Info;
}

// Display labels are cosmetic only (natural Bahasa Melayu Title Case per
// design.pen) and must never replace the canonical uppercase heading used
// for storage or for resolveIcon's lookup above.
const SECTION_DISPLAY_LABELS: Record<string, string> = {
  KADAR: "Kadar Bantuan",
  PEMILIHAN: "Kriteria Kelayakan",
  "KRITERIA PEMILIHAN": "Kriteria Pemilihan",
  "KRITERIA KELAYAKAN": "Kriteria Kelayakan",
  "KAEDAH PENYALURAN": "Kaedah Penyaluran",
  "KAEDAH PELAKSANAAN": "Kaedah Pelaksanaan",
  "PUNCA KUASA": "Punca Kuasa",
  "JENIS BANTUAN": "Jenis Bantuan",
  "KADAR ELAUN": "Kadar Elaun",
  "SKOP BANTUAN": "Skop Bantuan",
  "SUMBER PERUNTUKAN": "Sumber Peruntukan",
  "RANGKA KERJA": "Rangka Kerja",
  "MUAT TURUN": "Muat Turun",
  "MUAT TURUN & PAUTAN": "Muat Turun & Pautan",
  TUJUAN: "Tujuan",
  "LATAR BELAKANG": "Latar Belakang",
  ANJAKAN: "Anjakan",
  INISIATIF: "Inisiatif",
  SASARAN: "Sasaran",
  "OBJEKTIF PROGRAM": "Objektif Program",
  "PROJEK KHAS 3C": "Projek Khas 3C",
  IMPAK: "Impak",
  PENGENALAN: "Pengenalan",
  RUJUKAN: "Rujukan",
};

export function resolveDisplayLabel(heading: string): string {
  return SECTION_DISPLAY_LABELS[heading.toUpperCase()] ?? heading;
}

export function isKadarHeading(heading: string): boolean {
  return ["KADAR", "KADAR BANTUAN", "KADAR ELAUN"].includes(
    heading.toUpperCase(),
  );
}
