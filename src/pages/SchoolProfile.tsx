import { EmailIcon, GovtOfficeIcon, PhoneIcon, PinIcon, PrinterIcon, UserGroupIcon, UserIcon } from "@govtechmy/myds-react/icon";
import HelmetMeta from "../seo/HelmetMeta";
import { useParams, useNavigate } from "react-router-dom";
import SchoolProfileHero from "../components/Hero/SchoolProfileHero";
import { getSchoolLogoUrl } from "../services/school.svc";
import { useSchoolProfile } from "../hooks/useSchoolProfile";
import { StatCard, InfoRow, InfoGridItem, NearbySchoolCard } from "../components/SchoolProfile";
import { formatSchoolAddress } from "../utils/schoolHelpers";

export default function SchoolProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { school, nearbySchools, loading, error } = useSchoolProfile(id);
  const domain = import.meta.env.VITE_DOMAIN_NAME;
  const schoolProfile = "/halaman-sekolah";
  const lang = localStorage.getItem("lang") || "ms";

  const handleNearbySchoolClick = (schoolId: string) => {
    navigate(`/${lang}/halaman-sekolah/${schoolId}`);
  };

  if (loading) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">Loading school data...</div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
        <div className="text-center py-8">
          {error ? `Error: ${error.message}` : 'School not found'}
        </div>
      </div>
    );
  }

  return (<>
    <HelmetMeta
      title={`${school?.namaSekolah} School Profile`}
      description={`School profile page for ${school?.namaSekolah}.`}
      canonical={`${domain}${schoolProfile}/${id}`}
    />
    <HelmetMeta
      title={`${school?.namaSekolah} School Profile`}
      description={`School profile page for ${school?.namaSekolah}.`}
      canonical={`${domain}${schoolProfile}/${id}`}
    />
    <SchoolProfileHero 
      school={school} 
      url={getSchoolLogoUrl( school.data.infoPentadbiran.negeri, school.data.infoPentadbiran.parlimen, school.kodSekolah )}
    />
    <div className="w-full flex-shrink-0 mx-auto flex-1 [906px]:px-[24px] space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-2 mt-0 md:px-12 max-md:px-0">
        <StatCard
          icon={<UserGroupIcon />}
          label="PELAJAR"
          value={school?.data?.infoSekolah?.jumlahPelajar ?? "Tiada Maklumat"}
        />
        <StatCard
          icon={<UserIcon />}
          label="GURU"
          value={school?.data?.infoSekolah?.jumlahGuru ?? "Tiada Maklumat"}
        />
      </div>

      <div className="pt-[84px] pb-[32px] px-[109px] max-md:pt-[48px] max-md:px-[28px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Mengenai Sekolah</div>
        <div className="shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <InfoRow 
              icon={<GovtOfficeIcon width={24} height={24} />}
              text={school.namaSekolah}
            />
            <InfoRow 
              icon={<PhoneIcon width={24} height={24} />}
              text={school.data.infoKomunikasi?.noTelefon}
            />
            <InfoRow 
              icon={<PrinterIcon width={24} height={24} />}
              text={school.data.infoKomunikasi?.noFax}
            />
            <InfoRow 
              icon={<EmailIcon width={24} height={24} />}
              text={school.data.infoKomunikasi?.email}
            />
            <InfoRow 
              icon={<PinIcon width={24} height={24} />}
              text={formatSchoolAddress(school)}
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

      <div className="grid grid-cols-2 md:grid-cols-4 px-9">
        <InfoGridItem label="KOD SEKOLAH" value={school.kodSekolah} />
        <InfoGridItem label="NEGERI" value={school.data.infoPentadbiran?.negeri} />
        <InfoGridItem label="PPD" value={school.data.infoPentadbiran?.ppd} />
        <InfoGridItem label="PARLIMEN" value={school.data.infoPentadbiran?.parlimen} />
        <InfoGridItem label="BANTUAN" value={school.data.infoPentadbiran?.bantuan} />
        <InfoGridItem label="BIL SESI" value={school.data.infoPentadbiran?.bilSesi} />
        <InfoGridItem label="PRASEKOLAH" value={school.data.infoPentadbiran?.prasekolah} />
        <InfoGridItem label="INTEGRASI" value={school.data.infoPentadbiran?.integrasi} />
      </div>

      <div className="py-[84px] px-[109px] max-md:px-[28px] max-md:py-[48px]">
        <div className="text-heading-sm text-txt-black-900 font-semibold pb-12">Sekolah Berdekatan</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearbySchools.map((school) => (
            <NearbySchoolCard
              key={school.kodSekolah}
              school={school}
              url={getSchoolLogoUrl( school.data.infoPentadbiran.negeri,school.data.infoPentadbiran.parlimen,school.kodSekolah )}
              handleNearbySchoolClick={handleNearbySchoolClick}
            />
          ))}
        </div>
      </div>
    </div>
  </>);
}
