"use client"

import { useState, useCallback } from "react"
import type { MedicalIndication, CreateMedicalOrderRequest } from "../types/medicalOrder"
import { medicalOrderService } from "../services/medicalOrderServices"
import { message } from "antd"

export const useMedicalOrder = () => {
  const [indications, setIndications] = useState<MedicalIndication[]>([])
  const [loading, setLoading] = useState(false)

  const addIndication = useCallback((indication: MedicalIndication) => {
    setIndications((prev) => [...prev, indication])
  }, [])

  const updateIndication = useCallback((index: number, field: keyof MedicalIndication, value: any) => {
    setIndications((prev) =>
      prev.map((indication, i) => (i === index ? { ...indication, [field]: value } : indication)),
    )
  }, [])

  const removeIndication = useCallback((index: number) => {
    setIndications((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const createMedicalOrder = useCallback(async (request: CreateMedicalOrderRequest) => {
    try {
      setLoading(true)
      await medicalOrderService.createMedicalOrder(request)
      message.success("Tạo chỉ định thành công")
    } catch (err) {
      message.error("Không thể tạo chỉ định")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    indications,
    loading,
    addIndication,
    updateIndication,
    removeIndication,
    createMedicalOrder,
    setIndications,
  }
}
