import underScoreRemover from "../../utils/underscoreRemover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shared/SelectMydsFix";

const SCHOOL_TYPE_LABELS: Record<string, string> = {
  "K11": "Sekolah Model Khas Komprehensif 11",
  "K9": "Sekolah Model Khas Komprehensif 9",
  "KT6": "Kolej Tingkatan Enam",
  "KV": "Kolej Vokasional",
  "MODEL KHAS": "Sekolah Model Khas",
  "SBJK": "Sekolah Bimbingan Jalinan Kasih",
  "SBP": "Sekolah Berasrama Penuh",
  "SENI": "Sekolah Seni Malaysia",
  "SJKC": "Sekolah Jenis Kebangsaan (Cina)",
  "SJKT": "Sekolah Jenis Kebangsaan (Tamil)",
  "SK": "Sekolah Kebangsaan",
  "SK KHAS": "Sekolah Kebangsaan Pendidikan Khas",
  "SM KHAS": "Sekolah Menengah Pendidikan Khas",
  "SM SABK": "Sekolah Menengah Agama Bantuan Kerajaan",
  "SMK": "Sekolah Menengah Kebangsaan",
  "SMKA": "Sekolah Menengah Kebangsaan Agama",
  "SMT": "Sekolah Menengah Teknik",
  "SR SABK": "Sekolah Rendah Agama Bantuan Kerajaan",
  "SUKAN": "Sekolah Sukan Malaysia",
};

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

  console.log(jenisList);
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
          className="w-[155px] justify-betweent truncate"
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

      <Select
        size="small"
        variant="outline"
        onValueChange={setSelectedJenis}
        value={selectedJenis ?? "ALL"}
      >
        <SelectTrigger
          aria-label="Pilih Jenis"
          className="truncate"
        >
          <SelectValue placeholder="Jenis Sekolah" />
        </SelectTrigger>
        <SelectContent className="z-[700]">
          <SelectGroup>
            <SelectItem value="ALL">Semua Jenis</SelectItem>
            {jenisList
              .filter((x): x is string => typeof x === "string")
              .map((x, idx: number) => (
                <SelectItem key={idx} value={x}>
                  {SCHOOL_TYPE_LABELS[x] ? `${SCHOOL_TYPE_LABELS[x]} (${x})` : x}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
