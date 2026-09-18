import {
  MapIcon,
  BookMOEIcon,
  GovtOfficeIcon,
  ReloadIcon,
} from "@govtechmy/myds-react/icon";
import { SimpleSelect, SimpleSelectItem } from "../shared/SelectComponent";
import { SCHOOL_TYPE_LABELS } from "../../constants/schoolTypes";
import underScoreRemover from "../../utils/underscoreRemover";

type FilterBarProps = {
  selectedNegeri: string;
  selectedJenis: string;
  selectedPeringkat: string;
  negeriList: (string | null)[];
  jenisList: (string | null)[];
  setSelectedNegeri: (value: string) => void;
  setSelectedJenis: (value: string) => void;
  setSelectedPeringkat: (value: string) => void;
  onClearFilters: () => void;
  dataTotal: number;
};

function FilterPill({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-otl-gray-200 bg-white px-2.5 py-1.5">
      {icon}
      <div className="flex min-w-[110px] flex-col items-start leading-none">
        <span className="font-body text-[9px] font-bold leading-none tracking-[0.3px] text-txt-black-500">
          {label}
        </span>
        {children}
      </div>
    </div>
  );
}

export function FilterBar({
  selectedNegeri,
  selectedJenis,
  selectedPeringkat,
  negeriList,
  jenisList,
  setSelectedNegeri,
  setSelectedJenis,
  setSelectedPeringkat,
  onClearFilters,
  dataTotal,
}: FilterBarProps) {
  const hasActiveFilter =
    selectedNegeri !== "ALL" ||
    selectedJenis !== "ALL" ||
    selectedPeringkat !== "ALL";

  return (
    <div className="flex w-full flex-col gap-2 bg-[#f8fafc] px-4 py-2 md:flex-row md:items-center md:justify-between md:gap-3 md:px-8 md:py-2">
      <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
        <FilterPill
          icon={<MapIcon className="size-4 shrink-0 text-[#2563EB]" />}
          label="NEGERI"
        >
          <SimpleSelect
            size="small"
            variant="ghost"
            triggerClassName="!p-0 leading-tight"
            value={selectedNegeri}
            onValueChange={setSelectedNegeri}
            placeholder="Semua Negeri"
          >
            <SimpleSelectItem value="ALL">Semua Negeri</SimpleSelectItem>
            {negeriList
              .filter((n): n is string => typeof n === "string")
              .map((n, idx) => (
                <SimpleSelectItem key={idx} value={n}>
                  {underScoreRemover(n)}
                </SimpleSelectItem>
              ))}
          </SimpleSelect>
        </FilterPill>

        <FilterPill
          icon={<BookMOEIcon className="size-4 shrink-0 text-[#2563EB]" />}
          label="PERINGKAT"
        >
          <SimpleSelect
            size="small"
            variant="ghost"
            triggerClassName="!p-0 leading-tight"
            value={selectedPeringkat}
            onValueChange={setSelectedPeringkat}
            placeholder="Semua Peringkat"
          >
            <SimpleSelectItem value="ALL">Semua Peringkat</SimpleSelectItem>
            <SimpleSelectItem value="MENENGAH">Menengah</SimpleSelectItem>
            <SimpleSelectItem value="RENDAH">Rendah</SimpleSelectItem>
          </SimpleSelect>
        </FilterPill>

        <FilterPill
          icon={<GovtOfficeIcon className="size-4 shrink-0 text-[#2563EB]" />}
          label="JENIS SEKOLAH"
        >
          <SimpleSelect
            size="small"
            variant="ghost"
            triggerClassName="!p-0 leading-tight"
            value={selectedJenis}
            onValueChange={setSelectedJenis}
            placeholder="Semua Jenis"
          >
            <SimpleSelectItem value="ALL">Semua Jenis</SimpleSelectItem>
            {jenisList
              .filter((x): x is string => typeof x === "string")
              .sort((a, b) => {
                const labelA = SCHOOL_TYPE_LABELS[a] || a;
                const labelB = SCHOOL_TYPE_LABELS[b] || b;
                return labelA.localeCompare(labelB);
              })
              .map((x) => (
                <SimpleSelectItem key={x} value={x}>
                  {SCHOOL_TYPE_LABELS[x]
                    ? `${SCHOOL_TYPE_LABELS[x]} (${x})`
                    : x}
                </SimpleSelectItem>
              ))}
          </SimpleSelect>
        </FilterPill>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-sm font-bold text-txt-black-900">
            {dataTotal.toLocaleString("ms-MY")}
          </span>
          <span className="font-body text-sm text-txt-black-500">
            sekolah ditemui
          </span>
        </div>
        {hasActiveFilter && (
          <>
            <div className="h-5 w-px bg-otl-gray-200" />
            <button
              type="button"
              onClick={onClearFilters}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 font-body text-sm font-semibold text-[#2563EB] transition hover:bg-white"
            >
              <ReloadIcon className="size-[15px]" />
              Set Semula
            </button>
          </>
        )}
      </div>
    </div>
  );
}
