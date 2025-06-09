"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, Table, Typography, message } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { useMedicalOrderModal } from "../../hooks/useServiceOrder"
import type { Service } from "../../types/services"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId?: number
}

interface MedicalOrderItem {
  id: string
  serviceId: number
  serviceName: string
  serviceType: string
  room: string
  expectedTime: string
}

export const MedicalOrderModal: React.FC<ModalProps> = ({ isOpen, onClose, appointmentId }) => {
  const { services, loading, createServiceOrder } = useMedicalOrderModal(appointmentId)
  const [indications, setIndications] = useState<MedicalOrderItem[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [filteredServices, setFilteredServices] = useState<Service[]>([])

  useEffect(() => {
    if (searchInput) {
      const filtered = services.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(searchInput.toLowerCase()) ||
          service.serviceType.toLowerCase().includes(searchInput.toLowerCase()),
      )
      setFilteredServices(filtered)
    } else {
      setFilteredServices(services)
    }
  }, [searchInput, services])

  const addIndication = (service: Service) => {
    const newIndication: MedicalOrderItem = {
      id: Date.now().toString(),
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      room: "CT-Scan [01]",
      expectedTime: "30 phút",
    }
    setIndications((prev) => [...prev, newIndication])
  }

  const updateField = (index: number, field: keyof MedicalOrderItem, value: any) => {
    setIndications((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const deleteIndication = (index: number) => {
    setIndications((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!appointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn")
      return
    }

    try {
      // Create service orders for each indication
      for (const indication of indications) {
        const roomId = Number.parseInt(indication.room.match(/\[(\d+)\]/)?.[1] || "1")
        await createServiceOrder(indication.serviceId, roomId)
      }

      // Clear indications and close modal
      setIndications([])
      message.success("Lưu chỉ định thành công")
      onClose()
    } catch (error) {
      message.error("Không thể lưu chỉ định")
    }
  }

  const columns = [
    {
      title: "Chỉ định",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text: string, record: MedicalOrderItem) => (
        <div>
          <div className="font-medium">{text}</div>
          <div className="text-sm text-gray-500">{record.serviceType}</div>
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "room",
      key: "room",
      width: 200,
      render: (text: string, record: MedicalOrderItem, index: number) => (
        <Select
          value={text}
          onChange={(value) => updateField(index, "room", value)}
          style={{ width: "100%" }}
          options={[
            { value: "CT-Scan [01]", label: "CT-Scan [01]" },
            { value: "CT-Scan [02]", label: "CT-Scan [02]" },
            { value: "MRI [01]", label: "MRI [01]" },
            { value: "MRI [02]", label: "MRI [02]" },
            { value: "X-Ray [01]", label: "X-Ray [01]" },
            { value: "X-Ray [02]", label: "X-Ray [02]" },
            { value: "Blood Test [01]", label: "Blood Test [01]" },
            { value: "Blood Test [02]", label: "Blood Test [02]" },
          ]}
        />
      ),
    },
    {
      title: "Thời gian dự kiến",
      dataIndex: "expectedTime",
      key: "expectedTime",
      width: 200,
      render: (text: string, record: MedicalOrderItem, index: number) => (
        <Input value={text} onChange={(e) => updateField(index, "expectedTime", e.target.value)} className="w-full" />
      ),
    },
    {
      title: "",
      key: "action",
      width: 70,
      render: (_: any, record: MedicalOrderItem, index: number) => (
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteIndication(index)} />
      ),
    },
  ]

  return (
    <Modal title="Thêm chỉ định" open={isOpen} onCancel={onClose} footer={null} width={1000}>
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <Text strong>Bệnh nhân: Trần Nhật Trường</Text>
            <div>
              <Text type="secondary">Mã bệnh nhân: BN22521584</Text>
            </div>
          </div>
          <div className="text-right">
            <Text strong>Ngày: {new Date().toLocaleDateString("vi-VN")}</Text>
            <div>
              <Text type="secondary">
                Giờ: {new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <Input
            placeholder="Tìm dịch vụ..."
            prefix={<SearchOutlined />}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-80"
          />
          <Button type="primary" icon={<PlusOutlined />} className="ml-3">
            Thêm chỉ định
          </Button>
          <Button icon={<EyeOutlined />} className="ml-3">
            Xem chỉ định
          </Button>
        </div>

        {/* Available Services */}
        {searchInput && (
          <div className="mb-4 max-h-40 overflow-y-auto border rounded p-2">
            <Text strong className="block mb-2">
              Dịch vụ có sẵn:
            </Text>
            {filteredServices.map((service) => (
              <div
                key={service.serviceId}
                className="flex justify-between items-center p-2 hover:bg-gray-50 cursor-pointer rounded"
                onClick={() => addIndication(service)}
              >
                <div>
                  <div className="font-medium">{service.serviceName}</div>
                  <div className="text-sm text-gray-500">{service.serviceType}</div>
                </div>
                <div className="text-sm text-gray-500">{service.price.toLocaleString("vi-VN")} VNĐ</div>
              </div>
            ))}
          </div>
        )}

        <Table
          columns={columns}
          dataSource={indications}
          rowKey="id"
          pagination={false}
          className="mb-6"
          loading={loading}
        />

        <Form layout="vertical">
          <Form.Item label="Ghi chú của bác sĩ">
            <Input.TextArea rows={4} placeholder="Nhập ghi chú cho các chỉ định..." />
          </Form.Item>
        </Form>
      </div>

      <div className="flex justify-end space-x-3">
        <Button onClick={onClose}>Hủy</Button>
        <Button type="primary" onClick={handleSave} loading={loading}>
          Lưu
        </Button>
      </div>
    </Modal>
  )
}
