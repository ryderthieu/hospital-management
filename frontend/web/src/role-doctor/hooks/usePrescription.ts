"use client"

import { useState, useEffect, useCallback } from "react"
import type { Medicine, CreatePrescriptionRequest, PrescriptionDetail, Prescription } from "../types/prescription"
import { medicineService, prescriptionService } from "../services/prescriptionServices"
import { message } from "antd"

export const usePrescription = (appointmentId?: number) => {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [selectedMedicines, setSelectedMedicines] = useState<PrescriptionDetail[]>([])
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")

  // Fetch existing prescription if available
  useEffect(() => {
    if (appointmentId) {
      const fetchPrescription = async () => {
        try {
          setLoading(true)
          const data = await prescriptionService.getPrescriptionByAppointment(appointmentId)
          setPrescription(data)

          // If prescription exists, load its details
          if (data && data.prescriptionDetails) {
            setSelectedMedicines(data.prescriptionDetails)
          }
        } catch (err) {
          // Prescription might not exist yet, which is fine
          console.log("No existing prescription found")
        } finally {
          setLoading(false)
        }
      }

      fetchPrescription()
    }
  }, [appointmentId])

  const searchMedicines = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true)
      const results = await medicineService.searchMedicines(searchTerm)
      setMedicines(results)
    } catch (err) {
      message.error("Không thể tìm kiếm thuốc")
    } finally {
      setLoading(false)
    }
  }, [])

  const addMedicine = useCallback((medicine: Medicine) => {
    const newMedicine: PrescriptionDetail = {
      medicine,
      dosage: "1",
      frequency: "Ngày 1 lần, buổi sáng",
      duration: "7 ngày",
      prescriptionNotes: "",
    }
    setSelectedMedicines((prev) => [...prev, newMedicine])
  }, [])

  const updateMedicineField = useCallback((index: number, field: keyof PrescriptionDetail, value: any) => {
    setSelectedMedicines((prev) => prev.map((med, i) => (i === index ? { ...med, [field]: value } : med)))
  }, [])

  const removeMedicine = useCallback((index: number) => {
    setSelectedMedicines((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const createOrUpdatePrescription = useCallback(
    async (prescriptionData: Partial<CreatePrescriptionRequest>) => {
      if (!appointmentId) return null

      try {
        setLoading(true)

        let result: Prescription

        if (prescription?.prescriptionId) {
          // Update existing prescription
          result = await prescriptionService.updatePrescription(prescription.prescriptionId, prescriptionData as any)

          // Update prescription details
          for (const detail of selectedMedicines) {
            if (detail.detailId) {
              // Update existing detail
              await prescriptionService.updatePrescriptionDetail(detail.detailId, detail)
            } else {
              // Add new detail
              await prescriptionService.addMedicineToPrescription({
                prescriptionId: prescription.prescriptionId,
                medicineId: detail.medicine.medicineId,
                dosage: detail.dosage,
                frequency: detail.frequency,
                duration: detail.duration,
                prescriptionNotes: detail.prescriptionNotes,
              })
            }
          }
        } else {
          // Create new prescription
          const newPrescription: CreatePrescriptionRequest = {
            appointmentId,
            isFollowUp: prescriptionData.isFollowUp || false,
            diagnosis: prescriptionData.diagnosis || "",
            systolicBloodPressure: prescriptionData.systolicBloodPressure || 0,
            diastolicBloodPressure: prescriptionData.diastolicBloodPressure || 0,
            heartRate: prescriptionData.heartRate || 0,
            bloodSugar: prescriptionData.bloodSugar || 0,
            followUpDate: prescriptionData.followUpDate,
            note: prescriptionData.note,
            prescriptionDetails: selectedMedicines.map((detail) => ({
              medicineId: detail.medicine.medicineId,
              dosage: detail.dosage,
              frequency: detail.frequency,
              duration: detail.duration,
              prescriptionNotes: detail.prescriptionNotes,
            })),
          }

          result = await prescriptionService.createPrescription(newPrescription)
        }

        setPrescription(result)
        message.success("Lưu đơn thuốc thành công")
        return result
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể lưu đơn thuốc"
        message.error(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [appointmentId, prescription, selectedMedicines],
  )

  return {
    medicines,
    selectedMedicines,
    prescription,
    loading,
    searchInput,
    setSearchInput,
    searchMedicines,
    addMedicine,
    updateMedicineField,
    removeMedicine,
    createOrUpdatePrescription,
    setSelectedMedicines,
  }
}

export const usePrescriptionModal = (appointmentId?: number) => {
  const {
    selectedMedicines: medications,
    prescription,
    loading,
    searchInput,
    setSearchInput,
    updateMedicineField,
    removeMedicine,
    createOrUpdatePrescription,
  } = usePrescription(appointmentId)

  const updateField = useCallback(
    (index: number, field: string, value: any) => {
      updateMedicineField(index, field as keyof PrescriptionDetail, value)
    },
    [updateMedicineField],
  )

  const deleteMed = useCallback(
    (index: number) => {
      removeMedicine(index)
    },
    [removeMedicine],
  )

  const save = useCallback(async () => {
    // Get form data from the modal
    const prescriptionData = {
      diagnosis: "Chẩn đoán từ form",
      isFollowUp: false,
      systolicBloodPressure: 120,
      diastolicBloodPressure: 80,
      heartRate: 75,
      bloodSugar: 100,
    }

    const result = await createOrUpdatePrescription(prescriptionData)
    return result
  }, [createOrUpdatePrescription])

  return {
    medications,
    prescription,
    loading,
    searchInput,
    setSearchInput,
    updateField,
    deleteMed,
    save,
  }
}
