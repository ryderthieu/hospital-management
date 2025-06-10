"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Typography,
  Spin,
  Card,
  message,
  Select,
  DatePicker,
  Space,
  Popconfirm,
} from "antd"
import {
  SaveOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons"
import type { ServiceOrder } from "../../types/serviceOrder"
import type { ExaminationRoom } from "../../types/examinationRoom"
import { getServiceOrderById, updateServiceOrder, deleteServiceOrder } from "../../services/serviceOrderServices"
import { appointmentService } from "../../services/appointmentServices"
import { examinationRoomService } from "../../services/examinationRoomServices"
import type { Appointment } from "../../types/appointment"
import dayjs from "dayjs"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const PatientDetail: React.FC = () => {
  const [serviceOrder, setServiceOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [examinationRoom, setExaminationRoom] = useState<ExaminationRoom | null>(null)

  const { orderId, roomId } = location.state || {}

  const fetchServiceOrder = async () => {
    if (!orderId || !roomId) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm")
      return
    }

    setLoading(true)
    try {
      // We need serviceId to get the service order, but we don't have it directly
      // This is a limitation of the current API structure
      // For now, we'll assume we can get it somehow or modify the API
      const data = await getServiceOrderById(1, orderId) // Using serviceId = 1 as placeholder
      setServiceOrder(data)

      // Fetch appointment data to get patient information
      if (data.appointmentId) {
        try {
          const appointmentData = await appointmentService.getAppointmentById(data.appointmentId)
          setAppointment(appointmentData)
        } catch (appointmentError) {
          console.error("Error fetching appointment data:", appointmentError)
          // Don't show error message for appointment fetch failure, just log it
        }
      }

      // Fetch examination room data
      if (data.roomId) {
        try {
          const roomData = await examinationRoomService.getExaminationRoomById(data.roomId)
          setExaminationRoom(roomData)
        } catch (roomError) {
          console.error("Error fetching room data:", roomError)
        }
      }

      // Set form values
      form.setFieldsValue({
        serviceName: data.service?.serviceName || "",
        serviceType: data.service?.serviceType || "",
        orderStatus: data.orderStatus,
        result: data.result || "",
        orderTime: data.orderTime ? dayjs(data.orderTime) : null,
        resultTime: data.resultTime ? dayjs(data.resultTime) : null,
      })
    } catch (error) {
      console.error("Error fetching service order:", error)
      message.error("Không thể tải thông tin đơn xét nghiệm")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()

      if (!serviceOrder) {
        message.error("Không tìm thấy thông tin đơn xét nghiệm")
        return
      }

      setSaving(true)

      const updateData: Partial<ServiceOrder> = {
        ...serviceOrder,
        orderStatus: values.orderStatus,
        result: values.result || "",
        resultTime: values.orderStatus === "COMPLETED" ? new Date().toISOString() : serviceOrder.resultTime,
      }

      await updateServiceOrder(serviceOrder.service.serviceId, orderId, updateData as ServiceOrder)

      message.success("Cập nhật kết quả xét nghiệm thành công")

      // Refresh data
      await fetchServiceOrder()
    } catch (error) {
      console.error("Error updating service order:", error)
      message.error("Có lỗi xảy ra khi cập nhật kết quả")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!serviceOrder) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm")
      return
    }

    setDeleting(true)
    try {
      await deleteServiceOrder(serviceOrder.service.serviceId, orderId)
      message.success("Xóa đơn xét nghiệm thành công")
      navigate(-1) // Go back to previous page
    } catch (error) {
      console.error("Error deleting service order:", error)
      message.error("Có lỗi xảy ra khi xóa đơn xét nghiệm")
    } finally {
      setDeleting(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ORDERED":
        return "#d97706"
      case "COMPLETED":
        return "#059669"
      default:
        return "#6b7280"
    }
  }

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Chưa có"
    try {
      return new Date(dateString).toLocaleString("vi-VN")
    } catch (e) {
      return "Định dạng không hợp lệ"
    }
  }

  const getRoomDisplayName = () => {
    if (!examinationRoom) return `Phòng ${roomId}`
    return `${examinationRoom.roomName} - ${examinationRoom.building} tầng ${examinationRoom.floor}`
  }

  useEffect(() => {
    fetchServiceOrder()
  }, [orderId, roomId])

  if (loading && !serviceOrder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!serviceOrder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Text type="danger">Không tìm thấy thông tin đơn xét nghiệm</Text>
          <div className="mt-4">
            <Button onClick={fetchServiceOrder}>Thử lại</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <main className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="text">
              Quay lại
            </Button>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Chi tiết đơn xét nghiệm #{serviceOrder.orderId}
              </Title>
              <Text type="secondary">Quản lý kết quả xét nghiệm</Text>
            </div>
          </div>

          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchServiceOrder} loading={loading}>
              Làm mới
            </Button>
            <Popconfirm
              title="Xóa đơn xét nghiệm"
              description="Bạn có chắc chắn muốn xóa đơn xét nghiệm này?"
              onConfirm={handleDelete}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />} loading={deleting}>
                Xóa đơn
              </Button>
            </Popconfirm>
          </Space>
        </div>

        <Row gutter={24}>
          {/* Left column - Service Order Info */}
          <Col span={8}>
            <Card title="Thông tin đơn xét nghiệm" className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ExperimentOutlined className="text-blue-600" />
                  <div>
                    <div className="font-medium">{serviceOrder.service?.serviceName}</div>
                    <div className="text-sm text-gray-500">Loại: {serviceOrder.service?.serviceType}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserOutlined className="text-green-600" />
                  <div>
                    <div className="font-medium">Cuộc hẹn #{serviceOrder.appointmentId}</div>
                    <div className="text-sm text-gray-500">{getRoomDisplayName()}</div>
                    {examinationRoom?.note && (
                      <div className="text-sm text-gray-500">Ghi chú: {examinationRoom.note}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarOutlined className="text-purple-600" />
                  <div>
                    <div className="font-medium">Thời gian đặt</div>
                    <div className="text-sm text-gray-500">{formatDateTime(serviceOrder.orderTime)}</div>
                  </div>
                </div>

                {serviceOrder.resultTime && (
                  <div className="flex items-center space-x-3">
                    <CalendarOutlined className="text-orange-600" />
                    <div>
                      <div className="font-medium">Thời gian trả kết quả</div>
                      <div className="text-sm text-gray-500">{formatDateTime(serviceOrder.resultTime)}</div>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <div className="text-sm text-gray-500 mb-1">Trạng thái hiện tại</div>
                  <span
                    style={{
                      color: getStatusColor(serviceOrder.orderStatus),
                      backgroundColor: `${getStatusColor(serviceOrder.orderStatus)}20`,
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: 500,
                    }}
                  >
                    {serviceOrder.orderStatus === "ORDERED" ? "Đang chờ" : "Đã hoàn thành"}
                  </span>
                </div>
              </div>
            </Card>

            {/* Patient Information Card */}
            {appointment?.patientInfo && (
              <Card title="Thông tin bệnh nhân" className="mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <UserOutlined className="text-blue-600" />
                    <div>
                      <div className="font-medium">{appointment.patientInfo.fullName}</div>
                      <div className="text-sm text-gray-500">Mã BN: {appointment.patientInfo.patientId}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Giới tính:</span>
                      <div className="font-medium">
                        {appointment.patientInfo.gender === "MALE"
                          ? "Nam"
                          : appointment.patientInfo.gender === "FEMALE"
                            ? "Nữ"
                            : "N/A"}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Ngày sinh:</span>
                      <div className="font-medium">
                        {appointment.patientInfo.birthday
                          ? new Date(appointment.patientInfo.birthday).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Chiều cao:</span>
                      <div className="font-medium">
                        {appointment.patientInfo.height ? `${appointment.patientInfo.height} cm` : "Chưa có"}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500">Cân nặng:</span>
                      <div className="font-medium">
                        {appointment.patientInfo.weight ? `${appointment.patientInfo.weight} kg` : "Chưa có"}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500 flex items-center">
                      <HomeOutlined className="mr-1" /> Địa chỉ:
                    </span>
                    <div className="font-medium mt-1">{appointment.patientInfo.address || "Chưa có thông tin"}</div>
                  </div>

                  <div className="text-sm">
                    <span className="text-gray-500">Dị ứng:</span>
                    <div className="font-medium mt-1">{appointment.patientInfo.allergies || "Không có"}</div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 flex items-center">
                        <PhoneOutlined className="mr-1" /> Số điện thoại:
                      </span>
                      <div className="font-medium">{appointment.patientInfo.phoneNumber || "Chưa có"}</div>
                    </div>

                    <div>
                      <span className="text-gray-500 flex items-center">
                        <MailOutlined className="mr-1" /> Email:
                      </span>
                      <div className="font-medium">{appointment.patientInfo.email || "Chưa có"}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">CMND/CCCD:</span>
                      <div className="font-medium">{appointment.patientInfo.identityNumber || "Chưa có"}</div>
                    </div>

                    <div>
                      <span className="text-gray-500">Số BHYT:</span>
                      <div className="font-medium">{appointment.patientInfo.insuranceNumber || "Chưa có"}</div>
                    </div>
                  </div>

                  {appointment.patientInfo.bloodType && (
                    <div className="text-sm">
                      <span className="text-gray-500">Nhóm máu:</span>
                      <div className="font-medium">{appointment.patientInfo.bloodType}</div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </Col>

          {/* Right column - Edit Form */}
          <Col span={16}>
            <Card title="Cập nhật kết quả xét nghiệm">
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên xét nghiệm" name="serviceName">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Loại xét nghiệm" name="serviceType">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Phòng xét nghiệm">
                      <Input value={getRoomDisplayName()} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Loại phòng">
                      <Input value={examinationRoom?.type === "TEST" ? "Phòng xét nghiệm" : "Phòng khám"} disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Thời gian đặt" name="orderTime">
                      <DatePicker showTime disabled style={{ width: "100%" }} format="DD/MM/YYYY HH:mm:ss" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thời gian trả kết quả" name="resultTime">
                      <DatePicker showTime disabled style={{ width: "100%" }} format="DD/MM/YYYY HH:mm:ss" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Trạng thái"
                  name="orderStatus"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                  <Select>
                    <Option value="ORDERED">Đang chờ</Option>
                    <Option value="COMPLETED">Đã hoàn thành</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Kết quả xét nghiệm"
                  name="result"
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (getFieldValue("orderStatus") === "COMPLETED" && !value) {
                          return Promise.reject(new Error("Vui lòng nhập kết quả khi đánh dấu hoàn thành!"))
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <TextArea rows={6} placeholder="Nhập kết quả xét nghiệm chi tiết..." />
                </Form.Item>

                <div className="flex justify-end space-x-4">
                  <Button onClick={handleBack}>Hủy</Button>
                  <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
                    Lưu kết quả
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  )
}

export default PatientDetail
