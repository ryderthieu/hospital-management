"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Table, Input, Button, Avatar, Space, Card, Select, Tooltip, Empty, DatePicker, message } from "antd"
import {
  EditOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClearOutlined,
} from "@ant-design/icons"
import WeCareLoading from "../../components/common/WeCareLoading"
import { useNavigate } from "react-router-dom"
import type { ServiceOrder } from "../../types/serviceOrder"
import { api } from "../../../services/api"
import { getServiceOrdersByRoomId } from "../../services/serviceOrderServices"
import { appointmentService } from "../../services/appointmentServices"
import { servicesService } from "../../services/servicesServices"
import dayjs from "dayjs"
import type { Dayjs } from "dayjs"

const { Search } = Input
const { Option } = Select

// Interface for work schedule
interface WorkSchedule {
  workDate: string
  roomId: number
  startTime: string
  endTime: string
}

const Patients: React.FC = () => {
  const navigate = useNavigate()
  const doctorId = localStorage.getItem("currentDoctorId")

  // States
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [appointmentsData, setAppointmentsData] = useState<{ [key: number]: any }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [workSchedules, setWorkSchedules] = useState<WorkSchedule[]>([])
  const [scheduleLoading, setScheduleLoading] = useState(false)

  // Filter states - chỉ sử dụng filter backend hỗ trợ
  const [selectedDate, setSelectedDate] = useState<string | null>(dayjs().format("YYYY-MM-DD"))
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch work schedules
  const fetchWorkSchedules = useCallback(async () => {
    if (!doctorId) {
      message.error("Không tìm thấy ID bác sĩ.")
      return
    }
    setScheduleLoading(true)
    try {
      const response = await api.get(`/doctors/${doctorId}/schedules`)
      const schedules = response.data || []
      console.log("lịch làm việc", schedules)
      setWorkSchedules(schedules)

      // Auto-select first room for selected date if none selected
      if (selectedDate && !selectedRoomId && schedules.length > 0) {
        const dateSchedule = schedules.find((schedule: WorkSchedule) => schedule.workDate === selectedDate)
        if (dateSchedule) {
          setSelectedRoomId(dateSchedule.roomId)
        }
      }
    } catch (error) {
      console.error("Error fetching work schedules:", error)
      message.error("Không thể tải lịch làm việc")
      setWorkSchedules([])
    } finally {
      setScheduleLoading(false)
    }
  }, [doctorId, selectedDate, selectedRoomId])

  // Fetch service orders with backend filters
  const fetchServiceOrders = useCallback(async () => {
    if (!selectedRoomId) {
      setServiceOrders([])
      setAppointmentsData({})
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("Fetching service orders with filters:", {
        roomId: selectedRoomId,
        status: statusFilter !== "all" ? statusFilter : undefined,
        orderDate: selectedDate,
      })

      // Call backend API with filters
      const data = await getServiceOrdersByRoomId(
        selectedRoomId,
        statusFilter !== "all" ? statusFilter : undefined,
        selectedDate || undefined,
      )

      const orders = Array.isArray(data) ? data : []
      console.log("Received service orders:", orders)

      if (orders.length === 0) {
        setServiceOrders([])
        setAppointmentsData({})
        return
      }

      // Fetch services to get service names
      const servicesData = await servicesService.getAllServices()
      const serviceMap = new Map()
      if (Array.isArray(servicesData)) {
        servicesData.forEach((service) => {
          serviceMap.set(service.serviceId, service.serviceName)
        })
      }

      // Enrich service orders with service names
      const enrichedOrders = orders.map((order) => ({
        ...order,
        serviceName: serviceMap.get(order.serviceId) || "Không xác định",
      }))

      // Fetch appointment data for each order
      const appointmentPromises = enrichedOrders.map(async (order) => {
        try {
          const appointment = await appointmentService.getAppointmentById(order.appointmentId)
          return { appointmentId: order.appointmentId, data: appointment }
        } catch (error) {
          console.error(`Error fetching appointment ${order.appointmentId}:`, error)
          return { appointmentId: order.appointmentId, data: null }
        }
      })

      const appointmentResults = await Promise.all(appointmentPromises)
      const appointmentsMap = appointmentResults.reduce(
        (acc, result) => {
          acc[result.appointmentId] = result.data
          return acc
        },
        {} as { [key: number]: any },
      )

      setServiceOrders(enrichedOrders)
      setAppointmentsData(appointmentsMap)
    } catch (err) {
      console.error("Error fetching service orders:", err)
      setError("Không thể tải danh sách xét nghiệm")
      message.error("Không thể tải danh sách xét nghiệm")
      setServiceOrders([])
      setAppointmentsData({})
    } finally {
      setLoading(false)
    }
  }, [selectedRoomId, statusFilter, selectedDate])

  // Load work schedules on component mount
  useEffect(() => {
    fetchWorkSchedules()
  }, [fetchWorkSchedules])

  // Fetch service orders when filters change
  useEffect(() => {
    if (selectedRoomId) {
      fetchServiceOrders()
    }
  }, [selectedRoomId, statusFilter, selectedDate, fetchServiceOrders])

  // Get rooms for selected date
  const getRoomsForSelectedDate = useMemo(() => {
    if (!selectedDate || !Array.isArray(workSchedules)) return []

    const roomsToday = workSchedules
      .filter((schedule) => schedule.workDate === selectedDate)
      .map((schedule) => schedule.roomId)
    const uniqueRoomIds = [...new Set(roomsToday)]

    return uniqueRoomIds.map((roomId) => ({
      roomId,
      displayName: `Phòng ${roomId}`,
    }))
  }, [selectedDate, workSchedules])

  // Filter service orders by search term (client-side)
  const filteredServiceOrders = useMemo(() => {
    if (!Array.isArray(serviceOrders)) return []

    if (!searchTerm) return serviceOrders

    const searchLower = searchTerm.toLowerCase()
    return serviceOrders.filter((order) => {
      const appointment = appointmentsData[order.appointmentId]
      const patientInfo = appointment?.patientInfo

      return (
        order.serviceName?.toLowerCase().includes(searchLower) ||
        order.orderId.toString().includes(searchLower) ||
        patientInfo?.fullName?.toLowerCase().includes(searchLower) ||
        patientInfo?.patientId?.toLowerCase().includes(searchLower)
      )
    })
  }, [serviceOrders, searchTerm, appointmentsData])

  // Calculate stats
  const stats = useMemo(() => {
    const orders = Array.isArray(filteredServiceOrders) ? filteredServiceOrders : []
    return {
      total: orders.length,
      ordered: orders.filter((order) => order.orderStatus === "ORDERED").length,
      completed: orders.filter((order) => order.orderStatus === "COMPLETED").length,
    }
  }, [filteredServiceOrders])

  // Event handlers
  const handleDateChange = (date: Dayjs | null) => {
    const dateStr = date ? date.format("YYYY-MM-DD") : null
    console.log("Date changed:", dateStr)
    setSelectedDate(dateStr)
    setSelectedRoomId(undefined) // Reset room when date changes
  }

  const handleRoomChange = (value: number) => {
    console.log("Room changed:", value)
    setSelectedRoomId(value)
  }

  const handleStatusChange = (value: string) => {
    console.log("Status changed:", value)
    setStatusFilter(value)
  }

  const handleClearFilters = () => {
    setSelectedDate(dayjs().format("YYYY-MM-DD"))
    setSelectedRoomId(undefined)
    setStatusFilter("all")
    setSearchTerm("")
  }

  const handleRefresh = () => {
    fetchWorkSchedules()
    if (selectedRoomId) {
      fetchServiceOrders()
    }
  }

  const handleViewServiceOrder = (record: ServiceOrder) => {
    const appointment = appointmentsData[record.appointmentId]
    navigate("/doctor/service/patient/detail", {
      state: {
        orderId: record.orderId,
        roomId: record.roomId,
        appointmentData: appointment,
        serviceOrder: record,
      },
    })
  }

  // Table columns
  const columns = [
    {
      title: "STT",
      key: "index",
      width: 70,
      render: (_: any, __: any, index: number) => (
        <span style={{ fontWeight: 500, color: "#6b7280" }}>{index + 1}</span>
      ),
    },
    {
      title: "Bệnh nhân",
      dataIndex: "appointmentId",
      key: "patient",
      render: (appointmentId: number, record: ServiceOrder) => {
        const appointment = appointmentsData[appointmentId]
        const patientInfo = appointment?.patientInfo

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={
                patientInfo?.avatar ||
                "https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg"
              }
              size={48}
              style={{ marginRight: 12, border: "2px solid #f0f9ff" }}
              icon={<UserOutlined />}
            />
            <div>
              <div style={{ fontWeight: 600, color: "#111827", marginBottom: "2px" }}>
                {patientInfo?.fullName || "Đang tải..."}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Mã BN: {patientInfo?.patientId || "N/A"}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {patientInfo?.birthday ? new Date(patientInfo.birthday).toLocaleDateString("vi-VN") : "N/A"} -{" "}
                {patientInfo?.gender === "MALE" ? "Nam" : patientInfo?.gender === "FEMALE" ? "Nữ" : "N/A"}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (serviceName: string, record: ServiceOrder) => (
        <div>
          <div style={{ fontWeight: 600, color: "#111827", marginBottom: "4px" }}>{serviceName}</div>
          <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Mã chỉ định: {record.orderId}</div>
          {record.result && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Button
                size="small"
                type="link"
                style={{ padding: "0", height: "auto", fontSize: "11px" }}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(record.result, "_blank")
                }}
              >
                Xem PDF
              </Button>
              <Button
                size="small"
                type="link"
                style={{ padding: "0", height: "auto", fontSize: "11px" }}
                onClick={(e) => {
                  e.stopPropagation()
                  const link = document.createElement("a")
                  link.href = record.result!
                  link.download = `ket-qua-${record.orderId}.pdf`
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                Tải xuống
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thời gian chỉ định",
      dataIndex: "orderTime",
      key: "orderTime",
      render: (orderTime: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CalendarOutlined style={{ marginRight: 8, color: "#6b7280" }} />
          <span style={{ color: "#374151" }}>
            {orderTime ? dayjs(orderTime).format("HH:mm DD/MM/YYYY") : "Chưa có"}
          </span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: string) => {
        const statusConfig = {
          ORDERED: { color: "#d97706", bgColor: "#fef3c7", text: "Đang chờ" },
          COMPLETED: { color: "#059669", bgColor: "#d1fae5", text: "Đã hoàn thành" },
        }

        const config = statusConfig[status as keyof typeof statusConfig] || {
          color: "#6b7280",
          bgColor: "#f3f4f6",
          text: "Không xác định",
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
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: ServiceOrder) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EditOutlined />}
              type="text"
              size="small"
              onClick={() => handleViewServiceOrder(record)}
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
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", margin: 0, marginBottom: "8px" }}>
            Danh sách bệnh nhân
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px", margin: 0 }}>
            Quản lý và theo dõi chỉ định dịch vụ
            {selectedDate && (
              <span style={{ marginLeft: "8px", fontWeight: 500 }}>
                - Ngày: {dayjs(selectedDate).format("DD/MM/YYYY")}
              </span>
            )}
            {selectedRoomId && <span style={{ marginLeft: "8px", fontWeight: 500 }}>- Phòng {selectedRoomId}</span>}
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
            <div style={{ color: "#6b7280" }}>Tổng chỉ định</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706" }}>{stats.ordered}</div>
            <div style={{ color: "#6b7280" }}>Đang chờ</div>
          </Card>
          <Card size="small" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#059669" }}>{stats.completed}</div>
            <div style={{ color: "#6b7280" }}>Đã hoàn thành</div>
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
              placeholder="Tìm kiếm bệnh nhân, dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 320 }}
              prefix={<SearchOutlined style={{ color: "#6b7280" }} />}
            />

            <DatePicker
              placeholder="Chọn ngày"
              style={{ width: 200 }}
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
            />

            <Select
              placeholder="Chọn phòng"
              value={selectedRoomId}
              onChange={handleRoomChange}
              style={{ width: 300 }}
              loading={scheduleLoading}
              disabled={!selectedDate || getRoomsForSelectedDate.length === 0}
            >
              {getRoomsForSelectedDate.map((room) => (
                <Option key={room.roomId} value={room.roomId}>
                  {room.displayName}
                </Option>
              ))}
            </Select>

            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={handleStatusChange}
              style={{ width: 150 }}
              suffixIcon={<FilterOutlined style={{ color: "#6b7280" }} />}
            >
              <Option value="all">Tất cả trạng thái</Option>
              <Option value="ORDERED">Đang chờ</Option>
              <Option value="COMPLETED">Đã hoàn thành</Option>
            </Select>

            <Button icon={<ClearOutlined />} onClick={handleClearFilters} type="text">
              Xóa bộ lọc
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading || scheduleLoading}
              style={{ marginLeft: "auto" }}
            >
              Làm mới
            </Button>
          </div>
        </Card>

        {/* Service Orders table */}
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
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#111827", margin: 0 }}>Danh sách chỉ định</h2>
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
                {stats.total} chỉ định
              </span>
            </div>
          </div>

          {loading ? (
            <WeCareLoading mode="parent" />
          ) : error ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <Empty description={error} />
            </div>
          ) : !selectedRoomId ? (
            <Empty description="Vui lòng chọn ngày và phòng để xem danh sách chỉ định" style={{ padding: "60px 0" }} />
          ) : !Array.isArray(filteredServiceOrders) || filteredServiceOrders.length === 0 ? (
            <Empty description="Không tìm thấy chỉ định nào" style={{ padding: "60px 0" }} />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredServiceOrders}
              rowKey="orderId"
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) => `Hiển thị ${range[0]}-${range[1]} trong tổng số ${total} chỉ định`,
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
