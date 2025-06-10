import { api } from "../../services/api"
import type { Services } from "../types/services"

export const servicesService = {
  // 🔵 Lấy danh sách tất cả dịch vụ
  async getAllServices(): Promise<Services[]> {
    const response = await api.get<Services[]>("/appointments/services")
    return response.data
  },

  // 🔵 Lấy chi tiết một dịch vụ theo serviceId
  async getServiceById(serviceId: number): Promise<Services> {
    const response = await api.get<Services>(`/appointments/services/${serviceId}`)
    return response.data
  },
}
