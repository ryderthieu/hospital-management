export interface Schedule {
  id: string
  title: "Khám bệnh"
  shift: string
  startTime: string // Format: "HH:mm:ss" from backend
  endTime: string // Format: "HH:mm:ss" from backend
  workDate: string // Format: "YYYY-MM-DD" from backend
  roomNote: string
  floor: string
  building: string
}

export interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  schedules: Schedule[]
  scheduleCount: number
}

export interface TimeSlot {
  label: string
  start: string // Format: "HH:mm"
  end: string // Format: "HH:mm"
}

export type ViewType = "month" | "week"

export interface ScheduleModalProps {
  selectedDay: Date | null
  schedules: Schedule[]
  onClose: () => void
}

export interface MonthViewProps {
  calendarDays: CalendarDay[]
  onDayClick: (day: Date) => void
}

export interface WeekViewProps {
  days: Date[]
  schedules: Schedule[]
  timeSlots: TimeSlot[]
}
