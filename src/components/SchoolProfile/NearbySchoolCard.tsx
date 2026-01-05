import type { ItemSekolahModel } from "../../models/response";
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
      className="bg-bg-white rounded-2xl shadow overflow-hidden border-[1px] outline-otl-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => handleNearbySchoolClick(school.kodSekolah)}
    >
      <div className="flex justify-center items-center h-40">
        <img
          src={url || "/utama/nearby-school-default.png"}
          alt={`${school.namaSekolah}`}
          className="h-full w-fit object-cover py-2"
          onError={handleImageError}
        />
      </div>
      <div className="p-4.5">
        <h3 className="text-txt-black-900 font-medium">{school.namaSekolah}</h3>
        <p className="text-gray-600 text-sm">{underScoreRemover(formatSchoolAddress(school))}</p>
      </div>
    </div>
  );
};
