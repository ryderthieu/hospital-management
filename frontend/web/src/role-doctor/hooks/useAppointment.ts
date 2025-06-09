import { useState, useEffect, useCallback } from "react"
import type { Appointment, AppointmentFilters, AppointmentStats} from "../types/appointment"
import { appointmentService } from "../services/appointmentServices"
import { message } from "antd"
import dayjs from "dayjs"

export const useAppointments = (initialFilters?: AppointmentFilters) => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Set default date to today
  const [filters, setFilters] = useState<AppointmentFilters>({
    date: dayjs().format("YYYY-MM-DD"), // Default to today
    ...initialFilters,
  })

  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  })

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const appointmentData = await appointmentService.getAppointments(filters)
      setAppointments(appointmentData)
      setFilteredAppointments(appointmentData)

      // Calculate stats from filtered data
      const statsData = appointmentService.calculateAppointmentStats(appointmentData)
      setStats(statsData)

      console.log("Appointments loaded:", appointmentData)
      console.log("Applied filters:", filters)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải danh sách lịch hẹn/bệnh nhân"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const updateFilters = useCallback((newFilters: Partial<AppointmentFilters>) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev, ...newFilters }
      console.log("Updating filters:", updatedFilters)
      return updatedFilters
    })
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
        fetchAppointments() // Refresh data
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
        fetchAppointments() // Refresh data
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
    appointments,
    filteredAppointments,
    loading,
    error,
    filters,
    stats,
    updateFilters,
    clearDateFilter,
    setTodayFilter,
    updateAppointmentStatus,
    updateAppointmentNotes,
    refreshAppointments,
  }
}

// //Dành cho việc hiển thị bảng danh sách bệnh nhân
// export const useAppointmentPatientsTable = () => {
//   const { appointments, loading, error, ...appointmentHook } = useAppointments()

//   // Transform appointments to patient format

//     const transformAppointments = appointments.map((appointment, index) => ({
//         appointmentId: appointment.appointmentId,
//         number: appointment.number,
//         patientName: appointment.patientInfo.fullName, 
//         patientId: appointment.patientInfo.patientId,
//         date: formatAppointmentDate(appointment.schedule.workDate),
//         gender: appointment.patientInfo.gender,
//         birthday: appointment.patientInfo.birthday,
//         symptom: appointment.symptoms,
//         status: getAppointmentStatusText(appointment.appointmentStatus),
//         appointmentFullData: appointment
//     }))

//   return {
//     transformAppointments ,
//     loading,
//     error,
//     ...appointmentHook,
//   }
// }
