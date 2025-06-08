import type {
  Service,
  ServiceOrder,
  CreateServiceOrderRequest,
  UpdateServiceOrderRequest,
  TestResult,
} from "../types/service"
import { api } from "../../services/api"

export const serviceService = {
  // Get all services
  async getAllServices(): Promise<Service[]> {
    const response = await api.get("/appointments/services")
    return response.data
  },

  // Get service by ID
  async getServiceById(serviceId: number): Promise<Service> {
    const response = await api.get(`/appointments/services/${serviceId}`)
    return response.data
  },

  // Create service
  async createService(service: Service): Promise<Service> {
    const response = await api.post("/appointments/services", service)
    return response.data
  },

  // Update service
  async updateService(serviceId: number, service: Service): Promise<Service> {
    const response = await api.put(`/appointments/services/${serviceId}`, service)
    return response.data
  },

  // Delete service
  async deleteService(serviceId: number): Promise<void> {
    await api.delete(`/appointments/services/${serviceId}`)
  },
}

export const serviceOrderService = {
  // Get all orders for a service
  async getAllOrders(serviceId: number): Promise<ServiceOrder[]> {
    const response = await api.get(`/appointments/services/${serviceId}/service-orders`)
    return response.data
  },

  // Get order by ID
  async getOrderById(serviceId: number, orderId: number): Promise<ServiceOrder> {
    const response = await api.get(`/appointments/services/${serviceId}/service-orders/${orderId}`)
    return response.data
  },

  // Create order
  async createOrder(serviceId: number, order: CreateServiceOrderRequest): Promise<ServiceOrder> {
    const response = await api.post(`/appointments/services/${serviceId}/service-orders`, order)
    return response.data
  },

  // Update order
  async updateOrder(serviceId: number, orderId: number, order: UpdateServiceOrderRequest): Promise<ServiceOrder> {
    const response = await api.put(`/appointments/services/${serviceId}/service-orders/${orderId}`, order)
    return response.data
  },

  // Delete order
  async deleteOrder(serviceId: number, orderId: number): Promise<void> {
    await api.delete(`/appointments/services/${serviceId}/service-orders/${orderId}`)
  },

  // Get test results for an appointment
  async getTestResults(appointmentId: number): Promise<TestResult[]> {
    const response = await api.get(`/appointments/${appointmentId}/test-results`)
    return response.data
  },
}
