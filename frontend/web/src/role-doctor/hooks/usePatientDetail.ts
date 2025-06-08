"use client"

import { useState, useEffect, useCallback } from "react"
import type { PatientDetail } from "../types/patient"
import type { VitalSigns, MedicalHistory } from "../types/prescription"
import type { TestResult } from "../types/service"
import type { AppointmentNote } from "../types/appointmentNote"
import { patientService } from "../services/patientServices"
import { prescriptionService } from "../services/prescriptionServices"
import { serviceOrderService } from "../services/serviceOrderServices"
import { appointmentNoteService } from "../services/appointmentNoteServices"
import { message } from "antd"

export const usePatientDetail = (appointmentId?: number) => {
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [vitalSigns, setVitalSigns] = useState<VitalSigns | null>(null)
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [notes, setNotes] = useState<AppointmentNote[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPatientDetail = useCallback(async () => {
    if (!appointmentId) return

    try {
      setLoading(true)
      setError(null)

      // Fetch patient details
      const detail = await patientService.getPatientDetail(appointmentId)
      setPatientDetail(detail)

      // Fetch additional data in parallel
      const [vitalSignsData, historyData, resultsData, notesData] = await Promise.all([
        prescriptionService.getVitalSigns(appointmentId).catch(() => null),
        prescriptionService.getMedicalHistory(detail.id),
        serviceOrderService.getTestResults(appointmentId),
        appointmentNoteService.getNotesByAppointmentId(appointmentId),
      ])

      setVitalSigns(vitalSignsData)
      setMedicalHistory(historyData)
      setTestResults(resultsData)
      setNotes(notesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể tải thông tin bệnh nhân"
      setError(errorMessage)
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    fetchPatientDetail()
  }, [fetchPatientDetail])

  const updatePatientInfo = useCallback(
    async (patientData: Partial<PatientDetail>) => {
      if (!appointmentId) return

      try {
        const updatedDetail = await patientService.updatePatientInfo(appointmentId, patientData)
        setPatientDetail(updatedDetail)
        message.success("Cập nhật thông tin thành công")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật thông tin"
        message.error(errorMessage)
      }
    },
    [appointmentId],
  )

  const addVitalSigns = useCallback(
    async (newVitalSigns: VitalSigns) => {
      if (!appointmentId) return

      try {
        const updatedVitalSigns = await prescriptionService.addVitalSigns(appointmentId, newVitalSigns)
        setVitalSigns(updatedVitalSigns)
        message.success("Thêm sinh hiệu thành công")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể thêm sinh hiệu"
        message.error(errorMessage)
      }
    },
    [appointmentId],
  )

  const updatePatientStatus = useCallback(
    async (statusType: string, status: string) => {
      if (!appointmentId) return

      try {
        await patientService.updatePatientStatus(appointmentId, statusType, status)
        message.success("Cập nhật trạng thái thành công")

        // Update local state
        if (patientDetail) {
          if (statusType === "testing") {
            setPatientDetail({ ...patientDetail, testingStatus: status })
          } else if (statusType === "medication") {
            setPatientDetail({ ...patientDetail, medicationStatus: status })
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật trạng thái"
        message.error(errorMessage)
      }
    },
    [appointmentId, patientDetail],
  )

  const addNote = useCallback(
    async (noteType: "DOCTOR" | "PATIENT", noteText: string) => {
      if (!appointmentId) return

      try {
        const newNote = await appointmentNoteService.createNote(appointmentId, { noteType, noteText })
        setNotes((prev) => [...prev, newNote])
        message.success("Thêm ghi chú thành công")
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể thêm ghi chú"
        message.error(errorMessage)
      }
    },
    [appointmentId],
  )

  return {
    patientDetail,
    vitalSigns,
    medicalHistory,
    testResults,
    notes,
    loading,
    error,
    updatePatientInfo,
    addVitalSigns,
    updatePatientStatus,
    addNote,
    refreshData: fetchPatientDetail,
  }
}
