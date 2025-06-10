import type React from "react"
import type { ImageSourcePropType } from "react-native"

// Navigation types
export type RootStackParamList = {
  SpecialistSearch: undefined
  DoctorList: { specialty: string }
  BookAppointment: { doctor: Doctor }
  SymptomSelection: {
    doctor: Doctor
    selectedDate: string
    selectedTime: string
    hasInsurance: boolean
    scheduleId: number
    patientId: number
  }
  BookingConfirmation: {
    doctor: Doctor
    selectedDate: string
    selectedTime: string
    hasInsurance: boolean
    selectedSymptoms: string[]
    location?: string
  }
  Payment: {
    doctor: Doctor
    selectedDate: string
    selectedTime: string
    hasInsurance: boolean
    selectedSymptoms: string[]
  }
  PaymentSuccess: {
    doctor: Doctor
    selectedDate: string
    selectedTime: string
    transactionId: string
    appointmentId?: string
    selectedSymptoms?: string[]
    hasInsurance?: boolean
  }
  AppointmentDetail: {
    appointment?: AppointmentDetail
    doctor?: Doctor
    selectedDate?: string
    selectedTime?: string
    transactionId?: string
    selectedSymptoms?: string[]
    hasInsurance?: boolean
  }
  SortOptions: undefined
  FilterOptions: undefined
  // Có thể thêm các màn hình khác
  Profile: undefined
  AppointmentHistory: undefined
}

// Appointment Detail interface để match với component có sẵn
export interface AppointmentDetail {
  id: string
  date: string
  time: string
  doctorName: string
  specialty: string
  imageUrl: string
  status: string
  department: string
  room: string
  queueNumber: number
  patientName: string
  patientBirthday: string
  patientGender: string
  patientLocation: string
  appointmentFee: string
  codes: {
    appointmentCode: string
    transactionCode: string
    patientCode: string
  }
}

// Specialty types với union type để hỗ trợ cả SVG và image
export type Specialty = {
  id: string
  name: string
  count: string
} & (
  | {
      iconType: "svg"
      icon: React.ComponentType<any>
    }
  | {
      iconType: "image"
      icon: ImageSourcePropType
    }
)

// Doctor interface với các trường bổ sung
export interface Doctor {
  id: string
  name: string
  specialty: string
  room?: string
  price: string
  image: ImageSourcePropType
  // Các trường bổ sung
  rating?: number
  reviewCount?: number // Thêm số lượng đánh giá
  experience?: string
  education?: string
  languages?: string[]
  availableSlots?: TimeSlot[]
  bio?: string
  joinDate?: string // Thêm ngày tham gia cho sort functionality
  isOnline?: boolean // Thêm trạng thái online
  status?: "active" | "busy" | "offline" // Thêm status chi tiết hơn
}

// Date option interface - Updated để match với DateCard component
export interface DateOption {
  id: string // ISO date string
  day: string
  date: string
  scheduleIds: number[];
  disabled?: boolean
  isToday?: boolean
  isTomorrow?: boolean
  isWeekend?: boolean
  availableSlots?: number // Số slot có sẵn trong ngày
}

// Time slot interface - Updated để match với TimeSlot component
export interface TimeSlot {
  id: string
  time: string
  available: boolean
  price?: string
  isSelected?: boolean // Thêm trạng thái selected
  isPast?: boolean // Thêm check nếu slot đã qua
}

// Symptom interface
export interface Symptom {
  id: string
  name: string
  category?: string
}

// Payment types
export type PaymentMethod = "credit_card" | "momo" | "cash" | "bank_transfer"

export interface PaymentInfo {
  method: PaymentMethod
  amount: number
  currency: string
  transactionId?: string
  status: "pending" | "completed" | "failed"
}

// Appointment interface
export interface Appointment {
  id: string
  doctorId: string
  doctor: Doctor
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  patientName: string
  patientPhone: string
  hasInsurance?: boolean // Thêm thông tin bảo hiểm
  symptoms?: string[] // Thêm triệu chứng
  payment?: PaymentInfo // Thêm thông tin thanh toán
  notes?: string
  createdAt: string
  updatedAt?: string
}

// Filter options
export interface FilterOptions {
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  availability?: "today" | "tomorrow" | "this_week"
  experience?: string
  specialty?: string
  location?: string
  isOnline?: boolean
}

// Sort options - Updated để match với SortOptionsScreen
export type SortOption = "newest" | "oldest" | "popular" | "price_low_high" | "price_high_low"

// Thêm type cho sort option details
export interface SortOptionDetail {
  id: SortOption
  label: string
  description: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form validation types
export interface BookingFormData {
  patientName: string
  patientPhone: string
  selectedDate: string
  selectedTime: string
  hasInsurance: boolean // Thêm bảo hiểm
  symptoms: string[] // Thêm triệu chứng
  paymentMethod: PaymentMethod // Thêm phương thức thanh toán
  notes?: string
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp?: string
}

// Search types
export interface SearchFilters {
  query?: string
  specialty?: string
  priceRange?: {
    min: number
    max: number
  }
  rating?: number
  sortBy?: SortOption
}

// Component prop types
export interface DoctorCardProps {
  doctor: Doctor
  onPress?: () => void
  isFavorite?: boolean
  onFavoritePress?: () => void
  showStatus?: boolean
  isOnline?: boolean
  showRating?: boolean
}

export interface DateCardProps {
  date: DateOption
  isSelected: boolean
  onPress: () => void
  showAvailability?: boolean
  availableSlots?: number
}

export interface TimeSlotProps {
  time: string
  isSelected: boolean
  isAvailable: boolean
  price?: string
  onPress: () => void
  isPast?: boolean
}

export interface SimilarDoctorCardProps {
  doctor: Doctor
  onPress?: () => void
  showRating?: boolean
}

// Day part type cho time selection
export type DayPart = "morning" | "afternoon" | "evening"

// Time slot generation options
export interface TimeSlotOptions {
  date: string
  dayPart?: DayPart
  doctorId?: string
  duration?: number // minutes
  breakTime?: number // minutes between slots
}

// Booking summary type
export interface BookingSummary {
  doctor: Doctor
  date: DateOption
  time: string
  hasInsurance: boolean
  symptoms: string[]
  paymentMethod: PaymentMethod
  totalPrice: string
  estimatedDuration: string
}

// Notification types
export interface Notification {
  id: string
  type: "appointment_reminder" | "appointment_confirmed" | "appointment_cancelled" | "doctor_message"
  title: string
  message: string
  data?: any
  read: boolean
  createdAt: string
}

// User preferences
export interface UserPreferences {
  language: "vi" | "en"
  notifications: {
    appointment_reminders: boolean
    doctor_messages: boolean
    promotional: boolean
  }
  theme: "light" | "dark" | "system"
  defaultInsurance: boolean
  defaultPaymentMethod: PaymentMethod
}

// Loading states
export interface LoadingState {
  doctors: boolean
  appointments: boolean
  timeSlots: boolean
  booking: boolean
  payment: boolean
}

// Error states
export interface ErrorState {
  doctors?: string
  appointments?: string
  timeSlots?: string
  booking?: string
  payment?: string
  network?: string
}
