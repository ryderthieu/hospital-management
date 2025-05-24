export interface DateOption {
  id: number
  day: string
  date: number
  disabled?: boolean
}

export interface Medication {
  id: string
  name: string
  dosage: string
  time: string
  instructions: string
  taken?: boolean
  status?: "pending" | "taken" | "canceled"
}

export interface TimeSlot {
  id: string
  period: string
  icon: "morning" | "noon" | "evening"
  medications: Medication[]
}

export interface DailySchedule {
  date: string
  timeSlots: TimeSlot[]
}

export interface Prescription {
  id: string
  specialty: string
  examinationDate: string
  doctor: string
}
export interface MedicationDetail {
  id: string
  name: string
  route: string 
  timesPerDay: number 
  quantityPerDay: number 
  timeOfUse: string 
  isScheduled: boolean
  hasReminder: boolean 
}
export interface PrescriptionDetail {
  id: string
  specialty: string
  code: string
  medications: MedicationDetail[]
}
export interface MedicationReminder {
  id: string
  time: string
  dosage: string
  isActive: boolean
}
export interface MedicationReminderSettings {
  medicationId: string
  medicationName: string
  remainingQuantity: number
  unit: string
  startDate: string 
  repeatFrequency: string 
  reminders: MedicationReminder[]
  notificationsEnabled: boolean
}
export interface RepeatOption {
  id: string
  label: string
  value: string
}
export interface CustomReminderSettings {
  repeatType: "daily" | "weekly" | "monthly" | "custom"
  repeatInterval: number 
  selectedDays?: number[]
  endDate?: string 
  totalDoses?: number 
}