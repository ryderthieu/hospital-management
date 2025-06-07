
export type RootStackParamList = {
  MainTabs: undefined
  Home: undefined
  Appointments: undefined
  AppointmentDetail: { appointment: Appointment }
  CompletedAppointmentDetail: { appointment: Appointment }
}

export interface Appointment {
  id: string
  date: string
  time: string
  doctorName: string
  specialty: string
  imageUrl: string
  status: "upcoming" | "completed"
  department?: string
  room?: string
  queueNumber?: number
  patientName?: string
  patientBirthday?: string
  patientGender?: string
  patientLocation?: string
  appointmentFee?: string
  codes?: {
    appointmentCode?: string
    transactionCode?: string
    patientCode?: string
  }
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  imageUrl: string
  rating: number
  experience: string
  availability: string[]
}
