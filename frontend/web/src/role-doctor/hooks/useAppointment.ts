"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import type { Appointment, AppointmentFilters, AppointmentStats } from "../types/appointment"
import { appointmentService } from "../services/appointmentServices"
import { message } from "antd"
import dayjs from "dayjs"

export interface PaginatedResponse<T> {
  content: T[]
  pageNo: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface PaginationParams {
  page: number
  size: number
}

export const useAppointments = (initialFilters?: AppointmentFilters) => {
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Appointment>>({
    content: [],
    pageNo: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    last: true,
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state for API calls
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 0,
    size: 10,
  })

  // Client-side filters for additional filtering
  const [filters, setFilters] = useState<AppointmentFilters>({
    date: dayjs().format("YYYY-MM-DD"),
    ...initialFilters,
  })

  // Fetch data from API
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await appointmentService.getAppointments(pagination)
      setPaginatedData(response)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách lịch hẹn"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [pagination])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Apply client-side filters to the current page data
  const filteredAppointments = useMemo(() => {
    return paginatedData.content.filter((appointment) => {
      // Filter by status
      if (filters.status && filters.status !== "all" && appointment.appointmentStatus !== filters.status) {
        return false
      }

      // Filter by date
      if (filters.date && appointment.schedule?.workDate !== filters.date) {
        return false
      }

      // Filter by gender - only filter if patientInfo exists
      if (filters.gender && filters.gender !== "all" && appointment.patientInfo?.gender !== filters.gender) {
        return false
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const symptomsMatch = appointment.symptoms.toLowerCase().includes(searchLower)
        const nameMatch = appointment.patientInfo?.fullName?.toLowerCase().includes(searchLower) || false
        if (!symptomsMatch && !nameMatch) {
          return false
        }
      }

      return true
    })
  }, [paginatedData.content, filters])

  // Calculate stats from filtered data
  const stats = useMemo((): AppointmentStats => {
    return filteredAppointments.reduce(
      (stats, appointment) => {
        stats.total++
        switch (appointment.appointmentStatus) {
          case "PENDING":
            stats.pending++
            break
          case "CONFIRMED":
            stats.confirmed++
            break
          case "COMPLETED":
            stats.completed++
            break
          case "CANCELLED":
            stats.cancelled++
            break
        }
        return stats
      },
      { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    )
  }, [filteredAppointments])

  // Update filters (client-side only)
  const updateFilters = useCallback((newFilters: Partial<AppointmentFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Update pagination (triggers API call)
  const updatePagination = useCallback((page: number, size?: number) => {
    setPagination((prev) => ({
      page: page - 1, // Convert from 1-based to 0-based
      size: size || prev.size,
    }))
  }, [])

  const clearDateFilter = useCallback(() => {
    setFilters((prev) => {
      const { date, ...rest } = prev
      return rest
    })
  }, [])

  const setTodayFilter = useCallback(() => {
    updateFilters({ date: dayjs().format("YYYY-MM-DD") })
  }, [updateFilters])

  const updateAppointmentStatus = useCallback(
    async (appointmentId: number, status: string) => {
      try {
        await appointmentService.updateAppointmentStatus(appointmentId, status)
        message.success("Cập nhật trạng thái thành công")
        fetchAppointments()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật trạng thái"
        message.error(errorMessage)
      }
    },
    [fetchAppointments],
  )

  const updateAppointmentNotes = useCallback(
    async (appointmentId: number, notes: string) => {
      try {
        await appointmentService.updateAppointmentNotes(appointmentId, notes)
        message.success("Cập nhật ghi chú thành công")
        fetchAppointments()
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật ghi chú"
        message.error(errorMessage)
      }
    },
    [fetchAppointments],
  )

  const refreshAppointments = useCallback(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return {
    appointments: filteredAppointments,
    paginatedData,
    loading,
    error,
    filters,
    stats,
    updateFilters,
    updatePagination,
    clearDateFilter,
    setTodayFilter,
    updateAppointmentStatus,
    updateAppointmentNotes,
    refreshAppointments,
  }
}
