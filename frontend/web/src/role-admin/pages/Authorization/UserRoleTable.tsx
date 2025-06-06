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
import { Users, Shield, Settings } from 'lucide-react';

interface User {
  id: string;
  user: {
    image: string;
    name: string;
    email: string;
  };
  role: string;
  department: string;
  status: string;
  lastLogin: string;
  createdAt: string;
}

const tableData: User[] = [
  {
    id: "U001",
    user: {
      image: "/images/user/user-17.jpg",
      name: "Trần Nhật Trường",
      email: "truong@wecare.vn",
    },
    role: "Admin",
    department: "Quản trị hệ thống",
    status: "Hoạt động",
    lastLogin: "30/04/2025 14:30",
    createdAt: "15/01/2025",
  },
  {
    id: "U002",
    user: {
      image: "/images/user/user-18.jpg",
      name: "Nguyễn Thị Mai",
      email: "mai@wecare.vn",
    },
    role: "Bác sĩ",
    department: "Khoa Tim mạch",
    status: "Hoạt động",
    lastLogin: "30/04/2025 09:15",
    createdAt: "20/01/2025",
  },
  {
    id: "U003",
    user: {
      image: "/images/user/user-19.jpg",
      name: "Lê Văn Hùng",
      email: "hung@wecare.vn",
    },
    role: "Y tá",
    department: "Khoa Nội",
    status: "Hoạt động",
    lastLogin: "29/04/2025 16:45",
    createdAt: "25/01/2025",
  },
  {
    id: "U004",
    user: {
      image: "/images/user/user-20.jpg",
      name: "Phạm Thị Lan",
      email: "lan@wecare.vn",
    },
    role: "Lễ tân",
    department: "Tiếp nhận",
    status: "Tạm khóa",
    lastLogin: "28/04/2025 11:20",
    createdAt: "10/02/2025",
  },
  {
    id: "U005",
    user: {
      image: "/images/user/user-21.jpg",
      name: "Hoàng Minh Tuấn",
      email: "tuan@wecare.vn",
    },
    role: "Dược sĩ",
    department: "Khoa Dược",
    status: "Hoạt động",
    lastLogin: "30/04/2025 13:10",
    createdAt: "05/02/2025",
  },
  {
    id: "U006",
    user: {
      image: "/images/user/user-22.jpg",
      name: "Đỗ Thị Hương",
      email: "huong@wecare.vn",
    },
    role: "Kế toán",
    department: "Tài chính",
    status: "Hoạt động",
    lastLogin: "30/04/2025 08:30",
    createdAt: "12/02/2025",
  },
];

const PAGE_SIZE = 10;

export default function UserRoleTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = tableData.filter(user =>
    user.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "error";
      case "Bác sĩ":
        return "success";
      case "Y tá":
        return "warning";
      case "Dược sĩ":
        return "info";
      default:
        return "light";
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hoạt động":
        return "success";
      case "Tạm khóa":
        return "error";
      case "Chờ xác thực":
        return "warning";
      default:
        return "light";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex justify-start items-center pt-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">Danh sách người dùng</h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">
            {totalItems} người dùng
          </span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {/* Search Bar */}
          <SearchInput 
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Dropdown for Role Filter */}
          <div className="relative">
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="doctor">Bác sĩ</option>
              <option value="nurse">Y tá</option>
              <option value="pharmacist">Dược sĩ</option>
              <option value="receptionist">Lễ tân</option>
              <option value="accountant">Kế toán</option>
            </select>
          </div>

          {/* Dropdown for Department Filter */}
          <div className="relative">
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="">Tất cả khoa</option>
              <option value="admin">Quản trị hệ thống</option>
              <option value="cardiology">Khoa Tim mạch</option>
              <option value="internal">Khoa Nội</option>
              <option value="pharmacy">Khoa Dược</option>
              <option value="reception">Tiếp nhận</option>
              <option value="finance">Tài chính</option>
            </select>
          </div>

          {/* Dropdown for Status Filter */}
          <div className="relative">
            <select className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Tạm khóa</option>
              <option value="pending">Chờ xác thực</option>
            </select>
          </div>

          {/* Filter Button */}
          <button className="h-11 w-full rounded-lg bg-base-700 text-white text-sm font-medium shadow-theme-xs hover:bg-base-600 focus:outline-hidden focus:ring-3 focus:ring-base-600/50 flex items-center justify-center gap-2">
            <Settings size={16} />
            Lọc
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Người dùng
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Vai trò
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Khoa/Phòng ban
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Trạng thái
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Đăng nhập cuối
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Ngày tạo
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
              >
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {paginatedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-[40px] w-[40px] overflow-hidden rounded-full">
                      <img
                        src={user.user.image}
                        className="h-[40px] w-[40px]"
                        alt={user.user.name}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {user.user.name}
                      </p>
                      <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {user.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getRoleColor(user.role)}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.department}
                </TableCell>
                <TableCell className="py-3">
                  <Badge
                    size="sm"
                    color={getStatusColor(user.status)}
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {user.createdAt}
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                      title="Chỉnh sửa quyền"
                    >
                      <Shield size={14} />
                      Phân quyền
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-900/30 dark:text-gray-400 dark:hover:bg-gray-900/50"
                      title="Chỉnh sửa"
                    >
                      <Users size={14} />
                      Sửa
                    </button>
                  </div>
                </TableCell>
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
