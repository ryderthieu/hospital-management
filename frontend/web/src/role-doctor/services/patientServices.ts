import type { PatientDetail } from "../types/patient"
import { api } from "../../services/api"

export const patientService = {
  // Get patient detail by appointment ID
  async getPatientDetail(appointmentId: number): Promise<PatientDetail> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  // Update patient information
  async updatePatientInfo(appointmentId: number, patientData: Partial<PatientDetail>): Promise<PatientDetail> {
    const response = await api.put(`/appointments/${appointmentId}`, patientData)
    return response.data
  },

  // Update patient status
  async updatePatientStatus(appointmentId: number, statusType: string, status: string): Promise<void> {
    await api.patch(`/appointments/${appointmentId}`, {
      statusType,
      status,
    })
  },
}
