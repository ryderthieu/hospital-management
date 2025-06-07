export interface Appointment {
  id: string
  title: string
  description?: string
  startTime: string // Format: "HH:mm"
  endTime: string // Format: "HH:mm"
  date: Date
  type?: string
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  appointments: Appointment[]
  appointmentCount: number
}

export interface TimeSlot {
  label: string
  start: string // Format: "HH:mm"
  end: string // Format: "HH:mm"
}

export type ViewType = "month" | "week"

export interface AppointmentModalProps {
  selectedDay: Date | null
  appointments: Appointment[]
  onClose: () => void
}

export interface MonthViewProps {
  calendarDays: CalendarDay[]
  onDayClick: (day: Date) => void
}

export interface WeekViewProps {
  days: Date[]
  appointments: Appointment[]
  timeSlots: TimeSlot[]
}
