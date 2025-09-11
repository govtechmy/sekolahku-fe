type AnalyticsItem = {
  icon: React.ReactElement;
  title: string;
  statistic: string;
};

type SectionItemAnalyticsProps = {
  dataItemAnalytics: AnalyticsItem[];
};

import React from "react";

export default function SectionItemAnalytics({
  dataItemAnalytics,
}: SectionItemAnalyticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 border border-otl-gray-200 rounded-lg overflow-hidden">
      {dataItemAnalytics.map((item: AnalyticsItem, index: number) => (
        <div
          key={index}
          className={`
        flex items-center gap-6 px-6 py-8
        border-otl-gray-200
        border-b
        last:border-b-0

        md:border-b
        md:[&:nth-last-child(-n+2)]:border-b-0
        md:[&:nth-last-child(2n)]:border-r

        xl:[&:nth-last-child(-n+3)]:border-b-0
        xl:[&:nth-child(3n+1)]:border-r
        xl:[&:nth-child(3n+2)]:border-r
        xl:[&:nth-child(6n+3)]:!border-r-0
      `}
        >
          <div className="size-16 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
            {React.cloneElement(item.icon as any, { className: "w-8 h-8" })}
          </div>
          <div>
            <div className="text-txt-primary font-body text-body-xl font-semibold">
              {item.statistic}
            </div>
            <div className="text-txt-black-700 font-body text-body-md font-semibold">
              {item.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
