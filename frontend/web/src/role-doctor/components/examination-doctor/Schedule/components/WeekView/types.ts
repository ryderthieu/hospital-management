import type { Appointment, TimeSlot } from "../../types/schedule.types"

export interface WeekViewProps {
  days: Date[]
  appointments: Appointment[]
  timeSlots: TimeSlot[]
}
