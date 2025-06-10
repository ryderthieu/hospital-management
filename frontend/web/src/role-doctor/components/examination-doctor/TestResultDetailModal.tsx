"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Button, Typography, Spin, message, Row, Col, Card, Tag } from "antd"
import { SaveOutlined, ReloadOutlined, ExperimentOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons"
import type { ServiceOrder } from "../../types/serviceOrder"
import type { ExaminationRoom } from "../../types/examinationRoom"
import type { Appointment } from "../../types/appointment"
import { updateServiceOrder } from "../../services/serviceOrderServices"
import { examinationRoomService } from "../../services/examinationRoomServices"
import { appointmentService } from "../../services/appointmentServices"

const { Title, Text } = Typography
const { TextArea } = Input

interface TestResultDetailModalProps {
  isOpen: boolean
  onClose: () => void
  serviceOrder: ServiceOrder | null
}

export const TestResultDetailModal: React.FC<TestResultDetailModalProps> = ({ isOpen, onClose, serviceOrder }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [examinationRoom, setExaminationRoom] = useState<ExaminationRoom | null>(null)

  // Fetch related data when modal opens
  useEffect(() => {
    const fetchRelatedData = async () => {
      if (!serviceOrder || !isOpen) return

      setLoading(true)
      try {
        // Fetch appointment data
        if (serviceOrder.appointmentId) {
          try {
            const appointmentData = await appointmentService.getAppointmentById(serviceOrder.appointmentId)
            setAppointment(appointmentData)
          } catch (error) {
            console.error("Error fetching appointment:", error)
          }
        }

        // Fetch examination room data
        if (serviceOrder.roomId) {
          try {
            const roomData = await examinationRoomService.getExaminationRoomById(serviceOrder.roomId)
            setExaminationRoom(roomData)
          } catch (error) {
            console.error("Error fetching room:", error)
          }
        }

        // Set form values
        form.setFieldsValue({
          result: serviceOrder.result || "",
          orderStatus: serviceOrder.orderStatus,
        })
      } catch (error) {
        console.error("Error fetching related data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedData()
  }, [serviceOrder, isOpen, form])

  const handleSave = async () => {
    if (!serviceOrder) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm")
      return
    }

    try {
      const values = await form.validateFields()
      setSaving(true)

      const updateData: Partial<ServiceOrder> = {
        ...serviceOrder,
        orderStatus: values.orderStatus || serviceOrder.orderStatus,
        result: values.result || "",
        resultTime: values.orderStatus === "COMPLETED" ? new Date().toISOString() : serviceOrder.resultTime,
      }

      await updateServiceOrder(serviceOrder.service.serviceId, serviceOrder.orderId, updateData as ServiceOrder)

      message.success("Cập nhật kết quả xét nghiệm thành công")
      onClose()
    } catch (error) {
      console.error("Error updating service order:", error)
      message.error("Có lỗi xảy ra khi cập nhật kết quả")
    } finally {
      setSaving(false)
    }
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

  const getServiceTypeColor = (serviceType: string) => {
    switch (serviceType) {
      case "TEST":
        return "blue"
      case "IMAGING":
        return "purple"
      case "CONSULTATION":
        return "green"
      default:
        return "default"
    }
  }

  const getServiceTypeText = (serviceType: string) => {
    switch (serviceType) {
      case "TEST":
        return "Xét nghiệm"
      case "IMAGING":
        return "Chẩn đoán hình ảnh"
      case "CONSULTATION":
        return "Tư vấn"
      default:
        return "Khác"
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
    if (!examinationRoom) return `Phòng ${serviceOrder?.roomId}`
    return `${examinationRoom.roomName} - ${examinationRoom.building} tầng ${examinationRoom.floor}`
  }

  if (!serviceOrder) {
    return null
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <ExperimentOutlined className="mr-2 text-blue-600" />
          <span>Chi tiết kết quả xét nghiệm</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {/* Service Order Information */}
          <Card className="mb-6" size="small">
            <Row gutter={24}>
              <Col span={12}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <ExperimentOutlined className="text-blue-600" />
                    <div>
                      <div className="font-medium text-lg">{serviceOrder.service?.serviceName}</div>
                      <Tag color={getServiceTypeColor(serviceOrder.service?.serviceType || "OTHER")}>
                        {getServiceTypeText(serviceOrder.service?.serviceType || "OTHER")}
                      </Tag>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <UserOutlined className="text-green-600" />
                    <div>
                      <div className="font-medium">Cuộc hẹn #{serviceOrder.appointmentId}</div>
                      <div className="text-sm text-gray-500">{getRoomDisplayName()}</div>
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
                </div>
              </Col>

              <Col span={12}>
                {/* Patient Information */}
                {appointment?.patientInfo && (
                  <div className="space-y-3">
                    <Title level={5} className="mb-3">
                      Thông tin bệnh nhân
                    </Title>
                    <div>
                      <Text strong>{appointment.patientInfo.fullName}</Text>
                      <div className="text-sm text-gray-500">Mã BN: {appointment.patientInfo.patientId}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
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
                    </div>
                    {appointment.patientInfo.allergies && (
                      <div className="text-sm">
                        <span className="text-gray-500">Dị ứng:</span>
                        <div className="font-medium text-red-600">{appointment.patientInfo.allergies}</div>
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>

            {/* Current Status */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <Text type="secondary">Trạng thái hiện tại:</Text>
                  <span
                    className="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      color: getStatusColor(serviceOrder.orderStatus),
                      backgroundColor: `${getStatusColor(serviceOrder.orderStatus)}20`,
                    }}
                  >
                    {serviceOrder.orderStatus === "ORDERED" ? "Đang chờ" : "Đã hoàn thành"}
                  </span>
                </div>
                <div className="text-right">
                  <Text type="secondary">Giá dịch vụ:</Text>
                  <div className="font-bold text-lg text-blue-600">
                    {serviceOrder.service?.price?.toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Result Form */}
          <Card title="Kết quả xét nghiệm" className="mb-6">
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
                label="Kết quả chi tiết"
                name="result"
                rules={[
                  {
                    required: serviceOrder.orderStatus === "COMPLETED",
                    message: "Vui lòng nhập kết quả xét nghiệm!",
                  },
                ]}
              >
                <TextArea
                  rows={8}
                  placeholder="Nhập kết quả xét nghiệm chi tiết..."
                  disabled={serviceOrder.orderStatus === "COMPLETED"}
                />
              </Form.Item>

              {serviceOrder.orderStatus === "ORDERED" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <Text type="warning">
                    <strong>Lưu ý:</strong> Xét nghiệm này đang trong trạng thái chờ kết quả. Bạn có thể cập nhật kết
                    quả khi đã có thông tin từ phòng xét nghiệm.
                  </Text>
                </div>
              )}

              {serviceOrder.orderStatus === "COMPLETED" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <Text type="success">
                    <strong>Hoàn thành:</strong> Kết quả xét nghiệm đã được cập nhật vào lúc{" "}
                    {formatDateTime(serviceOrder.resultTime)}
                  </Text>
                </div>
              )}
            </Form>
          </Card>

          {/* Room Information */}
          {examinationRoom && (
            <Card title="Thông tin phòng xét nghiệm" size="small" className="mb-6">
              <Row gutter={16}>
                <Col span={8}>
                  <Text type="secondary">Tên phòng:</Text>
                  <div className="font-medium">{examinationRoom.roomName}</div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Vị trí:</Text>
                  <div className="font-medium">
                    {examinationRoom.building} - Tầng {examinationRoom.floor}
                  </div>
                </Col>
                <Col span={8}>
                  <Text type="secondary">Loại phòng:</Text>
                  <div className="font-medium">
                    {examinationRoom.type === "TEST" ? "Phòng xét nghiệm" : "Phòng khám"}
                  </div>
                </Col>
              </Row>
              {examinationRoom.note && (
                <div className="mt-3">
                  <Text type="secondary">Ghi chú:</Text>
                  <div className="font-medium">{examinationRoom.note}</div>
                </div>
              )}
            </Card>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end space-x-3">
            <Button onClick={onClose}>Đóng</Button>
            {serviceOrder.orderStatus === "ORDERED" && (
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
                Cập nhật kết quả
              </Button>
            )}
            <Button icon={<ReloadOutlined />} onClick={() => window.location.reload()}>
              Làm mới
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
