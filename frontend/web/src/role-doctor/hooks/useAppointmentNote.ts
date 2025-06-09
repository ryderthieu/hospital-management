"use client"

import { useState, useEffect, useCallback } from "react"
import type { AppointmentNote, NoteType } from "../types/appointmentNote"
// import { appointmentNoteService } from "../services/appointmentNoteServices"
import { message } from "antd"

// Mock data
const mockNotes: AppointmentNote[] = [
  {
    noteId: 1,
    appointmentId: 1,
    noteType: "DOCTOR",
    noteText: "Bệnh nhân có triệu chứng ho khan, cần theo dõi thêm",
    createdAt: "2025-04-21T09:30:00",
  },
  {
    noteId: 2,
    appointmentId: 1,
    noteType: "DOCTOR",
    noteText: "Đã tư vấn cho bệnh nhân về chế độ ăn uống",
    createdAt: "2025-04-21T09:45:00",
  },
]

export const useAppointmentNote = (appointmentId?: number) => {
  const [notes, setNotes] = useState<AppointmentNote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    if (!appointmentId) return

    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Use mock data
      setNotes(mockNotes)

      // // Original API call - commented out
      // const data = await appointmentNoteService.getNotesByAppointmentId(appointmentId)
      // setNotes(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải ghi chú"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const addNote = useCallback(
    async (noteType: NoteType, noteText: string) => {
      if (!appointmentId) return

      try {
        setLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newNote: AppointmentNote = {
          noteId: Date.now(),
          appointmentId,
          noteType,
          noteText,
          createdAt: new Date().toISOString(),
        }

        setNotes((prev) => [...prev, newNote])
        message.success("Thêm ghi chú thành công")
        return newNote

        // // Original API call - commented out
        // const newNote = await appointmentNoteService.createNote(appointmentId, { noteType, noteText })
        // setNotes((prev) => [...prev, newNote])
        // return newNote
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể thêm ghi chú"
        message.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [appointmentId],
  )

  const updateNote = useCallback(async (noteId: number, noteType?: NoteType, noteText?: string) => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedNote = { noteId, noteType, noteText, createdAt: new Date().toISOString() }
      setNotes((prev) => prev.map((note) => (note.noteId === noteId ? { ...note, ...updatedNote } : note)))
      message.success("Cập nhật ghi chú thành công")
      return updatedNote

      // // Original API call - commented out
      // const updatedNote = await appointmentNoteService.updateNote(noteId, { noteType, noteText })
      // setNotes((prev) => prev.map((note) => (note.noteId === noteId ? updatedNote : note)))
      // return updatedNote
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật ghi chú"
      message.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteNote = useCallback(async (noteId: number) => {
    try {
      setLoading(true)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setNotes((prev) => prev.filter((note) => note.noteId !== noteId))
      message.success("Xóa ghi chú thành công")
      return true

      // // Original API call - commented out
      // await appointmentNoteService.deleteNote(noteId)
      // setNotes((prev) => prev.filter((note) => note.noteId !== noteId))
      // return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa ghi chú"
      message.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    notes,
    loading,
    error,
    addNote,
    updateNote,
    deleteNote,
    refreshNotes: fetchNotes,
  }
}
