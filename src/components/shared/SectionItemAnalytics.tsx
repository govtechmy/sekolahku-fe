import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analytics.svc";
import type { AnalyticsModel } from "../../models/response";
import { GovtOfficeIcon, BookIcon, UserGroupIcon } from "@govtechmy/myds-react/icon";
import DoughnutChart from "../DoughnutChart";
import type { ReactElement } from "react";

type AnalyticsItem = {
  icon: ReactElement;
  title: string;
  statistic: string;
};

export default function SectionItemAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getAnalytics();
        
        setAnalytics(data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return <div className="p-6 text-center">Loading analytics...</div>;
  }

  const dataItemAnalytics: AnalyticsItem[] = [
    {
      icon: <GovtOfficeIcon />,
      statistic: analytics.jumlahSekolah.toLocaleString(),
      title: "Jumlah Sekolah di Malaysia",
    },
    {
      icon: <BookIcon />,
      statistic: analytics.jumlahGuru.toLocaleString(),
      title: "Pelajar Guru di Malaysia",
    },
    {
      icon: <UserGroupIcon />,
      statistic: analytics.jumlahPelajar.toLocaleString(),
      title: "Jumlah Pelajar di Malaysia",
    },
  ];

  return (
    <>
      <div className="border border-otl-gray-200 rounded-lg overflow-hidden">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {dataItemAnalytics.map((item: AnalyticsItem, index: number) => (
            <div
              key={index}
              className={`
                flex items-center gap-6 px-6 py-8
                border-otl-gray-200
                border-b
                last:border-b-0
                
                md:border-b
                md:last:border-b-0
                md:odd:border-r
                md:last:odd:border-r-0
                
                lg:border-b
                lg:border-r
                lg:last:border-r-0
              `}
            >
              <div className="size-16 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                {item.icon}
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 border-t border-otl-gray-200">
            <DoughnutChart 
              title="Sekolah Mengikut Peringkat"
              data={analytics.data.jenisLabel}
            />
          </div>
          <div className="p-6 border-t border-otl-gray-200 lg:border-l">
            <DoughnutChart 
              title="Jenis Bantuan"
              data={analytics.data.bantuan}
            />
          </div>
        </div>
      </div>

    </>
  );
}
