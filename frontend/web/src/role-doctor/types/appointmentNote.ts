export enum NoteType {
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
}

export interface AppointmentNote {
  noteId?: number
  appointmentId?: number
  noteType: NoteType
  noteText: string
  createdAt?: string
  doctorName?: string // Thêm field tên bác sĩ
}

export interface CreateAppointmentNoteRequest {
  noteType: NoteType
  noteText: string
}

export interface UpdateAppointmentNoteRequest {
  noteType?: NoteType
  noteText?: string
}
