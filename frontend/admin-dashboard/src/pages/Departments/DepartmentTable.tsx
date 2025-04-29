import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

import Pagination from "../../components/common/Pagination";
import { useState } from "react";
import SearchInput from "../../components/common/SearchInput";
  
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

const tableData: Department[] = [
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
  
const PAGE_SIZE = 10;

export default function DepartmentTable(){
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
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách khoa</h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">{totalItems} khoa</span>
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
                Mã khoa
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Tên khoa
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Trưởng khoa
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Vị trí
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Số nhân viên
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Năm thành lập
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
            {paginatedData.map((department) => (
              <TableRow key={department.id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {department.id}
                </TableCell>
                <TableCell className="py-3">
                    <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {department.name}
                    </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {department.head}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {department.location}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {department.staffCount} người
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {department.foundedYear}
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