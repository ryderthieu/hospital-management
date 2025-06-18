export enum NoteType {
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

export interface AppointmentNote {
  noteId?: number
  appointmentId?: number
  noteType: NoteType
  content: string
  createdAt?: string
  doctorName?: string // Thêm field tên bác sĩ
}

export interface CreateAppointmentNoteRequest {
  noteType: NoteType
  content: string
}

export interface UpdateAppointmentNoteRequest {
  noteType?: NoteType
  content?: string
}
