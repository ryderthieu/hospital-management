export interface Medicine {
  medicineId: number
  medicineName: string
  manufactor?: string
  category: string
  description?: string
  usage: string
  unit: string
  insuranceDiscountPercent: number
  insuranceDiscount?: number
  sideEffects?: string
  price: number
  quantity?: number
}

export interface PrescriptionDetail {
  detailId?: number
  prescriptionId?: number
  medicine: Medicine
  dosage: string
  frequency: string
  duration: string
  prescriptionNotes?: string
  createdAt?: string
}

export interface Prescription {
  prescriptionId?: number
  appointmentId: number
  followUpDate?: string
  isFollowUp: boolean
  diagnosis: string
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartRate: number
  bloodSugar: number
  note?: string
  createdAt?: string
  prescriptionDetails: PrescriptionDetail[]
}

export interface CreatePrescriptionRequest {
  appointmentId: number
  followUpDate?: string
  isFollowUp: boolean
  diagnosis: string
  systolicBloodPressure: number
  diastolicBloodPressure: number
  heartRate: number
  bloodSugar: number
  note?: string
  prescriptionDetails: PrescriptionDetailRequest[]
}

export interface PrescriptionDetailRequest {
  medicineId: number
  dosage: string
  frequency: string
  duration: string
  prescriptionNotes?: string
}

export interface UpdatePrescriptionRequest {
  followUpDate?: string
  isFollowUp?: boolean
  diagnosis?: string
  systolicBloodPressure?: number
  diastolicBloodPressure?: number
  heartRate?: number
  bloodSugar?: number
  note?: string
}

export interface VitalSigns {
  systolicBloodPressure?: number
  diastolicBloodPressure?: number
  heartRate?: number
  bloodSugar?: number
  temperature?: number
  weight?: number
  height?: number
}

export interface MedicalHistory {
  id: string
  clinic: string
  date: string
  diagnosis: string
  doctor: string
}
