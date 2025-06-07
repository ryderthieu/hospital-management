import type { Appointment } from "./types"

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

export const getAppointmentsForDay = (appointments: Appointment[], day: Date): Appointment[] => {
  return appointments.filter(
    (app) =>
      app.date.getDate() === day.getDate() &&
      app.date.getMonth() === day.getMonth() &&
      app.date.getFullYear() === day.getFullYear(),
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

// Mock Services
export const generateMockAppointments = (): Appointment[] => {
  const today = new Date()
  const appointments: Appointment[] = []

  // Add fixed appointments for today
  appointments.push({
    id: `appointment-${today.toISOString()}-1`,
    title: "Tư vấn sức khỏe",
    description: "P[05] Tư vấn dinh dưỡng",
    startTime: "13:00",
    endTime: "18:00",
    date: new Date(today),
  })

  appointments.push({
    id: `appointment-${today.toISOString()}-2`,
    title: "Khám tổng quát",
    description: "P[08] Khám sức khỏe định kỳ",
    startTime: "07:00",
    endTime: "11:00",
    date: new Date(today),
  })

  // Add some random appointments for the month
  for (let i = 1; i <= 15; i++) {
    const date = new Date()
    date.setDate(today.getDate() + i)

    if (Math.random() > 0.6) {
      appointments.push({
        id: `appointment-${date.toISOString()}-${i}`,
        title: "Khám bệnh",
        description: "P[08] Dị ứng - Miễn dịch lâm sàng",
        startTime: Math.random() > 0.5 ? "07:00" : "13:00",
        endTime: Math.random() > 0.5 ? "11:00" : "16:00",
        date: new Date(date),
      })
    }
  }

  return appointments
}
