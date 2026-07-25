import { clx } from "@govtechmy/myds-react/utils";

export function NegeriMarkerIcon(label: string, className?: string) {
  return (
    <div
      className={clx(
        "rounded-full size-10 text-xs flex items-center justify-center font-semibold bg-primary-800 text-txt-white",
        className,
      )}
    >
      {label}
    </div>
  );
}
