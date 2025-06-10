"use client"

import { useState, useEffect, useCallback } from "react"
import { message } from "antd"
import type { Services } from "../../types/services"
import type { ServiceOrder } from "../../types/serviceOrder"
import { servicesService } from "../../services/servicesServices"
import { createServiceOrder as createServiceOrderAPI } from "../../services/serviceOrderServices"

export const useMedicalOrderModal = (appointmentId?: number) => {
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Fetch all services on mount
  useEffect(() => {
    const fetchServices = async () => {
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
    }

    fetchServices()
  }, [])

  // Search services locally
  const searchServices = useCallback(
    async (searchTerm: string): Promise<Services[]> => {
      setSearchLoading(true)
      try {
        // Filter services locally for better performance
        const filtered = services.filter(
          (service) =>
            service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        return filtered.slice(0, 10) // Limit to 10 results
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
        return result
      } catch (error) {
        console.error("Error creating service order:", error)
        message.error("Không thể tạo đơn xét nghiệm")
        return null
      }
    },
    [appointmentId],
  )

  return {
    services,
    loading,
    searchLoading,
    searchServices,
    createServiceOrder,
  }
}
