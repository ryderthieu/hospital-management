import type { PatientDetail } from "../types/patient"
import type { Prescription } from "../types/prescription"
import { api } from "../../services/api"

export const pharmacyService = {

  // Lấy thông tin toa thuốc theo appointmentId (appointment hiện tại)
  async getCurrentPrescriptionByAppointmentId(appointmentId: number): Promise<Prescription> {
    const response = await api.get(`/pharmacy/prescriptions/appointment/${appointmentId}`)
    return response.data
  },

  // Thêm toa thuốc (appointment hiện tại)
  async createPrescriptionByAppointmentId(): Promise<Prescription> {
    const response = await api.post(`/pharmacy/prescription`)
    return response.data
  },

  //Sửa toa thuốc theo prescriptionId
  async updatePrescriptionByAppointmentId(prescriptionId: number): Promise<any> {
    const response = await api.put(`/pharmacy/prescription/${prescriptionId}`)
    return response.data
  },

  //Xóa toa thuốc theo prescriptionId
  async deletePrescriptionByAppointmentId(prescriptionId: number): Promise<any> {
    const response = await api.delete(`/pharmacy/prescription/${prescriptionId}`)
    return response.data
  },

  
}
