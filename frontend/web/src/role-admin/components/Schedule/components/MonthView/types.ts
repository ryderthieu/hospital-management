import type { CalendarDay } from "../../types/schedule.types"

export interface MonthViewProps {
  calendarDays: CalendarDay[]
  onDayClick: (day: Date) => void
}
