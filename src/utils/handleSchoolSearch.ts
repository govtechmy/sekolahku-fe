import { getSchoolSuggestion } from "../services/school.svc";
import type { ItemSekolahModel } from "../models/response";
import type { SearchBarMapProps } from "../types/maps";

export type SchoolSearchParams = {
  namaSekolah?: string;
  negeri?: string;
  jenis?: string;
};

export type SchoolSearchSetters = {
  setFilteredSearchResult: (val: SearchBarMapProps[]) => void;
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
};

export const transformSchoolData = (
  school: ItemSekolahModel
): SearchBarMapProps => {
  return {
    namaSekolah: school.namaSekolah ?? "Sekolah Tidak Diketahui",
    kodSekolah: school.kodSekolah ?? "",
    koordinatYY: school.data.infoLokasi.koordinatYY,
    koordinatXX: school.data.infoLokasi.koordinatXX,
    negeri: school.data.infoPentadbiran.negeri ?? "",
    bandarSurat: school.data.infoKomunikasi.bandarSurat,
    jenisLabel: school.data.infoSekolah.jenisLabel ?? "",
    jumlahPelajar: school.data.infoSekolah.jumlahPelajar ?? 0,
    jumlahGuru: school.data.infoSekolah.jumlahGuru ?? 0,
    parlimen: school.data.infoPentadbiran.parlimen ?? "",
  };
};

export async function handleSchoolSearch(
  params: SchoolSearchParams,
  setters: SchoolSearchSetters
): Promise<void> {
  try {
    const results = await getSchoolSuggestion(params);
    const transformed = results.map(transformSchoolData);
    setters.setFilteredSearchResult(transformed);

    if (transformed.length > 0) {
      const firstResult = transformed[0];
      setters.setCenter([firstResult.koordinatYY, firstResult.koordinatXX]);
      setters.setZoom(18);
    }
  } catch (error) {
    console.error("Error fetching school suggestions:", error);
    setters.setFilteredSearchResult([]);
  }
}
