import { clx } from "@govtechmy/myds-react/utils";
import SekolahIcon from "./SekolahIcon";

export function SekolahMarkerIcon(
  className?: string,
  isSelected: boolean = false,
) {
  return (
    <div
      tabIndex={0}
      className={clx(
        "rounded-full size-9 flex items-center justify-center font-semibold text-txt-white",
        isSelected
          ? "bg-bg-danger-500 ring-[10px] ring-fr-danger"
          : "bg-primary-600",
        className,
      )}
    >
      <SekolahIcon />
    </div>
  );
}
