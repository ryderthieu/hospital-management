import type { Appointment } from "../../types/schedule.types"

export interface AppointmentModalProps {
  selectedDay: Date | null
  appointments: Appointment[]
  onClose: () => void
}
