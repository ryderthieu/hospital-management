import PageMeta from "../../components/common/PageMeta";
import AddButton from "../../components/ui/button/AddButton";
import MedicineTable from "../../components/sections/medicines/MedicineTable";


export default function Inpatient() {
  return (
    <div>
      <PageMeta
        title="Medicines | Admin Dashboard"
        description="This is Medicines Dashboard"
      />
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Bệnh nhân nội trú
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="col-span-12 xl:col-span-7">
            <MedicineTable/>
        </div>
        <div className="fixed right-5 bottom-5">
          <AddButton />
        </div>
      </div>
    </div>
  );
}
