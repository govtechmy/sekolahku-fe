import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

/**
 * Reusable stat card component for displaying school statistics
 */
export const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <div className="border-t-0 border-[1px] outline-otl-gray-200 gap-0.5 mt-0">
      <div className="flex w-full max-w-xl px-8 md:px-12 lg:px-16 py-8 items-start gap-4 shrink-0">
        <div className="flex w-[42px] h-[42px] justify-center items-center gap-x-[10px] gap-y-[10px] shrink-0 bg-primary-50 rounded-full">
          <div className="text-txt-primary font-semibold">{icon}</div>
        </div>
        <div className="flex flex-col items-start gap-1 flex-1">
          <p className="text-txt-primary text-center text-sm max-md:text-xs font-semibold leading-tight tracking-widest uppercase">
            {label}
          </p>
          <div className="self-stretch text-txt-black-900 text-heading-lg max-md:text-heading-sm font-semibold">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
};
