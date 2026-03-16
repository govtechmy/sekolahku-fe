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
  negeriList: (string | null)[];
  jenisList: (string | null)[];
  setSelectedNegeri: (value: string) => void;
  setSelectedJenis: (value: string) => void;
  setSelectedPeringkat: (value: string) => void;
};

export function FilterDropdowns({
  selectedNegeri,
  selectedJenis,
  selectedPeringkat,
  negeriList,
  jenisList,
  setSelectedNegeri,
  setSelectedJenis,
  setSelectedPeringkat,
}: FilterDropdownsProps) {
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
          negeriList.filter((n): n is string => typeof n === "string")
          .map((n, idx) => (
            <SimpleSelectItem key={idx} value={n}>
              {underScoreRemover(n)}
            </SimpleSelectItem>
          ))}
      </SimpleSelect>

      <SimpleSelect
        size="small"
        variant="outline"
        onValueChange={setSelectedPeringkat}
        value={selectedPeringkat ?? "ALL"}
        placeholder="Peringkat"
        className="w-[155px]"
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
        {jenisList
          .filter((x): x is string => typeof x === "string")
          .map((x) => (
            <SimpleSelectItem key={x} value={x}>
              {SCHOOL_TYPE_LABELS[x] ? `${SCHOOL_TYPE_LABELS[x]} (${x})` : x}
            </SimpleSelectItem>
          ))}
      </SimpleSelect>

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
