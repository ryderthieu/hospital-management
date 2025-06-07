"use client"

import { useState, useEffect } from "react"
import type { Indication } from "../types/medical"
import { fetchMedicalOrder, updateMedicalOrder } from "../services/medicalService"

export const useMedicalOrderModal = () => {
  const [indications, setIndications] = useState<Indication[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadIndications = async () => {
      try {
        setLoading(true)
        const data = await fetchMedicalOrder()
        setIndications(data)
      } catch (error) {
        console.error("Error loading indications:", error)
      } finally {
        setLoading(false)
      }
    }

    loadIndications()
  }, [])

  const updateField = (index: number, field: keyof Indication, value: string) => {
    const updatedIndications = [...indications]
    updatedIndications[index] = {
      ...updatedIndications[index],
      [field]: value,
    }
    setIndications(updatedIndications)
  }

  const deleteIndication = async (index: number) => {
    const indicationToDelete = indications[index]
    if (indicationToDelete.id) {
      try {
        await deleteIndication(indicationToDelete.id)
      } catch (error) {
        console.error("Error deleting indication:", error)
      }
    }

    const updatedIndications = [...indications]
    updatedIndications.splice(index, 1)
    setIndications(updatedIndications)
  }

  const save = async () => {
    try {
      setLoading(true)
      await updateMedicalOrder(indications)
      return true
    } catch (error) {
      console.error("Error saving medical order:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    indications,
    searchInput,
    setSearchInput,
    loading,
    updateField,
    deleteIndication,
    save,
  }
}
