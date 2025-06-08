"use client"

import { useState, useEffect, useCallback } from "react"
import type { PatientDetail } from "../types/patient"
import type { VitalSigns, MedicalHistory } from "../types/prescription"
import type { TestResult } from "../types/service"
import type { AppointmentNote } from "../types/appointmentNote"
// import { patientService } from "../services/patientServices"
// import { prescriptionService } from "../services/prescriptionServices"
// import { serviceOrderService } from "../services/serviceOrderServices"
// import { appointmentNoteService } from "../services/appointmentNoteServices"
import { message } from "antd"

// Mock data
const mockPatientDetail: PatientDetail = {
  id: "BN22521584",
  name: "Trần Nhật Trường",
  avatar: "/placeholder.svg?height=96&width=96",
  clinic: "Phòng khám Nội tổng hợp",
  doctor: "BS. Nguyễn Văn A",
  doctorCode: "BS001",
  appointmentTime: "09:20",
  appointmentDate: "21/04/2025",
  appointmentDateTime: "2025-04-21T09:20:00",
  diagnosis: "Viêm họng cấp",
  doctorNotes: "Bệnh nhân cần nghỉ ngơi và uống nhiều nước",
  followUpDate: "28/04/2025",
  hasFollowUp: true,
  email: "truong.tran@email.com",
  phone: "0123456789",
  birthDate: "15/03/2003",
  medicalHistory: "Không có tiền sử bệnh lý đặc biệt",
  height: "175",
  weight: "65",
  roomNumber: "305",
  testingStatus: "Đang xét nghiệm",
  medicationStatus: "Chưa kê thuốc",
}

const mockVitalSigns: VitalSigns = {
  systolicBloodPressure: 120,
  diastolicBloodPressure: 80,
  heartRate: 75,
  bloodSugar: 95,
  temperature: 36.5,
  weight: 65,
  height: 175,
}

const mockMedicalHistory: MedicalHistory[] = [
  {
    id: "1",
    clinic: "Phòng khám Nội tổng hợp",
    date: "15/03/2025",
    diagnosis: "Cảm cúm thông thường",
    doctor: "BS. Nguyễn Văn A",
  },
  {
    id: "2",
    clinic: "Phòng khám Tim mạch",
    date: "10/02/2025",
    diagnosis: "Khám sức khỏe định kỳ",
    doctor: "BS. Lê Thị B",
  },
]

const mockTestResults: TestResult[] = [
  {
    orderId: 1,
    serviceName: "Xét nghiệm máu tổng quát",
    expectedTime: "2 giờ",
    actualTime: "1.5 giờ",
    result: "Bình thường",
    status: "COMPLETED",
    roomId: 101,
  },
  {
    orderId: 2,
    serviceName: "Chụp X-quang phổi",
    expectedTime: "30 phút",
    status: "ORDERED",
    roomId: 102,
  },
]

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

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Use mock data instead of API calls
      setPatientDetail(mockPatientDetail)
      setVitalSigns(mockVitalSigns)
      setMedicalHistory(mockMedicalHistory)
      setTestResults(mockTestResults)
      setNotes(mockNotes)

      // // Original API calls - commented out
      // const detail = await patientService.getPatientDetail(appointmentId)
      // setPatientDetail(detail)

      // const [vitalSignsData, historyData, resultsData, notesData] = await Promise.all([
      //   prescriptionService.getVitalSigns(appointmentId).catch(() => null),
      //   prescriptionService.getMedicalHistory(detail.id),
      //   serviceOrderService.getTestResults(appointmentId),
      //   appointmentNoteService.getNotesByAppointmentId(appointmentId),
      // ])

      // setVitalSigns(vitalSignsData)
      // setMedicalHistory(historyData)
      // setTestResults(resultsData)
      // setNotes(notesData)
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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update local state with mock data
        setPatientDetail((prev) => (prev ? { ...prev, ...patientData } : null))
        message.success("Cập nhật thông tin thành công")

        // // Original API call - commented out
        // const updatedDetail = await patientService.updatePatientInfo(appointmentId, patientData)
        // setPatientDetail(updatedDetail)
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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update local state with mock data
        setVitalSigns(newVitalSigns)
        message.success("Thêm sinh hiệu thành công")

        // // Original API call - commented out
        // const updatedVitalSigns = await prescriptionService.addVitalSigns(appointmentId, newVitalSigns)
        // setVitalSigns(updatedVitalSigns)
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
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        message.success("Cập nhật trạng thái thành công")

        // Update local state
        if (patientDetail) {
          if (statusType === "testing") {
            setPatientDetail({ ...patientDetail, testingStatus: status })
          } else if (statusType === "medication") {
            setPatientDetail({ ...patientDetail, medicationStatus: status })
          }
        }

        // // Original API call - commented out
        // await patientService.updatePatientStatus(appointmentId, statusType, status)
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
        // Simulate API call
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

        // // Original API call - commented out
        // const newNote = await appointmentNoteService.createNote(appointmentId, { noteType, noteText })
        // setNotes((prev) => [...prev, newNote])
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
