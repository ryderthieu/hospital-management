import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import Pagination from "../../components/common/Pagination";
import { useState } from "react";
import SearchInput from "../../components/common/SearchInput";
  
interface HealthService {
  id: string;
  name: string;
  price: string;
  category: string;
  duration: string;
  status: "Đang hoạt động" | "Tạm ngưng";
  insurance_covered: boolean;
  department: string;
}

const tableData: HealthService[] = [
  {
    id: "DV2025-001",
    name: "Khám tổng quát",
    price: "200000",
    category: "Khám bệnh",
    duration: "30 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Khám bệnh",
  },
  {
    id: "DV2025-002",
    name: "Siêu âm bụng tổng quát",
    price: "250000",
    category: "Chẩn đoán hình ảnh",
    duration: "15 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Chẩn đoán hình ảnh",
  },
  {
    id: "DV2025-003",
    name: "Xét nghiệm máu cơ bản",
    price: "150000",
    category: "Xét nghiệm",
    duration: "5 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Xét nghiệm",
  },
  {
    id: "DV2025-004",
    name: "Chụp X-quang ngực",
    price: "180000",
    category: "Chẩn đoán hình ảnh",
    duration: "10 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Chẩn đoán hình ảnh",
  },
  {
    id: "DV2025-005",
    name: "Khám nha khoa",
    price: "120000",
    category: "Nha khoa",
    duration: "20 phút",
    status: "Tạm ngưng",
    insurance_covered: false,
    department: "Răng Hàm Mặt",
  },
  {
    id: "DV2025-006",
    name: "Tư vấn dinh dưỡng",
    price: "300000",
    category: "Tư vấn",
    duration: "45 phút",
    status: "Đang hoạt động",
    insurance_covered: false,
    department: "Dinh dưỡng",
  },
  {
    id: "DV2025-007",
    name: "Chụp CT Scanner",
    price: "1500000",
    category: "Chẩn đoán hình ảnh",
    duration: "30 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Chẩn đoán hình ảnh",
  },
  {
    id: "DV2025-008",
    name: "Vật lý trị liệu",
    price: "200000",
    category: "Phục hồi chức năng",
    duration: "60 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Phục hồi chức năng",
  },
  {
    id: "DV2025-009",
    name: "Khám sản phụ khoa",
    price: "250000",
    category: "Sản khoa",
    duration: "30 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Sản",
  },
  {
    id: "DV2025-010",
    name: "Khám tim mạch",
    price: "280000",
    category: "Khám chuyên khoa",
    duration: "30 phút",
    status: "Đang hoạt động",
    insurance_covered: true,
    department: "Tim mạch",
  },
  {
    id: "DV2025-011",
    name: "Nội soi dạ dày",
    price: "500000",
    category: "Nội soi",
    duration: "20 phút",
    status: "Tạm ngưng",
    insurance_covered: true,
    department: "Tiêu hóa",
  },
];
  
const PAGE_SIZE = 10;

export default function ServiceTable(){
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedData = tableData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex justify-start items-center pt-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách dịch vụ y tế</h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">120 dịch vụ</span>
        </div>

        <div className="flex items-center gap-3">
          <SearchInput placeholder="Tìm kiếm..." />
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="stroke-current fill-white dark:fill-gray-800"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.29004 5.90393H17.7067"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17.7075 14.0961H2.29085"
                stroke=""
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
              <path
                d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z"
                fill=""
                stroke=""
                strokeWidth="1.5"
              />
            </svg>
            Lọc
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Mã dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Tên dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Phí dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Khoa
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Thời gian
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Tình trạng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Loại dịch vụ
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Hành động
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedData.map((service) => (
              <TableRow key={service.id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {service.id}
                </TableCell>
                <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {service.name} {service.insurance_covered && (<span className="bg-purple-500/30 ml-2 text-xs px-2 rounded-3xl font-bold text-purple-500">BHYT</span>)}
                    </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {parseInt(service.price).toLocaleString('vi-VN')} ₫
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {service.department}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {service.duration}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      service.status === "Đang hoạt động"
                        ? "success"
                        : "error"
                    }
                  >
                    {service.status}
                  </Badge>
                </TableCell>
                {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {service.insurance_covered ? (
                    <span className="text-green-600 font-medium">Có</span>
                  ) : (
                    <span className="text-red-500">Không</span>
                  )}
                </TableCell> */}
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {service.category}
                </TableCell>
                {/* <TableCell className="py-3">
                  <button className="text-sky-500 hover:text-sky-700 font-medium">
                    Xem chi tiết
                  </button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={PAGE_SIZE}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
          />
        </div>    
      </div>
    </div>
  );
}