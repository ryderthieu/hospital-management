"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { message } from "antd"
import { patientService, type UpdatePatientRequest } from "../services/patientServices"
import { pharmacyService } from "../services/pharmacyServices"
import { appointmentNoteService } from "../services/appointmentNoteServices"
import { getServiceOrdersByAppointmentId } from "../services/serviceOrderServices"
import type { PatientDetail } from "../types/patient"
import type { Prescription } from "../types/prescription"
import type { PrescriptionDetail } from "../types/prescriptionDetail"
import type { Medicine } from "../types/medicin"
import type { ServiceOrder } from "../types/serviceOrder"
import type { AppointmentNote, CreateAppointmentNoteRequest } from "../types/appointmentNote"
import type { Appointment } from "../types/appointment"

interface UsePatientDetailReturn {
  // Patient data
  patientDetail: PatientDetail | null
  prescription: Prescription | null
  serviceOrders: ServiceOrder[]
  appointmentNotes: AppointmentNote[]
  appointment: Appointment | null

  // Prescription management data
  medications: PrescriptionDetail[]
  currentPrescriptionId: number | null
  searchInput: string
  searchLoading: boolean

  // Loading states
  loading: boolean
  prescriptionLoading: boolean
  serviceOrdersLoading: boolean
  notesLoading: boolean
  saving: boolean

  // Patient actions
  fetchPatientDetail: (appointmentId: number) => Promise<void>
  fetchPrescription: (appointmentId: number) => Promise<void>
  fetchServiceOrders: (appointmentId: number) => Promise<void>
  fetchAppointmentNotes: (appointmentId: number) => Promise<void>
  createAppointmentNote: (appointmentId: number, note: CreateAppointmentNoteRequest) => Promise<void>
  updateAppointmentNote: (noteId: number, note: CreateAppointmentNoteRequest) => Promise<void>
  deleteAppointmentNote: (noteId: number) => Promise<void>
  updatePatientInfo: (appointmentId: number, updateData: UpdatePatientRequest) => Promise<void>
  updateVitalSigns: (appointmentId: number, vitalSigns: any) => Promise<void>

  // Prescription management actions
  searchMedicines: (searchTerm: string) => Promise<Medicine[]>
  addMedicine: (medicine: Medicine) => void
  updateMedicationField: (index: number, field: keyof PrescriptionDetail, value: any) => void
  deleteMedication: (index: number) => void
  savePrescription: (prescriptionData: any) => Promise<Prescription | null>
  loadExistingPrescription: (prescription: Prescription | null) => void
  checkExistingPrescription: () => Promise<Prescription | null>
  resetPrescriptionLoadState: () => void
  setSearchInput: (value: string) => void
  setMedications: (medications: PrescriptionDetail[]) => void

  // Refresh all data
  refreshAll: (appointmentId: number) => Promise<void>
}

