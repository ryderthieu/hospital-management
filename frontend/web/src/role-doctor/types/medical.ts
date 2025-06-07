export interface Indication {
  id?: string
  indicationType: string
  room: string
  expectedTime: string
}

export interface MedicalOrder {
  id?: string
  patientName: string
  patientCode: string
  date: string
  time: string
  indications: Indication[]
  doctorNote?: string
}

export interface Medication {
  id?: string
  name: string
  dosage: string
  unit: string
  frequency: string
  instructions: string
  quantity: string
}

export interface Prescription {
  id?: string
  patientName: string
  patientCode: string
  date: string
  time: string
  medications: Medication[]
  doctorNote?: string
}

export interface VitalSignData {
  systolic: number
  diastolic: number
  pulse: number
  glucose: number
}
