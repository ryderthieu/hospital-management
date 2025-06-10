"use client"

import type React from "react"
import { useState } from "react"
import { Card, Typography, Dropdown, Button, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import type { MenuProps } from "antd"

const { Text } = Typography

interface PatientStatusSectionProps {
  roomNumber?: string | number
  initialTestingStatus?: string
  initialAppointmentStatus?: string
  onTestingStatusChange?: (status: string) => void
  onAppointmentStatusChange?: (status: string) => void
}

export const PatientStatusSection: React.FC<PatientStatusSectionProps> = ({
  roomNumber = "305",
  initialTestingStatus = "Đang xét nghiệm",
  initialAppointmentStatus = "Đang khám",
  onTestingStatusChange,
  onAppointmentStatusChange,
}) => {
  const [testingStatus, setTestingStatus] = useState(initialTestingStatus)
  const [appointmentStatus, setAppointmentStatus] = useState(initialAppointmentStatus)

  // Options for testing status dropdown
  const testingOptions: string[] = ["Chưa có chỉ định", "Đang xét nghiệm", "Chờ kết quả", "Đã có kết quả"]

  // Options for appointment status dropdown
  const appointmentOptions: string[] = ["Đang chờ", "Đang khám", "Hoàn thành", "Đã hủy"]

  const handleTestingStatusChange: MenuProps["onClick"] = ({ key }) => {
    const newStatus = key as string
    setTestingStatus(newStatus)
    if (onTestingStatusChange) {
      onTestingStatusChange(newStatus)
    }
  }

  const handleAppointmentStatusChange: MenuProps["onClick"] = ({ key }) => {
    const newStatus = key as string
    setAppointmentStatus(newStatus)
    if (onAppointmentStatusChange) {
      onAppointmentStatusChange(newStatus)
    }
  }

  const testingItems: MenuProps["items"] = testingOptions.map((option) => ({
    key: option,
    label: option,
  }))

  const appointmentItems: MenuProps["items"] = appointmentOptions.map((option) => ({
    key: option,
    label: option,
  }))

  return (
    <Card title="Trạng thái hiện tại" size="small" className="w-64">
      <div className="mb-3">
        <Text type="secondary">Phòng bệnh số:</Text>
        <div className="bg-base-100 rounded py-2 px-4 mt-1 flex items-center">
          <div className="w-3 h-3 bg-base-700 rounded-full mr-2"></div>
          <Text strong>{roomNumber}</Text>
        </div>
      </div>

      <div className="mb-3">
        <Text type="secondary">Trạng thái xét nghiệm:</Text>
        <Dropdown menu={{ items: testingItems, onClick: handleTestingStatusChange }} trigger={["click"]}>
          <Button className="bg-base-100 rounded py-1 px-4 mt-1 flex items-center justify-between w-full">
            <Space>
              <div className="w-3 h-3 bg-base-700 rounded-full"></div>
              <Text strong>{testingStatus}</Text>
            </Space>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>

      <div>
        <Text type="secondary">Trạng thái cuộc hẹn:</Text>
        <Dropdown menu={{ items: appointmentItems, onClick: handleAppointmentStatusChange }} trigger={["click"]}>
          <Button className="bg-base-100 rounded py-1 px-4 mt-1 flex items-center justify-between w-full">
            <Space>
              <div className="w-3 h-3 bg-base-700 rounded-full"></div>
              <Text strong>{appointmentStatus}</Text>
            </Space>
            <DownOutlined />
          </Button>
        </Dropdown>
      </div>
    </Card>
  )
}
