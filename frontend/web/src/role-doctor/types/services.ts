import { ServiceOrder } from "./serviceOrder";

export interface Services {
  serviceId: number;
  serviceName: string;
  serviceType: ServiceType;
  price: number;
  createdAt: string; 
  serviceOrders: ServiceOrder[];
}

export type ServiceType = 'TEST' | 'IMAGING' | 'CONSULTATION' | 'OTHER';
