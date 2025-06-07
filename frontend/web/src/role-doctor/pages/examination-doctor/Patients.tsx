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
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const { Search } = Input
const { Option } = Select

interface Patient {
  id: number
  name: string
  code: string
  appointment: string
  date: string
  gender: string
  age: number
  symptom: string
  status: string
  avatar?: string
  priority?: "high" | "medium" | "low"
}

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Enhanced mock data
  const patients: Patient[] = [
    {
      id: 1,
      name: "Trần Nhật Trường",
      code: "BN22521396",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Dị ứng thức ăn, nổi mẩn đỏ",
      status: "Hoàn thành",
      priority: "medium",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Huỳnh Văn Thiệu",
      code: "BN22521397",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nam",
      age: 21,
      symptom: "Mắt mờ, đau đầu thường xuyên",
      status: "Hoàn thành",
      priority: "low",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Trần Ngọc Ánh Thơ",
      code: "BN22521398",
      appointment: "Không đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Trầm cảm, lo âu",
      status: "Hoàn thành",
      priority: "high",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "Lê Thiện Nhi",
      code: "BN22521399",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Thiếu máu, mệt mỏi",
      status: "Xét nghiệm",
      priority: "medium",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "Trần Đỗ Phương Nhi",
      code: "BN22521400",
      appointment: "Đặt lịch",
      date: "21/04/2025",
      gender: "Nữ",
      age: 21,
      symptom: "Tăng huyết áp, đau ngực",
      status: "Đang chờ",
      priority: "high",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
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
      render: (date: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
          <span style={{ color: "#374151" }}>{date}</span>
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
      render: (age: number) => <span style={{ color: "#374151", fontWeight: 500 }}>{age}</span>,
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
      render: (_: any, record: Patient) => (
        <Space size="small">
          <Tooltip title="Bỏ qua">
            <Button icon={<StepForwardOutlined />} type="text" size="small" style={{ color: "#6b7280" }} />
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

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    const matchesGender = genderFilter === "all" || patient.gender === genderFilter

    return matchesSearch && matchesStatus && matchesGender
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
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>Quản lý và theo dõi thông tin bệnh nhân</p>
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
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Xét nghiệm">Xét nghiệm</Option>
              <Option value="Đang chờ">Đang chờ</Option>
            </Select>

            <Select placeholder="Giới tính" value={genderFilter} onChange={setGenderFilter} style={{ width: 120 }}>
              <Option value="all">Tất cả</Option>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>

            <DatePicker placeholder="Chọn ngày" style={{ width: 200 }} />

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
    </div>
  )
}

export default Patients
