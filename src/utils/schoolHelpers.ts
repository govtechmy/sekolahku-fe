import type { ItemSekolahModel } from "../models/response";
import { DATA_BASE_URL } from "../services/school.svc";
import schoolLogoFallback from "../data/schoolLogoFallback.json";

export const formatSchoolAddress = (school: ItemSekolahModel): string => {
  const { alamatSurat, poskodSurat, bandarSurat } =
    school?.data?.infoKomunikasi || {};
  const { negeri } = school?.data?.infoPentadbiran || {};

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

const SCHOOL_LOGO_FALLBACK: Record<string, string> = schoolLogoFallback;

// Local logo for a school whose CDN logo.png is missing, or undefined if none.
export const getSchoolLogoFallbackUrl = (
  kodSekolah: string | undefined,
): string | undefined => {
  const ext = kodSekolah ? SCHOOL_LOGO_FALLBACK[kodSekolah] : undefined;
  return ext ? `/logo-sekolah/${kodSekolah}.${ext}` : undefined;
};

// Call from a logo <img> onError before applying the default image. Swaps to
// the local fallback once per school and returns true; returns false when
// there is no fallback or it already failed, so the caller shows its default.
// Tracks the school code (not a boolean) because React reuses the same <img>
// when the selected school changes.
export const trySchoolLogoFallback = (
  img: HTMLImageElement,
  kodSekolah: string | undefined,
): boolean => {
  const fallbackUrl = getSchoolLogoFallbackUrl(kodSekolah);
  if (!fallbackUrl || img.dataset.logoFallback === kodSekolah) return false;
  img.dataset.logoFallback = kodSekolah;
  img.src = fallbackUrl;
  return true;
};
