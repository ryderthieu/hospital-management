import type { PatientDetail } from "../types/patient"
import type { Prescription } from "../types/prescription"
import { api } from "../../services/api"

export const patientService = {
  // Lấy các thông tin cơ bản cuộc hẹn của bệnh nhân appointmentId (thông tin cá nhân, thông tin bác sĩ, chỉ số sinh học)
  async getPatientDetail(appointmentId: number): Promise<PatientDetail> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },


  // Thêm AppointmnetNote (lời dặn bác sĩ)

  // Thêm sinh hiệu

  // Thêm chỉ định xét nghiệm

  // Lấy lịch sử khám (appointmnet trước)

  // Lấy lịch sử xét nghiệm (appointmnet trước)
}
