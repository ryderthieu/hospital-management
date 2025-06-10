import type { Prescription } from "../types/prescription"
import type { Medicine } from "../types/medicin"
import { api } from "../../services/api"

export const pharmacyService = {
  // Lấy thông tin toa thuốc theo appointmentId (appointment hiện tại)
  async getCurrentPrescriptionByAppointmentId(appointmentId: number): Promise<Prescription> {
    const response = await api.get(`/pharmacy/prescriptions/appointment/${appointmentId}`)
    return response.data
  },

  // 🆕 Lấy lịch sử đơn thuốc theo patientId
  async getPrescriptionHistoryByPatientId(patientId: number): Promise<Prescription[]> {
    const response = await api.get(`/pharmacy/prescriptions/patient/${patientId}`)
    return response.data
  },

  // 🆕 Tạo toa thuốc mới (appointment hiện tại) - TRẢ VỀ PRESCRIPTION VỚI ID
  async createPrescription(appointmentId: number, prescriptionData: any): Promise<Prescription> {
    const response = await api.post(`/pharmacy/prescriptions`, {
      appointmentId,
      ...prescriptionData,
    })
    return response.data
  },

  // Sửa toa thuốc theo prescriptionId (SỬ DỤNG SAU KHI ĐÃ CÓ PRESCRIPTION ID)
 async updatePrescription(prescriptionId: number, prescriptionData: Prescription): Promise<Prescription> {
  try {
    
    const response = await api.put(`/pharmacy/prescriptions/${prescriptionId}`, prescriptionData)
    console.log("Đã gọi API sửa toa thuốc", response.data)
    return response.data
  } catch (error) {
    console.error("Lỗi khi cập nhật toa thuốc:", error)
    throw error 
  }
},

  // Xóa toa thuốc theo prescriptionId
  async deletePrescription(prescriptionId: number): Promise<any> {
    const response = await api.delete(`/pharmacy/prescriptions/${prescriptionId}`)
    return response.data
  },

  // 🔵 Lấy tất cả thuốc
  async getAllMedicines(): Promise<Medicine[]> {
    const response = await api.get<Medicine[]>("/pharmacy/medicines")
    return response.data
  },

  // 🔵 Lấy thuốc theo ID
  async getMedicineById(id: number): Promise<Medicine> {
    const response = await api.get<Medicine>(`/pharmacy/medicines/${id}`)
    return response.data
  },

  // 🔍 Tìm kiếm thuốc theo tên hoặc danh mục
  async searchMedicine(name?: string, category?: string): Promise<Medicine[]> {
    const params: any = {}
    if (name) params.name = name
    if (category) params.category = category

    const response = await api.get<Medicine[]>("/pharmacy/medicines/search", { params })
    return response.data
  },
}
