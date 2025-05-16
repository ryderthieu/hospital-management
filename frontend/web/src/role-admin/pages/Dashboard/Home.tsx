import UpMetric from "../../components/statistics/UpMetric";
import DropMetric from "../../components/statistics/DropMetric";
import StatisticsChart from "../../components/statistics/StatisticsChart";
import RecentTransactions from "../../components/statistics/RecentTransaction";
import PageMeta from "../../components/common/PageMeta";
import { BoxCubeIcon, CalenderIcon, GroupIcon, TaskIcon } from "../../icons";
import RecentPatients from "../../components/statistics/RecentPatients";
import TodayAppointments from "../../components/statistics/TodayAppointment";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Trang chủ | Bệnh viện Đa khoa Wecare"
        description="Trang chủ website admin bệnh viện"
      />
      <div className="">
        <div className="col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-4">
          <UpMetric title="Bệnh nhân" value={2252} percentChange={11.64} icon={GroupIcon} bgColor="bg-green-200/30" iconColor="text-green-900"/>
          <DropMetric title="Đặt trước" value={836} percentChange={11.64} icon={CalenderIcon} bgColor="bg-yellow-300/30" iconColor="text-yellow-500" />
          <UpMetric title="Hóa đơn" value={5243} percentChange={11.64} icon={BoxCubeIcon} bgColor="bg-blue-200/30" iconColor="text-blue-800"/>
          <DropMetric title="Doanh thu" value={245} percentChange={11.64} icon={TaskIcon} bgColor="bg-rose-200/50" iconColor="text-rose-900" />
        </div>


        {/* <div className="col-span-12 xl:col-span-5">
          <BarChart />

        </div> */}

        <div className="col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-4">
          <div className="col-span-3">
            <StatisticsChart />
          </div>
          <div className="col-span-1">
            <RecentPatients/>
          </div>
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        <div className="col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <div className="col-span-3">
            <RecentTransactions />
          </div>
          <div>
            <TodayAppointments />
          </div>
          
        </div>
      </div>
    </>
  );
}
