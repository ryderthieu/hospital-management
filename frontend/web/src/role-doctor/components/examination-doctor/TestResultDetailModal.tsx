"use client"

import type React from "react"
import { Modal, Typography, Row, Col, Divider, Table, Tag } from "antd"
import { CalendarOutlined, UserOutlined, FileTextOutlined, ClockCircleOutlined } from "@ant-design/icons"
import type { ServiceOrder } from "../../types/serviceOrder"

const { Text, Title } = Typography

interface TestResultDetailModalProps {
  isOpen: boolean
  onClose: () => void
  serviceOrder: ServiceOrder | null
}

export const TestResultDetailModal: React.FC<TestResultDetailModalProps> = ({ isOpen, onClose, serviceOrder }) => {
  if (!serviceOrder) return null

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Không có dữ liệu"
    try {
      return new Date(dateString).toLocaleString("vi-VN")
    } catch (e) {
      return "Định dạng không hợp lệ"
    }
  }

  const getStatusColor = (status?: string) => {
    if (!status) return "default"

    switch (status) {
      case "COMPLETED":
        return "green"
      case "ORDERED":
        return "blue"
      default:
        return "default"
    }
  }

  const getStatusText = (status?: string) => {
    if (!status) return "Không xác định"

    switch (status) {
      case "COMPLETED":
        return "Đã hoàn thành"
      case "ORDERED":
        return "Đã đặt"
      default:
        return status
    }
  }

  // Mock detailed test results - in real app, this would come from API
  const detailedResults = [
    {
      parameter: "Hemoglobin",
      value: "14.2",
      unit: "g/dL",
      normalRange: "12.0 - 16.0",
      status: "Bình thường",
    },
    {
      parameter: "Hematocrit",
      value: "42.1",
      unit: "%",
      normalRange: "36.0 - 46.0",
      status: "Bình thường",
    },
    {
      parameter: "White Blood Cells",
      value: "8.5",
      unit: "10³/μL",
      normalRange: "4.0 - 11.0",
      status: "Bình thường",
    },
    {
      parameter: "Platelets",
      value: "285",
      unit: "10³/μL",
      normalRange: "150 - 450",
      status: "Bình thường",
    },
    {
      parameter: "Glucose",
      value: "95",
      unit: "mg/dL",
      normalRange: "70 - 100",
      status: "Bình thường",
    },
  ]

  const columns = [
    {
      title: "Chỉ số",
      dataIndex: "parameter",
      key: "parameter",
      width: "25%",
    },
    {
      title: "Giá trị",
      dataIndex: "value",
      key: "value",
      width: "15%",
      render: (text: string, record: any) => (
        <div>
          <span className="font-medium">{text}</span>
          <span className="text-gray-500 ml-1">{record.unit}</span>
        </div>
      ),
    },
    {
      title: "Khoảng bình thường",
      dataIndex: "normalRange",
      key: "normalRange",
      width: "25%",
      render: (text: string, record: any) => (
        <div>
          <span>{text}</span>
          <span className="text-gray-500 ml-1">{record.unit}</span>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "20%",
      render: (status: string) => (
        <Tag color={status === "Bình thường" ? "green" : status === "Cao" ? "red" : "orange"}>{status}</Tag>
      ),
    },
  ]

  return (
    <Modal
      title="Chi tiết kết quả xét nghiệm"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      style={{ top: 20 }}
    >
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <Row gutter={24}>
            <Col span={12}>
              <div className="mb-3">
                <Text type="secondary">
                  <FileTextOutlined className="mr-2" />
                  Tên dịch vụ:
                </Text>
                <div>
                  <Text strong>{serviceOrder.service?.serviceName || "Không có tên"}</Text>
                </div>
              </div>
              <div className="mb-3">
                <Text type="secondary">
                  <UserOutlined className="mr-2" />
                  Loại dịch vụ:
                </Text>
                <div>
                  <Text strong>{serviceOrder.service?.serviceType || "Không xác định"}</Text>
                </div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Phòng thực hiện:</Text>
                <div>
                  <Text strong>Phòng {serviceOrder.roomId || "N/A"}</Text>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-3">
                <Text type="secondary">
                  <CalendarOutlined className="mr-2" />
                  Thời gian đặt:
                </Text>
                <div>
                  <Text strong>{formatDateTime(serviceOrder.orderTime)}</Text>
                </div>
              </div>
              <div className="mb-3">
                <Text type="secondary">
                  <ClockCircleOutlined className="mr-2" />
                  Thời gian trả kết quả:
                </Text>
                <div>
                  <Text strong>{serviceOrder.resultTime ? formatDateTime(serviceOrder.resultTime) : "Chưa có"}</Text>
                </div>
              </div>
              <div className="mb-3">
                <Text type="secondary">Trạng thái:</Text>
                <div>
                  <Tag color={getStatusColor(serviceOrder.orderStatus)}>{getStatusText(serviceOrder.orderStatus)}</Tag>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Service Information */}
        <div className="mb-6">
          <Title level={5} className="mb-3">
            Thông tin dịch vụ
          </Title>
          <Row gutter={16}>
            <Col span={8}>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-sm text-gray-500">Mã đơn</div>
                <div className="text-lg font-semibold text-blue-600">#{serviceOrder.orderId || "N/A"}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-sm text-gray-500">Số thứ tự</div>
                <div className="text-lg font-semibold text-green-600">{serviceOrder.number || "N/A"}</div>
              </div>
            </Col>
            <Col span={8}>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-sm text-gray-500">Giá dịch vụ</div>
                <div className="text-lg font-semibold text-yellow-600">
                  {serviceOrder.service?.price ? serviceOrder.service.price.toLocaleString("vi-VN") : "0"} VNĐ
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Main Result */}
        {serviceOrder.result && (
          <div className="mb-6">
            <Title level={5} className="mb-3">
              Kết luận chung
            </Title>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Text>{serviceOrder.result}</Text>
            </div>
          </div>
        )}

        <Divider />

        {/* Detailed Results */}
        {serviceOrder.orderStatus === "COMPLETED" && (
          <div className="mb-6">
            <Title level={5} className="mb-3">
              Chi tiết kết quả
            </Title>
            <Table
              columns={columns}
              dataSource={detailedResults}
              rowKey="parameter"
              pagination={false}
              size="small"
              className="border border-gray-200 rounded"
            />
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <Title level={5} className="mb-3">
            Ghi chú
          </Title>
          <div className="p-4 bg-blue-50 rounded-lg">
            <Text>
              {serviceOrder.orderStatus === "COMPLETED"
                ? "Kết quả xét nghiệm trong giới hạn bình thường. Bệnh nhân nên duy trì chế độ ăn uống và tập luyện hợp lý."
                : "Đang chờ kết quả xét nghiệm. Vui lòng quay lại sau để xem kết quả chi tiết."}
            </Text>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <Row gutter={24}>
            <Col span={12}>
              <Text strong>Tổng số chỉ số: </Text>
              <Text className="text-blue-600">{detailedResults.length} chỉ số</Text>
            </Col>
            <Col span={12}>
              <Text strong>Trạng thái tổng quan: </Text>
              <Text className="text-blue-600">
                {serviceOrder.orderStatus === "COMPLETED" ? "Hoàn thành" : "Đang xử lý"}
              </Text>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  )
}
