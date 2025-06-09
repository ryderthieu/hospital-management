import type { Service, ServiceDto } from "../types/appointment";
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
};
