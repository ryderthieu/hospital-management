import type { Appointment, AppointmentFilters, AppointmentStats } from "../types/appointment"
import { api } from "../../services/api"


const doctorId = localStorage.getItem("currentDoctorId")
const doctorIdNumber = doctorId ? Number.parseInt(doctorId) : null

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
  return timeString.substring(0, 5)
}

export const formatTimeSlot = (startTime: string, endTime: string): string => {
  const formattedStart = formatAppointmentTime(startTime)
  const formattedEnd = formatAppointmentTime(endTime)
  return `${formattedStart} - ${formattedEnd}`
}

export const getAppointmentStatusText = (status: string): string => {
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

export const filterAppointments = (appointments: Appointment[], filters: AppointmentFilters): Appointment[] => {
  return appointments.filter((appointment) => {
    // Filter by status
    if (filters.status && filters.status !== "all" && appointment.appointmentStatus !== filters.status) {
      return false
    }

    // Filter by date
    if (filters.date && appointment.schedule.workDate !== filters.date) {
      return false
    }

    // Filter by schedule ID
    if (filters.scheduleId && appointment.schedule.scheduleId !== filters.scheduleId) {
      return false
    }

    // Filter by search term (symptoms)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      if (!appointment.symptoms.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    return true
  })
}

export const sortAppointmentsByTime = (appointments: Appointment[]): Appointment[] => {
  return [...appointments].sort((a, b) => {
    // First sort by date
    const dateCompare = a.schedule.workDate.localeCompare(b.schedule.workDate)
    if (dateCompare !== 0) return dateCompare

    // Then sort by slot start time
    return a.slotStart.localeCompare(b.slotStart)
  })
}

export const appointmentService = {
  // Get appointments by doctorId
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    try {
      // Build query parameters
      const params: any = {}

      if (filters?.date) {
        params.date = filters.date
      }
      if (filters?.status && filters.status !== "all") {
        params.status = filters.status
      }
      if (filters?.scheduleId) {
        params.scheduleId = filters.scheduleId
      }

      console.log("Fetching appointments with params:", params)

      const response = await api.get(`/appointments/doctor/${doctorIdNumber}`, { params })
      let appointments = response.data

      // Apply client-side filters if needed
      if (filters) {
        appointments = filterAppointments(appointments, filters)
      }

      // Sort by time
      return sortAppointmentsByTime(appointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
      throw error
    }
  },

  // Get appointment by ID
  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId: number, status: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${appointmentId}/status`, { status })
    return response.data
  },

  // Add appointment notes
  async updateAppointmentNotes(appointmentId: number, notes: string): Promise<Appointment> {
    const response = await api.patch(`/appointments/${appointmentId}/notes`, { notes })
    return response.data
  },

  // Get appointments for a specific date
  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const response = await api.get(`/doctors/${doctorIdNumber}/appointments`, {
      params: { date },
    })
    return sortAppointmentsByTime(response.data)
  },

  // Get appointment statistics
  async getAppointmentStats(): Promise<AppointmentStats> {
    const appointments = await this.getAppointments()
    return calculateAppointmentStats(appointments)
  },

  // Expose the calculation function for use in hooks
  calculateAppointmentStats,
}
