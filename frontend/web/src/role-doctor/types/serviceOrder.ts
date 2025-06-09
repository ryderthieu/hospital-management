import { Services } from './services';

export interface ServiceOrder {
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

