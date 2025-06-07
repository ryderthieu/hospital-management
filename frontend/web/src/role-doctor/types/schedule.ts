export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  date: Date
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  appointments: Appointment[]
  appointmentCount: number
}

export type ViewType = "month" | "week"

export interface TimeSlot {
  label: string
  start: string
  end: string
}
