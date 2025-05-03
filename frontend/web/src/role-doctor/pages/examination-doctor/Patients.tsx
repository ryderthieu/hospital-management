import { useState } from "react"
import { SearchFilters } from "../../components/examination-doctor/SearchFilters"
import { PatientTable } from "../../components/examination-doctor/Patient-table"
import { Pagination } from "../../components/examination-doctor/Pagination"


const Patients = () => {
 
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
    {
      id: 10,
      name: "Nguyễn Thị Kim Ngân",
      code: "BN22521397",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 45,
      symptom: "Khó thở",
      status: "Hoàn thành",
    },
    {
      id: 11,
      name: "Phạm Minh Quân",
      code: "BN22521398",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 34,
      symptom: "Đau vai gáy",
      status: "Xét nghiệm",
    },
    {
      id: 12,
      name: "Lê Văn Hòa",
      code: "BN22521399",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 52,
      symptom: "Đau bụng",
      status: "Đang chờ",
    },
    {
      id: 13,
      name: "Trịnh Thị Thanh Mai",
      code: "BN22521400",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 26,
      symptom: "Viêm họng",
      status: "Hoàn thành",
    },
    {
      id: 14,
      name: "Đinh Phương Thảo",
      code: "BN22521401",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 30,
      symptom: "Đau khớp",
      status: "Xét nghiệm",
    },
    {
      id: 15,
      name: "Bùi Văn Hưng",
      code: "BN22521402",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 40,
      symptom: "Tê tay",
      status: "Đang chờ",
    },
    {
      id: 16,
      name: "Ngô Thị Hạnh",
      code: "BN22521403",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 33,
      symptom: "Đau lưng",
      status: "Đang chờ",
    },
    {
      id: 17,
      name: "Trần Quốc Dũng",
      code: "BN22521404",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 60,
      symptom: "Huyết áp thấp",
      status: "Đang chờ",
    },
    {
      id: 18,
      name: "Vũ Thị Bích Ngọc",
      code: "BN22521405",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 37,
      symptom: "Khó ngủ",
      status: "Hoàn thành",
    },
    {
      id: 19,
      name: "Lâm Tấn Tài",
      code: "BN22521406",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 25,
      symptom: "Đau tim",
      status: "Xét nghiệm",
    },
    {
      id: 20,
      name: "Nguyễn Thị Thu Trang",
      code: "BN22521407",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 29,
      symptom: "Suy nhược",
      status: "Đang chờ",
    },
    {
      id: 21,
      name: "Hoàng Văn Cường",
      code: "BN22521408",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 38,
      symptom: "Rối loạn tiêu hóa",
      status: "Hoàn thành",
    },
    {
      id: 22,
      name: "Đoàn Hữu Tâm",
      code: "BN22521409",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 42,
      symptom: "Sỏi thận",
      status: "Đang chờ",
    },
    {
      id: 23,
      name: "Trần Thị Ngọc Yến",
      code: "BN22521410",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 22,
      symptom: "Đau bụng kinh",
      status: "Xét nghiệm",
    },
    {
      id: 24,
      name: "Hồ Quang Hải",
      code: "BN22521411",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 31,
      symptom: "Nổi mẩn đỏ",
      status: "Hoàn thành",
    },
    {
      id: 25,
      name: "Nguyễn Trọng Phúc",
      code: "BN22521412",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 27,
      symptom: "Viêm khớp",
      status: "Đang chờ",
    },
    {
      id: 26,
      name: "Tô Minh Phương",
      code: "BN22521413",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 19,
      symptom: "Sốt cao",
      status: "Xét nghiệm",
    },
    {
      id: 27,
      name: "Trịnh Ngọc Hân",
      code: "BN22521414",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 24,
      symptom: "Căng thẳng",
      status: "Hoàn thành",
    },
    {
      id: 28,
      name: "Lý Khánh Duy",
      code: "BN22521415",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 35,
      symptom: "Mất ngủ",
      status: "Đang chờ",
    },
    {
      id: 29,
      name: "Nguyễn Thị Bảo Châu",
      code: "BN22521416",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 43,
      symptom: "Cảm cúm",
      status: "Đang chờ",
    }
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = patients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      {/* Main content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Danh sách bệnh nhân</h1>
            <p className="text-gray-500">Mặc định: Hiển thị tất cả bệnh nhân trong hôm nay</p>
          </div>

          {/* Search and filters */}
          <SearchFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Patient table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 flex flex-row gap-3 items-center border-b border-gray-200">
              <h2 className="font-semibold text-lg">Danh sách bệnh nhân</h2>
              <div className="bg-blue-100 text-blue-700 text-sm font-medium px-2 py-1 rounded-2xl">100 bệnh nhân</div>
            </div>

            {/* Table */}
            <PatientTable 
                patients={patients} 
                currentPage={currentPage}
                itemsPerPage={itemsPerPage} />

            {/* Pagination */}
            <Pagination  
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                handlePrev={handlePrev}
                handleNext={handleNext}
                handleItemsPerPageChange={handleItemsPerPageChange}
                setCurrentPage={setCurrentPage} /> 
          </div>
        </main>
      </div>
  )
}

export default Patients
