export interface MedicalIndication {
  id: string
  indicationType: string
  room: string
  expectedTime: string
  status: "pending" | "in_progress" | "completed"
  notes?: string
}

export interface CreateMedicalOrderRequest {
  appointmentId: number
  indications: MedicalIndicationRequest[]
  doctorNotes?: string
}

export interface MedicalIndicationRequest {
  indicationType: string
  room: string
  expectedTime: string
  notes?: string
}
