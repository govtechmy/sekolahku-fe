import type { ItemSekolahModel } from "../models/response";
import { DATA_BASE_URL } from "../services/school.svc";

export const formatSchoolAddress = (school: ItemSekolahModel): string => {
  const { alamatSurat, poskodSurat, bandarSurat } = school.data.infoKomunikasi;
  const { negeri } = school.data.infoPentadbiran || {};

  const parts = [
    alamatSurat,
    poskodSurat && bandarSurat
      ? `${poskodSurat} ${bandarSurat}`
      : poskodSurat || bandarSurat,
    negeri,
  ].filter(Boolean);

  return parts.join(", ");
};

export const getSchoolLogoUrl = (
  negeri: string,
  parlimen: string,
  kodSekolah: string,
): string => {
  return `${DATA_BASE_URL}/${negeri}/${parlimen}/${kodSekolah}/assets/logo.png`;
};
