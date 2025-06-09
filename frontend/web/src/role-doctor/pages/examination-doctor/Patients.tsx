"use client"

import type React from "react"
import { useState } from "react"
import { Table, Input, DatePicker, Button, Avatar, Space, Card, Select, Tag, Tooltip, Empty, Spin, Modal } from "antd"
import {
  EditOutlined,
  StepForwardOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  ClearOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { useAppointmentPatients } from "../../hooks/useAppointment"
import {
  formatTimeSlot,
  getAppointmentStatusColor,
  formatAppointmentDate,
  getAppointmentStatusText,
} from "../../services/appointmentServices"
import type { Patient } from "../../types/patient"
import dayjs, { type Dayjs } from "dayjs"

const { Search } = Input
const { Option } = Select

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const navigate = useNavigate()

  const {
    patients,
    loading,
    error,
    stats,
    filters,
    updateFilters,
    clearDateFilter,
    setTodayFilter,
    updateAppointmentStatus,
    refreshAppointments,
  } = useAppointmentPatients()

  const handleViewPatient = (id: number) => {
    const patient = patients.find((p) => p.id === id)
    if (patient?.appointmentData) {
      // Navigate to PatientDetail with appointment data
      navigate("/doctor/examination/patient/detail", {
        state: {
          appointmentId: patient.appointmentData.appointmentId,
          patientData: patient,
          appointmentData: patient.appointmentData,
        },
      })
    } else {
      navigate("/doctor/examination/patient/detail", { state: { patientId: id } })
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    updateFilters({ searchTerm: value || undefined })
  }

  const getStatusBadge = (status: string, appointmentStatus?: string) => {
    if (appointmentStatus) {
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
          {status}
        </span>
      )
    }

    // Fallback for non-appointment statuses
    const statusConfig = {
      "Hoàn thành": { color: "#059669", bgColor: "#d1fae5", text: "Hoàn thành" },
      "Xét nghiệm": { color: "#2563eb", bgColor: "#dbeafe", text: "Xét nghiệm" },
      "Đang chờ": { color: "#d97706", bgColor: "#fef3c7", text: "Đang chờ" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "#6b7280",
      bgColor: "#f3f4f6",
      text: status,
    }

    return (
      <span
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {config.text}
      </span>
    )
  }

  const getPriorityTag = (priority: string) => {
    const colors = {
      high: "#f04438",
      medium: "#f79009",
      low: "#12b76a",
    }
    return <Tag color={colors[priority as keyof typeof colors]}>{priority.toUpperCase()}</Tag>
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      width: 70,
      render: (id: number, record: Patient, index: number) => (
        <span style={{ fontWeight: 500, color: "#6b7280" }}>{(currentPage - 1) * itemsPerPage + index + 1}</span>
      ),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Patient) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.avatar}
            size={48}
            style={{ marginRight: 12, border: "2px solid #f0f9ff" }}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#111827", marginBottom: "2px" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>{record.code}</div>
            {record.priority && <div style={{ marginTop: "4px" }}>{getPriorityTag(record.priority)}</div>}
            {record.appointmentData && (
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                Số thứ tự: {record.appointmentData.number}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Dạng khám",
      dataIndex: "appointment",
      key: "appointment",
      render: (appointment: string) => (
        <Tag color={appointment === "Đặt lịch" ? "#047481" : "#6b7280"}>{appointment}</Tag>
      ),
    },
    {
      title: "Ngày khám",
      dataIndex: "date",
      key: "date",
      render: (date: string, record: Patient) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
            <span style={{ color: "#374151" }}>{date}</span>
          </div>
          {record.appointmentData && (
            <div style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#6b7280" }}>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {formatTimeSlot(record.appointmentData.slotStart, record.appointmentData.slotEnd)}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => <span style={{ color: "#374151" }}>{gender}</span>,
    },
    {
      title: "Tuổi",
      dataIndex: "age",
      key: "age",
      render: (age: number) => <span style={{ color: "#374151", fontWeight: 500 }}>{age || "N/A"}</span>,
    },
    {
      title: "Triệu chứng",
      dataIndex: "symptom",
      key: "symptom",
      ellipsis: true,
      render: (symptom: string) => (
        <Tooltip title={symptom}>
          <span style={{ color: "#374151" }}>{symptom}</span>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: Patient) => getStatusBadge(status, record.appointmentData?.appointmentStatus),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: Patient) => (
        <Space size="small">
          <Tooltip title="Bỏ qua">
            <Button icon={<StepForwardOutlined />} type="text" size="small" style={{ color: "#6b7280" }} />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => handleViewPatient(record.id)}
              style={{ color: "#047481" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Apply additional client-side filtering for search and gender
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      !searchTerm ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.symptom.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGender = genderFilter === "all" || patient.gender === genderFilter

    return matchesSearch && matchesGender
  })

  const totalItems = filteredPatients.length

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

            <Select placeholder="Giới tính" value={genderFilter} onChange={setGenderFilter} style={{ width: 120 }}>
              <Option value="all">Tất cả</Option>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
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
                {filteredPatients.length} bệnh nhân
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
            </div>
          ) : filteredPatients.length === 0 ? (
            <Empty description="Không tìm thấy bệnh nhân nào" style={{ padding: "60px 0" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredPatients}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: itemsPerPage,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} bệnh nhân`,
                onChange: (page, pageSize) => {
                  setCurrentPage(page)
                  if (pageSize !== itemsPerPage) {
                    setItemsPerPage(pageSize)
                  }
                },
                style: { marginTop: "16px" },
              }}
              style={{ borderRadius: "12px" }}
              rowClassName={(record, index) => (index % 2 === 0 ? "table-row-light" : "table-row-dark")}
            />
          )}
        </Card>
      </div>

      {/* Appointment Detail Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <MedicineBoxOutlined style={{ marginRight: 8, color: "#047481" }} />
            Chi tiết lịch hẹn
          </div>
        }
        open={!!selectedAppointment}
        onCancel={() => setSelectedAppointment(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedAppointment(null)}>
            Đóng
          </Button>,
          <Button
            key="confirm"
            type="primary"
            onClick={() => {
              if (selectedAppointment) {
                handleStatusChange(selectedAppointment.appointmentId, "CONFIRMED")
                setSelectedAppointment(null)
              }
            }}
          >
            Xác nhận lịch hẹn
          </Button>,
        ]}
        width={600}
      >
        {selectedAppointment && (
          <div style={{ padding: "16px 0" }}>
            <div style={{ marginBottom: "16px" }}>
              <strong>Mã lịch hẹn:</strong> {selectedAppointment.appointmentId}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Số thứ tự:</strong> {selectedAppointment.number}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Ngày khám:</strong> {formatAppointmentDate(selectedAppointment.schedule.workDate)}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Thời gian:</strong> {formatTimeSlot(selectedAppointment.slotStart, selectedAppointment.slotEnd)}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Ca làm việc:</strong> {selectedAppointment.schedule.shift}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Phòng:</strong> {selectedAppointment.schedule.roomId}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Triệu chứng:</strong> {selectedAppointment.symptoms}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Trạng thái:</strong>{" "}
              {getStatusBadge(
                getAppointmentStatusText(selectedAppointment.appointmentStatus),
                selectedAppointment.appointmentStatus,
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Patients
