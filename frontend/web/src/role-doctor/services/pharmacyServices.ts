import type { PatientDetail } from "../types/patient"
import type { Prescription } from "../types/prescription"
import { api } from "../../services/api"

export const pharmacyService = {

  // Lấy thông tin toa thuốc theo appointmentId (appointment hiện tại)
  async getCurrentPrescriptionByAppointmentId(appointmentId: number): Promise<Prescription> {
    const response = await api.get(`/pharmacy/prescription/${appointmentId}`)
    return response.data
  },

  // Kê toa thuốc theo appointmentId (appointment hiện tại)
  async postPrescriptionByAppointmentId(appointmentId: number, prescription: Prescription): Promise<void> {
    await api.post(`/pharmacy/prescription/${appointmentId}`, {prescription})
  },

  // Thêm sinh hiệu

  // Thêm chỉ định xét nghiệm

  // Lấy lịch sử khám (appointmnet trước)

  // Lấy lịch sử xét nghiệm (appointmnet trước)
}