export const usePatientDetail = (initialAppointmentId?: number): UsePatientDetailReturn => {
  // Patient State
  const [patientDetail, setPatientDetail] = useState<PatientDetail | null>(null)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([])
  const [appointmentNotes, setAppointmentNotes] = useState<AppointmentNote[]>([])
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  // Prescription Management State
  const [medications, setMedications] = useState<PrescriptionDetail[]>([])
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState<number | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  const hasLoadedRef = useRef(false)

  // Loading states
  const [loading, setLoading] = useState(false)
  const [prescriptionLoading, setPrescriptionLoading] = useState(false)
  const [serviceOrdersLoading, setServiceOrdersLoading] = useState(false)
  const [notesLoading, setNotesLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // =============================================================================
  // PATIENT DETAIL FUNCTIONS
  // =============================================================================

  // Fetch patient detail
  const fetchPatientDetail = useCallback(async (appointmentId: number) => {
    try {
      setLoading(true)
      const data = await patientService.getPatientDetail(appointmentId)
      setPatientDetail(data)
    } catch (error) {
      console.error("Error fetching patient detail:", error)
      message.error("Không thể tải thông tin bệnh nhân")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch prescription
  const fetchPrescription = useCallback(async (appointmentId: number) => {
    try {
      setPrescriptionLoading(true)
      const data = await pharmacyService.getCurrentPrescriptionByAppointmentId(appointmentId)
      const result = Array.isArray(data) ? data[data.length - 1] : data //do db bị sai nên dẫn đến 1 appointmentId có nhiều đơn thuốc
      setPrescription(result)
      
      // Auto-update currentPrescriptionId when prescription is fetched
      if (data?.prescriptionId) {
        setCurrentPrescriptionId(data.prescriptionId)
      }
    } catch (error) {
      console.error("Error fetching prescription:", error)
      setPrescription(null)
      setCurrentPrescriptionId(null)
    } finally {
      setPrescriptionLoading(false)
    }
  }, [])

  // Fetch service orders
  const fetchServiceOrders = useCallback(async (appointmentId: number) => {
    try {
      setServiceOrdersLoading(true)
      const data = await getServiceOrdersByAppointmentId(appointmentId)
      setServiceOrders(data)
    } catch (error) {
      console.error("Error fetching service orders:", error)
      message.error("Không thể tải danh sách chỉ định")
      setServiceOrders([])
    } finally {
      setServiceOrdersLoading(false)
    }
  }, [])

  // Fetch appointment notes
  const fetchAppointmentNotes = useCallback(async (appointmentId: number) => {
    try {
      setNotesLoading(true)
      const data = await appointmentNoteService.getNotesByAppointmentId(appointmentId)
      setAppointmentNotes(data)
    } catch (error) {
      console.error("Error fetching appointment notes:", error)
      setAppointmentNotes([])
    } finally {
      setNotesLoading(false)
    }
  }, [])


  // Create appointment note
  const createAppointmentNote = useCallback(
    async (appointmentId: number, note: CreateAppointmentNoteRequest) => {
      try {
        await appointmentNoteService.createNote(appointmentId, note)
        message.success("Thêm ghi chú thành công")
        await fetchAppointmentNotes(appointmentId)
      } catch (error) {
        console.error("Error creating appointment note:", error)
        message.error("Không thể thêm ghi chú")
      }
    },
    [fetchAppointmentNotes],
  )

  // Update appointment note
  const updateAppointmentNote = useCallback(
    async (noteId: number, note: CreateAppointmentNoteRequest) => {
      try {
        await appointmentNoteService.updateNote(noteId, note)
        message.success("Cập nhật ghi chú thành công")
        if (patientDetail) {
          await fetchAppointmentNotes(Number(patientDetail.appointmentId))
        }
      } catch (error) {
        console.error("Error updating appointment note:", error)
        message.error("Không thể cập nhật ghi chú")
      }
    },
    [patientDetail, fetchAppointmentNotes],
  )

  // Delete appointment note
  const deleteAppointmentNote = useCallback(
    async (noteId: number) => {
      try {
        await appointmentNoteService.deleteNote(noteId)
        message.success("Xóa ghi chú thành công")
        if (patientDetail) {
          await fetchAppointmentNotes(Number(patientDetail.appointmentId))
        }
      } catch (error) {
        console.error("Error deleting appointment note:", error)
        message.error("Không thể xóa ghi chú")
      }
    },
    [patientDetail, fetchAppointmentNotes],
  )

  // Update patient information
  const updatePatientInfo = useCallback(
    async (appointmentId: number, updateData: UpdatePatientRequest) => {
      try {
        setSaving(true)
        await patientService.updatePatientDetail(appointmentId, updateData)
        message.success("Cập nhật thông tin thành công")
        await fetchPatientDetail(appointmentId)
      } catch (error) {
        console.error("Error updating patient info:", error)
        message.error("Không thể cập nhật thông tin")
        throw error
      } finally {
        setSaving(false)
      }
    },
    [fetchPatientDetail],
  )

  // Update vital signs
  const updateVitalSigns = useCallback(
    async (appointmentId: number, vitalSigns: any) => {
      try {
        await patientService.updateVitalSigns(appointmentId, vitalSigns)
        message.success("Cập nhật sinh hiệu thành công")
        await fetchPatientDetail(appointmentId)
      } catch (error) {
        console.error("Error updating vital signs:", error)
        message.error("Không thể cập nhật sinh hiệu")
        throw error
      }
    },
    [fetchPatientDetail],
  )

  // =============================================================================
  // PRESCRIPTION MANAGEMENT FUNCTIONS
  // =============================================================================

  // Search medicines
  const searchMedicines = useCallback(async (searchTerm: string): Promise<Medicine[]> => {
    if (!searchTerm.trim()) {
      return []
    }

    try {
      setSearchLoading(true)
      const results = await pharmacyService.searchMedicine(searchTerm)
      return results
    } catch (error) {
      console.error("Error searching medicines:", error)
      message.error("Không thể tìm kiếm thuốc")
      return []
    } finally {
      setSearchLoading(false)
    }
  }, [])

  // Add medicine to prescription
  const addMedicine = useCallback((medicine: Medicine) => {
    if (!initialAppointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn")
      return
    }

    // Create empty prescription to satisfy type requirements
    const emptyPrescription: Prescription = {
      prescriptionId: 0,
      patientId: 0,
      appointmentId: initialAppointmentId,
      followUpDate: "",
      isFollowUp: false,
      diagnosis: "",
      systolicBloodPressure: 0,
      diastolicBloodPressure: 0,
      heartRate: 0,
      bloodSugar: 0,
      note: "",
      createdAt: new Date().toISOString(),
      prescriptionDetails: [],
    }

    const newMedication: PrescriptionDetail = {
      detailId: Date.now(),
      medicine,
      dosage: "1",
      frequency: "Ngày 1 lần, buổi sáng",
      duration: "7 ngày",
      quantity: 7,
      prescriptionNotes: "Trước ăn",
      createdAt: new Date().toISOString(),
      prescription: emptyPrescription,
    }

    setMedications((prev) => [...prev, newMedication])
    message.success(`Đã thêm ${medicine.medicineName}`)
  }, [initialAppointmentId])

  // Update medication field
  const updateMedicationField = useCallback((index: number, field: keyof PrescriptionDetail, value: any) => {
    if (index < 0 || index >= medications.length) return

    setMedications((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }, [medications.length])

  // Delete medication
  const deleteMedication = useCallback((index: number) => {
    if (index < 0 || index >= medications.length) return

    setMedications((prev) => prev.filter((_, i) => i !== index))
  }, [medications.length])

  // Save prescription
  const savePrescription = useCallback(async (prescriptionData: Prescription): Promise<Prescription | null> => {
    if (!initialAppointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn")
      return null
    }

    if (!medications || medications.length === 0) {
      message.warning("Chưa có thuốc nào trong toa thuốc")
      return null
    }

    try {
      setSaving(true)

      const fullPrescriptionData = {
        ...prescriptionData,
        prescriptionDetails: medications.map((med) => ({
          medicineId: med.medicine?.medicineId || 0,
          dosage: med.dosage || "1",
          frequency: med.frequency || "Ngày 1 lần",
          duration: med.duration || "7 ngày",
          quantity: med.quantity || 1,
          prescriptionNotes: med.prescriptionNotes || "",
        })),
      }

      let savedPrescription: Prescription

      if (currentPrescriptionId) {
        // Update existing prescription
        console.log("test prescriptionId", currentPrescriptionId )
        console.log("test full data cập nhật",fullPrescriptionData)
        savedPrescription = await pharmacyService.updatePrescription(currentPrescriptionId, fullPrescriptionData)
        message.success("Cập nhật toa thuốc thành công")
      } else {
        // Create new prescription
        savedPrescription = await pharmacyService.createPrescription(initialAppointmentId, fullPrescriptionData)
        setCurrentPrescriptionId(savedPrescription.prescriptionId)
        message.success("Tạo toa thuốc thành công")
      }

      // Refresh prescription data after save
      await fetchPrescription(initialAppointmentId)
      
      // Clear medications after successful save
      setMedications([])
      hasLoadedRef.current = false

      return savedPrescription
    } catch (error) {
      console.error("Error saving prescription:", error)
      message.error("Không thể lưu toa thuốc")
      return null
    } finally {
      setSaving(false)
    }
  }, [initialAppointmentId, medications, currentPrescriptionId, fetchPrescription])

  // Load existing prescription for editing
  const loadExistingPrescription = useCallback((prescription: Prescription | null) => {
    if (!prescription) return

    // Only load if not already loaded
    if (!hasLoadedRef.current) {
      setCurrentPrescriptionId(prescription.prescriptionId)

      // Convert prescription details to medications format
      const loadedMedications: PrescriptionDetail[] =
        prescription.prescriptionDetails?.map((detail) => ({
          ...detail,
          detailId: detail.detailId || Date.now() + Math.random(),
        })) || []

      setMedications(loadedMedications)
      message.info("Đã tải toa thuốc hiện tại")
      hasLoadedRef.current = true
    }
  }, [])

  // Check existing prescription
  const checkExistingPrescription = useCallback(async (): Promise<Prescription | null> => {
    if (!initialAppointmentId) return null

    try {
      const existingPrescription = await pharmacyService.getCurrentPrescriptionByAppointmentId(initialAppointmentId)
      if (existingPrescription && existingPrescription.prescriptionId) {
        setCurrentPrescriptionId(existingPrescription.prescriptionId)
        return existingPrescription
      }
      return null
    } catch (error) {
      setCurrentPrescriptionId(null)
      return null
    }
  }, [initialAppointmentId])

  // Reset prescription load state
  const resetPrescriptionLoadState = useCallback(() => {
    hasLoadedRef.current = false
  }, [])

  // =============================================================================
  // COMBINED FUNCTIONS
  // =============================================================================

  // Refresh all data
  const refreshAll = useCallback(
    async (appointmentId: number) => {
      await Promise.all([
        fetchPatientDetail(appointmentId),
        fetchPrescription(appointmentId),
        fetchServiceOrders(appointmentId),
        fetchAppointmentNotes(appointmentId),
      ])
    },
    [fetchPatientDetail, fetchPrescription, fetchServiceOrders, fetchAppointmentNotes],
  )

  // Initial load
  useEffect(() => {
    if (initialAppointmentId) {
      refreshAll(initialAppointmentId)
    }
  }, [initialAppointmentId, refreshAll])

  return {
    // Patient Data
    patientDetail,
    prescription,
    serviceOrders,
    appointmentNotes,
    appointment,

    // Prescription Management Data
    medications,
    currentPrescriptionId,
    searchInput,
    searchLoading,

    // Loading States
    loading,
    prescriptionLoading,
    serviceOrdersLoading,
    notesLoading,
    saving,

    // Patient Actions
    fetchPatientDetail,
    fetchPrescription,
    fetchServiceOrders,
    fetchAppointmentNotes,
    createAppointmentNote,
    updateAppointmentNote,
    deleteAppointmentNote,
    updatePatientInfo,
    updateVitalSigns,

    // Prescription Management Actions
    searchMedicines,
    addMedicine,
    updateMedicationField,
    deleteMedication,
    savePrescription,
    loadExistingPrescription,
    checkExistingPrescription,
    resetPrescriptionLoadState,
    setSearchInput,
    setMedications,

    // Combined Actions
    refreshAll,
  }
}