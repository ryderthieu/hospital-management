"use client"

import { useState, useEffect } from "react"
import type { Medication } from "../types/medical"
import { fetchMedications, updatePrescription, deleteMedication } from "../services/medicalService"

export const usePrescriptionModal = () => {
  const [medications, setMedications] = useState<Medication[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadMedications = async () => {
      try {
        setLoading(true)
        const data = await fetchMedications()
        setMedications(data)
      } catch (error) {
        console.error("Error loading medications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMedications()
  }, [])

  const updateField = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...medications]
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    }
    setMedications(updatedMedications)
  }

  const deleteMed = async (index: number) => {
    const medToDelete = medications[index]
    if (medToDelete.id) {
      try {
        await deleteMedication(medToDelete.id)
      } catch (error) {
        console.error("Error deleting medication:", error)
      }
    }

    const updatedMedications = [...medications]
    updatedMedications.splice(index, 1)
    setMedications(updatedMedications)
  }

  const save = async () => {
    try {
      setLoading(true)
      await updatePrescription(medications)
      return true
    } catch (error) {
      console.error("Error saving prescription:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    medications,
    searchInput,
    setSearchInput,
    loading,
    updateField,
    deleteMed,
    save,
  }
}
