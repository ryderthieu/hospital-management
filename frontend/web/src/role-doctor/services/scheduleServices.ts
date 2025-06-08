import type { Schedule } from "../types/schedule"
import { api } from "../../services/api"

const doctorId = localStorage.getItem("currentDoctorId")
const doctorIdNumber = doctorId ? Number.parseInt(doctorId) : null

// Utility functions for date/time formatting
export const parseScheduleDate = (dateString: string): Date => {
  return new Date(dateString)
}

export const formatScheduleDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const formatScheduleTime = (timeString: string): string => {
  // Convert "HH:mm:ss" to "HH:mm"
  return timeString.substring(0, 5)
}

// Date Services
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month, 1)
  const days: Date[] = []

  // Get days from previous month to fill first week
  const firstDay = new Date(date).getDay()
  const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1 // Adjust for Monday as first day

  for (let i = prevMonthDays; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i)
    days.push(prevDate)
  }

  // Get all days in current month
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  // Get days from next month to complete last week
  const lastDay = new Date(year, month + 1, 0).getDay()
  const nextMonthDays = lastDay === 0 ? 0 : 7 - lastDay

  for (let i = 1; i <= nextMonthDays; i++) {
    const nextDate = new Date(year, month + 1, i)
    days.push(nextDate)
  }

  return days
}

export const getWeekDays = (date: Date): Date[] => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday as first day

  const monday = new Date(date)
  monday.setDate(diff)

  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(monday)
    nextDate.setDate(monday.getDate() + i)
    days.push(nextDate)
  }

  return days
}

export const formatMonthYear = (date: Date): string => {
  return `Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
}

export const formatDayMonthYear = (date: Date): string => {
  return `${date.getDate()} Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
}

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${startDate.getDate()} Tháng ${startDate.getMonth() + 1} ${startDate.getFullYear()} - ${endDate.getDate()} Tháng ${endDate.getMonth() + 1} ${endDate.getFullYear()}`
}

export const formatTimeRange = (startTime: string, endTime: string): string => {
  const formattedStart = formatScheduleTime(startTime)
  const formattedEnd = formatScheduleTime(endTime)
  return `${formattedStart} - ${formattedEnd}`
}

export const getSchedulesForDay = (schedules: Schedule[], day: Date): Schedule[] => {
  return schedules.filter((sch) => {
    const scheduleDate = parseScheduleDate(sch.date)
    return (
      scheduleDate.getDate() === day.getDate() &&
      scheduleDate.getMonth() === day.getMonth() &&
      scheduleDate.getFullYear() === day.getFullYear()
    )
  })
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Calculate time difference between two time strings in hours
export const calculateTimeDifference = (startTime: string, endTime: string): number => {
  // Parse hours and minutes from time strings
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)

  // Handle cases where end time is on the next day (e.g., 21:00 to 01:00)
  let hoursDiff = endHours - startHours
  let minutesDiff = endMinutes - startMinutes

  if (hoursDiff < 0) {
    hoursDiff += 24 // Add 24 hours if end time is on the next day
  }

  if (minutesDiff < 0) {
    minutesDiff += 60
    hoursDiff -= 1
  }

  // Convert to decimal hours
  return hoursDiff + minutesDiff / 60
}

// Check if a date is in the current week relative to a reference date
export const isDateInCurrentWeek = (date: Date, referenceDate: Date): boolean => {
  const refDate = new Date(referenceDate)
  const weekStart = new Date(refDate)
  const day = refDate.getDay()
  const diff = refDate.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday as first day

  weekStart.setDate(diff)
  weekStart.setHours(0, 0, 0, 0)

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  return date >= weekStart && date <= weekEnd
}

// Check if a date is in the current month relative to a reference date
export const isDateInCurrentMonth = (date: Date, referenceDate: Date): boolean => {
  return date.getMonth() === referenceDate.getMonth() && date.getFullYear() === referenceDate.getFullYear()
}

export const scheduleService = {
  // Get schedules by doctorId (localStorage token)
  async getSchedules(): Promise<Schedule[]> {
    const response = await api.get(`/doctors/${doctorIdNumber}/schedules`)

    // Transform the API response to match the Schedule interface
    return response.data.map((item: any) => ({
      id: item.scheduleId.toString(),
      title: "Khám bệnh", // Default title since it's not in the API response
      shift: item.shift,
      startTime: item.startTime,
      endTime: item.endTime,
      date: item.workDate, // Map workDate to date
      roomNote: item.roomNote,
      floor: item.floor.toString(),
      building: item.building,
    }))
  },
}
