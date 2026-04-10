import { CheckCircleFillIcon, CrossFillIcon } from "@govtechmy/myds-react/icon";

interface InfoGridItemProps {
  label: string;
  value: string | boolean;
  note?: string;
}

export const InfoGridItem = ({ label, value, note }: InfoGridItemProps) => {
  return (
    <div
      className="gap-0.5 focus:outline-primary-200"
      tabIndex={0}
      aria-label={`${label}: ${value}${note ? ` | ${note}` : ""}`}
    >
      <div className="py-8 px-2.5 rounded-xl shadow text-center">
        <div className="text-txt-primary uppercase pb-2">{label}</div>
        {typeof value === "string" ? (
          <div className="text-txt-black-500">
            {value} {note && `| ${note}`}
          </div>
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
