"use client"

import { useState, useEffect } from "react"
import { message } from "antd"
import { pharmacyService } from "../services/pharmacyServices"
import type { Prescription } from "../types/prescription"

export const usePrescriptionHistory = (patientId?: number) => {
  const [prescriptionHistory, setPrescriptionHistory] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(false)

  const loadPrescriptionHistory = async () => {
    if (!patientId) return

    try {
      setLoading(true)
      const data = await pharmacyService.getPrescriptionHistoryByPatientId(patientId)
      setPrescriptionHistory(data)
    } catch (error) {
      console.error("Error loading prescription history:", error)
      message.error("Không thể tải lịch sử đơn thuốc")
    } finally {
      setLoading(false)
    }
  }

  const refreshHistory = () => {
    loadPrescriptionHistory()
  }

  useEffect(() => {
    loadPrescriptionHistory()
  }, [patientId])

  return {
    prescriptionHistory,
    loading,
    refreshHistory,
  }
}
