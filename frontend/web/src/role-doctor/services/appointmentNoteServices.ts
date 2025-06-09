import type {
  AppointmentNote,
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
} from "../types/appointmentNote"
import { api } from "../../services/api"

export const appointmentNoteService = {
  // Lấy lời dặn bác sĩ theo appointmentId
  async getNotesByAppointmentId(appointmentId: number): Promise<AppointmentNote[]> {
    const response = await api.get(`/appointments/${appointmentId}/notes`)
    return response.data
  },

  // Tạo lời dặn bác sĩ theo appointmentId
  async createNote(appointmentId: number, note: CreateAppointmentNoteRequest): Promise<AppointmentNote> {
    const response = await api.post(`/appointments/${appointmentId}/notes`, note)
    return response.data
  },

  // Cập nhật lời dặn bác sĩ theo appointmentId
  async updateNote(noteId: number, note: UpdateAppointmentNoteRequest): Promise<AppointmentNote> {
    const response = await api.put(`/appointments/notes/${noteId}`, note)
    return response.data
  },

  // Xóa lời dặn bác sĩ theo appointmentId
  async deleteNote(noteId: number): Promise<void> {
    await api.delete(`/appointments/notes/${noteId}`)
  },
}
