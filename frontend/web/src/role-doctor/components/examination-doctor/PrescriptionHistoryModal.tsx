"use client"

import type React from "react"
import { Modal, Typography, Row, Col, Divider, Table } from "antd"
import { CalendarOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons"
import type { Prescription } from "../../types/prescription"
import { PrescriptionPDF } from "./PrescriptionPDF"
import type { PatientInfo } from "../../types/patient"

const { Text, Title } = Typography

interface PrescriptionHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  prescription: Prescription | null
  patientName?: string
  patientInfo?: PatientInfo
}

export const PrescriptionHistoryModal: React.FC<PrescriptionHistoryModalProps> = ({
  isOpen,
  onClose,
  prescription,
  patientName,
  patientInfo
}) => {
  if (!prescription) return null
  

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  // Columns for prescription details table
  const columns = [
    {
      title: "Tên thuốc",
      dataIndex: ["medicine", "medicineName"],
      key: "medicineName",
      render: (text: string, record: any) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.medicine.category}</div>
          <div className="text-xs text-gray-400">
            {record.medicine.price.toLocaleString("vi-VN")} VNĐ/
            {record.medicine.unit}
          </div>
        </div>
      ),
    },
    {
      title: "Liều lượng",
      dataIndex: "dosage",
      key: "dosage",
      width: 100,
      render: (text: string, record: any) => (
        <div className="text-center">
          <div className="font-medium">{text}</div>
        </div>
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      key: "unit",
      width: 70,
      render: (text: string, record: any) => (
        <div className="text-left">
          <div className="font-medium">{record.medicine.unit}</div>
        </div>
      ),
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      width: 200,
    },
    {
      title: "Cách dùng",
      dataIndex: "prescriptionNotes",
      key: "prescriptionNotes",
      width: 150,
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      render: (text: string) => <div className="text-center">{text}</div>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (text: string, record: any) => (
        <div className="text-center">
          <div className="font-medium">{text}</div>
        </div>
      ),
    },
  ]

  return (
    <Modal title="Chi tiết đơn thuốc" open={isOpen} onCancel={onClose} footer={null} width={1200} style={{ top: 20 }}>
      <div className="max-h-[80vh] overflow-y-auto">
        {/* Header Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <Row gutter={24}>
            <Col span={12}>
              <div className="mb-3">
                <Text type="secondary">
                  <CalendarOutlined className="mr-2" />
                  Ngày kê đơn:
                </Text>
                <Text strong className="ml-2">
                  {formatDateTime(prescription.createdAt)}
                </Text>
              </div>
              <div className="mb-3">
                <Text type="secondary">
                  <UserOutlined className="mr-2" />
                  Mã bệnh nhân:
                </Text>
                <Text strong className="ml-2">
                  {prescription.patientId}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-3">
                <Text type="secondary">
                  <FileTextOutlined className="mr-2" />
                  Mã đơn thuốc:
                </Text>
                <Text strong className="ml-2">
                  {prescription.prescriptionId}
                </Text>
              </div>
              <div className="mb-3">
                <Text type="secondary">
                  <CalendarOutlined className="mr-2" />
                  Hẹn tái khám:
                </Text>
                <Text strong className="ml-2">
                  {prescription.followUpDate ? prescription.followUpDate.split("-").reverse().join("-") : "Không"}
                </Text>
              </div>
            </Col>
          </Row>
        </div>

        {/* PDF Actions */}
        {/* <div className="mb-6 flex justify-end gap-2">
          <PrescriptionPDF
            prescription={prescription}
            patientName={patientName}
            showControls={true}
            className="inline-block"
          />
        </div> */}

        {/* Vital Signs */}
        <div className="mb-6">
          <Title level={5} className="mb-3">
            Sinh hiệu
          </Title>
          <Row gutter={16}>
            <Col span={6}>
              <div className="text-center p-3 bg-blue-50 rounded">
                <div className="text-sm text-gray-500">Huyết áp tâm thu</div>
                <div className="text-lg font-semibold text-blue-600">{prescription.systolicBloodPressure}</div>
                <div className="text-xs text-gray-400">mmHg</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center p-3 bg-green-50 rounded">
                <div className="text-sm text-gray-500">Huyết áp tâm trương</div>
                <div className="text-lg font-semibold text-green-600">{prescription.diastolicBloodPressure}</div>
                <div className="text-xs text-gray-400">mmHg</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-sm text-gray-500">Nhịp tim</div>
                <div className="text-lg font-semibold text-red-600">{prescription.heartRate}</div>
                <div className="text-xs text-gray-400">bpm</div>
              </div>
            </Col>
            <Col span={6}>
              <div className="text-center p-3 bg-yellow-50 rounded">
                <div className="text-sm text-gray-500">Đường huyết</div>
                <div className="text-lg font-semibold text-yellow-600">{prescription.bloodSugar}</div>
                <div className="text-xs text-gray-400">mg/dL</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Diagnosis and Notes */}
        <div className="mb-6">
          <Row gutter={24}>
            <Col span={12}>
              <Title level={5} className="mb-3">
                Chẩn đoán
              </Title>
              <div className="p-3 bg-gray-50 rounded min-h-[100px]">
                <Text>{prescription.diagnosis}</Text>
              </div>
            </Col>
            <Col span={12}>
              <Title level={5} className="mb-3">
                Ghi chú của bác sĩ
              </Title>
              <div className="p-3 bg-gray-50 rounded min-h-[100px]">
                <Text>{prescription.note || "Không có ghi chú"}</Text>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Prescription Details */}
        <div className="mb-6">
          <Title level={5} className="mb-3">
            Chi tiết đơn thuốc
          </Title>
          <Table
            columns={columns}
            dataSource={prescription.prescriptionDetails}
            rowKey="detailId"
            pagination={false}
            size="small"
            className="border border-gray-200 rounded"
          />
        </div>

        {/* Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <Row gutter={24}>
            <Col span={12}>
              <Text strong>Tổng số loại thuốc: </Text>
              <Text className="text-blue-600">{prescription.prescriptionDetails.length} loại</Text>
            </Col>
            <Col span={12}>
              <Text strong>Tổng giá trị đơn thuốc: </Text>
              <Text className="text-blue-600">
                {prescription.prescriptionDetails
                  .reduce((total, detail) => total + detail.medicine.price * Number(detail.quantity), 0)
                  .toLocaleString("vi-VN")}{" "}
                VNĐ
              </Text>
            </Col>
          </Row>
        </div>

        {/* Hidden PDF Component for generation */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
          <PrescriptionPDF prescription={prescription} patientName={patientName} patientInfo={patientInfo} showControls={false} />
        </div>
      </div>
    </Modal>
  )
}
