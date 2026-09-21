import { DownloadIcon } from "@govtechmy/myds-react/icon";
import type { BantuanAction } from "../../models/response";

type BantuanActionListProps = {
  actions: BantuanAction[];
};

// Renders the `actions[]` (download/external links) some Bantuan items carry
// (e.g. KWAPM, Pengurusan Asrama Harian). Not built on DownloadAttachmentItem
// since that component expects filename/filesize/mimeType, which actions[]
// (just label+url) doesn't have.
export default function BantuanActionList({ actions }: BantuanActionListProps) {
  if (actions.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-otl-divider bg-bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7F0FE]">
          <DownloadIcon className="size-5 text-[#0062FF]" />
        </div>
        <h3 className="font-heading text-lg font-bold text-txt-black-900">
          Muat Turun & Pautan
        </h3>
      </div>
      <ul className="flex flex-col gap-2">
        {actions.map((action, index) => (
          <li key={index}>
            <a
              href={action.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-sm font-semibold text-[#0062FF] hover:underline"
            >
              <DownloadIcon className="size-4 shrink-0" />
              <span>{action.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
