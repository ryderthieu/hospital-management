"use client"

import { useState, useEffect, useCallback } from "react"
import type { Service, ServiceOrder, CreateServiceOrderRequest, TestResult } from "../types/service"
import { serviceService, serviceOrderService } from "../services/serviceOrderServices"
import { message } from "antd"

export const useServiceOrder = (appointmentId?: number) => {
  const [services, setServices] = useState<Service[]>([])
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch available services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const data = await serviceService.getAllServices()
      setServices(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách dịch vụ"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch test results for the appointment
  const fetchTestResults = useCallback(async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      const data = await serviceOrderService.getTestResults(appointmentId)
      setTestResults(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải kết quả xét nghiệm"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    fetchServices()
    if (appointmentId) {
      fetchTestResults()
    }
  }, [fetchServices, fetchTestResults, appointmentId])

  const createServiceOrder = useCallback(
    async (serviceId: number, roomId: number) => {
      if (!appointmentId) return

      try {
        setLoading(true)
        const orderRequest: CreateServiceOrderRequest = {
          appointmentId,
          roomId,
          serviceId,
          orderTime: new Date().toISOString(),
        }

        const newOrder = await serviceOrderService.createOrder(serviceId, orderRequest)
        setServiceOrders((prev) => [...prev, newOrder])
        message.success("Tạo chỉ định thành công")

        // Refresh test results
        fetchTestResults()

        return newOrder
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tạo chỉ định"
        message.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [appointmentId, fetchTestResults],
  )

  const updateServiceOrderStatus = useCallback(
    async (serviceId: number, orderId: number, status: string, result?: string) => {
      try {
        setLoading(true)
        await serviceOrderService.updateOrder(serviceId, orderId, {
          orderStatus: status as any,
          result,
          resultTime: status === "COMPLETED" ? new Date().toISOString() : undefined,
        })

        message.success("Cập nhật trạng thái thành công")

        // Refresh test results
        fetchTestResults()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật trạng thái"
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [fetchTestResults],
  )

  return {
    services,
    serviceOrders,
    testResults,
    loading,
    error,
    createServiceOrder,
    updateServiceOrderStatus,
    refreshTestResults: fetchTestResults,
  }
}

export const useMedicalOrderModal = (appointmentId?: number) => {
  const { services, createServiceOrder, loading } = useServiceOrder(appointmentId)
  const [indications, setIndications] = useState<any[]>([])
  const [searchInput, setSearchInput] = useState("")

  const updateField = useCallback((index: number, field: string, value: any) => {
    setIndications((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }, [])

  const deleteIndication = useCallback((index: number) => {
    setIndications((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const save = useCallback(async () => {
    if (!appointmentId) return

    try {
      // Create service orders for each indication
      for (const indication of indications) {
        await createServiceOrder(indication.serviceId, indication.roomId)
      }

      // Clear indications after saving
      setIndications([])

      return true
    } catch (err) {
      message.error("Không thể lưu chỉ định")
      return false
    }
  }, [appointmentId, indications, createServiceOrder])

  return {
    indications,
    services,
    loading,
    searchInput,
    setSearchInput,
    updateField,
    deleteIndication,
    save,
    setIndications,
  }
}
