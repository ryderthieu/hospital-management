"use client"

import { useState, useEffect } from "react"
import { message } from "antd"
import { appointmentNoteService } from "../services/appointmentNoteServices"
import type { AppointmentNote, CreateAppointmentNoteRequest } from "../types/appointmentNote"
import type { NoteType } from "../types/appointmentNote"

export const useAppointmentNote = (appointmentId?: number) => {
  const [notes, setNotes] = useState<AppointmentNote[]>([])
  const [loading, setLoading] = useState(false)

  const loadNotes = async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      const data = await appointmentNoteService.getNotesByAppointmentId(appointmentId)
      setNotes(data)
    } catch (error) {
      console.error("Error loading notes:", error)
      message.error("Không thể tải ghi chú")
    } finally {
      setLoading(false)
    }
  }

  const addNote = async (noteType: NoteType, noteText: string) => {
    if (!appointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn")
      return
    }

    try {
      const noteRequest: CreateAppointmentNoteRequest = {
        noteType,
        noteText,
      }

      await appointmentNoteService.createNote(appointmentId, noteRequest)
      message.success("Thêm ghi chú thành công")
      await loadNotes() // Refresh notes
    } catch (error) {
      console.error("Error adding note:", error)
      message.error("Không thể thêm ghi chú")
    }
  }

  const deleteNote = async (noteId: number) => {
    try {
      await appointmentNoteService.deleteNote(noteId)
      message.success("Xóa ghi chú thành công")
      await loadNotes() // Refresh notes
    } catch (error) {
      console.error("Error deleting note:", error)
      message.error("Không thể xóa ghi chú")
    }
  }

  const refreshNotes = () => {
    loadNotes()
  }

  useEffect(() => {
    loadNotes()
  }, [appointmentId])

  return {
    notes,
    loading,
    addNote,
    deleteNote,
    refreshNotes,
  }
}
