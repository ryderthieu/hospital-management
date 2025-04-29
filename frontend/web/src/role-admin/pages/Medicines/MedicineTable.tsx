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
  
interface Medicine {
id: string; 
name: string;
price: string; 
quantity: number; 
image: string; 
status: "Có sẵn" | "Hết"
unit: "Hộp" | "Gói" | "Chai" | "Viên" | "Lọ" | "Ống" | "mg" | "g" | "kg" | "ml" | "l";
manufacturer: string;
is_insurance_covered: boolean;
side_effects: string;
expiration_date: Date
import_date: Date
}


const tableData: Medicine[] = [
  {
    id: "T2025-9084",
    name: "Paracetamol",
    price: "2000",
    quantity: 100,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược A",
    is_insurance_covered: true,
    side_effects: "Buồn nôn, chóng mặt",
    expiration_date: new Date("2025-12-31"),
    import_date: new Date("2025-04-01"),
  },
  {
    id: "T2025-9084",
    name: "Amoxicillin",
    price: "1500",
    quantity: 50,
    image: "/images/medicines/amoxicillin.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược B",
    is_insurance_covered: false,
    side_effects: "Dị ứng, tiêu chảy",
    expiration_date: new Date("2025-10-15"),
    import_date: new Date("2025-03-20"),
  },
  {
    id: "T2025-9084",
    name: "Vitamin C",
    price: "5000",
    quantity: 200,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược C",
    is_insurance_covered: true,
    side_effects: "Không có",
    expiration_date: new Date("2026-01-10"),
    import_date: new Date("2025-04-10"),
  },
  {
    id: "T2025-9084",
    name: "Dung dịch muối sinh lý",
    price: "10000",
    quantity: 30,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Chai",
    manufacturer: "Công ty Dược D",
    is_insurance_covered: true,
    side_effects: "Không có",
    expiration_date: new Date("2025-09-30"),
    import_date: new Date("2025-03-28"),
  },
  {
    id: "T2025-9084",
    name: "Ibuprofen",
    price: "3000",
    quantity: 0,
    image: "/images/user/owner.jpg",
    status: "Hết",
    unit: "Hộp",
    manufacturer: "Công ty Dược E",
    is_insurance_covered: false,
    side_effects: "Đau dạ dày, buồn nôn",
    expiration_date: new Date("2025-11-20"),
    import_date: new Date("2025-04-05"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc ho Prospan",
    price: "50000",
    quantity: 20,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Chai",
    manufacturer: "Công ty Dược F",
    is_insurance_covered: true,
    side_effects: "Không có",
    expiration_date: new Date("2026-02-15"),
    import_date: new Date("2025-04-12"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc nhỏ mắt V.Rohto",
    price: "25000",
    quantity: 40,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Chai",
    manufacturer: "Công ty Dược G",
    is_insurance_covered: false,
    side_effects: "Kích ứng nhẹ",
    expiration_date: new Date("2025-08-25"),
    import_date: new Date("2025-03-30"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc tiêm Vitamin B12",
    price: "15000",
    quantity: 100,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Ống",
    manufacturer: "Công ty Dược H",
    is_insurance_covered: true,
    side_effects: "Đỏ da tại chỗ tiêm",
    expiration_date: new Date("2025-12-01"),
    import_date: new Date("2025-04-08"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc kháng viêm Diclofenac",
    price: "5000",
    quantity: 60,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược I",
    is_insurance_covered: false,
    side_effects: "Đau dạ dày, buồn nôn",
    expiration_date: new Date("2025-10-05"),
    import_date: new Date("2025-03-25"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc bổ sung sắt Ferrovit",
    price: "30000",
    quantity: 90,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược J",
    is_insurance_covered: true,
    side_effects: "Táo bón, buồn nôn",
    expiration_date: new Date("2026-03-20"),
    import_date: new Date("2025-04-15"),
  },
  {
    id: "T2025-9084",
    name: "Thuốc bổ sung sắt Ferrovit",
    price: "30000",
    quantity: 90,
    image: "/images/user/owner.jpg",
    status: "Có sẵn",
    unit: "Hộp",
    manufacturer: "Công ty Dược J",
    is_insurance_covered: true,
    side_effects: "Táo bón, buồn nôn",
    expiration_date: new Date("2026-03-20"),
    import_date: new Date("2025-04-15"),
  },
];
  
const PAGE_SIZE = 10;

export default function MedicineTable(){
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
        <div className="flex justify-start items-center  pt-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách thuốc</h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">5000 loại thuốc</span>
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
                Mã thuốc
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Tên thuốc
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Đơn giá 
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Ngày nhập
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Ngày hết hạn
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
                Tồn kho
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Đơn vị
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
            {paginatedData.map((medicine) => (
              <TableRow key={medicine.id} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.id}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                      <img
                        src={medicine.image}
                        className="h-[50px] w-[50px]"
                        alt={medicine.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {medicine.name} {medicine.is_insurance_covered && (<span className="bg-purple-500/30 ml-2 text-xs px-2 rounded-3xl font-bold text-purple-500">BHYT</span>)}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {medicine.manufacturer}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.import_date.toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.expiration_date.toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      medicine.status === "Có sẵn"
                        ? "success"
                        : "error"
                    }
                  >
                    {medicine.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.quantity}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {medicine.unit}
                </TableCell>
                {/* <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  Xem chi tiết
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