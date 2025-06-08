import { useState, useEffect, useCallback } from "react"
import type { AppointmentNote, NoteType } from "../types/appointmentNote"
import { appointmentNoteService } from "../services/appointmentNoteServices"
import { message } from "antd"

export const useAppointmentNote = (appointmentId?: number) => {
  const [notes, setNotes] = useState<AppointmentNote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      const data = await appointmentNoteService.getNotesByAppointmentId(appointmentId)
      setNotes(data)
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
        const newNote = await appointmentNoteService.createNote(appointmentId, { noteType, noteText })
        setNotes((prev) => [...prev, newNote])
        message.success("Thêm ghi chú thành công")
        return newNote
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
      const updatedNote = await appointmentNoteService.updateNote(noteId, { noteType, noteText })
      setNotes((prev) => prev.map((note) => (note.noteId === noteId ? updatedNote : note)))
      message.success("Cập nhật ghi chú thành công")
      return updatedNote
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
      await appointmentNoteService.deleteNote(noteId)
      setNotes((prev) => prev.filter((note) => note.noteId !== noteId))
      message.success("Xóa ghi chú thành công")
      return true
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
