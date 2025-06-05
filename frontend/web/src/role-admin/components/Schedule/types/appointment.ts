export interface Appointment {
    id: string
    title: string
    date: string // ISO date string
    startTime: string // Format: "HH:mm"
    endTime: string // Format: "HH:mm"
    description?: string
    type?: string
  }
  