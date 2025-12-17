import { clx } from "@govtechmy/myds-react/utils";
import SekolahIcon from "./SekolahIcon";

export function SekolahMarkerIcon(className?:string){
  return (
    <div
    tabIndex={0}
      className={clx(
        "rounded-full size-9 flex items-center justify-center font-semibold bg-primary-600 text-txt-white focus:ring-4 focus:ring-primary-50",
        className
      )}
    >
      <SekolahIcon/>
    </div>
  );
}
