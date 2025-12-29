import { CheckCircleFillIcon, CrossFillIcon } from "@govtechmy/myds-react/icon";

interface InfoGridItemProps {
  label: string;
  value: string | boolean;
}

export const InfoGridItem = ({ label, value }: InfoGridItemProps) => {
  return (
    <div className="border-[1px] outline-otl-gray-200 gap-0.5">
      <div className="py-8 px-2.5 rounded-xl shadow text-center">
        <div className="text-txt-primary uppercase pb-2">{label}</div>
        {typeof value === 'string' ? (
          <div className="text-txt-black-500">{value}</div>
        ) : value === true ? (
          <div className="text-txt-success flex items-center justify-center">
            <CheckCircleFillIcon />
          </div>
        ) : (
          <div className="text-txt-danger flex items-center justify-center">
            <CrossFillIcon />
          </div>
        )}
      </div>
    </div>
  );
};
