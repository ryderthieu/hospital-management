"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Modal, Input, Select, Button, Table, Typography, message, Spin } from "antd"
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Services } from "../../types/services"
import type { ServiceOrder } from "../../types/serviceOrder"
import { examinationRoomService } from "../../services/examinationRoomServices"
import type { ExaminationRoom } from "../../types/examinationRoom"
import { appointmentService } from "../../services/appointmentServices"
import { servicesService } from "../../services/servicesServices"
import { createServiceOrder as createServiceOrderService } from "../../services/serviceOrderServices"

const { Text } = Typography

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  appointmentId?: number
}

interface MedicalOrderItem extends Omit<ServiceOrder, "orderId" | "createdAt"> {
  serviceId: number
  expectedTime: string
}

export const ServiceOrderModal: React.FC<ModalProps> = ({ isOpen, onClose, appointmentId }) => {
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [indications, setIndications] = useState<MedicalOrderItem[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [filteredServices, setFilteredServices] = useState<Services[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [examinationRooms, setExaminationRooms] = useState<ExaminationRoom[]>([])
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [appointmentData, setAppointmentData] = useState<any>(null)

  const searchContainerRef = useRef<HTMLDivElement>(null)

  const searchServices = useCallback(async (searchTerm: string): Promise<Services[]> => {
    try {
      setSearchLoading(true)
      const results = await servicesService.searchServices(searchTerm)
      return results
    } catch (error) {
      console.error("Error searching services:", error)
      return []
    } finally {
      setSearchLoading(false)
    }
  }, [])

  const handleCreateServiceOrder = useCallback(
    async (serviceId: number, roomId: number | null) => {
      if (!appointmentId || !roomId) {
        message.error("Thiếu thông tin để tạo chỉ định")
        return
      }

      try {
        setLoading(true)
        await createServiceOrderService(appointmentId, serviceId, roomId)
        message.success("Tạo chỉ định thành công")
      } catch (error) {
        console.error("Error creating service order:", error)
        message.error("Không thể tạo chỉ định")
      } finally {
        setLoading(false)
      }
    },
    [appointmentId],
  )

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchInput.trim()) {
        const results = await searchServices(searchInput)
        setFilteredServices(results)
      } else {
        const all = await searchServices("")
        setFilteredServices(all)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchInput, searchServices])

  // Hiển thị dropdown chỉ khi input được focus và có dữ liệu
  useEffect(() => {
    if (isInputFocused && filteredServices.length > 0) {
      setShowSearchResults(true)
    } else if (!isInputFocused) {
      setShowSearchResults(false)
    }
  }, [isInputFocused, filteredServices])

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsInputFocused(false)
      }
    }

    if (isInputFocused) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isInputFocused])

  useEffect(() => {
    const fetchTestRooms = async () => {
      setRoomsLoading(true)
      try {
        const allRooms = await examinationRoomService.getAllExaminationRooms()
        const testRooms = allRooms.filter((room) => room.type === "TEST")
        setExaminationRooms(testRooms)
      } catch (error) {
        console.error("Error fetching examination rooms:", error)
        message.error("Không thể tải danh sách phòng xét nghiệm")
      } finally {
        setRoomsLoading(false)
      }
    }

    if (isOpen) {
      fetchTestRooms()
    }
  }, [isOpen])

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (appointmentId) {
        try {
          const data = await appointmentService.getAppointmentById(appointmentId)
          setAppointmentData(data)
        } catch (error) {
          console.error("Error fetching appointment:", error)
        }
      }
    }

    if (isOpen && appointmentId) {
      fetchAppointmentData()
    }
  }, [isOpen, appointmentId])

  const addIndication = (service: Services) => {
    const newIndication: MedicalOrderItem = {
      id: Date.now().toString(),
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      roomId: null,
      expectedTime: new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: service.price,
      quantity: 1,
      status: "pending",
      appointmentId: appointmentId || 0,
      service,
      orderStatus: "ORDERED",
      result: "",
      number: 1, //sửa backend
      orderTime: new Date().toISOString(),
      resultTime: "",
    }
    setIndications((prev) => [...prev, newIndication])
    setIsInputFocused(false)
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
      message.error("Không tìm thấy thông tin mã hồ sơ để thêm chỉ định")
      return
    }

    try {
      // Create service orders for each indication
      for (const indication of indications) {
        await handleCreateServiceOrder(indication.service.serviceId, indication.roomId)
      }

      // Clear indications and close modal
      setIndications([])
      message.success("Thêm chỉ định thành công")
      onClose()
    } catch (error) {
      message.error("Không thể thêm chỉ định")
    }
  }

  const columns = [
    {
      title: "Chỉ định",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (text: string, record: MedicalOrderItem) => (
        <div>
          <div className="font-medium mb-1">{text}</div>
          <div className="text-xs text-gray-400">{record.service.price.toLocaleString("vi-VN")} VNĐ</div>
        </div>
      ),
    },
    {
      title: "Nơi thực hiện",
      dataIndex: "roomId",
      key: "roomId",
      width: 400,
      render: (roomId: number, record: MedicalOrderItem, index: number) => (
        <Select
          value={roomId}
          onChange={(value) => updateField(index, "roomId", value)}
          style={{ width: "100%" }}
          loading={roomsLoading}
          placeholder="Chọn nơi thực hiện"
          options={examinationRooms.map((room) => ({
            value: room.roomId,
            label: `${room.note} - Tòa ${room.building} Tầng ${room.floor}`,
          }))}
        />
      ),
    },
    {
      title: "Thời gian dự kiến",
      dataIndex: "expectedTime",
      key: "expectedTime",
      width: 170,
      render: (text: string, record: MedicalOrderItem, index: number) => (
        <Input
          value={text}
          disabled={true}
          onChange={(e) => updateField(index, "expectedTime", e.target.value)}
          style={{ color: "black" }}
        />
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
            <Text strong>Bệnh nhân: {appointmentData?.patientInfo?.fullName || "Đang tải..."}</Text>
            <div>
              <Text type="secondary">Mã bệnh nhân: {appointmentData?.patientInfo?.patientId || "Đang tải..."}</Text>
            </div>
          </div>
          <div className="text-right">
            <Text strong>Ngày: {new Date().toLocaleDateString("vi-VN")}</Text>
            <div>
              <Text type="secondary">
                Giờ:{" "}
                {new Date().toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-md" ref={searchContainerRef}>
            <Input
              placeholder="Tìm chỉ định..."
              prefix={<SearchOutlined />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full"
              suffix={searchLoading ? <Spin size="small" /> : null}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  if (!searchContainerRef.current?.contains(document.activeElement)) {
                    setIsInputFocused(false)
                  }
                }, 100)
              }}
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
                    <div className="font-medium mb-1">{service.serviceName}</div>
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
        </div>

        <Table
          columns={columns}
          dataSource={indications}
          rowKey="id"
          pagination={false}
          className="mb-6"
          loading={loading}
        />
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
