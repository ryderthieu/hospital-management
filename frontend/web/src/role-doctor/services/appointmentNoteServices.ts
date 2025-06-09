import type {
  AppointmentNote,
  CreateAppointmentNoteRequest,
  UpdateAppointmentNoteRequest,
} from "../types/appointmentNote"
import { api } from "../../services/api"

export const appointmentNoteService = {
  // Get notes by appointment ID
  async getNotesByAppointmentId(appointmentId: number): Promise<AppointmentNote[]> {
    const response = await api.get(`/appointments/${appointmentId}/notes`)
    return response.data
  },

  // Create note
  async createNote(appointmentId: number, note: CreateAppointmentNoteRequest): Promise<AppointmentNote> {
    const response = await api.post(`/appointments/${appointmentId}/notes`, note)
    return response.data
  },

  // Update note
  async updateNote(noteId: number, note: UpdateAppointmentNoteRequest): Promise<AppointmentNote> {
    const response = await api.put(`/appointments/notes/${noteId}`, note)
    return response.data
  },

  // Delete note
  async deleteNote(noteId: number): Promise<void> {
    await api.delete(`/appointments/notes/${noteId}`)
  },
}
