"use client"

import { useState, useEffect, useCallback } from "react"
import type { Service, ServiceOrder, TestResult } from "../types/services"
import { message } from "antd"

// Mock data
const mockServices: Service[] = [
  {
    serviceId: 1,
    serviceName: "Xét nghiệm máu tổng quát",
    serviceType: "TEST",
    price: 150000,
    createdAt: "2025-01-01T00:00:00",
  },
  {
    serviceId: 2,
    serviceName: "Chụp X-quang phổi",
    serviceType: "IMAGING",
    price: 200000,
    createdAt: "2025-01-01T00:00:00",
  },
  {
    serviceId: 3,
    serviceName: "Siêu âm bụng",
    serviceType: "IMAGING",
    price: 300000,
    createdAt: "2025-01-01T00:00:00",
  },
  {
    serviceId: 4,
    serviceName: "Điện tim",
    serviceType: "TEST",
    price: 100000,
    createdAt: "2025-01-01T00:00:00",
  },
]

const mockTestResults: TestResult[] = [
  {
    orderId: 1,
    serviceName: "Xét nghiệm máu tổng quát",
    expectedTime: "2 giờ",
    actualTime: "1.5 giờ",
    result: "Bình thường",
    status: "COMPLETED",
    roomId: 101,
  },
  {
    orderId: 2,
    serviceName: "Chụp X-quang phổi",
    expectedTime: "30 phút",
    status: "ORDERED",
    roomId: 102,
  },
]

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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Use mock data
      setServices(mockServices)

      // Original API call - commented out
      // const data = await serviceService.getAllServices()
      // setServices(data)
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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Use mock data
      setTestResults(mockTestResults)

      // Original API call - commented out
      // const data = await serviceOrderService.getTestResults(appointmentId)
      // setTestResults(data)
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

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Create mock service order
        const service = mockServices.find((s) => s.serviceId === serviceId)
        if (service) {
          const newOrder: ServiceOrder = {
            orderId: Date.now(),
            appointmentId,
            roomId,
            service,
            orderStatus: "ORDERED",
            number: 1,
            orderTime: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }

          setServiceOrders((prev) => [...prev, newOrder])
          message.success("Tạo chỉ định thành công")

          // Add to test results
          const newTestResult: TestResult = {
            orderId: newOrder.orderId,
            serviceName: service.serviceName,
            expectedTime: "30 phút",
            status: "ORDERED",
            roomId,
          }
          setTestResults((prev) => [...prev, newTestResult])

          return newOrder
        }

        // Original API call - commented out
        // const orderRequest: CreateServiceOrderRequest = {
        //   appointmentId,
        //   roomId,
        //   serviceId,
        //   orderTime: new Date().toISOString(),
        // }
        // const newOrder = await serviceOrderService.createOrder(serviceId, orderRequest)
        // setServiceOrders((prev) => [...prev, newOrder])
        // fetchTestResults()
        // return newOrder
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tạo chỉ định"
        message.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [appointmentId],
  )

  const updateServiceOrderStatus = useCallback(
    async (serviceId: number, orderId: number, status: string, result?: string) => {
      try {
        setLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update mock data
        setTestResults((prev) =>
          prev.map((test) =>
            test.orderId === orderId
              ? {
                  ...test,
                  status: status as any,
                  result,
                  actualTime: status === "COMPLETED" ? new Date().toLocaleTimeString() : undefined,
                }
              : test,
          ),
        )

        message.success("Cập nhật trạng thái thành công")

        // Original API call - commented out
        // await serviceOrderService.updateOrder(serviceId, orderId, {
        //   orderStatus: status as any,
        //   result,
        //   resultTime: status === "COMPLETED" ? new Date().toISOString() : undefined,
        // })
        // fetchTestResults()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật trạng thái"
        message.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [],
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
