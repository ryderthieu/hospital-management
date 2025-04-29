import Metric from "../../components/statistics/Metric";
import DropMetric from "../../components/statistics/DropMetric";
import PageMeta from "../../components/common/PageMeta";
import { BoxIcon, CalenderIcon, GroupIcon } from "../../icons";
import PatientTable from "./PatientTable";
import AddButton from "../../components/ui/button/AddButton";

export default function Patient() {
  return (
    <>
      <PageMeta
        title="Patient | Admin Dashboard"
        description="This is Patient Dashboard"
      />
      <div className="">
        <div className="col-span-12 xl:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-5">
          <Metric title="Bệnh nhân trong ngày" value={100} icon={GroupIcon} time="ngày" bgColor="bg-green-200/30" iconColor="text-green-900"/>
          <Metric title="Bệnh nhân trong tháng" value={57} icon={CalenderIcon} time="tháng" bgColor="bg-yellow-300/30" iconColor="text-yellow-500" />
          <Metric title="Bệnh nhân trong năm" value={78} icon={BoxIcon} time="năm" bgColor="bg-blue-200/30" iconColor="text-blue-800"/>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <PatientTable />
        </div>

        <div className="fixed right-5 bottom-5">
          <AddButton />
        </div>
      </div>
    </>
  );
}
