"use client"

import { useState } from "react"
import type { VitalSignData } from "../types/medicin"
import { addVitalSign } from "../services/medicalService"

export const useAddVitalSign = (onClose: () => void) => {
  const [formData, setFormData] = useState<VitalSignData>({
    systolic: 120,
    diastolic: 80,
    pulse: 75,
    glucose: 100,
  })

  const handleChange = (key: keyof VitalSignData, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    try {
      await addVitalSign(formData)
      onClose()
      return true
    } catch (error) {
      console.error("Error adding vital sign:", error)
      return false
    }
  }

  return {
    formData,
    handleChange,
    handleSubmit,
  }
}
