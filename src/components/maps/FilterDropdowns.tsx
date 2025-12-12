import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/SelectMydsFix";

type FilterDropdownsProps = {
  selectedNegeri: string;
  selectedJenis: string;
  negeriList: (string | undefined)[];
  jenisList: (string | undefined)[];
  setSelectedNegeri: (value: string) => void;
  setSelectedJenis: (value: string) => void;
};

export function FilterDropdowns({
  selectedNegeri,
  selectedJenis,
  negeriList,
  jenisList,
  setSelectedNegeri,
  setSelectedJenis,
}: FilterDropdownsProps) {
  return (
    <div className="px-3 py-4 border-t border-gray-200 flex gap-2 text-sm">
      <Select
        size="small"
        variant="outline"
        onValueChange={setSelectedNegeri}
        value={selectedNegeri ?? "ALL"}
      >
        <SelectTrigger
          aria-label="Pilih Negeri"
          className="w-[155px] justify-between"
        >
          <SelectValue placeholder="Jenis Negeri" />
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectGroup>
            <SelectItem value="ALL">Semua Negeri</SelectItem>
            {negeriList
              .filter((n): n is string => typeof n === "string")
              .map((n, idx) => (
                <SelectItem key={idx} value={n}>
                  {n}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        size="small"
        variant="outline"
        onValueChange={setSelectedJenis}
        value={selectedJenis ?? "ALL"}
      >
        <SelectTrigger
          aria-label="Pilih Jenis"
          className="w-[155px] justify-between"
        >
          <SelectValue placeholder="Jenis Sekolah" />
        </SelectTrigger>
        <SelectContent className="z-[1000]">
          <SelectGroup>
            <SelectItem value="ALL">Semua Jenis</SelectItem>
            {jenisList
              .filter((x): x is string => typeof x === "string")
              .map((x, idx: number) => (
                <SelectItem key={idx} value={x}>
                  {x}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
