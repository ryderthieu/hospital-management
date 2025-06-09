import type { PatientDetail } from "../types/patient"
import { api } from "../../services/api"

export const patientService = {
  // Lấy các thông tin cơ bản của bệnh nhân (sinh hiệu, thông tin cá nhân...)
  async getPatientDetail(appointmentId: number): Promise<PatientDetail> {
    const response = await api.get(`/appointments/${appointmentId}`)
    return response.data
  },

  // Lấy thông tin toa thuốc (appointment hiện tại, có lẽ không cần do rỗng)
  async updatePatientInfo(appointmentId: number, patientData: Partial<PatientDetail>): Promise<PatientDetail> {
    const response = await api.put(`/appointments/${appointmentId}`, patientData)
    return response.data
  },

  // Kê toa thuốc (appointment hiện tại)
  async updatePatientStatus(appointmentId: number, statusType: string, status: string): Promise<void> {
    await api.patch(`/appointments/${appointmentId}`, {
      statusType,
      status,
    })
  },

  // Thêm AppointmnetNote (lời dặn bác sĩ)

  // Thêm sinh hiệu

  // Thêm chỉ định xét nghiệm

  // Lấy lịch sử khám (appointmnet trước)

  // Lấy lịch sử xét nghiệm (appointmnet trước)
}
