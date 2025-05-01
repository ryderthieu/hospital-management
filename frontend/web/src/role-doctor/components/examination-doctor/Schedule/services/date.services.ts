import type { Appointment } from "../types/schedule.types"

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

export const formatMonthYear = (date: Date, locale = "vi-VN"): string => {
  return `${date.getDate()} Tháng ${date.getMonth() + 1} ${date.getFullYear()}`
}

export const formatDateRange = (startDate: Date, endDate: Date): string => {
  return `${startDate.getDate()} Tháng ${startDate.getMonth() + 1} ${startDate.getFullYear()} - ${endDate.getDate()} Tháng ${endDate.getMonth() + 1} ${endDate.getFullYear()}`
}

export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`
}

export const getAppointmentsForDay = (appointments: Appointment[], day: Date): Appointment[] => {
  return appointments.filter(
    (app) =>
      app.date.getDate() === day.getDate() &&
      app.date.getMonth() === day.getMonth() &&
      app.date.getFullYear() === day.getFullYear(),
  )
}

export const getAppointmentsForTimeSlot = (
  appointments: Appointment[],
  day: Date,
  slotStart: string,
  slotEnd: string,
): Appointment[] => {
  return appointments.filter(
    (app) =>
      app.date.getDate() === day.getDate() &&
      app.date.getMonth() === day.getMonth() &&
      app.date.getFullYear() === day.getFullYear() &&
      app.startTime <= slotStart &&
      app.endTime >= slotEnd,
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
