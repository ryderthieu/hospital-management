import type { PatientDetail } from "../types/patient"
import { api } from "../../services/api"

export const patientService = {
  // Lấy các thông tin cơ bản cuộc hẹn của bệnh nhân appointmentId (thông tin cá nhân, thông tin bác sĩ, chỉ số sinh học)
  async getPatientDetail(appointmentId: number): Promise<PatientDetail> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },


}
