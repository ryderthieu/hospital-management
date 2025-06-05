import { useState } from "react"
import { VitalSignData } from "./types"
import { addVitalSign } from "../../../services/vitalSignApi"

export const useAddVitalSign = (onClose: () => void) => {
  const [formData, setFormData] = useState<VitalSignData>({
    systolic: 0,
    diastolic: 0,
    pulse: 0,
    glucose: 0,
  })

  const handleChange = (key: keyof VitalSignData, value: number) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    await addVitalSign(formData)
    onClose()
  }

  return {
    formData,
    handleChange,
    handleSubmit,
  }
}
