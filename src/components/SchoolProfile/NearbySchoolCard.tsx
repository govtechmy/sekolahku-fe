import type { ItemSekolahModel } from "../../models/response";
import { formatSchoolAddress } from "../../utils/schoolHelpers";

interface NearbySchoolCardProps {
  school: ItemSekolahModel;
  onSchoolClick?: (schoolId: string) => void;
  url: string;
}

/**
 * Reusable card component for displaying nearby school information
 */
export const NearbySchoolCard = ({ school, onSchoolClick, url }: NearbySchoolCardProps) => {
  const address = formatSchoolAddress(school);

  const handleClick = () => {
    if (onSchoolClick) {
      onSchoolClick(school.kodSekolah);
    }
  };

  return (
    <div 
      key={school.kodSekolah} 
      className="bg-white rounded-2xl shadow overflow-hidden border-[1px] outline-otl-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      <img
        src={url}
        alt={`${school.namaSekolah}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4.5">
        <h3 className="text-txt-black-900 font-medium">{school.namaSekolah}</h3>
        <p className="text-gray-600 text-sm">{address}</p>
      </div>
    </div>
  );
};
