import type { Schedule } from "./types"
import { api } from "../../../../../services/api"

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
  return `${startTime} - ${endTime}`
}

export const getSchedulesForDay = (schedules: Schedule[], day: Date): Schedule[] => {
  return schedules.filter(
    (sch) =>
      sch.date.getDate() === day.getDate() &&
      sch.date.getMonth() === day.getMonth() &&
      sch.date.getFullYear() === day.getFullYear(),
  )
}

export const isToday = (date: Date): boolean => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

export const scheduleService = {
 // Get schedules by doctorId (localStorage token)
  async getSchedules(): Promise<Schedule[]> {
    const response = await api.get<Schedule[]>("/doctors/schedules")
    return response.data
  },
}

