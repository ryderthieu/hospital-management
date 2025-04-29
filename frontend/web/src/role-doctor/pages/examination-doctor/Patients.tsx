import { useState } from "react"
import { SearchFilters } from "../../components/examination-doctor/SearchFilters"
import { PatientTable } from "../../components/examination-doctor/Patient-table"
import { Pagination } from "../../components/examination-doctor/Pagination"


const Patients = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  interface Patient {
    id: number
    name: string
    code: string
    appointment: string
    date: string
    gender: string
    age: number
    symptom: string
    status: string
  }

  const patients: Patient[] = [
    {
      id: 1,
      name: "Trần Nhật Trường",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Dị ứng",
      status: "Hoàn thành",
    },
    {
      id: 2,
      name: "Huỳnh Văn Thiệu",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Mắt mờ",
      status: "Hoàn thành",
    },
    {
      id: 3,
      name: "Trần Ngọc Ánh Thơ",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Trầm cảm",
      status: "Hoàn thành",
    },
    {
      id: 4,
      name: "Lê Thiện Nhi",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Thêm yếu",
      status: "Xét nghiệm",
    },
    {
      id: 5,
      name: "Trần Đỗ Phương Nhi",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Tăng huyết áp",
      status: "Đang chờ",
    },
    {
      id: 6,
      name: "Trịnh Thị Phương Quỳnh",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Tâm thần",
      status: "Đang chờ",
    },
    {
      id: 7,
      name: "Huỳnh Văn Tín",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 28,
      symptom: "Đau đầu",
      status: "Đang chờ",
    },
    {
      id: 8,
      name: "Võ Ngọc Tân",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 36,
      symptom: "Hoa mắt",
      status: "Đang chờ",
    },
    {
      id: 9,
      name: "Phạm Nhật Duy",
      code: "BN22521396",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 36,
      symptom: "Chóng mặt",
      status: "Đang chờ",
    },
  ]

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* Main content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Danh sách bệnh nhân</h1>
            <p className="text-gray-500">Hiển thị: Tất cả bệnh nhân trong hôm nay</p>
          </div>

          {/* Search and filters */}
          <SearchFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Patient table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="font-semibold text-lg">Danh sách bệnh nhân</h2>
              <div className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded">100 bệnh nhân</div>
            </div>

            {/* Table */}
            <PatientTable patients={patients} />

            {/* Pagination */}
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
          </div>
        </main>
      </div>
  )
}

export default Patients
