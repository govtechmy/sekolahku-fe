import type { ItemSekolahModel } from "../models/response";


export const formatSchoolAddress = (school: ItemSekolahModel): string => {
  const { alamatSurat, poskodSurat, bandarSurat } = school.data.infoKomunikasi;
  const { negeri } = school.data.infoPentadbiran || {};

  const parts = [
    alamatSurat,
    poskodSurat && bandarSurat ? `${poskodSurat} ${bandarSurat}` : poskodSurat || bandarSurat,
    negeri,
  ].filter(Boolean);

  return parts.join(', ');
};


export const getSchoolLogoUrl = (
  baseUrl: string,
  negeri: string,
  parlimen: string,
  kodSekolah: string
): string => {
  return `${baseUrl}/${negeri}/${parlimen}/${kodSekolah}/assets/logo.png`;
};
