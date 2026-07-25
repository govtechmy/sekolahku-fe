import underScoreRemover from "../../utils/underscoreRemover";
import { SimpleSelect, SimpleSelectItem } from "../shared/SelectComponent";
import { SCHOOL_TYPE_LABELS } from "../../constants/schoolTypes";

/*
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/SelectMydsFix";
*/

type FilterDropdownsProps = {
  selectedNegeri: string;
  selectedJenis: string;
  selectedPeringkat: string;
  selectedSesi: string;
  negeriList: (string | null)[];
  jenisList: (string | null)[];
  setSelectedNegeri: (value: string) => void;
  setSelectedJenis: (value: string) => void;
  setSelectedPeringkat: (value: string) => void;
  setSelectedSesi: (value: string) => void;
  onClearFilters: () => void;
};

export function FilterDropdowns({
  selectedNegeri,
  selectedJenis,
  selectedPeringkat,
  selectedSesi,
  negeriList,
  jenisList,
  setSelectedNegeri,
  setSelectedJenis,
  setSelectedPeringkat,
  setSelectedSesi,
  onClearFilters,
}: FilterDropdownsProps) {
  const hasActiveFilter =
    selectedNegeri !== "ALL" ||
    selectedJenis !== "ALL" ||
    selectedPeringkat !== "ALL" ||
    selectedSesi !== "ALL";
  return (
    <div className="px-3 py-4 border-t border-gray-200 flex flex-wrap gap-2 text-sm">
      {/* NEW IMPLEMENTATION - SimpleSelect with built-in truncation */}
      <SimpleSelect
        size="small"
        variant="outline"
        onValueChange={setSelectedNegeri}
        value={selectedNegeri ?? "ALL"}
        placeholder="Jenis Negeri"
        className="w-[155px]"
      >
        <SimpleSelectItem value="ALL">Semua Negeri</SimpleSelectItem>
        {negeriList &&
          negeriList
            .filter((n): n is string => typeof n === "string")
            .map((n, idx) => (
              <SimpleSelectItem key={idx} value={n}>
                {underScoreRemover(n)}
              </SimpleSelectItem>
            ))}
      </SimpleSelect>

      <SimpleSelect
        size="small"
        variant="outline"
        placeholder="Peringkat"
        className="w-[155px]"
        value={selectedPeringkat ?? "ALL"}
        onValueChange={setSelectedPeringkat}
      >
        <SimpleSelectItem value="ALL">Semua Peringkat</SimpleSelectItem>
        <SimpleSelectItem value="MENENGAH">Menengah</SimpleSelectItem>
        <SimpleSelectItem value="RENDAH">Rendah</SimpleSelectItem>
      </SimpleSelect>

      {/*
      <Select
        size="small"
        variant="outline"
        onValueChange={setSelectedNegeri}
        value={selectedNegeri ?? "ALL"}
      >
        <SelectTrigger
          aria-label="Pilih Negeri"
          className="!w-[155px] justify-between truncate"
        >
          <SelectValue placeholder="Jenis Negeri" />
        </SelectTrigger>
        <SelectContent className="z-[700]">
          <SelectGroup>
            <SelectItem value="ALL">Semua Negeri</SelectItem>
            {negeriList
              .filter((n): n is string => typeof n === "string")
              .map((n, idx) => (
                <SelectItem key={idx} value={n}>
                  {underScoreRemover(n)}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      */}

      <SimpleSelect
        size="small"
        variant="outline"
        onValueChange={setSelectedJenis}
        value={selectedJenis ?? "ALL"}
        placeholder="Jenis Sekolah"
        className="w-[155px]"
      >
        <SimpleSelectItem value="ALL">Semua Jenis</SimpleSelectItem>
        <SimpleSelectItem value="SEKOLAH_ANGKAT_MADANI">
          Sekolah Angkat Madani
        </SimpleSelectItem>
        {jenisList &&
          jenisList
            .filter((x): x is string => typeof x === "string")
            .sort((a, b) => {
              const labelA = SCHOOL_TYPE_LABELS[a] || a;
              const labelB = SCHOOL_TYPE_LABELS[b] || b;
              return labelA.localeCompare(labelB);
            })
            .map((x) => (
              <SimpleSelectItem key={x} value={x}>
                {SCHOOL_TYPE_LABELS[x] ? `${SCHOOL_TYPE_LABELS[x]} (${x})` : x}
              </SimpleSelectItem>
            ))}
      </SimpleSelect>

      <SimpleSelect
        size="small"
        variant="outline"
        onValueChange={setSelectedSesi}
        value={selectedSesi ?? "ALL"}
        placeholder="Sesi"
        className="w-[155px]"
      >
        <SimpleSelectItem value="ALL">Semua Sesi</SimpleSelectItem>
        <SimpleSelectItem value="Pagi Sahaja">Pagi Sahaja</SimpleSelectItem>
        <SimpleSelectItem value="Pagi dan Petang">
          Pagi dan Petang
        </SimpleSelectItem>
        <SimpleSelectItem value="Petang Sahaja">Petang Sahaja</SimpleSelectItem>
      </SimpleSelect>

      {hasActiveFilter && (
        <button
          type="button"
          onClick={onClearFilters}
          className="h-9 rounded-md border border-gray-300 px-3 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Kosongkan Filter
        </button>
      )}

      {/*
      <Select
        size="small"
        variant="outline"
        onValueChange={setSelectedJenis}
        value={selectedJenis ?? "ALL"}
      >
        <SelectTrigger
          aria-label="Pilih Jenis"
          className="!w-[155px] justify-between truncate"
        >
          <SelectValue placeholder="Jenis Sekolah" />
        </SelectTrigger>
        <SelectContent className="z-[700]">
          <SelectGroup>
            <SelectItem value="ALL">Semua Jenis</SelectItem>
            {jenisList
              .filter((x): x is string => typeof x === "string")
              .map((x) => (
                <SelectItem key={x} value={x}>
                  {SCHOOL_TYPE_LABELS[x]
                    ? `${SCHOOL_TYPE_LABELS[x]} (${x})`
                    : x}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      */}
    </div>
  );
}
