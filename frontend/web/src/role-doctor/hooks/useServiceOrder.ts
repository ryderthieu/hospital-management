import { useState, useEffect } from "react"
import { message } from "antd"
import { createServiceOrder, getServiceOrdersByAppointmentId } from "../services/serviceOrderServices"
import { servicesService } from "../services/servicesServices"
import type { Services } from "../types/services"
import type { ServiceOrder } from "../types/serviceOrder"

export const useServiceOrderModal = (appointmentId?: number) => {
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Load all services on mount
  useEffect(() => {
    loadAllServices()
  }, [])

  const loadAllServices = async () => {
    try {
      setLoading(true)
      const data = await servicesService.getAllServices()
      setServices(data)
    } catch (error) {
      console.error("Error loading services:", error)
      message.error("Không thể tải danh sách dịch vụ")
    } finally {
      setLoading(false)
    }
  }

  const searchServices = async (searchTerm: string): Promise<Services[]> => {
    if (!searchTerm.trim()) {
      return services
    }

    try {
      setSearchLoading(true)
      // Filter services by name or type
      const filtered = services.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      return filtered
    } catch (error) {
      console.error("Error searching services:", error)
      message.error("Không thể tìm kiếm dịch vụ")
      return []
    } finally {
      setSearchLoading(false)
    }
  }

  const createOrder = async (serviceId: number, roomId: number) => {
    if (!appointmentId) {
      throw new Error("Appointment ID is required")
    }

    try {
      const service = services.find((s) => s.serviceId === serviceId)
      if (!service) {
        throw new Error("Service not found")
      }

      const serviceOrder: ServiceOrder = {
        orderId: 0, // Will be set by backend
        appointmentId,
        roomId,
        service,
        orderStatus: "ORDERED",
        result: "",
        number: 1,
        orderTime: new Date().toISOString(),
        resultTime: "",
        createdAt: new Date().toISOString(),
      }

      const result = await createServiceOrder(serviceId, serviceOrder)
      return result
    } catch (error) {
      console.error("Error creating service order:", error)
      message.error("Không thể tạo chỉ định")
      throw error
    }
  }

  return {
    services,
    loading,
    searchLoading,
    loadAllServices,
    searchServices,
    createServiceOrder: createOrder,
  }
}

// Hook for managing service orders in patient detail
export const useServiceOrder = (appointmentId?: number) => {
  const [testResults, setTestResults] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(false)

  const loadTestResults = async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      const data = await getServiceOrdersByAppointmentId(appointmentId)
      setTestResults(data)
    } catch (error) {
      console.error("Error loading test results:", error)
      message.error("Không thể tải kết quả xét nghiệm")
    } finally {
      setLoading(false)
    }
  }

  const refreshTestResults = () => {
    loadTestResults()
  }

  useEffect(() => {
    loadTestResults()
  }, [appointmentId])

  return {
    testResults,
    loading,
    refreshTestResults,
  }
}
