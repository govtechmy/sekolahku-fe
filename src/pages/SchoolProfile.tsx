import {
  EmailIcon,
  GovtOfficeIcon,
  PhoneIcon,
  PinIcon,
  PrinterIcon,
  UserGroupIcon,
  UserIcon,
} from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SchoolProfileHero from "../components/Hero/SchoolProfileHero";
import { getSchoolProfile } from "../services/school.svc";
import type { ItemSekolahModel } from "../models/response";
import {
  StatCard,
  InfoRow,
  InfoGridItem,
  NearbySchoolCard,
} from "../components/SchoolProfile";
import { formatSchoolAddress, getSchoolLogoUrl } from "../utils/schoolHelpers";
import underScoreRemover from "../utils/underscoreRemover";
import caseConverter from "../utils/caseConverter";
import PageContainer from "../components/layout/PageContainer";
import { removePPD } from "../utils/ppdRemover";

export default function SchoolProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState<ItemSekolahModel | null>(null);
  const [nearbySchools, setNearbySchools] = useState<ItemSekolahModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const domain = import.meta.env.VITE_DOMAIN_NAME;
  const schoolProfile = "/halaman-sekolah";
  const lang = localStorage.getItem("lang") || "ms";

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchSchoolData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { school: schoolData, nearbySchools: nearby } =
          await getSchoolProfile(id);

        setSchool(schoolData);
        setNearbySchools(nearby);
      } catch (err) {
        console.error("Failed to fetch school profile:", err);
        setError(
          err instanceof Error ? err : new Error("Unknown error occurred"),
        );
        setSchool(null);
        setNearbySchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolData();
  }, [id]);

  const handleNearbySchoolClick = (schoolId: string) => {
    navigate(`/${lang}/halaman-sekolah/${schoolId}`);
  };

  if (loading) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">Memuatkan data sekolah...</div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">
          {error ? `Ralat: ${error.message}` : "Sekolah tidak dijumpai"}
        </div>
      </div>
    );
  }

  return (
    <>
      <HelmetMeta
        title={`Profil Sekolah ${school?.namaSekolah ?? "Sekolah"}`}
        description={`Halaman profil sekolah untuk ${school?.namaSekolah ?? "sekolah"}.`}
        canonical={`${domain}${schoolProfile}/${id}`}
      />
      <HelmetMeta
        title={`Profil Sekolah ${school?.namaSekolah ?? "Sekolah"}`}
        description={`Halaman profil sekolah untuk ${school?.namaSekolah ?? "sekolah"}.`}
        canonical={`${domain}${schoolProfile}/${id}`}
      />
      <div>
        <SchoolProfileHero
          school={school}
          url={getSchoolLogoUrl(
            school.data.infoPentadbiran?.negeri,
            school.data.infoPentadbiran?.parlimen,
            school.kodSekolah,
          )}
        />
        <>
          <div className="border-otl-divider border-y">
            <PageContainer>
              <div className="grid grid-cols-2 xl:grid-cols-2 overflow-hidden border border-otl-divider border-y-0 divide-y md:divide-y-0 divide-x divide-otl-divider ">
                <StatCard
                  icon={<UserGroupIcon />}
                  label="PELAJAR"
                  value={
                    school?.data?.infoSekolah?.jumlahPelajar ?? "Tiada Maklumat"
                  }
                />
                <StatCard
                  icon={<UserIcon />}
                  label="GURU"
                  value={
                    school?.data?.infoSekolah?.jumlahGuru ?? "Tiada Maklumat"
                  }
                />
              </div>
            </PageContainer>
          </div>
          <PageContainer>
            <div className="pt-[84px] pb-[32px] px-[40px] max-md:pt-[48px] max-md:px-[28px]">
              <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">
                <div
                  className=" focus:outline-primary-200"
                  tabIndex={0}
                  aria-label={`Mengenai Sekolah`}
                >
                  Mengenai Sekolah
                </div>
              </div>
              <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  {school.namaSekolah && (
                    <InfoRow
                      icon={<GovtOfficeIcon width={24} height={24} />}
                      text={caseConverter(school.namaSekolah)}
                    />
                  )}
                  {school.data.infoKomunikasi?.noTelefon && (
                    <InfoRow
                      icon={<PhoneIcon width={24} height={24} />}
                      text={school.data.infoKomunikasi.noTelefon}
                    />
                  )}
                  {school.data.infoKomunikasi?.noFax && (
                    <InfoRow
                      icon={<PrinterIcon width={24} height={24} />}
                      text={school.data.infoKomunikasi.noFax}
                    />
                  )}
                  {school.data.infoKomunikasi?.email && (
                    <InfoRow
                      icon={<EmailIcon width={24} height={24} />}
                      text={school.data.infoKomunikasi.email}
                    />
                  )}
                  <InfoRow
                    icon={<PinIcon width={24} height={24} />}
                    text={caseConverter(
                      underScoreRemover(formatSchoolAddress(school)),
                    )}
                  />
                </div>
                <div>
                  <img
                    src="/utama/school-outline.png"
                    alt="School building outline"
                  />
                </div>
              </div>
            </div>
          </PageContainer>

          <div className="border-otl-divider border-y">
            <PageContainer className="px-4">
              <div className="grid grid-cols-2 xl:grid-cols-4 overflow-hidden border border-otl-divider border-y-0 divide-x divide-y divide-otl-divider">
                {school.kodSekolah && (
                  <InfoGridItem label="KOD SEKOLAH" value={school.kodSekolah} />
                )}
                {school.data.infoPentadbiran?.negeri && (
                  <InfoGridItem
                    label="NEGERI"
                    value={caseConverter(
                      underScoreRemover(school.data.infoPentadbiran.negeri),
                    )}
                  />
                )}
                {school.data.infoPentadbiran?.ppd && (
                  <InfoGridItem
                    label="PPD"
                    value={
                      "PPD " +
                      caseConverter(removePPD(school.data.infoPentadbiran.ppd))
                    }
                  />
                )}
                {school.data.infoPentadbiran?.parlimen && (
                  <InfoGridItem
                    label="PARLIMEN"
                    value={caseConverter(
                      underScoreRemover(school.data.infoPentadbiran.parlimen),
                    )}
                  />
                )}
                {school.data.infoPentadbiran?.bantuan && (
                  <InfoGridItem
                    label="BANTUAN"
                    value={school.data.infoPentadbiran.bantuan}
                  />
                )}
                {school.data.infoPentadbiran?.bilSesi && (
                  <InfoGridItem
                    label="BIL SESI"
                    value={caseConverter(school.data.infoPentadbiran.bilSesi)}
                  />
                )}
                {school.data.infoPentadbiran?.prasekolah && (
                  <InfoGridItem
                    label="PRASEKOLAH"
                    value={school.data.infoPentadbiran.prasekolah}
                  />
                )}
                {school.data.infoPentadbiran?.integrasi && (
                  <InfoGridItem
                    label="INTEGRASI"
                    value={school.data.infoPentadbiran.integrasi}
                  />
                )}
              </div>
            </PageContainer>
          </div>
          {nearbySchools && nearbySchools.length > 0 && (
            <PageContainer>
              <div className="py-[84px] px-[40px] max-md:px-[28px] max-md:py-[48px]">
                <div className="text-heading-sm text-txt-black-900 font-semibold pb-12 ">
                  <div
                    className="focus:outline-primary-200"
                    tabIndex={0}
                    aria-label={`Sekolah Berdekatan`}
                  >
                    Sekolah Berdekatan
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {nearbySchools.map((school, index) => (
                    <div
                      key={school.kodSekolah}
                      className={
                        nearbySchools.length === 3 && index === 2
                          ? "md:col-span-2 md:justify-self-center xl:col-span-1"
                          : ""
                      }
                    >
                      <NearbySchoolCard
                        school={school}
                        url={getSchoolLogoUrl(
                          school.data.infoPentadbiran?.negeri,
                          school.data.infoPentadbiran?.parlimen,
                          school.kodSekolah,
                        )}
                        handleNearbySchoolClick={handleNearbySchoolClick}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </PageContainer>
          )}
        </>
      </div>
    </>
  );
}
