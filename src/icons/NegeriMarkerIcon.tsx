import { clx } from "@govtechmy/myds-react/utils";

export function NegeriMarkerIcon(label:string, className?:string){
  return (
    <div
      className={clx("rounded-full w-8 h-8 flex items-center justify-center font-semibold bg-primary-800",className)}
    >
      {label}
    </div>
  );
}
