"use client"

import type React from "react"
import { useState } from "react"
import { Table, Input, DatePicker, Button, Avatar, Space, Card, Select, Tag, Tooltip, Empty, Spin } from "antd"
import {
  EditOutlined,
  StepForwardOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Search } = Input
const { Option } = Select

interface Appointment {
  id: number
  patientName: string
  patientCode: string
  phone: string
  appointmentType: string
  date: string
  time: string
  gender: string
  age: number
  symptom: string
  status: string
  avatar?: string
  priority?: "high" | "medium" | "low"
  doctor: string
}

const Appointment: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [timeFilter, setTimeFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Enhanced mock data for appointments
  const appointments: Appointment[] = [
    {
      id: 1,
      patientName: "Trần Nhật Trường",
      patientCode: "BN22521396",
      phone: "0961 565 563",
      appointmentType: "Tái khám",
      date: "21/04/2025",
      time: "09:00",
      gender: "Nam",
      age: 21,
      symptom: "Dị ứng thức ăn, nổi mẩn đỏ",
      status: "Đã xác nhận",
      priority: "medium",
      doctor: "Dr. Nguyễn Thiên Tài",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      patientName: "Lê Thiện Nhi",
      patientCode: "BN22521399",
      phone: "0912 345 678",
      appointmentType: "Khám mới",
      date: "21/04/2025",
      time: "10:30",
      gender: "Nữ",
      age: 21,
      symptom: "Thiếu máu, mệt mỏi",
      status: "Chờ xác nhận",
      priority: "high",
      doctor: "Dr. Nguyễn Thiên Tài",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      patientName: "Trần Đỗ Phương Nhi",
      patientCode: "BN22521400",
      phone: "0987 654 321",
      appointmentType: "Tái khám",
      date: "21/04/2025",
      time: "14:00",
      gender: "Nữ",
      age: 21,
      symptom: "Tăng huyết áp, đau ngực",
      status: "Đã xác nhận",
      priority: "high",
      doctor: "Dr. Nguyễn Thiên Tài",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      patientName: "Nguyễn Văn An",
      patientCode: "BN22521401",
      phone: "0901 234 567",
      appointmentType: "Khám mới",
      date: "21/04/2025",
      time: "15:30",
      gender: "Nam",
      age: 35,
      symptom: "Ho kéo dài, khó thở",
      status: "Chờ xác nhận",
      priority: "medium",
      doctor: "Dr. Nguyễn Thiên Tài",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      patientName: "Phạm Thị Mai",
      patientCode: "BN22521402",
      phone: "0978 123 456",
      appointmentType: "Tái khám",
      date: "21/04/2025",
      time: "16:00",
      gender: "Nữ",
      age: 28,
      symptom: "Đau đầu, chóng mặt",
      status: "Đã hủy",
      priority: "low",
      doctor: "Dr. Nguyễn Thiên Tài",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
  ]

  const handleViewPatient = (id: number) => {
    navigate("/examination/patient/detail", { state: { patientId: id } })
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Đã xác nhận": { color: "#059669", bgColor: "#d1fae5", text: "Đã xác nhận" },
      "Chờ xác nhận": { color: "#d97706", bgColor: "#fef3c7", text: "Chờ xác nhận" },
      "Đã hủy": { color: "#dc2626", bgColor: "#fee2e2", text: "Đã hủy" },
      "Hoàn thành": { color: "#2563eb", bgColor: "#dbeafe", text: "Hoàn thành" },
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
      render: (id: number, record: Appointment, index: number) => (
        <span style={{ fontWeight: 500, color: "#6b7280" }}>{(currentPage - 1) * itemsPerPage + index + 1}</span>
      ),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "patientName",
      key: "patientName",
      render: (text: string, record: Appointment) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            src={record.avatar}
            size={48}
            style={{ marginRight: 12, border: "2px solid #f0f9ff" }}
            icon={<UserOutlined />}
          />
          <div>
            <div style={{ fontWeight: 600, color: "#111827", marginBottom: "2px" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "2px" }}>{record.patientCode}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", display: "flex", alignItems: "center" }}>
              <PhoneOutlined style={{ marginRight: 4 }} />
              {record.phone}
            </div>
            {record.priority && <div style={{ marginTop: "4px" }}>{getPriorityTag(record.priority)}</div>}
          </div>
        </div>
      ),
    },
    {
      title: "Loại khám",
      dataIndex: "appointmentType",
      key: "appointmentType",
      render: (type: string) => <Tag color={type === "Tái khám" ? "#047481" : "#6366f1"}>{type}</Tag>,
    },
    {
      title: "Ngày & Giờ hẹn",
      key: "datetime",
      render: (record: Appointment) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
            <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
            <span style={{ color: "#374151", fontWeight: 500 }}>{record.date}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ClockCircleOutlined style={{ marginRight: 8, color: "#6b7280" }} />
            <span style={{ color: "#374151" }}>{record.time}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Bác sĩ",
      dataIndex: "doctor",
      key: "doctor",
      render: (doctor: string) => <span style={{ color: "#374151", fontWeight: 500 }}>{doctor}</span>,
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
      render: (status: string) => getStatusBadge(status),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: Appointment) => (
        <Space size="small">
          <Tooltip title="Hủy lịch hẹn">
            <Button
              icon={<StepForwardOutlined />}
              type="text"
              size="small"
              style={{ color: "#ef4444" }}
              disabled={record.status === "Đã hủy"}
            />
          </Tooltip>
          <Tooltip title="Xem hồ sơ">
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

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesTime =
      timeFilter === "all" ||
      (timeFilter === "morning" && Number.parseInt(appointment.time.split(":")[0]) < 12) ||
      (timeFilter === "afternoon" && Number.parseInt(appointment.time.split(":")[0]) >= 12)

    return matchesSearch && matchesStatus && matchesTime
  })

  const totalItems = filteredAppointments.length

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
            Lịch hẹn khám bệnh
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
            Quản lý và theo dõi các cuộc hẹn với bệnh nhân
          </p>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 320 }}
              prefix={<SearchOutlined style={{ color: "#6b7280" }} />}
            />

            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined style={{ color: "#6b7280" }} />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="Đã xác nhận">Đã xác nhận</Option>
              <Option value="Chờ xác nhận">Chờ xác nhận</Option>
              <Option value="Đã hủy">Đã hủy</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
            </Select>

            <Select placeholder="Thời gian" value={timeFilter} onChange={setTimeFilter} style={{ width: 120 }}>
              <Option value="all">Cả ngày</Option>
              <Option value="morning">Buổi sáng</Option>
              <Option value="afternoon">Buổi chiều</Option>
            </Select>

            <DatePicker placeholder="Chọn ngày" style={{ width: 200 }} />

            <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading} style={{ marginLeft: "auto" }}>
              Làm mới
            </Button>
          </div>
        </Card>

        {/* Appointment table */}
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
                Danh sách lịch hẹn
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
                {filteredAppointments.length} lịch hẹn
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Spin size="large" />
            </div>
          ) : filteredAppointments.length === 0 ? (
            <Empty description="Không tìm thấy lịch hẹn nào" style={{ padding: "60px 0" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredAppointments}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: itemsPerPage,
                total: totalItems,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} lịch hẹn`,
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
    </div>
  )
}

export default Appointment
