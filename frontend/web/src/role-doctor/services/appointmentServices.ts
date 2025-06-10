import type { Appointment, AppointmentStats, PaginatedResponse } from "../types/appointment"
import { api } from "../../services/api"

// Get doctorId safely
const getDoctorId = (): number | null => {
  if (typeof window !== "undefined") {
    const doctorId = localStorage.getItem("currentDoctorId")
    return doctorId ? Number.parseInt(doctorId) : null
  }
  return null
}

// Utility functions for appointment data
export const formatAppointmentDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatAppointmentTime = (timeString: string): string => {
  // Convert "HH:mm:ss" to "HH:mm"
  return timeString?.substring(0, 5)
}

export const formatTimeSlot = (slotStart?: string, slotEnd?: string): string => {
  if (!slotStart || !slotEnd) {
    return "Chưa xác định"
  }
  const formattedStart = formatAppointmentTime(slotStart)
  const formattedEnd = formatAppointmentTime(slotEnd)
  return `${formattedStart} - ${formattedEnd}`
}

export const getAppointmentStatusVietnameseText = (status: string): string => {
  const statusMap = {
    PENDING: "Đang chờ",
    CONFIRMED: "Đã xác nhận",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  }
  return statusMap[status as keyof typeof statusMap] || status
}

export const getAppointmentStatusColor = (status: string): { color: string; bgColor: string } => {
  const colorMap = {
    PENDING: { color: "#d97706", bgColor: "#fef3c7" },
    CONFIRMED: { color: "#2563eb", bgColor: "#dbeafe" },
    COMPLETED: { color: "#059669", bgColor: "#d1fae5" },
    CANCELLED: { color: "#dc2626", bgColor: "#fee2e2" },
  }
  return colorMap[status as keyof typeof colorMap] || { color: "#6b7280", bgColor: "#f3f4f6" }
}

// Interface cho pagination
export interface PaginationParams {
  page: number
  size: number
}

export const calculateAppointmentStats = (appointments: Appointment[]): AppointmentStats => {
  return appointments.reduce(
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
}

// Service for API calls
export const appointmentService = {
  async getAppointments(pagination: PaginationParams): Promise<PaginatedResponse<Appointment>> {
    try {
      const doctorIdNumber = getDoctorId()
      if (!doctorIdNumber) {
        throw new Error("Doctor ID not found")
      }

      const params = {
        pageNo: pagination.page,
        pageSize: pagination.size,
      }

      const response = await api.get(`/appointments/doctor/${doctorIdNumber}`, { params })
      return response.data
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  },

  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  async updateAppointmentStatus(appointmentId: number, status: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  async updateAppointmentNotes(appointmentId: number, notes: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${appointmentId}/notes`, { notes })
    return response.data
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const doctorIdNumber = getDoctorId()
    if (!doctorIdNumber) {
      throw new Error("Doctor ID not found")
    }

    const response = await api.get(`/doctors/${doctorIdNumber}/appointments`, {
      params: { date },
    })
    return response.data.content || response.data
  },
}
