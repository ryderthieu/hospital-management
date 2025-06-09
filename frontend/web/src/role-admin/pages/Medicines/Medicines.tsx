import PageMeta from "../../components/common/PageMeta"
import AddButton from "../../components/ui/button/AddButton"
import MedicineTable from "../../components/sections/medicines/MedicineTable"
import { Link } from "react-router-dom"

export default function Medicine() {
  return (
    <div>
      <PageMeta title="Medicines | Admin Dashboard" description="This is Medicines Dashboard" />
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-6">Quản lý kho thuốc</h2>
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="col-span-12 xl:col-span-7">
          <MedicineTable />
        </div>
        <div className="fixed right-5 bottom-5">
          <Link to="/admin/medicines/add">
            <AddButton />
          </Link>
        </div>
      </div>
    </div>
  )
}
