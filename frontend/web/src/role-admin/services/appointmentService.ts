import type {
  Service,
  ServiceDto,
  Appointment,
  ServiceOrder,
} from "../types/appointment";
import { api } from "../../services/api";

export const appointmentService = {
  // Get all services
  async getAllServices(): Promise<Service[]> {
    const response = await api.get<Service[]>("/appointments/services");
    return response.data;
  },

  // Get service by ID
  async getServiceById(serviceId: number): Promise<Service> {
    const response = await api.get<Service>(
      `/appointments/services/${serviceId}`
    );
    return response.data;
  },

  // Create service
  async createService(serviceData: ServiceDto): Promise<Service> {
    const response = await api.post<Service>(
      "/appointments/services",
      serviceData
    );
    return response.data;
  },

  // Update service
  async updateService(
    serviceId: number,
    serviceData: Partial<ServiceDto>
  ): Promise<Service> {
    const response = await api.put<Service>(
      `/appointments/services/${serviceId}`,
      serviceData
    );
    return response.data;
  },

  // Delete service
  async deleteService(serviceId: number): Promise<string> {
    const response = await api.delete<string>(
      `/appointments/services/${serviceId}`
    );
    return response.data;
  },

  // Get all orders
  async getAllOrders(serviceId: number): Promise<ServiceOrder[]> {
    const response = await api.get<ServiceOrder[]>(
      `/appointments/services/${serviceId}/service-orders`
    );
    return response.data;
  },

  // Get all appointments by patient ID
  async getAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
    const response = await api.get<Appointment[]>(
      `/appointments/patient/${patientId}`
    );
    return response.data;
  },

  // Get appointment by ID
  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    const response = await api.get<Appointment>(
      `/appointments/${appointmentId}`
    );
    return response.data;
  },

  // Create appointment
  async createAppointment(
    appointmentData: Omit<Appointment, "appointmentId" | "createdAt">
  ): Promise<Appointment> {
    const response = await api.post<Appointment>(
      "/appointments",
      appointmentData
    );
    return response.data;
  },

  // Update appointment
  async updateAppointment(
    appointmentId: number,
    appointmentData: Partial<Omit<Appointment, "appointmentId" | "createdAt">>
  ): Promise<Appointment> {
    const response = await api.put<Appointment>(
      `/appointments/${appointmentId}`,
      appointmentData
    );
    return response.data;
  },

  // Delete appointment
  async deleteAppointment(appointmentId: number): Promise<string> {
    const response = await api.delete<string>(`/appointments/${appointmentId}`);
    return response.data;
  },
};
