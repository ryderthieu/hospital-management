import { Services } from './services';

export interface ServiceOrder {
  orderId: number;
  serviceId: number,
  appointmentId: number;
  roomId: number;
  service: Services;
  orderStatus: OrderStatus;
  result: string;
  number: number;
  orderTime: string;  
  resultTime: string; 
  createdAt: string;  
}

export interface CreateServiceOrderRequest {
  serviceId: number,
  appointmentId: number;
  roomId: number;
}

export interface ServiceOrderDto {
  orderId: number;
  appointmentId: number;
  roomId: number;
  service: Services;
  orderStatus: OrderStatus;
  result: string;
  number: number;
  orderTime: string;  
  resultTime: string; 
  createdAt: string;  
}

export type OrderStatus = 'ORDERED' | 'COMPLETED';

