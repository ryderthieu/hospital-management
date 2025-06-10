import type React from "react"
import { useState } from "react"
import { Table, Input, DatePicker, Button, Avatar, Space, Card, Select, Tooltip, Empty } from "antd"
import {
  EditOutlined,
  StepForwardOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClearOutlined,
} from "@ant-design/icons"
import WeCareLoading from "../../components/common/WeCareLoading"
import { useNavigate } from "react-router-dom"
import { useAppointments } from "../../hooks/useAppointment"
import {
  formatTimeSlot,
  getAppointmentStatusColor,
  getAppointmentStatusVietnameseText,
} from "../../services/appointmentServices"
import type { Appointment } from "../../types/appointment"
import dayjs, { type Dayjs } from "dayjs"

const { Search } = Input
const { Option } = Select

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const navigate = useNavigate()

  const {
    appointments,
    paginatedData,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    updatePagination,
    clearDateFilter,
    setTodayFilter,
    updateAppointmentStatus,
    refreshAppointments,
  } = useAppointments()

  const handleViewPatient = (id: number) => {
    const appointment = appointments.find((a: Appointment) => a.appointmentId === id)
    if (appointment) {
      navigate("/doctor/examination/patient/detail", {
        state: {
          appointmentId: appointment.appointmentId,
        },
      })
    }
  }

  const handleRefresh = () => {
    refreshAppointments()
  }

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    await updateAppointmentStatus(appointmentId, newStatus)
  }

  const handleDateChange = (date: Dayjs | null, dateString: string | string[]) => {
    const dateStr = Array.isArray(dateString) ? dateString[0] : dateString
    if (dateStr) {
      updateFilters({ date: dateStr })
    } else {
      clearDateFilter()
    }
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    updateFilters({ status: value === "all" ? undefined : value })
  }

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value)
    updateFilters({ gender: value === "all" ? undefined : value })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateFilters({ searchTerm: value || undefined })
  }

  const getStatusBadge = (appointmentStatus: string) => {
    const { color, bgColor } = getAppointmentStatusColor(appointmentStatus)
    return (
      <span
        style={{
          color,
          backgroundColor: bgColor,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {getAppointmentStatusVietnameseText(appointmentStatus)}
      </span>
    )
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "number",
      key: "number",
      width: 70,
      render: (number: number) => <span style={{ fontWeight: 500, color: "#6b7280" }}>{number}</span>,
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patientInfo",
      key: "patientInfo",
      render: (patientInfo: any, record: Appointment) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src="https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
            size={48}
            style={{ marginRight: 12, border: "2px solid #f0f9ff" }}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#111827", marginBottom: "2px" }}>
              {patientInfo?.fullName || "Chưa có thông tin"}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "schedule",
      key: "schedule",
      render: (schedule: any, record: Appointment) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
            <span style={{ color: "#374151" }}>{schedule?.workDate}</span>
          </div>
          
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "patientInfo",
      key: "gender",
      render: (patientInfo: any) => (
        <span style={{ color: "#374151" }}>
          {patientInfo?.gender === "MALE" ? "Nam" : patientInfo?.gender === "FEMALE" ? "Nữ" : "N/A"}
        </span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "patientInfo",
      key: "birthday",
      render: (patientInfo: any) => (
        <span style={{ color: "#374151", fontWeight: 500 }}>
          {patientInfo?.birthday ? patientInfo.birthday.split("-").reverse().join("/") : "N/A"}
        </span>
      ),
    },
    {
      title: "Triệu chứng",
      dataIndex: "symptoms",
      key: "symptoms",
      ellipsis: true,
      render: (symptoms: string) => (
        <Tooltip title={symptoms}>
          <span style={{ color: "#374151" }}>{symptoms}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "appointmentStatus",
      key: "appointmentStatus",
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: Appointment) => (
        <Space size="small">
          <Tooltip title="Bỏ qua">
            <Button icon={<StepForwardOutlined />} type="text" size="small" style={{ color: "#6b7280" }} />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => handleViewPatient(record.appointmentId)}
              style={{ color: "#047481" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#111827",
              margin: 0,
              marginBottom: "8px",
            }}
          >
            Danh sách bệnh nhân
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
            Quản lý và theo dõi thông tin bệnh nhân
            {filters.date && (
              <span style={{ marginLeft: "8px", fontWeight: 500 }}>
                - Ngày: {dayjs(filters.date).format("DD/MM/YYYY")}
              </span>
            )}
          </p>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#111827" }}>{stats.total}</div>
            <div style={{ color: "#6b7280" }}>Tổng lịch hẹn</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>{stats.pending}</div>
            <div style={{ color: "#6b7280" }}>Đang chờ</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>{stats.confirmed}</div>
            <div style={{ color: "#6b7280" }}>Đã xác nhận</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>{stats.completed}</div>
            <div style={{ color: "#6b7280" }}>Hoàn thành</div>
          </Card>
        </div>

        {/* Filters */}
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            marginBottom: "24px",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <Search
              placeholder="Tìm kiếm bệnh nhân..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: 320 }}
              prefix={<SearchOutlined style={{ color: "#6b7280" }} />}
            />

            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined style={{ color: "#6b7280" }} />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="PENDING">Đang chờ</Option>
              <Option value="CONFIRMED">Đã xác nhận</Option>
              <Option value="COMPLETED">Hoàn thành</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>

            <Select
              placeholder="Giới tính"
              value={genderFilter}
              onChange={handleGenderFilterChange}
              style={{ width: 120 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="MALE">Nam</Option>
              <Option value="FEMALE">Nữ</Option>
            </Select>

            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: 200 }}
              value={filters.date ? dayjs(filters.date) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />

            <Button icon={<ClearOutlined />} onClick={clearDateFilter} disabled={!filters.date} type="text">
              Xóa bộ lọc ngày
            </Button>

            <Button onClick={setTodayFilter} type="text">
              Hôm nay
            </Button>

            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} style={{ marginLeft: "auto" }}>
              Làm mới
            </Button>
          </div>
        </Card>

        {/* Patient table */}
        <Card
          bordered={false}
          style={{
            borderRadius: "16px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111827",
                  margin: 0,
                }}
              >
                Danh sách bệnh nhân
              </h2>
              <span
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1d4ed8",
                  fontSize: "14px",
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                {appointments.length} bệnh nhân
              </span>
            </div>
          </div>

          {loading ? (
            <WeCareLoading mode="parent" />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
            </div>
          ) : appointments.length === 0 ? (
            <Empty description="Không tìm thấy bệnh nhân nào" style={{ padding: "60px 0" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={appointments}
              rowKey="appointmentId"
              pagination={{
                current: paginatedData.pageNo + 1, // Convert from 0-based to 1-based
                pageSize: paginatedData.pageSize,
                total: paginatedData.totalElements,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bệnh nhân`,
                onChange: (page, pageSize) => {
                  updatePagination(page, pageSize)
                },
                style: { marginTop: "16px" },
              }}
              style={{ borderRadius: "12px" }}
              rowClassName={(record, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
            />
          )}
        </Card>
      </div>
    </div>
  )
}

export default Patients
