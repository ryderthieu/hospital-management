import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/common/Pagination";

interface Department {
  id: string;
  name: string;
  head: string;
  team: {
    images: string[];
  };
  location: string;
  staffCount: number;
  description: string;
  foundedYear: number;
}

// Sử dụng lại dữ liệu từ DepartmentTable
const departmentData: Department[] = [
  {
    id: "KH2025-001",
    name: "Khám bệnh",
    head: "TS.BS Nguyễn Văn An",
    team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
    location: "Tầng 1, Tòa nhà A",
    staffCount: 25,
    description: "Khoa khám bệnh tổng quát và phân loại bệnh nhân",
    foundedYear: 2010,
  },
  {
    id: "KH2025-002",
    name: "Chẩn đoán hình ảnh",
    head: "PGS.TS Trần Thị Bình",
    team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
    location: "Tầng 2, Tòa nhà B",
    staffCount: 18,
    description: "Khoa thực hiện các dịch vụ chẩn đoán hình ảnh và siêu âm",
    foundedYear: 2010,
  },
  {
    id: "KH2025-003",
    name: "Xét nghiệm",
    head: "TS.BS Lê Minh Công",
    team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
    location: "Tầng 3, Tòa nhà B",
    staffCount: 22,
    description: "Thực hiện các xét nghiệm mẫu bệnh phẩm",
    foundedYear: 2010,
  },
  {
    id: "KH2025-004",
    name: "Răng Hàm Mặt",
    head: "BS.CKI Phạm Quang Dương",
    team: {
        images: [
          "/images/user/user-22.jpg",
          "/images/user/user-23.jpg",
          "/images/user/user-24.jpg",
        ],
      },
    location: "Tầng 1, Tòa nhà C",
    staffCount: 12,
    description: "Chuyên khoa về các bệnh lý và điều trị răng hàm mặt",
    foundedYear: 2012,
  },
  {
    id: "KH2025-005",
    name: "Dinh dưỡng",
    head: "TS.BS Hoàng Thị Lan",
    location: "Tầng 2, Tòa nhà A",
     team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    staffCount: 8,
    description: "Tư vấn dinh dưỡng và chế độ ăn cho bệnh nhân",
    foundedYear: 2015,
  },
  {
    id: "KH2025-006",
    name: "Phục hồi chức năng",
    head: "PGS.TS Vũ Thanh Hà",
    location: "Tầng 4, Tòa nhà C",
     team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    staffCount: 15,
    description: "Khoa chuyên về phục hồi chức năng và vật lý trị liệu",
    foundedYear: 2013,
  },
  {
    id: "KH2025-007",
    name: "Sản",
    head: "TS.BS Nguyễn Thu Trang",
    location: "Tầng 3, Tòa nhà A",
     team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    staffCount: 20,
    description: "Chuyên khoa sản, chăm sóc mẹ và bé",
    foundedYear: 2010,
  },
  {
    id: "KH2025-008",
    name: "Tim mạch",
    head: "GS.TS Trần Văn Minh",
     team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    location: "Tầng 5, Tòa nhà B",
    staffCount: 16,
    description: "Khoa chuyên về các bệnh lý tim mạch",
    foundedYear: 2010,
  },
  {
    id: "KH2025-009",
    name: "Tiêu hóa",
    head: "TS.BS Lương Thị Hạnh",
     team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    location: "Tầng 4, Tòa nhà A",
    staffCount: 14,
    description: "Chuyên về các bệnh lý đường tiêu hóa",
    foundedYear: 2011,
  },
];

const PAGE_SIZE = 6; // Hiển thị 6 card mỗi trang

export default function DepartmentCards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc danh sách khoa theo từ khóa tìm kiếm
  const filteredDepartments = departmentData.filter(department => 
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredDepartments.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedData = filteredDepartments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] px-3 py-4 sm:px-6">
        {/* Search bar và số lượng */}
        <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách khoa</h3>
            <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">{totalItems} khoa</span>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Tìm kiếm khoa..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.map((department) => (
            <div 
              key={department.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    {department.name}
                  </h3>
                  <span className="text-xs font-medium px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded dark:bg-gray-700 dark:text-gray-300">
                    {department.id}
                  </span>
                </div>

                {/* Team photos */}
                <div className="flex -space-x-2 mb-4">
                  {department.team.images.map((image, index) => (
                    <img
                      key={index}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                      src={image}
                      alt="Team member"
                    />
                  ))}
                  {department.staffCount > department.team.images.length && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800">
                      <span className="text-xs font-medium">+{department.staffCount - department.team.images.length}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-start mb-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {department.head}
                  </span>
                </div>
                
                <div className="flex items-start mb-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {department.location}
                  </span>
                </div>
                
                <div className="flex items-center mb-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {department.staffCount} nhân viên
                  </span>
                </div>
                
                <div className="flex items-start mb-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Thành lập năm {department.foundedYear}
                  </span>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {department.description}
                  </p>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleViewDetail(department)}
                    className="text-white bg-base-600 hover:bg-base-700 outline-nonefont-medium rounded-lg text-sm px-4 py-2 focus:bg-base-800"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty state */}
        {filteredDepartments.length === 0 && (
          <div className="text-center py-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M5.8 21H18.2a2 2 0 002-2V5a2 2 0 00-2-2H5.8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Không tìm thấy khoa
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Không có khoa nào phù hợp với từ khóa tìm kiếm
            </p>
          </div>
        )}
        
        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
              
    </>
  );
}