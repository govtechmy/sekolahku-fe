import type { ItemSekolahModel } from "../../models/response";
import caseConverter from "../../utils/caseConverter";
import { formatSchoolAddress } from "../../utils/schoolHelpers";
import underScoreRemover from "../../utils/underscoreRemover";

interface NearbySchoolCardProps {
  school: ItemSekolahModel;
  handleNearbySchoolClick: (schoolId: string) => void;
  url: string;
}

export const NearbySchoolCard = ({
  school,
  handleNearbySchoolClick,
  url,
}: NearbySchoolCardProps) => {
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = "/utama/nearby-school-default.svg";
    e.currentTarget.className = "h-full w-full object-cover";
  };

  return (
    <div
      key={school.kodSekolah}
      className="bg-bg-white rounded-2xl shadow overflow-hidden border outline-otl-divider cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleNearbySchoolClick(school.kodSekolah)}
    >
      <div className="flex justify-center items-center h-40 border-b border-otl-gray-200">
        {!url && (
          <img
            src={"/utama/nearby-school-default.png"}
            alt={`${school.namaSekolah}`}
            className="h-full w-fit object-cover py-2"
            onError={handleImageError}
          />
        )}
        <img
          src={url}
          alt={`${school.namaSekolah}`}
          className="h-full w-fit object-contain py-2"
          onError={handleImageError}
        />
      </div>
      <div className="p-4.5 flex flex-col gap-2">
        <h3 className="text-txt-black-900 font-medium">
          {caseConverter(school.namaSekolah)}
        </h3>
        <p className="text-txt-black-500 text-sm min-h-12 line-clamp-2">
          {caseConverter(underScoreRemover(formatSchoolAddress(school)))}
        </p>
      </div>
    </div>
  );
};
