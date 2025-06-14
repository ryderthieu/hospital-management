"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Button, Typography, Spin, message, Row, Col, Card } from "antd"
import {
  SaveOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons"
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

  // Cache for API responses
  const appointmentCache = new Map<number, Appointment>()
  const roomCache = new Map<number, ExaminationRoom>()

  // Fetch related data when modal opens
  useEffect(() => {
    let isMounted = true
    const fetchRelatedData = async () => {
      if (!serviceOrder || !isOpen) return

      setLoading(true)
      try {
        // Parallel data fetching with caching
        const fetchPromises = []

        // Fetch appointment data if not cached
        if (serviceOrder.appointmentId && !appointmentCache.has(serviceOrder.appointmentId)) {
          fetchPromises.push(
            appointmentService
              .getAppointmentById(serviceOrder.appointmentId)
              .then((data) => {
                if (isMounted) {
                  appointmentCache.set(serviceOrder.appointmentId!, data)
                  setAppointment(data)
                }
              })
              .catch((error) => {
                console.error("Error fetching appointment:", error)
                if (isMounted) setAppointment(null)
              }),
          )
        } else if (serviceOrder.appointmentId) {
          // Use cached data
          setAppointment(appointmentCache.get(serviceOrder.appointmentId))
        }

        // Fetch examination room data if not cached
        if (serviceOrder.roomId && !roomCache.has(serviceOrder.roomId)) {
          fetchPromises.push(
            examinationRoomService
              .getExaminationRoomById(serviceOrder.roomId)
              .then((data) => {
                if (isMounted) {
                  roomCache.set(serviceOrder.roomId!, data)
                  setExaminationRoom(data)
                }
              })
              .catch((error) => {
                console.error("Error fetching room:", error)
                if (isMounted) setExaminationRoom(null)
              }),
          )
        } else if (serviceOrder.roomId) {
          // Use cached data
          setExaminationRoom(roomCache.get(serviceOrder.roomId))
        }

        // Wait for all promises to resolve
        await Promise.all(fetchPromises)

        // Set form values
        if (isMounted) {
          form.setFieldsValue({
            result: serviceOrder.result || "",
            orderStatus: serviceOrder.orderStatus,
          })
        }
      } catch (error) {
        console.error("Error fetching related data:", error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchRelatedData()

    return () => {
      isMounted = false
    }
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
    return `${examinationRoom.note} - Tòa ${examinationRoom.building} - Tầng ${examinationRoom.floor}`
  }

  if (!serviceOrder) {
    return null
  }

  return (
    <Modal
      title={
        <div className="flex items-center">
          <span>Chi tiết kết quả thực hiện chỉ định</span>
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
                  <Title level={5} style={{ color: "#036672" }}>
                    Thông tin chỉ định
                  </Title>
                  <div className="flex items-center space-x-3">
                    <ExperimentOutlined />
                    <div>
                      <span className="font-medium text-lg">{serviceOrder.serviceName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <EnvironmentOutlined />
                    <div>
                      <div className="font-medium">{getRoomDisplayName()}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <CalendarOutlined />
                    <div>
                      <div className="font-medium">Thời gian đặt</div>
                      <div className="text-sm text-gray-500">{formatDateTime(serviceOrder.orderTime)}</div>
                    </div>
                  </div>

                  {serviceOrder.resultTime && (
                    <div className="flex items-center space-x-3">
                      <CalendarOutlined />
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
                    <Title level={5} style={{ color: "#036672" }}>
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
                        <div className="font-medium">{appointment.patientInfo.allergies}</div>
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
                    {serviceOrder?.price.toLocaleString("vi-VN")} VNĐ
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Result Form */}
          <Card title={<div style={{ color: "#036672" }}>Kết quả</div>}>
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item
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
