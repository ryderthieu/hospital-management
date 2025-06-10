import { api } from "../../services/api"
import type { ServiceOrder } from "../types/serviceOrder"

// Lấy tất cả các đơn dịch vụ theo serviceId
export const getAllServiceOrders = async (serviceId: number): Promise<ServiceOrder[]> => {
  const response = await api.get(`/appointments/services/${serviceId}/service-orders`)
  return response.data
}

// Lấy một đơn dịch vụ cụ thể theo serviceId và orderId
export const getServiceOrderById = async (
  serviceId: number,
  orderId: number
): Promise<ServiceOrder> => {
  const response = await api.get(`/appointments/services/${serviceId}/service-orders/${orderId}`)
  return response.data
}

// Tạo mới một đơn dịch vụ theo serviceId
export const createServiceOrder = async (
  serviceId: number,
  ServiceOrder: ServiceOrder
): Promise<ServiceOrder> => {
  const response = await api.post(`/appointments/services/${serviceId}/service-orders`, ServiceOrder)
  return response.data
}

// Cập nhật đơn dịch vụ theo serviceId và orderId
export const updateServiceOrder = async (
  serviceId: number,
  orderId: number,
  ServiceOrder: ServiceOrder
): Promise<ServiceOrder> => {
  const response = await api.put(`/appointments/services/${serviceId}/service-orders/${orderId}`, ServiceOrder)
  return response.data
}

// Xóa đơn dịch vụ theo serviceId và orderId
export const deleteServiceOrder = async (
  serviceId: number,
  orderId: number
): Promise<string> => {
  const response = await api.delete(`/appointments/services/${serviceId}/service-orders/${orderId}`)
  return response.data // "Đặt dịch vụ đã xóa thành công"
}

// Lấy tất cả đơn dịch vụ theo appointmentId
export const getServiceOrdersByAppointmentId = async (
  appointmentId: number
): Promise<ServiceOrder[]> => {
  const response = await api.get(`/appointments/services/appointments/${appointmentId}/orders`)
  return response.data
}

// Lấy tất cả đơn dịch vụ theo roomId
export const getServiceOrdersByRoomId = async (
   roomId: number
): Promise<ServiceOrder[]> => {
  const response = await api.get(`/appointments/services/rooms/${roomId}/orders`)
  return response.data
}
