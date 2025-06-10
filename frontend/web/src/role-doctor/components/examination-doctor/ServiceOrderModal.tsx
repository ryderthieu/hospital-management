"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, Table, Typography, message, Spin } from "antd"
import { SearchOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import { useMedicalOrderModal } from "../../hooks/useServiceOrder"
import type { Services } from "../../types/services"
import type { ServiceOrder } from "../../types/serviceOrder"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId?: number
}

interface MedicalOrderItem extends Omit<ServiceOrder, "orderId" | "createdAt"> {
  id: string
  expectedTime: string
}

export const ServiceOrderModal: React.FC<ModalProps> = ({ isOpen, onClose, appointmentId }) => {
  const { services, loading, searchLoading, searchServices, createServiceOrder } = useMedicalOrderModal(appointmentId)
  const [indications, setIndications] = useState<MedicalOrderItem[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [filteredServices, setFilteredServices] = useState<Services[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Search services when input changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchInput.trim()) {
        const results = await searchServices(searchInput)
        setFilteredServices(results)
        setShowSearchResults(true)
      } else {
        setFilteredServices([])
        setShowSearchResults(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, searchServices])

  const addIndication = (service: Services) => {
    const newIndication: MedicalOrderItem = {
      id: Date.now().toString(),
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      roomId: 1, // Default value, will be updated by the select
      expectedTime: "30 phút",
      price: service.price,
      quantity: 1,
      status: "pending",
      appointmentId: appointmentId || 0,
      service,
      orderStatus: "ORDERED",
      result: "",
      number: 1,
      orderTime: new Date().toISOString(),
      resultTime: "",
    }
    setIndications((prev) => [...prev, newIndication])
    setShowSearchResults(false)
    setSearchInput("")
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
        await createServiceOrder(indication.service.serviceId, indication.roomId || 1)
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
          <div className="text-xs text-gray-400">{record.service.price.toLocaleString("vi-VN")} VNĐ</div>
        </div>
      ),
    },
    {
      title: "Phòng",
      dataIndex: "roomId",
      key: "roomId",
      width: 200,
      render: (roomId: number, record: MedicalOrderItem, index: number) => (
        <Select
          value={roomId}
          onChange={(value) => updateField(index, "roomId", value)}
          style={{ width: "100%" }}
          options={[
            { value: 1, label: "CT-Scan [01]" },
            { value: 2, label: "CT-Scan [02]" },
            { value: 3, label: "MRI [01]" },
            { value: 4, label: "MRI [02]" },
            { value: 5, label: "X-Ray [01]" },
            { value: 6, label: "X-Ray [02]" },
            { value: 7, label: "Blood Test [01]" },
            { value: 8, label: "Blood Test [02]" },
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
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Tìm dịch vụ..."
              prefix={<SearchOutlined />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
              suffix={searchLoading ? <Spin size="small" /> : null}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && filteredServices.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                {filteredServices.map((service) => (
                  <div
                    key={service.serviceId}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => addIndication(service)}
                  >
                    <div className="font-medium">{service.serviceName}</div>
                    <div className="text-sm text-gray-500">{service.serviceType}</div>
                    <div className="text-xs text-gray-400">{service.price.toLocaleString("vi-VN")} VNĐ</div>
                  </div>
                ))}
              </div>
            )}

            {showSearchResults && filteredServices.length === 0 && searchInput && !searchLoading && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-3">
                <div className="text-gray-500 text-center">Không tìm thấy dịch vụ</div>
              </div>
            )}
          </div>

          <Button type="primary" icon={<PlusOutlined />} className="ml-3">
            Thêm chỉ định
          </Button>
          <Button icon={<EyeOutlined />} className="ml-3">
            Xem chỉ định
          </Button>
        </div>

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
