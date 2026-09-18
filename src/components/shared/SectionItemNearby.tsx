import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  PinIcon,
  SearchIcon,
  ArrowForwardIcon,
} from "@govtechmy/myds-react/icon";
import { getSchoolSuggestion } from "../../services/school.svc";
import { getSchoolLogoUrl } from "../../utils/schoolHelpers";
import { calculateDistance } from "../../utils/calculateDistance";
import { buildSchoolSearchPath } from "../../utils/schoolSearchUrl";
import NearbySchoolCardCompact from "./NearbySchoolCardCompact";
import type { ItemSekolahModel } from "../../models/response";

interface NearbySchool {
  school: ItemSekolahModel;
  distanceKm?: number;
}

export default function SectionItemNearby() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [postcode, setPostcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schools, setSchools] = useState<NearbySchool[]>([]);

  const loadNearby = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const { filteredData } = await getSchoolSuggestion(undefined, 1, [
        lat,
        lng,
      ]);
      const withDistance = filteredData.map((school) => ({
        school,
        distanceKm:
          calculateDistance(
            lat,
            lng,
            school.data.infoLokasi.koordinatYY,
            school.data.infoLokasi.koordinatXX,
          ) / 1000,
      }));
      withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
      setSchools(withDistance.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch nearby schools:", err);
      setError("Gagal mendapatkan sekolah berdekatan.");
    } finally {
      setLoading(false);
    }
  };

  const loadRandomFallback = async () => {
    setLoading(true);
    try {
      const { filteredData } = await getSchoolSuggestion();
      const shuffled = [...filteredData].sort(() => Math.random() - 0.5);
      setSchools(shuffled.slice(0, 3).map((school) => ({ school })));
    } catch (err) {
      console.error("Failed to fetch fallback schools:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      loadRandomFallback();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadNearby(latitude, longitude);
      },
      () => {
        loadRandomFallback();
      },
      { timeout: 5000 },
    );
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Lokasi tidak disokong pada peranti ini.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        loadNearby(latitude, longitude);
      },
      () => {
        setLoading(false);
        setError("Gagal mendapatkan lokasi anda.");
      },
    );
  };

  const handleNearbySchoolClick = (schoolId: string) => {
    navigate(`/${lang || "ms"}/halaman-sekolah/${schoolId}`);
  };

  const handlePostcodeSearch = () => {
    if (!postcode.trim()) return;
    navigate(buildSchoolSearchPath(lang, postcode.trim()));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <PinIcon className="size-[18px] text-[#0062FF]" />
            <h2 className="font-heading text-xl font-bold text-[#0062FF]">
              Sekolah Berdekatan Anda
            </h2>
          </div>
          <p className="font-body text-[13px] text-txt-black-500">
            Cari sekolah berhampiran lokasi anda dengan lebih mudah.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(buildSchoolSearchPath(lang))}
          className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#0062FF] hover:underline focus:outline-primary-200"
        >
          Lihat semua sekolah berdekatan
          <ArrowForwardIcon className="size-3.5" />
        </button>
      </div>

      <div className="flex flex-col gap-6 rounded-[20px] bg-[#EAF2FE] p-6 lg:flex-row">
        <div className="flex w-full max-w-[260px] flex-col gap-3">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0062FF] px-5 py-3 font-body text-[13px] font-bold text-white transition hover:bg-[#0052D6] disabled:opacity-60"
          >
            <PinIcon className="size-4" />
            Guna lokasi semasa saya
          </button>
          <div className="flex w-full justify-center">
            <span className="font-body text-xs text-txt-black-500">atau</span>
          </div>
          <div className="flex w-full items-center justify-between gap-2 rounded-full bg-white py-2.5 pl-4 pr-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <PinIcon className="size-4 shrink-0 text-txt-black-400" />
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePostcodeSearch();
                }}
                placeholder="Masukkan poskod atau kawasan"
                className="min-w-0 flex-1 bg-transparent font-body text-[13px] text-txt-black-900 outline-none placeholder:text-txt-black-400"
              />
            </div>
            <button
              type="button"
              onClick={handlePostcodeSearch}
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0062FF] transition hover:bg-[#0052D6]"
              aria-label="Cari"
            >
              <SearchIcon className="size-3.5 text-white" />
            </button>
          </div>
          {error && <p className="font-body text-xs text-red-600">{error}</p>}
        </div>

        <div className="min-w-0 flex-1 self-stretch">
          {schools.length > 0 ? (
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
              {schools.map(({ school, distanceKm }) => (
                <NearbySchoolCardCompact
                  key={school.kodSekolah}
                  school={school}
                  distanceKm={distanceKm}
                  onClick={handleNearbySchoolClick}
                  url={getSchoolLogoUrl(
                    school.data.infoPentadbiran.negeri,
                    school.data.infoPentadbiran.parlimen,
                    school.kodSekolah,
                  )}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[140px] items-center justify-center rounded-2xl bg-white/60 p-6 text-center font-body text-sm text-txt-black-500">
              {loading
                ? "Mencari sekolah berdekatan..."
                : "Guna lokasi semasa atau masukkan poskod untuk melihat sekolah berdekatan."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
