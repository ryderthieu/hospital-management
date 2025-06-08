import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentService } from "../../../services/departmentService";
import { Department, transformDepartmentData } from "../../../types/department";
import Pagination from "../../components/common/Pagination";

export default function DepartmentCards() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const apiDepartments = await departmentService.getAllDepartments();
        const transformedDepartments = apiDepartments.map((dept, index) => transformDepartmentData(dept, index));
        setDepartments(transformedDepartments);
        setError(null);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError("Không thể tải danh sách khoa. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);
  // Function to handle navigation to department detail page
  const handleViewDetail = (department: Department) => {
    navigate(`/admin/departments/${department.id}`);
  };

  // Lọc danh sách khoa theo từ khóa tìm kiếm
  const filteredDepartments = departments.filter(department => 
    (department.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (department.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const PAGE_SIZE = 6; // Hiển thị 6 card mỗi trang
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

        {/* Loading state */}
        {loading && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-base-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Đang tải danh sách khoa...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-red-400 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-red-500 dark:text-red-400 mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Department Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((department, index) => (
            <div 
              key={`${department.id}-${index}`} 
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
                  {department.team.images.length > 0 ? (
                    department.team.images.slice(0, 4).map((image, index) => (
                      <img
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                        src={image}
                        alt={`Nhân viên ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = "/images/user/default-avatar.jpg";
                        }}
                      />
                    ))
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">?</span>
                    </div>
                  )}
                  
                  {department.staffCount > Math.max(department.team.images.length, 1) && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 border-2 border-white dark:border-gray-800">
                      <span className="text-xs font-medium text-white">
                        +{department.staffCount - Math.max(department.team.images.length, 1)}
                      </span>
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
            </div>            ))}
          </div>
        )}
        
        {/* Empty state */}
        {!loading && !error && filteredDepartments.length === 0 && (
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
        {!loading && !error && filteredDepartments.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
              
    </>
  );
}