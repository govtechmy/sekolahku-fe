import type { AnalyticsModel } from "../../models/response";
import { PutrajayaIcon, BookIcon, UserGroupIcon } from "@govtechmy/myds-react/icon";
import DoughnutChart from "../DoughnutChart";
interface SectionItemAnalyticsProps {
  analytics: AnalyticsModel;
}

export default function SectionItemAnalytics({
  analytics,
}: SectionItemAnalyticsProps) {
  return (
    <>
      <div className="border border-otl-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          <div className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b lg:border-r lg:border-b-0">
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <PutrajayaIcon className="w-8 h-8"/>
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahSekolah.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Jumlah Sekolah di Malaysia
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b lg:border-r lg:border-b-0">
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <BookIcon className="w-8 h-8"/>
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahGuru.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Pelajar Guru di Malaysia
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 px-6 py-8 border-otl-gray-200 border-b last:border-b-0 lg:border-b-0 lg:border-r-0">
            <div className="p-4 rounded-full bg-bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
              <UserGroupIcon className="w-8 h-8"/>
            </div>
            <div>
              <div className="text-txt-primary font-body text-3xl font-semibold">
                {analytics?.jumlahPelajar.toLocaleString()}
              </div>
              <div className="text-txt-black-700 font-body text-body-md font-semibold">
                Jumlah Pelajar di Malaysia
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-6 border-t border-otl-gray-200">
            <DoughnutChart
              title="Sekolah Mengikut Peringkat"
              data={analytics?.data.jenisLabel}
            />
          </div>
          <div className="p-6 border-t border-otl-gray-200 lg:border-l">
            <DoughnutChart
              title="Jenis Bantuan"
              data={analytics?.data.bantuan}
            />
          </div>
        </div>
      </div>
    </>
  );
}
