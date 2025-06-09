import type { MedicalIndication, CreateMedicalOrderRequest } from "../types/medicalOrder"
import { api } from "../../services/api"

export const medicalOrderService = {
  // Create medical order
  async createMedicalOrder(request: CreateMedicalOrderRequest): Promise<any> {
    const response = await api.post("/medical-orders", request)
    return response.data
  },

  // Get medical orders by appointment
  async getMedicalOrdersByAppointment(appointmentId: number): Promise<MedicalIndication[]> {
    const response = await api.get(`/appointments/${appointmentId}/medical-orders`)
    return response.data
  },

  // Update medical order status
  async updateMedicalOrderStatus(orderId: number, status: string): Promise<void> {
    await api.patch(`/medical-orders/${orderId}/status`, { status })
  },
}
