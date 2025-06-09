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
import { Shield, Edit, Trash2 } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  id: string;
  name: string;
  category: string;
}

const permissionsData: Permission[] = [
  { id: "dashboard_view", name: "Xem dashboard", category: "Dashboard" },
  { id: "patient_view", name: "Xem bệnh nhân", category: "Bệnh nhân" },
  { id: "patient_create", name: "Tạo bệnh nhân", category: "Bệnh nhân" },
  { id: "patient_edit", name: "Sửa bệnh nhân", category: "Bệnh nhân" },
  { id: "patient_delete", name: "Xóa bệnh nhân", category: "Bệnh nhân" },
  { id: "doctor_view", name: "Xem bác sĩ", category: "Bác sĩ" },
  { id: "doctor_create", name: "Tạo bác sĩ", category: "Bác sĩ" },
  { id: "doctor_edit", name: "Sửa bác sĩ", category: "Bác sĩ" },
  { id: "appointment_view", name: "Xem lịch hẹn", category: "Lịch hẹn" },
  { id: "appointment_create", name: "Tạo lịch hẹn", category: "Lịch hẹn" },
  { id: "medicine_view", name: "Xem thuốc", category: "Kho thuốc" },
  { id: "medicine_manage", name: "Quản lý thuốc", category: "Kho thuốc" },
  { id: "finance_view", name: "Xem tài chính", category: "Tài chính" },
  { id: "finance_manage", name: "Quản lý tài chính", category: "Tài chính" },
  { id: "user_manage", name: "Quản lý người dùng", category: "Hệ thống" },
  { id: "role_manage", name: "Quản lý vai trò", category: "Hệ thống" },
];

const rolesData: Role[] = [
  {
    id: "R001",
    name: "Super Admin",
    description: "Quyền cao nhất trong hệ thống, có thể thực hiện mọi thao tác",
    permissions: permissionsData.map((p) => p.id),
    userCount: 1,
    color: "error",
    createdAt: "15/01/2025",
    updatedAt: "30/04/2025",
  },
  {
    id: "R002",
    name: "Quản lý",
    description: "Quản lý các hoạt động chính của bệnh viện",
    permissions: [
      "dashboard_view",
      "patient_view",
      "patient_create",
      "patient_edit",
      "doctor_view",
      "appointment_view",
      "appointment_create",
      "finance_view",
    ],
    userCount: 3,
    color: "warning",
    createdAt: "15/01/2025",
    updatedAt: "28/04/2025",
  },
  {
    id: "R003",
    name: "Bác sĩ",
    description: "Quyền truy cập dành cho bác sĩ trong hệ thống",
    permissions: [
      "dashboard_view",
      "patient_view",
      "patient_edit",
      "appointment_view",
      "appointment_create",
      "medicine_view",
    ],
    userCount: 15,
    color: "success",
    createdAt: "15/01/2025",
    updatedAt: "29/04/2025",
  },
  {
    id: "R004",
    name: "Y tá",
    description: "Quyền truy cập dành cho y tá",
    permissions: [
      "dashboard_view",
      "patient_view",
      "patient_edit",
      "appointment_view",
      "medicine_view",
    ],
    userCount: 25,
    color: "info",
    createdAt: "15/01/2025",
    updatedAt: "27/04/2025",
  },
  {
    id: "R005",
    name: "Lễ tân",
    description: "Quyền truy cập dành cho lễ tân tiếp nhận",
    permissions: [
      "dashboard_view",
      "patient_view",
      "patient_create",
      "appointment_view",
      "appointment_create",
    ],
    userCount: 8,
    color: "warning",
    createdAt: "15/01/2025",
    updatedAt: "26/04/2025",
  },
  {
    id: "R006",
    name: "Dược sĩ",
    description: "Quyền truy cập dành cho dược sĩ",
    permissions: [
      "dashboard_view",
      "patient_view",
      "medicine_view",
      "medicine_manage",
    ],    userCount: 6,
    color: "light",
    createdAt: "15/01/2025",
    updatedAt: "25/04/2025",
  },
];

const PAGE_SIZE = 10;

export default function RolePermissionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredData = rolesData.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getPermissionsByCategory = (permissions: string[]) => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach((permId) => {
      const permission = permissionsData.find((p) => p.id === permId);
      if (permission) {
        if (!categories[permission.category]) {
          categories[permission.category] = [];
        }
        categories[permission.category].push(permission);
      }
    });
    return categories;
  };

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Roles Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">        {/* Header */}
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-start items-center pt-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Quản lý vai trò
            </h2>
            <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">
              {totalItems} vai trò
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-base-600 rounded-lg hover:bg-base-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tạo vai trò
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            <SearchInput
              placeholder="Tìm kiếm vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                  Tên vai trò
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Mô tả
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Số người dùng
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Số quyền
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400"
                >
                  Cập nhật cuối
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
              {paginatedData.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full bg-${role.color}-500`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {role.name}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {role.id}
                        </p>
                      </div>                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400 max-w-xs">
                    <div className="truncate" title={role.description}>
                      {role.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color="light">
                      {role.userCount} người
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {role.permissions.length} quyền
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {role.updatedAt}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPermissions(role)}
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        title="Xem quyền"
                      >
                        <Shield size={14} />
                        Quyền
                      </button>
                      <button
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors dark:bg-gray-900/30 dark:text-gray-400 dark:hover:bg-gray-900/50"
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                        Sửa
                      </button>
                      {role.userCount === 0 && (
                        <button
                          className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                          title="Xóa vai trò"
                        >
                          <Trash2 size={14} />
                          Xóa
                        </button>
                      )}
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

      {/* Permission Modal */}
      {showPermissionModal && selectedRole && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto  overflow-hidden">
            <div className="flex justify-between items-center mb-6">              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Quyền của vai trò: {selectedRole.name}
              </h3>
              <button
                onClick={() => setShowPermissionModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Đóng"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(
                getPermissionsByCategory(selectedRole.permissions)
              ).map(([category, permissions]) => (
                <div
                  key={category}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3">
                    {category}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {permission.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPermissionModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Đóng
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-base-600 rounded-lg hover:bg-base-700">
                Chỉnh sửa quyền
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
