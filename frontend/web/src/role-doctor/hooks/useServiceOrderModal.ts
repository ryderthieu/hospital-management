"use client"

import { useState, useEffect, useCallback } from "react"
import { message } from "antd"
import type { Services } from "../types/services"
import type { ServiceOrder } from "../types/serviceOrder"
import type { ExaminationRoom } from "../types/examinationRoom"
import { servicesService } from "../services/servicesServices"
import { examinationRoomService } from "../services/examinationRoomServices"
import { createServiceOrder as createServiceOrderAPI } from "../services/serviceOrderServices"

export const useServiceOrderModal = (appointmentId?: number) => {
  const [services, setServices] = useState<Services[]>([])
  const [testRooms, setTestRooms] = useState<ExaminationRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [roomsLoading, setRoomsLoading] = useState(false)

  // Fetch all services on component mount
  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await servicesService.getAllServices()
      setServices(data)
    } catch (error) {
      console.error("Error fetching services:", error)
      message.error("Không thể tải danh sách dịch vụ")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch test rooms
  const fetchTestRooms = useCallback(async () => {
    setRoomsLoading(true)
    try {
      const rooms = await examinationRoomService.getTestRooms()
      setTestRooms(rooms)
    } catch (error) {
      console.error("Error fetching test rooms:", error)
      message.error("Không thể tải danh sách phòng xét nghiệm")
    } finally {
      setRoomsLoading(false)
    }
  }, [])

  // Search services by name
  const searchServices = useCallback(
    async (searchTerm: string): Promise<Services[]> => {
      if (!searchTerm.trim()) return []

      setSearchLoading(true)
      try {
        // Filter services locally for better performance
        const filtered = services.filter((service) =>
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        return filtered
      } catch (error) {
        console.error("Error searching services:", error)
        return []
      } finally {
        setSearchLoading(false)
      }
    },
    [services],
  )

  // Create service order
  const createServiceOrder = useCallback(
    async (serviceId: number, roomId: number): Promise<ServiceOrder | null> => {
      if (!appointmentId) {
        message.error("Không tìm thấy thông tin cuộc hẹn")
        return null
      }

      try {
        const serviceOrderData: Partial<ServiceOrder> = {
          appointmentId,
          roomId,
          orderStatus: "ORDERED",
          result: "",
          number: 1,
          orderTime: new Date().toISOString(),
          resultTime: "",
        }

        const result = await createServiceOrderAPI(serviceId, serviceOrderData as ServiceOrder)
        message.success("Tạo chỉ định thành công")
        return result
      } catch (error) {
        console.error("Error creating service order:", error)
        message.error("Không thể tạo chỉ định")
        return null
      }
    },
    [appointmentId],
  )

  // Get room display name
  const getRoomDisplayName = useCallback(
    (roomId: number): string => {
      const room = testRooms.find((r) => r.roomId === roomId)
      if (!room) return `Phòng ${roomId}`
      return `${room.roomName} - ${room.building} T${room.floor}`
    },
    [testRooms],
  )

  // Initialize data
  useEffect(() => {
    fetchServices()
    fetchTestRooms()
  }, [fetchServices, fetchTestRooms])

  return {
    services,
    testRooms,
    loading,
    searchLoading,
    roomsLoading,
    searchServices,
    createServiceOrder,
    getRoomDisplayName,
    refreshServices: fetchServices,
    refreshTestRooms: fetchTestRooms,
  }
}
