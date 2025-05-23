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
  route: string // Đường dùng
  timesPerDay: number // Lần/ngày
  quantityPerDay: number // Số lượng/ngày
  timeOfUse: string // Buổi dùng
  isScheduled: boolean
  hasReminder: boolean // Track whether a reminder has been set
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
  startDate: string // Ngày bắt đầu - thêm mới
  repeatFrequency: string // Thời gian lặp (VD: "MỖI NGÀY", "MỖI TUẦN", etc.) - thêm mới
  reminders: MedicationReminder[]
  notificationsEnabled: boolean
}

// Thêm interface mới cho các tùy chọn lặp lại
export interface RepeatOption {
  id: string
  label: string
  value: string
}

// Thêm interface cho cài đặt tùy chỉnh
export interface CustomReminderSettings {
  repeatType: "daily" | "weekly" | "monthly" | "custom"
  repeatInterval: number // Số ngày/tuần/tháng
  selectedDays?: number[] // Cho lặp hàng tuần (0-6, 0 = Chủ nhật)
  endDate?: string // Ngày kết thúc (tùy chọn)
  totalDoses?: number // Tổng số liều cần uống
}