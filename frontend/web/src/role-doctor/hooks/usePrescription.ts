"use client"

import { useState, useRef } from "react"
import { message } from "antd"
import { pharmacyService } from "../services/pharmacyServices"
import type { Medicine } from "../types/medicin"
import type { PrescriptionDetail } from "../types/prescriptionDetail"
import type { Prescription } from "../types/prescription"

export const usePrescriptionModal = (appointmentId?: number) => {
  const [medications, setMedications] = useState<PrescriptionDetail[]>([])
  const [currentPrescriptionId, setCurrentPrescriptionId] = useState<number | null>(null) // ID của prescription hiện tại
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchLoading, setSearchLoading] = useState(false)
  // Sử dụng ref để theo dõi trạng thái đã tải
  const hasLoadedRef = useRef(false)

  const searchMedicines = async (searchTerm: string): Promise<Medicine[]> => {
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
  }

  const addMedicine = (medicine: Medicine) => {
    // Tạo một prescription rỗng để thỏa mãn type
    const emptyPrescription: Prescription = {
      prescriptionId: 0,
      patientId: 0,
      appointmentId: appointmentId || 0,
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
  }

  const updateField = (index: number, field: keyof PrescriptionDetail, value: any) => {
    if (index < 0 || index >= medications.length) return

    setMedications((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)))
  }

  const deleteMed = (index: number) => {
    if (index < 0 || index >= medications.length) return

    setMedications((prev) => prev.filter((_, i) => i !== index))
  }

  // Lưu toa thuốc (gửi API)
  const save = async (prescriptionData: any) => {
    if (!appointmentId) {
      message.error("Không tìm thấy thông tin cuộc hẹn")
      return null
    }

    if (!medications || medications.length === 0) {
      message.warning("Chưa có thuốc nào trong toa thuốc")
      return null
    }

    try {
      setLoading(true)

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
        // Nếu đã có prescription ID, thực hiện update
        savedPrescription = await pharmacyService.updatePrescription(currentPrescriptionId, fullPrescriptionData)
        message.success("Cập nhật toa thuốc thành công")
      } else {
        // Nếu chưa có prescription ID, tạo mới
        savedPrescription = await pharmacyService.createPrescription(appointmentId, fullPrescriptionData)
        setCurrentPrescriptionId(savedPrescription.prescriptionId)
        message.success("Tạo toa thuốc thành công")
      }

      // Clear medications after successful save
      setMedications([])
      // Reset trạng thái đã tải
      hasLoadedRef.current = false

      return savedPrescription
    } catch (error) {
      console.error("Error saving prescription:", error)
      message.error("Không thể lưu toa thuốc")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Load existing prescription để edit
  const loadExistingPrescription = (prescription: Prescription | null) => {
    if (!prescription) return

    // Chỉ hiển thị thông báo và cập nhật dữ liệu nếu chưa tải
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

      // Đánh dấu đã tải
      hasLoadedRef.current = true
    }
  }

  // Reset trạng thái đã tải khi modal đóng
  const resetLoadState = () => {
    hasLoadedRef.current = false
  }

  // Check if prescription exists để quyết định tạo mới hay update
  const checkExistingPrescription = async () => {
    if (!appointmentId) return null

    try {
      const existingPrescription = await pharmacyService.getCurrentPrescriptionByAppointmentId(appointmentId)
      if (existingPrescription && existingPrescription.prescriptionId) {
        setCurrentPrescriptionId(existingPrescription.prescriptionId)
        return existingPrescription
      }
      return null
    } catch (error) {
      // Prescription chưa tồn tại
      setCurrentPrescriptionId(null)
      return null
    }
  }

  return {
    medications,
    setMedications,
    currentPrescriptionId,
    loading,
    searchInput,
    setSearchInput,
    searchLoading,
    searchMedicines,
    addMedicine,
    updateField,
    deleteMed,
    save,
    loadExistingPrescription,
    checkExistingPrescription,
    resetLoadState,
  }
}
