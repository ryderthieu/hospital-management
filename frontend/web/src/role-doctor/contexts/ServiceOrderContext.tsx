"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import type { ServiceOrder } from "../types/serviceOrder"
import type { Appointment } from "../types/appointment"
import type { ExaminationRoom } from "../types/examinationRoom"
import { getServiceOrdersByRoomId } from "../services/serviceOrderServices"
import { appointmentService } from "../services/appointmentServices"
import { examinationRoomService } from "../services/examinationRoomServices"

interface ServiceOrderContextType {
  serviceOrders: ServiceOrder[]
  appointmentsData: Record<number, Appointment>
  roomsData: Record<number, ExaminationRoom>
  loading: boolean
  error: string | null
  refreshServiceOrders: (roomId?: number, forceRefresh?: boolean) => Promise<void>
  updateServiceOrderInContext: (updatedOrder: ServiceOrder) => void
  selectedRoomId: number | undefined
  setSelectedRoomId: (roomId: number | undefined) => void
  // Filter states
  selectedDate: string | null
  setSelectedDate: (date: string | null) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
}

const ServiceOrderContext = createContext<ServiceOrderContextType | undefined>(undefined)

export const useServiceOrderContext = () => {
  const context = useContext(ServiceOrderContext)
  if (!context) {
    throw new Error("useServiceOrderContext must be used within a ServiceOrderProvider")
  }
  return context
}

interface ServiceOrderProviderProps {
  children: React.ReactNode
}

export const ServiceOrderProvider: React.FC<ServiceOrderProviderProps> = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [appointmentsData, setAppointmentsData] = useState<Record<number, Appointment>>({})
  const [roomsData, setRoomsData] = useState<Record<number, ExaminationRoom>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined)

  // Filter states - persist across navigation
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Cache management
  const lastFetchTime = useRef<Record<number, number>>({})
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  const fetchAppointmentData = useCallback(
    async (appointmentIds: number[]) => {
      const newAppointments: Record<number, Appointment> = {}
      const missingIds = appointmentIds.filter((id) => !appointmentsData[id])

      if (missingIds.length === 0) return

      try {
        const promises = missingIds.map(async (id) => {
          try {
            const appointment = await appointmentService.getAppointmentById(id)
            newAppointments[id] = appointment
          } catch (error) {
            console.error(`Error fetching appointment ${id}:`, error)
          }
        })

        await Promise.all(promises)

        if (Object.keys(newAppointments).length > 0) {
          setAppointmentsData((prev) => ({ ...prev, ...newAppointments }))
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    },
    [appointmentsData],
  )

  const fetchRoomData = useCallback(
    async (roomIds: number[]) => {
      const newRooms: Record<number, ExaminationRoom> = {}
      const missingIds = roomIds.filter((id) => !roomsData[id])

      if (missingIds.length === 0) return

      try {
        const promises = missingIds.map(async (id) => {
          try {
            const room = await examinationRoomService.getExaminationRoomById(id)
            newRooms[id] = room
          } catch (error) {
            console.error(`Error fetching room ${id}:`, error)
          }
        })

        await Promise.all(promises)

        if (Object.keys(newRooms).length > 0) {
          setRoomsData((prev) => ({ ...prev, ...newRooms }))
        }
      } catch (error) {
        console.error("Error fetching rooms:", error)
      }
    },
    [roomsData],
  )

  const refreshServiceOrders = useCallback(
    async (roomId?: number, forceRefresh = false) => {
      const targetRoomId = roomId || selectedRoomId
      if (!targetRoomId) return

      // Check cache
      const now = Date.now()
      const lastFetch = lastFetchTime.current[targetRoomId] || 0
      const isCacheValid = now - lastFetch < CACHE_DURATION

      if (!forceRefresh && isCacheValid && serviceOrders.length > 0) {
        return // Use cached data
      }

      setLoading(true)
      setError(null)

      try {
        const orders = await getServiceOrdersByRoomId(targetRoomId)
        setServiceOrders(orders)
        lastFetchTime.current[targetRoomId] = now

        // Fetch related data
        const appointmentIds = [...new Set(orders.map((order) => order.appointmentId))]
        const roomIds = [...new Set(orders.map((order) => order.roomId))]

        await Promise.all([fetchAppointmentData(appointmentIds), fetchRoomData(roomIds)])
      } catch (err) {
        console.error("Error fetching service orders:", err)
        setError("Không thể tải danh sách chỉ định")
      } finally {
        setLoading(false)
      }
    },
    [selectedRoomId, serviceOrders.length, fetchAppointmentData, fetchRoomData],
  )

  const updateServiceOrderInContext = useCallback((updatedOrder: ServiceOrder) => {
    setServiceOrders((prev) => prev.map((order) => (order.orderId === updatedOrder.orderId ? updatedOrder : order)))
  }, [])

  // Auto-refresh when selectedRoomId changes
  useEffect(() => {
    if (selectedRoomId) {
      refreshServiceOrders(selectedRoomId)
    }
  }, [selectedRoomId, refreshServiceOrders])

  const value: ServiceOrderContextType = {
    serviceOrders,
    appointmentsData,
    roomsData,
    loading,
    error,
    refreshServiceOrders,
    updateServiceOrderInContext,
    selectedRoomId,
    setSelectedRoomId,
    selectedDate,
    setSelectedDate,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
  }

  return <ServiceOrderContext.Provider value={value}>{children}</ServiceOrderContext.Provider>
}
