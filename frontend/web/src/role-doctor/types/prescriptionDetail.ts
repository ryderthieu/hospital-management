import type { Medicine } from "./medicin"
import type { Prescription } from "./prescription"

export interface PrescriptionDetail {
  detailId: number
  prescription: Prescription
  medicine: Medicine
  dosage: string
  frequency: string
  duration: string
  quantity: number // Thêm field quantity
  prescriptionNotes?: string
  createdAt: string // ISO format datetime
}
