import PageMeta from "../../components/common/PageMeta";
import AddButton from "../../components/ui/button/AddButton";
import ServiceTable from "./ServiceTable";


export default function Service() {
  return (
    <div>
      <PageMeta
        title="Services | Admin Dashboard"
        description="This is Services Dashboard"
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Quản lý dịch vụ
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="col-span-12 xl:col-span-7">
          <ServiceTable />
        </div>
        <div className="fixed right-5 bottom-5">
          <AddButton />
        </div>
      </div>
    </div>
  );
}
