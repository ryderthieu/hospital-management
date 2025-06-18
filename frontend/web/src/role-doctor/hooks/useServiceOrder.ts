"use client"

import { useState, useEffect, useCallback } from "react"
import { message } from "antd"
import { createServiceOrder, getServiceOrdersByAppointmentId } from "../services/serviceOrderServices"
import { servicesService } from "../services/servicesServices"
import type { Services } from "../types/services"
import type { ServiceOrder } from "../types/serviceOrder"

export const useServiceOrder = (appointmentId?: number) => {
  const [testResults, setTestResults] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const loadTestResults = useCallback(async () => {
    if (!appointmentId || initialized) return

    try {
      setLoading(true)
      const data = await getServiceOrdersByAppointmentId(appointmentId)
      setTestResults(data)
      setInitialized(true)
    } catch (error) {
      console.error("Error loading test results:", error)
      message.error("Không thể tải kết quả xét nghiệm")
    } finally {
      setLoading(false)
    }
  }, [appointmentId, initialized])

  const refreshTestResults = useCallback(async () => {
    if (!appointmentId) return

    setInitialized(false)
    await loadTestResults()
  }, [appointmentId, loadTestResults])

  useEffect(() => {
    loadTestResults()
  }, [loadTestResults])

  return {
    testResults,
    loading,
    refreshTestResults,
  }
}

// Separate hook for service order modal to avoid conflicts
export const useServiceOrderCreation = (appointmentId?: number) => {
  const [services, setServices] = useState<Services[]>([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [servicesLoaded, setServicesLoaded] = useState(false)

  const loadAllServices = useCallback(async () => {
    if (servicesLoaded) return // Prevent multiple calls

    try {
      setLoading(true)
      const data = await servicesService.getAllServices()
      setServices(data)
      setServicesLoaded(true)
    } catch (error) {
      console.error("Error loading services:", error)
      message.error("Không thể tải danh sách dịch vụ")
    } finally {
      setLoading(false)
    }
  }, [servicesLoaded])

  useEffect(() => {
    loadAllServices()
  }, [loadAllServices])

  const searchServices = useCallback(
    async (searchTerm: string): Promise<Services[]> => {
      if (!searchTerm.trim()) {
        return services
      }

      try {
        setSearchLoading(true)
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
    },
    [services],
  )

  const createOrder = useCallback(
    async (serviceId: number, roomId: number) => {
      if (!appointmentId) {
        throw new Error("Appointment ID is required")
      }

      try {
        const result = await createServiceOrder(appointmentId, serviceId, roomId)
        message.success("Tạo chỉ định thành công")
        return result
      } catch (error) {
        console.error("Error creating service order:", error)
        message.error("Không thể tạo chỉ định")
        throw error
      }
    },
    [appointmentId],
  )

  return {
    services,
    loading,
    searchLoading,
    searchServices,
    createServiceOrder: createOrder,
  }
}
