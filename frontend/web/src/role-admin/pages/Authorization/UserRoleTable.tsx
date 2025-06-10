import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Badge from "../../components/ui/badge/Badge";
import Pagination from "../../components/common/Pagination";
import { useState, useEffect, useCallback } from "react";
import SearchInput from "../../components/common/SearchInput";
import {
  Shield,
  Settings,
  Trash,
  Edit,
  UserPlus,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  userService,
  User,
  CreateUserData,
  UpdateUserData,
} from "../../services/authorizationService";

const PAGE_SIZE = 10;

export default function UserRoleTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // API state
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Form states
  const [createFormData, setCreateFormData] = useState<CreateUserData>({
    phone: "",
    email: "",
    password: "",
    role: "RECEPTIONIST",
  });

  const [updateFormData, setUpdateFormData] = useState<UpdateUserData>({
    phone: "",
    email: "",
    role: "RECEPTIONIST",
  });

  const [formLoading, setFormLoading] = useState(false);
  // Note: Statistics are handled in Authorization.tsx parent component
  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUsers({
        page: currentPage,
        limit: PAGE_SIZE,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
      });

      setUsers(response.users);
      setTotalItems(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError("Không thể tải dữ liệu người dùng");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }  }, [currentPage, searchTerm, roleFilter, departmentFilter, statusFilter]);
  // Load statistics data
  // Note: Statistics are handled in Authorization.tsx parent component

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  const handleCreateUser = async () => {
    setShowCreateModal(true);
    // Reset form when opening
    setCreateFormData({
      phone: "",
      email: "",
      password: "",
      role: "RECEPTIONIST",
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
    // Pre-fill form with current user data
    setUpdateFormData({
      phone: user.phone,
      email: user.email,
      role: user.role,
    });
  };

  const handleSubmitCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading) return;

    try {
      setFormLoading(true);
      
      // Validate required fields
      if (!createFormData.phone.trim()) {
        alert("Số điện thoại là bắt buộc!");
        return;
      }
      if (!createFormData.password.trim()) {
        alert("Mật khẩu là bắt buộc!");
        return;
      }

      console.log("Creating user with data:", createFormData);
      await userService.createUser(createFormData);
      
      // Success
      alert("Tạo người dùng thành công!");
      setShowCreateModal(false);
      await loadUsers(); // Reload data
      
      // Reset form
      setCreateFormData({
        phone: "",
        email: "",
        password: "",
        role: "RECEPTIONIST",
      });
    } catch (error: unknown) {
      console.error("Error creating user:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo người dùng";
      alert("Lỗi: " + errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formLoading || !selectedUser) return;

    try {
      setFormLoading(true);
      
      console.log("Updating user with data:", updateFormData);
      await userService.updateUser(selectedUser.id, updateFormData);
      
      // Success
      alert("Cập nhật người dùng thành công!");
      setShowEditModal(false);
      await loadUsers(); // Reload data
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật người dùng";
      alert("Lỗi: " + errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewPermissions = (user: User) => {
    setSelectedUser(user);
    setShowPermissionModal(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.user.name}?`)) {
      try {
        await userService.deleteUser(user.id);
        await loadUsers(); // Reload data
        alert("Xóa người dùng thành công!");
      } catch (error) {
        alert("Không thể xóa người dùng. Vui lòng thử lại!");
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleExportUsers = async () => {
    try {
      // TODO: Implement export functionality
      const allUsers = await userService.getUsers({ limit: 1000 });
      console.log("Export users data:", allUsers.users);
      alert("Tính năng xuất dữ liệu sẽ được triển khai sau!");    } catch (err) {
      console.error("Error exporting users:", err);
    }
  };  const handleRefresh = () => {
    setCurrentPage(1);
    loadUsers();
    // Note: Statistics refresh is handled in Authorization.tsx parent component
  };

  // Format date utility
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,      });
    } catch {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  // Role mapping từ English sang Vietnamese
  const getRoleDisplayName = (role: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "Admin";
      case "DOCTOR":
        return "Bác sĩ";
      case "NURSE":
        return "Y tá";
      case "PHARMACIST":
        return "Dược sĩ";
      case "RECEPTIONIST":
        return "Lễ tân";
      case "ACCOUNTANT":
        return "Kế toán";
      case "PATIENT":
        return "Bệnh nhân";
      default:
        return role || "Chưa xác định";
    }
  };

  const getRoleColor = (role: string) => {
    const normalizedRole = role?.toUpperCase();
    switch (normalizedRole) {
      case "ADMIN":
        return "error";
      case "DOCTOR":
        return "base";
      case "NURSE":
        return "warning";
      case "PHARMACIST":
        return "info";
      case "PATIENT":
        return "pending";
      case "RECEPTIONIST":
        return "info";
      case "ACCOUNTANT":
        return "warning";
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
        {" "}
        <div className="flex justify-start items-center pt-5">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Danh sách người dùng
          </h2>
          <span className="ml-5 text-sm bg-base-600/20 text-base-600 py-1 px-4 rounded-full font-bold">
            {totalItems} {" "}
            người dùng
          </span>
        </div>
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Làm mới
          </button>
          <button
            onClick={handleCreateUser}
            className="flex items-center gap-2 px-4 py-2 bg-base-500 text-white rounded-lg hover:bg-base-600 transition-colors text-sm font-medium"
          >
            <UserPlus size={16} />
            Thêm người dùng
          </button>
          <button
            onClick={handleExportUsers}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Download size={16} />
            Xuất dữ liệu
          </button>
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
            <select
              title="Lọc theo vai trò"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >
              {" "}
              <option value="">Tất cả vai trò</option>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Bác sĩ</option>
              <option value="NURSE">Y tá</option>
              <option value="PHARMACIST">Dược sĩ</option>
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="ACCOUNTANT">Kế toán</option>
              <option value="PATIENT">Bệnh nhân</option>
            </select>
          </div>

          {/* Dropdown for Department Filter */}
          <div className="relative">
            <select
              title="Lọc theo khoa"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >              <option value="">Tất cả khoa</option>
              <option value="Quản trị hệ thống">Quản trị hệ thống</option>
              <option value="Tim mạch">Tim mạch</option>
              <option value="Nội khoa">Nội khoa</option>
              <option value="Ngoại khoa">Ngoại khoa</option>
              <option value="Sản khoa">Sản khoa</option>
              <option value="Nhi khoa">Nhi khoa</option>
              <option value="Cơ xương khớp">Cơ xương khớp</option>
              <option value="Tiêu hóa">Tiêu hóa</option>
              <option value="Thần kinh">Thần kinh</option>
              <option value="Da liễu">Da liễu</option>
              <option value="Mắt">Mắt</option>
              <option value="Tai mũi họng">Tai mũi họng</option>
              <option value="Phụ khoa">Phụ khoa</option>
              <option value="Khoa Dược">Khoa Dược</option>
              <option value="Tiếp nhận">Tiếp nhận</option>
              <option value="Tài chính">Tài chính</option>
              <option value="Bệnh nhân">Bệnh nhân</option>
            </select>
          </div>

          {/* Dropdown for Status Filter */}
          <div className="relative">
            <select
              title="Lọc theo trạng thái"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 shadow-theme-xs appearance-none focus:border-base-300 focus:outline-none focus:ring-3 focus:ring-base-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt động">Hoạt động</option>
              <option value="Tạm khóa">Tạm khóa</option>
              <option value="Chờ xác thực">Chờ xác thực</option>
            </select>
          </div>

          {/* Filter Button */}
          <button
            onClick={handleRefresh}
            className="h-11 w-full rounded-lg bg-base-700 text-white text-sm font-medium shadow-theme-xs hover:bg-base-600 focus:outline-hidden focus:ring-3 focus:ring-base-600/50 flex items-center justify-center gap-2"
          >
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
          </TableHeader>{" "}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">            {loading ? (
              <TableRow>
                <TableCell className="py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-base-600"></div>
                    <span className="text-gray-500">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell className="py-8 text-center">
                  <div className="text-red-500">
                    <p>{error}</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 text-sm underline hover:no-underline"
                    >
                      Thử lại
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell className="py-8 text-center">
                  <span className="text-gray-500">
                    Không có dữ liệu người dùng
                  </span>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[40px] w-[40px] flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                        <img
                          src={user.user.image}
                          className="h-full w-full object-cover"
                          alt={user.user.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg";
                          }}
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
                    <Badge size="sm" color={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.department}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge size="sm" color={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>{" "}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.lastLogin || "Chưa có dữ liệu"}
                  </TableCell>{" "}
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {user.createdAt
                      ? formatDateTime(user.createdAt)
                      : "Chưa có dữ liệu"}
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewPermissions(user)}
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                        title="Xem và phân quyền"
                      >
                        <Shield size={14} />
                        Phân quyền
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors dark:bg-slate-900/30 dark:text-slate-400 dark:hover:bg-slate-900/50"
                        title="Chỉnh sửa người dùng"
                      >
                        <Edit size={14} />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        title="Xóa người dùng"
                      >
                        <Trash size={14} />
                        Xóa
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Thêm người dùng mới
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
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
            </div>            <form
              className="space-y-4"
              onSubmit={handleSubmitCreateUser}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={createFormData.phone}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập số điện thoại..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={createFormData.email}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập email..."
                  />
                </div>
              </div>              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vai trò *
                  </label>
                  <select
                    title="Chọn vai trò"
                    required
                    value={createFormData.role}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, role: e.target.value as CreateUserData['role'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="NURSE">Y tá</option>
                    <option value="PHARMACIST">Dược sĩ</option>
                    <option value="RECEPTIONIST">Lễ tân</option>
                    <option value="ACCOUNTANT">Kế toán</option>
                  </select>
                </div>                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mật khẩu *
                  </label>
                  <input
                    type="password"
                    required
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập mật khẩu..."
                  />
                </div>              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  className="rounded border-gray-300 text-base-600 focus:ring-base-500"
                />
                <label
                  htmlFor="sendEmail"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Gửi email thông báo đến người dùng
                </label>
              </div>              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-base-600 rounded-lg hover:bg-base-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {formLoading ? "Đang tạo..." : "Tạo người dùng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Chỉnh sửa người dùng: {selectedUser.user.name}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
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
            </div>            <form
              className="space-y-4"
              onSubmit={handleSubmitUpdateUser}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={updateFormData.phone}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập số điện thoại..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={updateFormData.email || ""}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    placeholder="Nhập email..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vai trò *
                  </label>
                  <select
                    title="Chọn vai trò"
                    required
                    value={updateFormData.role}
                    onChange={(e) => setUpdateFormData(prev => ({ ...prev, role: e.target.value as UpdateUserData['role'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-500 focus:border-base-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="DOCTOR">Bác sĩ</option>
                    <option value="NURSE">Y tá</option>
                    <option value="PHARMACIST">Dược sĩ</option>
                    <option value="RECEPTIONIST">Lễ tân</option>
                    <option value="ACCOUNTANT">Kế toán</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái (chỉ đọc)
                  </label>
                  <input
                    type="text"
                    value={selectedUser.status}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
                    placeholder="Trạng thái hiện tại..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-base-600 rounded-lg hover:bg-base-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {formLoading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {formLoading ? "Đang cập nhật..." : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permission Modal */}
      {showPermissionModal && selectedUser && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            {" "}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                Phân quyền cho: {selectedUser.user.name}
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
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <img
                      src={selectedUser.user.image}
                      className="h-full w-full object-cover"
                      alt={selectedUser.user.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://cdn.kona-blue.com/upload/kona-blue_com/post/images/2024/09/19/465/avatar-trang-1.jpg";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white/90">
                      {selectedUser.user.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedUser.role} • {selectedUser.department}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3 flex items-center gap-2">
                    <Shield size={16} className="text-green-600" />
                    Quyền được cấp
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Xem dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Quản lý bệnh nhân
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Xem lịch hẹn
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 dark:text-white/90 mb-3 flex items-center gap-2">
                    <Trash size={16} className="text-red-600" />
                    Quyền bị hạn chế
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Xóa bệnh nhân
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Quản lý tài chính
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Quản lý hệ thống
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
