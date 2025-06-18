"use client"

import { useState, useEffect, useCallback } from "react"
import type { Indication } from "../types/medicin"
import {
  fetchMedicalOrder,
  updateMedicalOrder,
  deleteIndication as deleteIndicationAPI,
} from "../services/medicalService"
import { message } from "antd"

export const useMedicalOrderModal = () => {
  const [indications, setIndications] = useState<Indication[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const loadIndications = useCallback(async () => {
    if (initialized) return // Prevent multiple calls

    try {
      setLoading(true)
      const data = await fetchMedicalOrder()
      setIndications(data)
      setInitialized(true)
    } catch (error) {
      console.error("Error loading indications:", error)
      message.error("Không thể tải danh sách chỉ định")
    } finally {
      setLoading(false)
    }
  }, [initialized])

  useEffect(() => {
    loadIndications()
  }, [loadIndications])

  const updateField = useCallback((index: number, field: keyof Indication, value: string) => {
    setIndications((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return updated
    })
  }, [])

  const deleteIndication = useCallback(
    async (index: number) => {
      const indicationToDelete = indications[index]

      try {
        if (indicationToDelete.id) {
          await deleteIndicationAPI(indicationToDelete.id)
        }

        setIndications((prev) => prev.filter((_, i) => i !== index))
        message.success("Xóa chỉ định thành công")
      } catch (error) {
        console.error("Error deleting indication:", error)
        message.error("Không thể xóa chỉ định")
      }
    },
    [indications],
  )

  const save = useCallback(async () => {
    try {
      setLoading(true)
      await updateMedicalOrder(indications)
      message.success("Lưu chỉ định thành công")
      return true
    } catch (error) {
      console.error("Error saving medical order:", error)
      message.error("Không thể lưu chỉ định")
      return false
    } finally {
      setLoading(false)
    }
  }, [indications])

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
