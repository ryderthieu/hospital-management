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

export const useMedicalOrderModal = () => {
  const { indications, updateIndication, removeIndication, setIndications } = useMedicalOrder()
  const [searchInput, setSearchInput] = useState("")

  const updateField = useCallback(
    (index: number, field: string, value: any) => {
      updateIndication(index, field as keyof MedicalIndication, value)
    },
    [updateIndication],
  )

  const deleteIndication = useCallback(
    (index: number) => {
      removeIndication(index)
    },
    [removeIndication],
  )

  const save = useCallback(async () => {
    // Implementation for saving medical orders
    message.success("Lưu chỉ định thành công")
  }, [])

  return {
    indications,
    searchInput,
    setSearchInput,
    updateField,
    deleteIndication,
    save,
  }
}
