import { clx } from "@govtechmy/myds-react/utils";

export function ParlimenMarkerIcon(label: string, className?: string) {
  return (
    <div
      className={clx(
        "rounded-full size-9 text-xs flex items-center justify-center font-semibold bg-primary-600 text-txt-white",
        className,
      )}
    >
      {label}
    </div>
  );
}
