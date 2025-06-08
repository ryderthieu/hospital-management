import type {
  Medicine,
  Prescription,
  CreatePrescriptionRequest,
  UpdatePrescriptionRequest,
  PrescriptionDetail,
  VitalSigns,
  MedicalHistory,
} from "../types/prescription"
import { api } from "../../services/api"

export const medicineService = {
  // Get all medicines
  async getAllMedicines(): Promise<Medicine[]> {
    const response = await api.get("/pharmacy/medicines")
    return response.data
  },

  // Search medicines
  async searchMedicines(name?: string, category?: string): Promise<Medicine[]> {
    const params = new URLSearchParams()
    if (name) params.append("name", name)
    if (category) params.append("category", category)

    const response = await api.get(`/pharmacy/medicines/search?${params.toString()}`)
    return response.data
  },

  // Get medicine by ID
  async getMedicineById(id: number): Promise<Medicine> {
    const response = await api.get(`/pharmacy/medicines/${id}`)
    return response.data
  },
}

export const prescriptionService = {
  // Create prescription
  async createPrescription(request: CreatePrescriptionRequest): Promise<Prescription> {
    const response = await api.post("/pharmacy/prescriptions", request)
    return response.data
  },

  // Get prescription by ID
  async getPrescription(id: number): Promise<Prescription> {
    const response = await api.get(`/pharmacy/prescriptions/${id}`)
    return response.data
  },

  // Get prescription by appointment ID
  async getPrescriptionByAppointment(appointmentId: number): Promise<Prescription> {
    const response = await api.get(`/pharmacy/prescriptions/appointment/${appointmentId}`)
    return response.data
  },

  // Update prescription
  async updatePrescription(id: number, request: UpdatePrescriptionRequest): Promise<Prescription> {
    const response = await api.put(`/pharmacy/prescriptions/${id}`, request)
    return response.data
  },

  // Delete prescription
  async deletePrescription(id: number): Promise<void> {
    await api.delete(`/pharmacy/prescriptions/${id}`)
  },

  // Add medicine to prescription
  async addMedicineToPrescription(request: any): Promise<PrescriptionDetail> {
    const response = await api.post("/pharmacy/prescriptions/detail", request)
    return response.data
  },

  // Get prescription details
  async getPrescriptionDetails(prescriptionId: number): Promise<PrescriptionDetail[]> {
    const response = await api.get(`/pharmacy/prescriptions/detail/${prescriptionId}`)
    return response.data
  },

  // Update prescription detail
  async updatePrescriptionDetail(detailId: number, request: any): Promise<PrescriptionDetail> {
    const response = await api.put(`/pharmacy/prescriptions/detail/${detailId}`, request)
    return response.data
  },

  // Delete prescription detail
  async deletePrescriptionDetail(detailId: number): Promise<void> {
    await api.delete(`/pharmacy/prescriptions/detail/${detailId}`)
  },

  // Add vital signs
  async addVitalSigns(appointmentId: number, vitalSigns: VitalSigns): Promise<VitalSigns> {
    const response = await api.post(`/pharmacy/prescriptions/${appointmentId}/vital-signs`, vitalSigns)
    return response.data
  },

  // Get vital signs
  async getVitalSigns(appointmentId: number): Promise<VitalSigns> {
    const response = await api.get(`/pharmacy/prescriptions/${appointmentId}/vital-signs`)
    return response.data
  },

  // Get patient medical history
  async getMedicalHistory(patientId: string): Promise<MedicalHistory[]> {
    const response = await api.get(`/pharmacy/prescriptions/patient/${patientId}/medical-history`)
    return response.data
  },
}
