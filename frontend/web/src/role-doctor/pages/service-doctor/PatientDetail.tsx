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
  Upload,
} from "antd"
import { SaveOutlined, ArrowLeftOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined } from "@ant-design/icons"
import type { ServiceOrder } from "../../types/serviceOrder"
import type { ExaminationRoom } from "../../types/examinationRoom"
import { getServiceOrderById, updateServiceOrder, deleteServiceOrder } from "../../services/serviceOrderServices"
import type { Appointment } from "../../types/appointment"
import dayjs from "dayjs"
import { api } from "../../../services/api"
import { useServiceOrderContext } from "../../contexts/ServiceOrderContext"

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const PatientDetail: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [examinationRoom, setExaminationRoom] = useState<ExaminationRoom | null>(null)

  const [currentServiceOrder, setCurrentServiceOrder] = useState<ServiceOrder | null>(null)

  const { updateServiceOrderInContext } = useServiceOrderContext()

  const { orderId, roomId, appointmentData, roomData, serviceOrder } = location.state || {}

  useEffect(() => {
    if (serviceOrder) {
      setCurrentServiceOrder(serviceOrder)
      setAppointment(appointmentData)
      setExaminationRoom(roomData)

      form.setFieldsValue({
        serviceName: serviceOrder?.serviceName || "",
        orderStatus: serviceOrder?.orderStatus,
        result: serviceOrder?.result
          ? [
              {
                uid: "existing_result",
                name: serviceOrder.result.split("/").pop() || "result.pdf",
                status: "done",
                url: serviceOrder.result,
              },
            ]
          : [],
        orderTime: serviceOrder?.orderTime ? dayjs(serviceOrder.orderTime) : null,
        resultTime: serviceOrder?.resultTime ? dayjs(serviceOrder.resultTime) : null,
      })
    }
  }, [serviceOrder, appointmentData, roomData, form])

  const fetchServiceOrder = async () => {
    if (!orderId || !roomId) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm")
      return
    }

    setLoading(true)
    try {
      const freshServiceOrder = await getServiceOrderById(roomId, orderId)
      setCurrentServiceOrder(freshServiceOrder)

      form.setFieldsValue({
        serviceName: freshServiceOrder?.serviceName || "",
        orderStatus: freshServiceOrder?.orderStatus,
        result: freshServiceOrder?.result
          ? [
              {
                uid: "existing_result",
                name: freshServiceOrder.result.split("/").pop() || "result.pdf",
                status: "done",
                url: freshServiceOrder.result,
              },
            ]
          : [],
        orderTime: freshServiceOrder?.orderTime ? dayjs(freshServiceOrder.orderTime) : null,
        resultTime: freshServiceOrder?.resultTime ? dayjs(freshServiceOrder.resultTime) : null,
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

      if (!currentServiceOrder) {
        message.error("Không tìm thấy thông tin đơn xét nghiệm")
        return
      }

      setSaving(true)

      let finalResultUrl = currentServiceOrder.result || ""

      const fileList = values.result
      const isNewFileUpload = fileList.length > 0 && fileList[0].originFileObj
      const isExistingFileRemoved = currentServiceOrder.result && fileList.length === 0

      if (isNewFileUpload) {
        const file = fileList[0].originFileObj
        const formData = new FormData()
        formData.append("file", file)

        try {
          message.loading("Đang tải lên tệp PDF...", 0)
          const response = await api.post(
            `appointments/services/service-orders/${currentServiceOrder.orderId}/result`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          )

          finalResultUrl = response.data.result
          message.destroy()
          message.success("Tải lên tệp PDF thành công!")
        } catch (uploadError: any) {
          message.destroy()
          console.error("Lỗi khi tải lên tệp PDF:", uploadError)
          let errorMessage = "Lỗi không xác định"
          if (uploadError.response && uploadError.response.data && uploadError.response.data.message) {
            errorMessage = uploadError.response.data.message
          } else if (uploadError.message) {
            errorMessage = uploadError.message
          }
          message.error(`Tải lên tệp PDF thất bại: ${errorMessage}`)
          setSaving(false)
          return
        }
      } else if (isExistingFileRemoved) {
        finalResultUrl = ""
      }

      const localDateTime = dayjs().format("YYYY-MM-DDTHH:mm:ss")

      const updateData: Partial<ServiceOrder> = {
        ...currentServiceOrder,
        orderStatus: form.getFieldValue("orderStatus"),
        result: finalResultUrl,
        resultTime: form.getFieldValue("orderStatus") === "COMPLETED" ? localDateTime : currentServiceOrder.resultTime,
      }

      const updatedOrder = await updateServiceOrder(currentServiceOrder.serviceId, orderId, updateData as ServiceOrder)

      // Update context with new data
      updateServiceOrderInContext(updatedOrder)

      message.success("Cập nhật kết quả xét nghiệm thành công")

      // Update local state
      setCurrentServiceOrder(updatedOrder)
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn xét nghiệm:", error)
      message.error("Có lỗi xảy ra khi cập nhật kết quả")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!currentServiceOrder) {
      message.error("Không tìm thấy thông tin đơn xét nghiệm")
      return
    }

    setDeleting(true)
    try {
      await deleteServiceOrder(currentServiceOrder.service.serviceId, orderId)
      message.success("Xóa đơn xét nghiệm thành công")
      navigate(-1)
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
    return `${examinationRoom.note} - Tòa ${examinationRoom.building}, Tầng ${examinationRoom.floor}`
  }

  const handleDownloadFile = (url: string, fileName: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && !currentServiceOrder) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (!currentServiceOrder) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Chi tiết đơn xét nghiệm #{currentServiceOrder.orderId}
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
          <Col span={8}>
            {appointment?.patientInfo && (
              <div className="flex-[400px] p-6 bg-white rounded-2xl border border-gray-200">
                <div className="flex flex-row justify-between items-center mb-6">
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={
                        appointment.patientInfo.avatar ||
                        "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-440x512-ni4kvfm4.png" ||
                        "/placeholder.svg"
                      }
                      alt="Patient"
                      className="w-24 h-24 rounded-full mb-3"
                    />
                    <p className="text-black font-semibold text-xl">{appointment.patientInfo.fullName}</p>
                    <p className="text-gray-600">Mã bệnh nhân: {appointment.patientInfo.patientId}</p>
                    <p className="text-gray-600">
                      {appointment.patientInfo.gender === "MALE"
                        ? "Nam"
                        : appointment.patientInfo.gender === "FEMALE"
                          ? "Nữ"
                          : "N/A"}
                      ,{" "}
                      {appointment.patientInfo.birthday
                        ? new Date().getFullYear() - new Date(appointment.patientInfo.birthday).getFullYear()
                        : "N/A"}{" "}
                      tuổi
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base-700 font-medium">Thông tin cá nhân</h3>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="w-[200px] py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Địa chỉ</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.address || "Không có"}</p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">CMND/CCCD</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.identityNumber || "Không có"}</p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Ngày sinh</span>
                      </div>
                      <p className="text-black text-sm">
                        {appointment.patientInfo.birthday
                          ? new Date(appointment.patientInfo.birthday).toLocaleDateString("vi-VN")
                          : "N/A"}
                      </p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">Số BHYT</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.insuranceNumber || "Không có"}</p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Chiều cao (cm)</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.height || "Chưa có dữ liệu"}</p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">Cân nặng (kg)</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.weight || "Không xác định"}</p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Nhóm máu</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.bloodType || "Không xác định"}</p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">Dị ứng</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.allergies || "Không xác định"}</p>
                    </div>

                    <div className="py-2">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm">Số điện thoại</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.phoneNumber || "Chưa có"}</p>
                    </div>

                    <div className="py-2 text-right">
                      <div className="mb-1">
                        <span className="text-gray-500 text-sm w-full text-right">Email</span>
                      </div>
                      <p className="text-black text-sm">{appointment.patientInfo.email || "Chưa có"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>

          <Col span={16}>
            <Card title="Cập nhật kết quả xét nghiệm">
              <Form form={form} layout="vertical" onFinish={handleSave}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Tên xét nghiệm" name="serviceName">
                      <Input disabled style={{ color: "black" }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Nơi thực hiện">
                      <Input value={getRoomDisplayName()} disabled style={{ color: "black" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="Thời gian đặt" name="orderTime">
                      <DatePicker
                        showTime
                        disabled
                        className="custom-disabled-picker"
                        style={{ width: "100%" }}
                        format="HH:mm DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Thời gian trả kết quả" name="resultTime">
                      <DatePicker
                        placeholder="Chưa có kết quả"
                        showTime
                        disabled
                        className="custom-disabled-picker"
                        style={{ width: "100%" }}
                        format="HH:mm DD/MM/YYYY"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Trạng thái"
                  name="orderStatus"
                  rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
                >
                  <Select style={{ width: "180px" }}>
                    <Option value="ORDERED">Đang chờ</Option>
                    <Option value="COMPLETED">Đã hoàn thành</Option>
                  </Select>
                </Form.Item>

                {/* Hiển thị file hiện tại nếu có */}
                {currentServiceOrder?.result && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-2">📄</span>
                        <Text strong className="text-blue-800">
                          File kết quả hiện tại: {currentServiceOrder.result.split("/").pop() || "result.pdf"}
                        </Text>
                      </div>
                      <Space>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => window.open(currentServiceOrder.result, "_blank")}
                        >
                          Xem
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          onClick={() =>
                            handleDownloadFile(
                              currentServiceOrder.result!,
                              currentServiceOrder.result!.split("/").pop() || "result.pdf",
                            )
                          }
                        >
                          Tải xuống
                        </Button>
                      </Space>
                    </div>
                  </div>
                )}

                <Form.Item
                  label="Kết quả xét nghiệm"
                  name="result"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e
                    return e?.fileList || []
                  }}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const orderStatus = getFieldValue("orderStatus")
                        const hasFile = Array.isArray(value) && value.length > 0

                        if (orderStatus === "COMPLETED" && !hasFile) {
                          return Promise.reject(new Error("Vui lòng tải lên kết quả PDF khi đánh dấu hoàn thành!"))
                        }
                        return Promise.resolve()
                      },
                    }),
                  ]}
                >
                  <Upload
                    beforeUpload={(file) => {
                      const isPdf = file.type === "application/pdf"
                      if (!isPdf) {
                        message.error("Chỉ được phép tải lên tệp PDF!")
                      }
                      return isPdf ? true : Upload.LIST_IGNORE
                    }}
                    maxCount={1}
                    accept=".pdf"
                    listType="text"
                    onPreview={(file) => {
                      // Mở file trong tab mới
                      if (file.url) {
                        window.open(file.url, "_blank")
                      }
                    }}
                    onDownload={(file) => {
                      // Download file
                      if (file.url) {
                        handleDownloadFile(file.url, file.name || "result.pdf")
                      }
                    }}
                    onRemove={(file) => {
                      form.setFieldsValue({ result: [] })
                      return true
                    }}
                    showUploadList={{
                      showPreviewIcon: true,
                      showDownloadIcon: true,
                      showRemoveIcon: true,
                    }}
                  >
                    <Button icon={<UploadOutlined />}>
                      {form.getFieldValue("result")?.length > 0 ? "Thay đổi file PDF" : "Tải lên file PDF"}
                    </Button>
                  </Upload>
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
